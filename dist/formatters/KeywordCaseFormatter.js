"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordCaseFormatter = void 0;
const constants_1 = require("../constants");
const util_1 = require("../util");
class KeywordCaseFormatter {
    /**
     * Handle indentation for an array of tokens
     */
    format(tokens, options) {
        var _a, _b, _c;
        for (let token of tokens) {
            //if this token is a keyword
            if (constants_1.Keywords.includes(token.kind)) {
                let keywordCase;
                let lowerKind = token.kind.toLowerCase();
                //a token is a type if it's preceded by an `as` token
                if (this.isType(tokens, token)) {
                    //if the token is a type, check for a specific override
                    const specificTypeCaseOverride = (_a = options.specificTypeCaseOverride) === null || _a === void 0 ? void 0 : _a[lowerKind];
                    if (specificTypeCaseOverride && specificTypeCaseOverride.toLowerCase() === lowerKind) {
                        token.text = specificTypeCaseOverride;
                        continue;
                    }
                    //options.typeCase is always set to options.keywordCase when not provided
                    keywordCase = options.typeCase;
                    //if this is an overridden type keyword, use that override instead
                    if (options.typeCaseOverride && options.typeCaseOverride[lowerKind] !== undefined) {
                        keywordCase = options.typeCaseOverride[lowerKind];
                    }
                }
                else {
                    //if the token is a keyword, check for a specific override
                    const specificKeywordCaseOverride = (_b = options.specificKeywordCaseOverride) === null || _b === void 0 ? void 0 : _b[lowerKind];
                    if (specificKeywordCaseOverride && specificKeywordCaseOverride.toLowerCase() === lowerKind) {
                        token.text = specificKeywordCaseOverride;
                        continue;
                    }
                    //keywordCase is always set to options.keywordCase when not provided
                    keywordCase = options.keywordCase;
                    //if this is an overridable keyword, use that override instead
                    if (options.keywordCaseOverride && options.keywordCaseOverride[lowerKind] !== undefined) {
                        keywordCase = options.keywordCaseOverride[lowerKind];
                    }
                }
                switch (keywordCase) {
                    case 'lower':
                        token.text = token.text.toLowerCase();
                        break;
                    case 'upper':
                        token.text = token.text.toUpperCase();
                        break;
                    case 'title':
                        let lowerValue = token.text.toLowerCase();
                        //format the first letter (conditional compile composite-keywords start with hash)
                        let charIndex = token.text.startsWith('#') ? 1 : 0;
                        token.text = this.upperCaseLetter(token.text, charIndex);
                        //if this is a composite keyword, format the first letter of the second word
                        if (constants_1.CompositeKeywords.includes(token.kind)) {
                            let spaceCharCount = ((_c = /\s+/.exec(lowerValue)) !== null && _c !== void 0 ? _c : []).length;
                            let firstWordLength = constants_1.CompositeKeywordStartingWords.find(x => lowerValue.startsWith(x)).length;
                            let nextWordFirstCharIndex = firstWordLength + spaceCharCount;
                            token.text = this.upperCaseLetter(token.text, nextWordFirstCharIndex);
                        }
                        break;
                    case 'original':
                    default:
                        //do nothing
                        break;
                }
            }
        }
        return tokens;
    }
    /**
     * Convert the character at the specified index to upper case
     */
    upperCaseLetter(text, index) {
        //out of bounds index should be a noop
        if (index < 0 || index > text.length) {
            return text;
        }
        text =
            //add the beginning text
            text.substring(0, index) +
                //uppercase the letter
                text.substring(index, index + 1).toUpperCase() +
                //rest of word
                text.substring(index + 1).toLowerCase();
        return text;
    }
    /**
     * Determine if the token is a type keyword (meaning preceded by `as` token)
     * @param token
     */
    isType(tokens, token) {
        let previousToken = util_1.util.getPreviousNonWhitespaceToken(tokens, tokens.indexOf(token));
        if (previousToken && previousToken.text.toLowerCase() === 'as') {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.KeywordCaseFormatter = KeywordCaseFormatter;
//# sourceMappingURL=KeywordCaseFormatter.js.map