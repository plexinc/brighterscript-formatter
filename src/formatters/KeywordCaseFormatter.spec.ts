import { expect } from 'chai';
import { KeywordCaseFormatter } from './KeywordCaseFormatter';
import { Formatter as MainFormatter } from '../Formatter';
import { undent } from 'undent';

describe('KeywordCaseFormatter', () => {
    let Formatter: KeywordCaseFormatter;
    beforeEach(() => {
        Formatter = new KeywordCaseFormatter();
    });

    describe('upperCaseLetter()', () => {
        it('works for beginning of word', () => {
            expect(Formatter['upperCaseLetter']('hello', 0)).to.equal('Hello');
        });
        it('works for middle of word', () => {
            expect(Formatter['upperCaseLetter']('hello', 2)).to.equal('heLlo');
        });
        it('works for end of word', () => {
            expect(Formatter['upperCaseLetter']('hello', 4)).to.equal('hellO');
        });
        it('handles out-of-bounds indexes', () => {
            expect(Formatter['upperCaseLetter']('hello', -1)).to.equal('hello');
            expect(Formatter['upperCaseLetter']('hello', 5)).to.equal('hello');
        });
    });

    describe('specificCaseOverride', () => {
        let formatter: MainFormatter;
        beforeEach(() => {
            formatter = new MainFormatter();
        });

        it('specificKeywordCaseOverride', () => {
            const input = undent`sub Main() print "hello" end sub`;
            const expected = undent`sub Main() PRINT "hello" endSub`;
            expect(formatter.format(input, {
                keywordCase: 'lower',
                specificKeywordCaseOverride: {
                    endsub: 'endSub',
                    print: 'PRINT'
                }
            })).to.equal(expected);
        });

        it('specificTypeCaseOverride', () => {
            const input = undent`sub Main(a as integer)`;
            const expected = undent`sub Main(a as Integer)`;
            expect(formatter.format(input, {
                typeCase: 'lower',
                specificTypeCaseOverride: {
                    integer: 'Integer'
                }
            })).to.equal(expected);
        });

        it('specificKeywordCaseOverride and specificTypeCaseOverride using different cases', () => {
            const input = undent`sub longinteger(a as longinteger)`;
            const expected = undent`sub LongInteger(a as longInteger)`;
            expect(formatter.format(input, {
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
            const input = undent`sub longinteger(a as longinteger)`;
            expect(formatter.format(input, {
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
