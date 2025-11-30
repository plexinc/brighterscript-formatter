"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortImportsFormatter = void 0;
const brighterscript_1 = require("brighterscript");
const util_1 = require("../util");
class SortImportsFormatter {
    format(tokens) {
        let nextLineStartTokenIndex = 0;
        let lineObj = util_1.util.getLineTokens(nextLineStartTokenIndex, tokens);
        nextLineStartTokenIndex = lineObj.stopIndex + 1;
        let importStatementsToSort = {
            startIndex: -1,
            startLine: -1,
            lineTokens: []
        };
        while (nextLineStartTokenIndex < tokens.length) {
            if (this.isImportStatement(lineObj.tokens)) {
                importStatementsToSort.lineTokens.push(lineObj.tokens);
                if (importStatementsToSort.startIndex === -1) {
                    importStatementsToSort.startIndex = lineObj.startIndex;
                    importStatementsToSort.startLine = lineObj.tokens[0].range.start.line;
                }
            }
            else {
                /* istanbul ignore else */
                if (importStatementsToSort.lineTokens.length > 1) {
                    this.sortImportStatements(importStatementsToSort, tokens);
                }
                importStatementsToSort = {
                    startIndex: -1,
                    startLine: -1,
                    lineTokens: []
                };
            }
            lineObj = util_1.util.getLineTokens(nextLineStartTokenIndex, tokens);
            nextLineStartTokenIndex = lineObj.stopIndex + 1;
        }
        return tokens;
    }
    isImportStatement(tokens) {
        if (tokens.length === 0) {
            return false;
        }
        return tokens[0].kind === brighterscript_1.TokenKind.Import;
    }
    sortImportStatements(importStatements, tokens) {
        importStatements.lineTokens.sort((a, b) => {
            let aText = a.map(x => x.text).join('');
            let bText = b.map(x => x.text).join('');
            return aText.localeCompare(bText);
        });
        const lineTokens = importStatements.lineTokens;
        let line = importStatements.startLine;
        lineTokens.forEach(lineToken => {
            let character = 0;
            lineToken.forEach(token => {
                token.range = {
                    start: brighterscript_1.Position.create(line, character),
                    end: brighterscript_1.Position.create(line, character + token.text.length)
                };
                character += token.text.length;
            });
            line++;
        });
        const sortedTokens = lineTokens.flat();
        tokens.splice(importStatements.startIndex, sortedTokens.length, ...sortedTokens);
    }
}
exports.SortImportsFormatter = SortImportsFormatter;
//# sourceMappingURL=SortImportsFormatter.js.map