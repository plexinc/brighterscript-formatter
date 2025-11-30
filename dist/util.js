"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.util = exports.Util = void 0;
const brighterscript_1 = require("brighterscript");
class Util {
    /**
     * Get the tokens for the whole line starting at the given index (including the Newline or EOF token at the end)
     * @param startIndex
     * @param tokens
     */
    getLineTokens(startIndex, tokens) {
        let outputTokens = [];
        let index = startIndex;
        for (index = startIndex; index < tokens.length; index++) {
            let token = tokens[index];
            outputTokens[outputTokens.length] = token;
            if (token.kind === brighterscript_1.TokenKind.Newline ||
                token.kind === brighterscript_1.TokenKind.Eof) {
                break;
            }
        }
        return {
            startIndex: startIndex,
            stopIndex: index,
            tokens: outputTokens
        };
    }
    /**
     * Get the first token before the index that is NOT Whitespace
     */
    getPreviousNonWhitespaceToken(tokens, startIndex, stopAtNewline = false) {
        for (let i = startIndex - 1; i > -1; i--) {
            let token = tokens[i];
            if (stopAtNewline && token.kind === brighterscript_1.TokenKind.Newline) {
                return;
            }
            if (token && token.kind !== brighterscript_1.TokenKind.Whitespace) {
                return tokens[i];
            }
        }
    }
    /**
     * Get the first token after the index that is NOT Whitespace. Returns undefined if stopAtNewLine===true and found a newline,
     * or if we found the EOF token
     */
    getNextNonWhitespaceToken(tokens, index, stopAtNewLine = false) {
        if (index < 0) {
            return;
        }
        for (index += 1; index < tokens.length; index++) {
            let token = tokens[index];
            if (stopAtNewLine && token && token.kind === brighterscript_1.TokenKind.Newline) {
                return;
            }
            if (token && token.kind !== brighterscript_1.TokenKind.Whitespace) {
                return token;
            }
        }
    }
    /**
     * Find the matching closing token for open square or open curly
     */
    getClosingToken(tokens, currentIndex, openKind, closeKind) {
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
                return token;
            }
        }
    }
    /**
     * Helper function used to print the tokens to console
     */
    printTokens(tokens) {
        const text = tokens.map(x => x.text.replace(/ /g, '•').replace(/\t/g, '→')).join('');
        console.log(text);
        return text;
    }
    /**
     * Merge multiple side-by-side whitespace tokens into a single token containing all the whitespace.
     * @param tokens the array of tokens to modify in-place
     * @param leadingOnly stop processing if a non-whitespace token is encountered
     */
    dedupeWhitespace(tokens, leadingOnly = false) {
        for (let i = 0; i < tokens.length; i++) {
            let currentToken = tokens[i];
            let nextToken = tokens[i + 1] ? tokens[i + 1] : { kind: undefined, text: '' };
            if (currentToken.kind === brighterscript_1.TokenKind.Whitespace && nextToken.kind === brighterscript_1.TokenKind.Whitespace) {
                currentToken.text += nextToken.text;
                tokens.splice(i + 1, 1);
                //decrement the counter so we process this token again so it can absorb more Whitespace tokens
                i--;
            }
            else if (leadingOnly) {
                return;
            }
        }
    }
}
exports.Util = Util;
const util = new Util();
exports.util = util;
//# sourceMappingURL=util.js.map