"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiLineItemFormatter = void 0;
const brighterscript_1 = require("brighterscript");
const util_1 = require("../util");
class MultiLineItemFormatter {
    /**
     * Handle indentation for an array of tokens
     */
    format(tokens) {
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            let openKind;
            let closeKind;
            if (token.kind === brighterscript_1.TokenKind.LeftCurlyBrace) {
                openKind = brighterscript_1.TokenKind.LeftCurlyBrace;
                closeKind = brighterscript_1.TokenKind.RightCurlyBrace;
            }
            else if (token.kind === brighterscript_1.TokenKind.LeftSquareBracket) {
                openKind = brighterscript_1.TokenKind.LeftSquareBracket;
                closeKind = brighterscript_1.TokenKind.RightSquareBracket;
            }
            let nextNonWhitespaceToken = util_1.util.getNextNonWhitespaceToken(tokens, i, true);
            //move contents to new line if this is a multi-line array or AA
            if (
            //is open curly or open square
            openKind && closeKind &&
                //is a multi-line array or AA
                !this.isStartofSingleLineArrayOrAA(tokens, i, openKind, closeKind) &&
                //there is extra stuff on this line that is not the end of the file
                nextNonWhitespaceToken && nextNonWhitespaceToken.kind !== brighterscript_1.TokenKind.Eof &&
                //is NOT array like `[[ ...\n ]]`, or `[{ ...\n }]`)
                !this.isMatchingDoubleArrayOrArrayCurly(tokens, i) &&
                //Don't reformat if the opening bracket or curly is on the same line as 'return'
                !this.isReturnArrayOrCurlyOnSameLine(tokens, i) &&
                //Don't reformat if there are multiple open/close pairs that are unbalanced
                !this.isMultiUnbalancedOpenClosePair(tokens, i)) {
                tokens.splice(i + 1, 0, {
                    kind: brighterscript_1.TokenKind.Newline,
                    text: '\n'
                });
                let closingToken = util_1.util.getClosingToken(tokens, i, openKind, closeKind);
                /* istanbul ignore next */
                let closingTokenKindex = closingToken ? tokens.indexOf(closingToken) : -1;
                i++;
                //if there's stuff before the closer, move it to a newline
                if (util_1.util.getPreviousNonWhitespaceToken(tokens, closingTokenKindex, true)) {
                    tokens.splice(closingTokenKindex, 0, {
                        kind: brighterscript_1.TokenKind.Newline,
                        text: '\n'
                    });
                }
            }
        }
        return tokens;
    }
    /**
     * Determines if the current index is the start of a single-line array or AA.
     * Walks forward until we find the equal number of open and close curlies/squares, or a newline
     */
    isStartofSingleLineArrayOrAA(tokens, currentIndex, openKind, closeKind) {
        let openCount = 0;
        for (let i = currentIndex; i < tokens.length; i++) {
            let token = tokens[i];
            if (token.kind === openKind) {
                openCount++;
            }
            else if (token.kind === closeKind) {
                openCount--;
            }
            if (openCount === 0) {
                return true;
            }
            else if (token.kind === brighterscript_1.TokenKind.Newline) {
                return false;
            }
        }
        return false;
    }
    /**
     * Detects when a line has both unbalanced square brackets and curly braces,
     * which indicates a pattern like `[m, {` that should not be reformatted.
     * Scans tokens from the given index until a newline is found.
     * @param tokens The array of tokens to scan.
     * @param currentIndex The index to start scanning from.
     * @returns {boolean} True if both curly and square brackets are unbalanced before a newline; otherwise, false.
     */
    isMultiUnbalancedOpenClosePair(tokens, currentIndex) {
        let curlyOpenCount = 0;
        let squareOpenCount = 0;
        for (let i = currentIndex; i < tokens.length; i++) {
            let token = tokens[i];
            if (token.kind === brighterscript_1.TokenKind.Newline) {
                break;
            }
            if (token.kind === brighterscript_1.TokenKind.LeftCurlyBrace) {
                curlyOpenCount++;
            }
            else if (token.kind === brighterscript_1.TokenKind.RightCurlyBrace) {
                curlyOpenCount--;
            }
            else if (token.kind === brighterscript_1.TokenKind.LeftSquareBracket) {
                squareOpenCount++;
            }
            else if (token.kind === brighterscript_1.TokenKind.RightSquareBracket) {
                squareOpenCount--;
            }
        }
        return curlyOpenCount > 0 && squareOpenCount > 0;
    }
    isMatchingDoubleArrayOrArrayCurly(tokens, currentIndex) {
        let token = tokens[currentIndex];
        let nextNonWhitespaceToken = util_1.util.getNextNonWhitespaceToken(tokens, currentIndex, true);
        //don't separate multiple open/close pairs
        if (
        //is open array
        token.kind === brighterscript_1.TokenKind.LeftSquareBracket &&
            //there is another token on this line
            nextNonWhitespaceToken &&
            //is next token an open array or open object
            (nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.LeftSquareBracket || nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.LeftCurlyBrace)) {
            let closingToken = util_1.util.getClosingToken(tokens, currentIndex, brighterscript_1.TokenKind.LeftSquareBracket, brighterscript_1.TokenKind.RightSquareBracket);
            //look at the previous token
            let previous = closingToken && util_1.util.getPreviousNonWhitespaceToken(tokens, tokens.indexOf(closingToken), true);
            if (previous && (previous.kind === brighterscript_1.TokenKind.RightSquareBracket || previous.kind === brighterscript_1.TokenKind.RightCurlyBrace)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Check if this is an array or object that starts on the same line as a 'return' statement
     * We want to preserve: return [...] or return {...}
     * Even if the contents span multiple lines
     */
    isReturnArrayOrCurlyOnSameLine(tokens, currentIndex) {
        let token = tokens[currentIndex];
        // Only check for arrays or objects
        /* istanbul ignore if (should not happen, defensive programming) */
        if (token.kind !== brighterscript_1.TokenKind.LeftSquareBracket && token.kind !== brighterscript_1.TokenKind.LeftCurlyBrace) {
            return false;
        }
        // Look backwards to see if there's a 'return' on the same line
        for (let i = currentIndex - 1; i >= 0; i--) {
            let prevToken = tokens[i];
            // If we hit a newline, there's no return on this line
            if (prevToken.kind === brighterscript_1.TokenKind.Newline) {
                return false;
            }
            // If we find 'return', this array is part of a return statement on the same line
            if (prevToken.kind === brighterscript_1.TokenKind.Return) {
                return true;
            }
        }
        return false;
    }
}
exports.MultiLineItemFormatter = MultiLineItemFormatter;
//# sourceMappingURL=MultiLineItemFormatter.js.map