"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const KeywordCaseFormatter_1 = require("./KeywordCaseFormatter");
describe('KeywordCaseFormatter', () => {
    let Formatter;
    beforeEach(() => {
        Formatter = new KeywordCaseFormatter_1.KeywordCaseFormatter();
    });
    describe('upperCaseLetter()', () => {
        it('works for beginning of word', () => {
            (0, chai_1.expect)(Formatter['upperCaseLetter']('hello', 0)).to.equal('Hello');
        });
        it('works for middle of word', () => {
            (0, chai_1.expect)(Formatter['upperCaseLetter']('hello', 2)).to.equal('heLlo');
        });
        it('works for end of word', () => {
            (0, chai_1.expect)(Formatter['upperCaseLetter']('hello', 4)).to.equal('hellO');
        });
        it('handles out-of-bounds indexes', () => {
            (0, chai_1.expect)(Formatter['upperCaseLetter']('hello', -1)).to.equal('hello');
            (0, chai_1.expect)(Formatter['upperCaseLetter']('hello', 5)).to.equal('hello');
        });
    });
});
//# sourceMappingURL=KeywordCaseFormatter.spec.js.map