"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailingWhitespaceFormatter = void 0;
const brighterscript_1 = require("brighterscript");
const util_1 = require("../util");
class TrailingWhitespaceFormatter {
    /**
     * Remove all trailing Whitespace
     */
    format(tokens, options) {
        let nextLineStartTokenIndex = 0;
        //the list of output tokens
        let outputTokens = [];
        //set the loop to run for a max of double the number of tokens we found so we don't end up with an infinite loop
        for (let outerLoopCounter = 0; outerLoopCounter <= tokens.length * 2; outerLoopCounter++) {
            let lineObj = util_1.util.getLineTokens(nextLineStartTokenIndex, tokens);
            nextLineStartTokenIndex = lineObj.stopIndex + 1;
            let lineTokens = lineObj.tokens;
            //the last token is Newline or EOF, so the next-to-last token is where the trailing Whitespace would reside
            let potentialWhitespaceTokenIndex = lineTokens.length - 2;
            let whitespaceTokenCandidate = lineTokens[potentialWhitespaceTokenIndex];
            //empty lines won't have any tokens
            if (whitespaceTokenCandidate) {
                //if the final token is Whitespace, throw it away
                if (whitespaceTokenCandidate.kind === brighterscript_1.TokenKind.Whitespace) {
                    lineTokens.splice(potentialWhitespaceTokenIndex, 1);
                    //if the final token is a comment, trim the Whitespace from the righthand side
                }
                else if (whitespaceTokenCandidate.kind === brighterscript_1.TokenKind.Comment) {
                    whitespaceTokenCandidate.text = whitespaceTokenCandidate.text.trimRight();
                }
            }
            //add this line to the output
            outputTokens.push.apply(outputTokens, lineTokens);
            //if we have found the end of file, quit the loop
            if (lineTokens[lineTokens.length - 1].kind === brighterscript_1.TokenKind.Eof) {
                break;
            }
        }
        return outputTokens;
    }
}
exports.TrailingWhitespaceFormatter = TrailingWhitespaceFormatter;
//# sourceMappingURL=TrailingWhitespaceFormatter.js.map