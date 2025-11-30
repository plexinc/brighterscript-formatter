"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const KeywordCaseFormatter_1 = require("./KeywordCaseFormatter");
const Formatter_1 = require("../Formatter");
const undent_1 = require("undent");
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
    describe('specificCaseOverride', () => {
        let formatter;
        beforeEach(() => {
            formatter = new Formatter_1.Formatter();
        });
        it('specificKeywordCaseOverride', () => {
            const input = (0, undent_1.undent) `sub Main() print "hello" end sub`;
            const expected = (0, undent_1.undent) `sub Main() PRINT "hello" endSub`;
            (0, chai_1.expect)(formatter.format(input, {
                keywordCase: 'lower',
                specificKeywordCaseOverride: {
                    endsub: 'endSub',
                    print: 'PRINT'
                }
            })).to.equal(expected);
        });
        it('specificTypeCaseOverride', () => {
            const input = (0, undent_1.undent) `sub Main(a as integer)`;
            const expected = (0, undent_1.undent) `sub Main(a as Integer)`;
            (0, chai_1.expect)(formatter.format(input, {
                typeCase: 'lower',
                specificTypeCaseOverride: {
                    integer: 'Integer'
                }
            })).to.equal(expected);
        });
        it('specificKeywordCaseOverride and specificTypeCaseOverride using different cases', () => {
            const input = (0, undent_1.undent) `sub longinteger(a as longinteger)`;
            const expected = (0, undent_1.undent) `sub LongInteger(a as longInteger)`;
            (0, chai_1.expect)(formatter.format(input, {
                typeCase: 'lower',
                specificKeywordCaseOverride: {
                    longinteger: 'LongInteger'
                },
                specificTypeCaseOverride: {
                    longinteger: 'longInteger'
                }
            })).to.equal(expected);
        });
        it('specificKeywordCaseOverride and specificTypeCaseOverride using invalid values (must match the original keyword)', () => {
            const input = (0, undent_1.undent) `sub longinteger(a as longinteger)`;
            (0, chai_1.expect)(formatter.format(input, {
                typeCase: 'lower',
                specificKeywordCaseOverride: {
                    longinteger: 'integer'
                },
                specificTypeCaseOverride: {
                    longinteger: 'integer'
                }
            })).to.equal(input);
        });
    });
});
//# sourceMappingURL=KeywordCaseFormatter.spec.js.map