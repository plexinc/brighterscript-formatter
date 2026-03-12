"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeKeywordFormatter = void 0;
const brighterscript_1 = require("brighterscript");
const constants_1 = require("../constants");
const util_1 = require("../util");
class CompositeKeywordFormatter {
    /**
     * Handle indentation for an array of tokens
     */
    format(tokens, options) {
        let indexOffset = 0;
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            token.startIndex += indexOffset;
            let previousNonWhitespaceToken = util_1.util.getPreviousNonWhitespaceToken(tokens, i);
            let nextNonWhitespaceToken = util_1.util.getNextNonWhitespaceToken(tokens, i);
            if (
            //is this a composite token
            constants_1.CompositeKeywords.includes(token.kind) &&
                //is not being used as a key in an AA literal
                (!nextNonWhitespaceToken || nextNonWhitespaceToken.kind !== brighterscript_1.TokenKind.Colon) &&
                //is not being used as an object key
                (previousNonWhitespaceToken === null || previousNonWhitespaceToken === void 0 ? void 0 : previousNonWhitespaceToken.kind) !== brighterscript_1.TokenKind.Dot) {
                let parts = this.getCompositeKeywordParts(token);
                let tokenValue = token.text;
                //remove separating Whitespace
                if (options.compositeKeywords === 'combine') {
                    token.text = parts[0] + parts[1];
                    //separate with exactly 1 space
                }
                else if (options.compositeKeywords === 'split') {
                    token.text = parts[0] + ' ' + parts[1];
                }
                else {
                    //do nothing
                }
                let offsetDifference = token.text.length - tokenValue.length;
                indexOffset += offsetDifference;
                //`else if` is a special case
            }
            else if (token.kind === brighterscript_1.TokenKind.Else && nextNonWhitespaceToken && nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.If) {
                const nextToken = tokens[i + 1];
                //remove separating Whitespace
                if (options.compositeKeywords === 'combine') {
                    //if there is a whitespace token between the `else` and `if`
                    if (nextToken.kind === brighterscript_1.TokenKind.Whitespace) {
                        //remove the whitespace token
                        tokens.splice(i + 1, 1);
                    }
                    //separate with exactly 1 space
                }
                else if (options.compositeKeywords === 'split') {
                    if (nextToken.kind !== brighterscript_1.TokenKind.Whitespace) {
                        tokens.splice(i + 1, 0, (0, brighterscript_1.createToken)(brighterscript_1.TokenKind.Whitespace, ' '));
                    }
                    else {
                        nextToken.text = ' ';
                    }
                }
            }
        }
        return tokens;
    }
    getCompositeKeywordParts(token) {
        let lowerValue = token.text.toLowerCase();
        let match;
        //split the parts of the token, but retain their case
        if (lowerValue.startsWith('end')) {
            return [token.text.substring(0, 3), token.text.substring(3).trim()];
        }
        else if ((match = /^(#\s*(?:else|end))\s*(if)/i.exec(token.text))) {
            return match.slice(1);
        }
        else {
            return [token.text.substring(0, 4), token.text.substring(4).trim()];
        }
    }
}
exports.CompositeKeywordFormatter = CompositeKeywordFormatter;
//# sourceMappingURL=CompositeKeywordFormatter.js.map