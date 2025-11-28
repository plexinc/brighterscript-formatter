"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const testHelpers_spec_1 = require("../testHelpers.spec");
const SortImportsFormatter_1 = require("./SortImportsFormatter");
describe('SortImportsFormatter', () => {
    let Formatter;
    beforeEach(() => {
        Formatter = new SortImportsFormatter_1.SortImportsFormatter();
    });
    describe('isImportStatement()', () => {
        [
            { input: `import "file.bs"`, expected: true },
            { input: `Not.An.Import.Statement()`, expected: false },
            // an empty string would lex to a EOF token, so we cover the case of an empty array explicitly
            { input: [], expected: false }
        ].forEach(({ input, expected }) => {
            it(`Identifies import statements: ${input}`, () => {
                let tokens = input;
                if (typeof tokens === 'string') {
                    tokens = (0, testHelpers_spec_1.lex)(tokens);
                }
                const isImportStatement = Formatter['isImportStatement'](tokens);
                (0, chai_1.expect)(isImportStatement).to.equal(expected);
            });
        });
    });
});
//# sourceMappingURL=SortImportsFormatter.spec.js.map