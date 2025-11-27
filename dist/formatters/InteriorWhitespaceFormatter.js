"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteriorWhitespaceFormatter = void 0;
const brighterscript_1 = require("brighterscript");
const constants_1 = require("../constants");
const util_1 = require("../util");
class InteriorWhitespaceFormatter {
    /**
     * Force all Whitespace between tokens to be exactly 1 space wide
     */
    format(tokens, parser, options) {
        let addBoth = [
            //assignments
            brighterscript_1.TokenKind.Equal,
            brighterscript_1.TokenKind.PlusEqual,
            brighterscript_1.TokenKind.MinusEqual,
            brighterscript_1.TokenKind.StarEqual,
            brighterscript_1.TokenKind.ForwardslashEqual,
            brighterscript_1.TokenKind.BackslashEqual,
            brighterscript_1.TokenKind.LeftShiftEqual,
            brighterscript_1.TokenKind.RightShiftEqual,
            //operators
            brighterscript_1.TokenKind.Plus,
            brighterscript_1.TokenKind.Minus,
            brighterscript_1.TokenKind.Star,
            brighterscript_1.TokenKind.Forwardslash,
            brighterscript_1.TokenKind.Backslash,
            brighterscript_1.TokenKind.Caret,
            brighterscript_1.TokenKind.LessGreater,
            brighterscript_1.TokenKind.LessEqual,
            brighterscript_1.TokenKind.GreaterEqual,
            brighterscript_1.TokenKind.Greater,
            brighterscript_1.TokenKind.Less,
            //keywords
            brighterscript_1.TokenKind.As
        ];
        let addLeft = [
            ...addBoth,
            brighterscript_1.TokenKind.RightCurlyBrace
        ];
        let addRight = [
            ...addBoth,
            brighterscript_1.TokenKind.LeftCurlyBrace,
            brighterscript_1.TokenKind.Comma,
            brighterscript_1.TokenKind.Colon,
            brighterscript_1.TokenKind.Import
        ];
        let removeBoth = [];
        let removeLeft = [
            ...removeBoth,
            brighterscript_1.TokenKind.Comma,
            brighterscript_1.TokenKind.RightSquareBracket,
            brighterscript_1.TokenKind.RightParen,
            brighterscript_1.TokenKind.PlusPlus,
            brighterscript_1.TokenKind.MinusMinus
        ];
        let removeRight = [
            ...removeBoth,
            brighterscript_1.TokenKind.LeftSquareBracket,
            brighterscript_1.TokenKind.LeftParen,
            brighterscript_1.TokenKind.QuestionLeftParen
        ];
        let isPastFirstTokenOfLine = false;
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            let nextTokenType = (tokens[i + 1] ? tokens[i + 1].kind : undefined);
            let previousTokenType = (tokens[i - 1] ? tokens[i - 1].kind : undefined);
            //reset token indicator on Newline
            if (token.kind === brighterscript_1.TokenKind.Newline) {
                isPastFirstTokenOfLine = false;
                continue;
            }
            //skip past leading Whitespace
            if (token.kind === brighterscript_1.TokenKind.Whitespace && isPastFirstTokenOfLine === false) {
                continue;
            }
            // skip replacement identifiers during whitespace formatting
            if (token.kind === brighterscript_1.TokenKind.ReplacementIdentifier) {
                continue;
            }
            // Don't modify when a ] starts the line
            if (token.kind === brighterscript_1.TokenKind.RightSquareBracket) {
                const previousToken = util_1.util.getPreviousNonWhitespaceToken(tokens, i, true);
                // If the previous non-whitespace token is a newline (or doesn't exist),
                // this ] starts the line - skip all formatting for it
                if (!previousToken || previousToken.kind === brighterscript_1.TokenKind.Newline) {
                    continue;
                }
            }
            //normalize whitespace following conditional compile symbol #if, #else, #elseif, etc...
            if (constants_1.ConditionalCompileTokenKinds.includes(token.kind)) {
                if (options.insertSpaceAfterConditionalCompileSymbol) {
                    token.text = token.text.replace(/^#\s*/, '# ');
                }
                else {
                    token.text = token.text.replace(/^#\s*/, '#');
                }
            }
            isPastFirstTokenOfLine = true;
            if (token.kind === brighterscript_1.TokenKind.Whitespace) {
                //force token to be exactly 1 space
                token.text = ' ';
            }
            if (token.kind === brighterscript_1.TokenKind.Dot && i > 0) {
                let whitespaceExistsOnTheLeft = true;
                // eslint-disable-next-line no-unmodified-loop-condition
                while (whitespaceExistsOnTheLeft === true) {
                    if (tokens[i - 1].kind === brighterscript_1.TokenKind.Whitespace) {
                        this.removeWhitespace(tokens, i - 1);
                        i--;
                    }
                    else {
                        whitespaceExistsOnTheLeft = false;
                    }
                }
                let whitespaceExistsOnTheRight = true;
                // eslint-disable-next-line no-unmodified-loop-condition
                while (whitespaceExistsOnTheRight === true) {
                    if (tokens[i + 1].kind === brighterscript_1.TokenKind.Whitespace) {
                        this.removeWhitespace(tokens, i + 1);
                    }
                    else {
                        whitespaceExistsOnTheRight = false;
                    }
                }
            }
            //pad any of these token types with a space to the right
            if (addRight.includes(token.kind)) {
                //special case: we want the negative sign to be directly beside a numeric, in certain cases.
                //we can't handle every case, but we can get close
                if (this.looksLikeNegativeNumericLiteral(tokens, i)) {
                    //throw out the space to the right of the minus symbol if present
                    if (i + 1 < tokens.length && tokens[i + 1].kind === brighterscript_1.TokenKind.Whitespace) {
                        this.removeWhitespace(tokens, i + 1);
                    }
                    //ensure a space token to the right, only if we have more tokens to the right available
                }
                else if (this.looksLikeNegativeVariable(tokens, i)) {
                    //throw out the space to the right of the minus symbol if present
                    if (i + 1 < tokens.length && tokens[i + 1].kind === brighterscript_1.TokenKind.Whitespace) {
                        this.removeWhitespace(tokens, i + 1);
                    }
                    //ensure a space token to the right, only if we have more tokens to the right available
                }
                else if (nextTokenType && ![brighterscript_1.TokenKind.Whitespace, brighterscript_1.TokenKind.Newline, brighterscript_1.TokenKind.Eof].includes(nextTokenType)) {
                    //don't add Whitespace if the next token is the Newline
                    tokens.splice(i + 1, 0, {
                        startIndex: -1,
                        kind: brighterscript_1.TokenKind.Whitespace,
                        text: ' '
                    });
                }
            }
            //pad any of these tokens with a space to the left
            if (addLeft.includes(token.kind) &&
                //don't add left for negative sign preceded by a square brace or paren
                !(token.kind === brighterscript_1.TokenKind.Minus && previousTokenType && [brighterscript_1.TokenKind.LeftSquareBracket, brighterscript_1.TokenKind.LeftParen, brighterscript_1.TokenKind.QuestionLeftParen].includes(previousTokenType))) {
                //ensure a space token to the left
                if (previousTokenType && previousTokenType !== brighterscript_1.TokenKind.Whitespace) {
                    tokens.splice(i, 0, {
                        startIndex: -1,
                        kind: brighterscript_1.TokenKind.Whitespace,
                        text: ' '
                    });
                    //increment i by 1 since we added a token
                    i++;
                }
            }
            //remove any space tokens on the right
            if (removeRight.includes(token.kind)) {
                if (nextTokenType === brighterscript_1.TokenKind.Whitespace) {
                    //remove the next token, which is the Whitespace token
                    tokens.splice(i + 1, 1);
                }
            }
            //remove any space tokens on the left
            if (removeLeft.includes(token.kind)) {
                if (previousTokenType === brighterscript_1.TokenKind.Whitespace) {
                    //remove the previous token, which is the Whitespace token
                    tokens.splice(i - 1, 1);
                    //backtrack the index since we just shifted the array
                    i--;
                }
            }
        }
        tokens = this.formatTokenSpacing(tokens, parser, options);
        return tokens;
    }
    /**
    * Format spacing between various tokens that are more specific than `formatInteriorWhitespace`
    */
    formatTokenSpacing(tokens, parser, options) {
        var _a, _b;
        let i = 0;
        let token = undefined;
        let nextNonWhitespaceToken;
        const setIndex = (newValue) => {
            i = newValue;
            token = tokens[i];
            nextNonWhitespaceToken = util_1.util.getNextNonWhitespaceToken(tokens, i);
        };
        //handle special cases
        for (i; i < tokens.length; i++) {
            setIndex(i);
            // Special handling for the interior of functions (spacing between function assignment operators)
            // When insertSpaceAroundParameterAssignment is false, remove spaces around parameter assignment operators
            /* istanbul ignore if (valid and tested, but missing some coverage and hard to test) */
            if (options.insertSpaceAroundParameterAssignment === false && (token.kind === brighterscript_1.TokenKind.Sub || token.kind === brighterscript_1.TokenKind.Function)) {
                const nextToken = util_1.util.getNextNonWhitespaceToken(tokens, i);
                let parenToken;
                // Detect immediate '(' after keyword or function name
                if ((nextToken === null || nextToken === void 0 ? void 0 : nextToken.kind) === brighterscript_1.TokenKind.LeftParen) {
                    parenToken = nextToken;
                }
                else if ((nextToken === null || nextToken === void 0 ? void 0 : nextToken.kind) === brighterscript_1.TokenKind.Identifier) {
                    const afterNext = util_1.util.getNextNonWhitespaceToken(tokens, tokens.indexOf(nextToken));
                    if ((afterNext === null || afterNext === void 0 ? void 0 : afterNext.kind) === brighterscript_1.TokenKind.LeftParen) {
                        parenToken = afterNext;
                    }
                }
                if (parenToken) {
                    // Iterate tokens inside parentheses and trim whitespace around assignment operators
                    // Track nested parentheses to find the correct closing paren
                    let j = tokens.indexOf(parenToken) + 1;
                    let parenDepth = 1;
                    const indicesToRemove = [];
                    while (j < tokens.length && parenDepth > 0) {
                        const t = tokens[j];
                        // Track nested parentheses
                        if (t.kind === brighterscript_1.TokenKind.LeftParen || t.kind === brighterscript_1.TokenKind.QuestionLeftParen) {
                            parenDepth++;
                        }
                        else if (t.kind === brighterscript_1.TokenKind.RightParen) {
                            parenDepth--;
                            if (parenDepth === 0) {
                                break;
                            }
                        }
                        if (t.kind === brighterscript_1.TokenKind.Equal) {
                            // Remove left whitespace
                            if (j > 0 && tokens[j - 1].kind === brighterscript_1.TokenKind.Whitespace) {
                                indicesToRemove.push(j - 1);
                            }
                            // Remove right whitespace
                            if (j + 1 < tokens.length && tokens[j + 1].kind === brighterscript_1.TokenKind.Whitespace) {
                                indicesToRemove.push(j + 1);
                            }
                        }
                        j++;
                    }
                    // Remove the tokens in reverse order to avoid index shifting issues
                    for (const index of indicesToRemove.sort((a, b) => b - a)) {
                        tokens.splice(index, 1);
                    }
                }
            }
            //space to left of function parens?
            {
                let parenToken;
                //look for anonymous functions
                if (token.kind === brighterscript_1.TokenKind.Function && nextNonWhitespaceToken && nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.LeftParen) {
                    parenToken = nextNonWhitespaceToken;
                    //look for named functions
                }
                else if (token.kind === brighterscript_1.TokenKind.Function && nextNonWhitespaceToken && nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.Identifier) {
                    //get the next non-Whitespace token, which SHOULD be the paren
                    let parenCandidate = util_1.util.getNextNonWhitespaceToken(tokens, tokens.indexOf(nextNonWhitespaceToken));
                    if (parenCandidate && parenCandidate.kind === brighterscript_1.TokenKind.LeftParen) {
                        parenToken = parenCandidate;
                    }
                }
                //if we found the paren token, handle spacing
                if (parenToken) {
                    //walk backwards, removing any Whitespace tokens found
                    this.removeWhitespaceTokensBackwards(tokens, tokens.indexOf(parenToken));
                    if (options.insertSpaceBeforeFunctionParenthesis) {
                        //insert a Whitespace token
                        tokens.splice(tokens.indexOf(parenToken), 0, {
                            kind: brighterscript_1.TokenKind.Whitespace,
                            text: ' ',
                            startIndex: -1
                        });
                    }
                    //next loop iteration should be after the open paren
                    setIndex(tokens.indexOf(parenToken));
                }
            }
            //add/remove whitespace around curly braces
            {
                //start of non empty object
                if (
                //is start of object
                token.kind === brighterscript_1.TokenKind.LeftCurlyBrace &&
                    (
                    //there is some non-whitespace token to our right
                    (_a = util_1.util.getNextNonWhitespaceToken(tokens, i, true)) === null || _a === void 0 ? void 0 : _a.kind)) {
                    let whitespaceToken = tokens[i + 1];
                    //this is never called because formatInteriorWhitespace already handles inserting this space
                    // //ensure there is a whitespace token in that position (make it 0-length for now)
                    // if (whitespaceToken && whitespaceToken.kind !== TokenKind.Whitespace) {
                    //     whitespaceToken = <any>{
                    //         kind: TokenKind.Whitespace,
                    //         startIndex: -1,
                    //         text: ''
                    //     };
                    //     tokens.splice(i, 0, whitespaceToken);
                    // }
                    //insert the space only if so configured
                    whitespaceToken.text = options.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces ? ' ' : '';
                }
                //end of non-empty object
                if (
                //is end of object
                token.kind === brighterscript_1.TokenKind.RightCurlyBrace &&
                    //there is some non-whitespace token to our left
                    util_1.util.getPreviousNonWhitespaceToken(tokens, i, true)) {
                    let whitespaceToken = tokens[i - 1];
                    //this is never called because formatInteriorWhitespace already handles inserting this space
                    // //ensure there is a whitespace token in that position (make it 0-length for now)
                    // if (whitespaceToken && whitespaceToken.kind !== TokenKind.Whitespace) {
                    //     whitespaceToken = <any>{
                    //         kind: TokenKind.Whitespace,
                    //         startIndex: -1,
                    //         text: ''
                    //     };
                    //     tokens.splice(i - 1, 0, whitespaceToken);
                    // }
                    //insert the space only if so configured
                    whitespaceToken.text = options.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces ? ' ' : '';
                    //next loop iteration should be after the closing curly brace
                    setIndex(tokens.indexOf(token));
                }
            }
            //empty curly braces
            if (token.kind === brighterscript_1.TokenKind.RightCurlyBrace && ((_b = util_1.util.getPreviousNonWhitespaceToken(tokens, i, true)) === null || _b === void 0 ? void 0 : _b.kind) === brighterscript_1.TokenKind.LeftCurlyBrace) {
                this.removeWhitespaceTokensBackwards(tokens, i);
                tokens.splice(tokens.indexOf(token), 0, {
                    kind: brighterscript_1.TokenKind.Whitespace,
                    startIndex: -1,
                    text: options.insertSpaceBetweenEmptyCurlyBraces ? ' ' : ''
                });
                //next loop iteration should be after the closing curly brace
                setIndex(tokens.indexOf(token));
            }
            //empty parenthesis (user doesn't have this option, we will always do this one)
            if (token.kind === brighterscript_1.TokenKind.LeftParen && nextNonWhitespaceToken && nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.RightParen) {
                this.removeWhitespaceTokensBackwards(tokens, tokens.indexOf(nextNonWhitespaceToken));
                //next loop iteration should be after the closing paren
                setIndex(tokens.indexOf(nextNonWhitespaceToken));
            }
        }
        tokens = this.formatSpaceBetweenAssociativeArrayLiteralKeyAndColon(tokens, parser, options);
        return tokens;
    }
    /**
     * Ensure exactly 1 or 0 spaces between all literal associative array keys and the colon after it
     */
    formatSpaceBetweenAssociativeArrayLiteralKeyAndColon(tokens, parser, options) {
        const aaLiterals = [];
        parser.ast.walk((0, brighterscript_1.createVisitor)({
            AALiteralExpression: (expression) => {
                aaLiterals.push(expression);
            }
        }), {
            walkMode: brighterscript_1.WalkMode.visitAllRecursive
        });
        //find all of the AA literals
        for (let aaLiteral of aaLiterals) {
            for (let element of aaLiteral.elements) {
                //our target elements should have both `key` and `colon` and they should both be on the same line
                if (element.keyToken && element.colonToken && element.keyToken.range.end.line === element.colonToken.range.end.line) {
                    let whitespaceToken;
                    let idx = tokens.indexOf(element.keyToken);
                    let nextToken = tokens[idx + 1];
                    if (nextToken.kind === brighterscript_1.TokenKind.Whitespace) {
                        whitespaceToken = nextToken;
                    }
                    else {
                        whitespaceToken = {
                            kind: brighterscript_1.TokenKind.Whitespace,
                            text: ''
                        };
                        tokens.splice(idx + 1, 0, whitespaceToken);
                    }
                    whitespaceToken.text = options.insertSpaceBetweenAssociativeArrayLiteralKeyAndColon === true ? ' ' : '';
                }
            }
        }
        return tokens;
    }
    /**
     * Remove Whitespace tokens backwards until a non-Whitespace token is encountered
     * @param startIndex the index of the non-Whitespace token to start with. This function will start iterating at `startIndex - 1`
     */
    removeWhitespaceTokensBackwards(tokens, startIndex) {
        let removeCount = 0;
        let i = startIndex - 1;
        while (tokens[i--].kind === brighterscript_1.TokenKind.Whitespace) {
            removeCount++;
        }
        tokens.splice(startIndex - removeCount, removeCount);
    }
    /**
     * Determine if the current token appears to be the negative sign for a variable identifier token
     */
    looksLikeNegativeVariable(tokens, index) {
        let thisToken = tokens[index];
        if (thisToken.kind === brighterscript_1.TokenKind.Minus) {
            let nextToken = util_1.util.getNextNonWhitespaceToken(tokens, index);
            let previousToken = util_1.util.getPreviousNonWhitespaceToken(tokens, index);
            if (nextToken &&
                //next non-Whitespace token is an identifier
                (nextToken.kind === brighterscript_1.TokenKind.Identifier || nextToken.kind === brighterscript_1.TokenKind.ReplacementIdentifier) &&
                previousToken &&
                constants_1.TokensBeforeNegativeNumericLiteral.includes(previousToken.kind)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Remove Whitespace until the next non-Whitespace character.
     * This operates on the array itself
     */
    removeWhitespace(tokens, index) {
        while (tokens[index] && tokens[index].kind === brighterscript_1.TokenKind.Whitespace) {
            tokens.splice(index, 1);
        }
    }
    /**
     * Determine if the current token appears to be the negative sign for a numeric literal
     */
    looksLikeNegativeNumericLiteral(tokens, index) {
        let thisToken = tokens[index];
        if (thisToken.kind === brighterscript_1.TokenKind.Minus) {
            let nextToken = util_1.util.getNextNonWhitespaceToken(tokens, index);
            let previousToken = util_1.util.getPreviousNonWhitespaceToken(tokens, index);
            if (nextToken &&
                //next non-Whitespace token is a numeric literal
                constants_1.NumericLiteralTokenKinds.includes(nextToken.kind) &&
                previousToken &&
                constants_1.TokensBeforeNegativeNumericLiteral.includes(previousToken.kind)) {
                return true;
            }
        }
        return false;
    }
}
exports.InteriorWhitespaceFormatter = InteriorWhitespaceFormatter;
//# sourceMappingURL=InteriorWhitespaceFormatter.js.map