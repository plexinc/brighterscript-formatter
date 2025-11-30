"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const util_1 = require("./util");
const brighterscript_1 = require("brighterscript");
describe('util', () => {
    describe('getNextNonWhitespaceToken', () => {
        it('returns undefined when index is out of bounds', () => {
            (0, chai_1.expect)(util_1.util.getNextNonWhitespaceToken([], -1)).to.be.undefined;
        });
    });
    describe('printTokens', () => {
        (0, chai_1.expect)(util_1.util.printTokens(brighterscript_1.Lexer.scan(`    print hello`, { includeWhitespace: true }).tokens)).to.eql(`••••print•hello`);
    });
    describe('dedupeWhitespace', () => {
        it('dedupes Whitespace', () => {
            const tokens = [{
                    kind: brighterscript_1.TokenKind.Whitespace,
                    text: ' ',
                    startIndex: 0
                }, {
                    kind: brighterscript_1.TokenKind.Whitespace,
                    text: ' ',
                    startIndex: 1
                }, {
                    kind: brighterscript_1.TokenKind.Whitespace,
                    text: ' ',
                    startIndex: 2
                }];
            util_1.util.dedupeWhitespace(tokens);
            (0, chai_1.expect)(tokens).to.be.lengthOf(1);
        });
    });
});
//# sourceMappingURL=util.spec.js.map