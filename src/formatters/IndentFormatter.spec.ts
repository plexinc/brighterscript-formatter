import { expect } from 'chai';
import { expectTokens, lex } from '../testHelpers.spec';
import { undent } from 'undent';
import { IndentFormatter } from './IndentFormatter';
import { Lexer, Parser, ParseMode, TokenKind } from 'brighterscript';
import { util } from '../util';
import { normalizeOptions } from '../FormattingOptions';

describe('IndentFormatter', () => {
    let formatter: IndentFormatter;

    beforeEach(() => {
        formatter = new IndentFormatter();
    });

    function format(text: string) {
        const options = normalizeOptions({});
        let { tokens } = Lexer.scan(text, { includeWhitespace: true });
        const parser = Parser.parse(
            tokens.filter(x => x.kind !== TokenKind.Whitespace),
            { mode: ParseMode.BrighterScript }
        );
        util.dedupeWhitespace(tokens);
        tokens = formatter.format(tokens, options, parser);
        return tokens.map(x => x.text).join('');
    }

    describe('ensureTokenIndentation', () => {
        it('does nothing for empty or invalid tokens', () => {
            expect(
                formatter['ensureTokenIndentation'](null as any, 0)
            ).to.eql(null);
            expect(
                formatter['ensureTokenIndentation']([], 0)
            ).to.eql([]);
        });

        it('handles negative tab size', () => {
            expectTokens(
                formatter['ensureTokenIndentation'](lex(`\tspeak()`), -2),
                ['', 'speak', '(', ')']
            );
        });

        it('does not add whitespace token if no indentation is needed', () => {
            expectTokens(
                formatter['ensureTokenIndentation'](lex(`speak()`), 0),
                ['speak', '(', ')']
            );
        });

        it('dedupes side-by-side whitespace tokens into one', () => {
            expectTokens(
                formatter['ensureTokenIndentation'](lex(` \t speak()`), 1),
                ['    ', 'speak', '(', ')']
            );
        });

        it('adds whitespace when missing', () => {
            expectTokens(
                formatter['ensureTokenIndentation'](lex(`speak()`), 1),
                ['    ', 'speak', '(', ')']
            );
        });

        it('adds correct indentation when missing', () => {
            expectTokens(
                formatter['ensureTokenIndentation'](lex(`speak()`), 3),
                ['            ', 'speak', '(', ')']
            );
        });

        it('uses supplied indentation char when provided', () => {
            expectTokens(
                formatter['ensureTokenIndentation'](lex(`speak()`), 3, '\t'),
                ['\t\t\t', 'speak', '(', ')']
            );
        });

        it('handles single-line if with @stop inside #if block', () => {
            const input = undent`
                #if DEBUG
                            ' When a colorsUrl is provided, there should always be a valid colorsUrlOriginId
                        if data.blur.colorsUrl <> invalid and IsInvalidOrEmpty(data.blur.colorsUrlOriginId) then @stop
                   #end if
            `;
            const expected = undent`
                #if DEBUG
                    ' When a colorsUrl is provided, there should always be a valid colorsUrlOriginId
                    if data.blur.colorsUrl <> invalid and IsInvalidOrEmpty(data.blur.colorsUrlOriginId) then @stop
                #end if
            `;
            expect(format(input)).to.equal(expected);
        });
    });

    describe('trimWhitespaceOnlyLines', () => {
        it('trims whitespace-only lines', () => {
            expectTokens(
                formatter['trimWhitespaceOnlyLines'](lex(` `)),
                []
            );
        });

        it('leaves non-whitespace-only lines intact', () => {
            expectTokens(
                formatter['trimWhitespaceOnlyLines'](lex(` speak()`)),
                [' ', 'speak', '(', ')']
            );
        });
    });

    it('handles array indentation in else if block', () => {
        const input = undent`
            sub test()
                    if true then
                    print "true"
            else if ArrayContains([
                        "addToWatchlist",
                        "removeFromWatchlist",
                        "removeFromContinueWatching",
                        "markAsWatched",
                        "markAsUnwatched"
                    ], action.id) then
                Metrics().ReportEvent(action.metrics?.click)
                  end if
               end sub
        `;
        const expected = undent`
            sub test()
                if true then
                    print "true"
                else if ArrayContains([
                    "addToWatchlist",
                    "removeFromWatchlist",
                    "removeFromContinueWatching",
                    "markAsWatched",
                    "markAsUnwatched"
                ], action.id) then
                    Metrics().ReportEvent(action.metrics?.click)
                end if
            end sub
        `;
        expect(format(input)).to.equal(expected);
    });

    it('handles object literal indentation after array access', () => {
        const input = undent`
            sub test()
                  m["mainGroupCurrentBasePosition"] = {
                        "x": 0,
                    "y": 0
                }
            end sub
        `;
        const expected = undent`
            sub test()
                m["mainGroupCurrentBasePosition"] = {
                    "x": 0,
                    "y": 0
                }
            end sub
        `;
        expect(format(input)).to.equal(expected);
    });

    it('handles indentation for })] with function call', () => {
        const input = undent`
            function GetOverflowActionFromMetadata(metadata as object) as object
                  if metadata._container.isLiveTV = true or metadata.type = "collection" then return []

                   return [API().CreateAction("pmsOverflow", "overflow-horizontal-alt", ltr("More"), {
                    "data": {
                           "originId": metadata._container._originId,
                        "ratingKey": metadata["ratingKey"],
                        "key": metadata["key"].Replace("/children", ""),
                    },
                })]
            end function
        `;
        const expected = undent`
            function GetOverflowActionFromMetadata(metadata as object) as object
                if metadata._container.isLiveTV = true or metadata.type = "collection" then return []

                return [API().CreateAction("pmsOverflow", "overflow-horizontal-alt", ltr("More"), {
                    "data": {
                        "originId": metadata._container._originId,
                        "ratingKey": metadata["ratingKey"],
                        "key": metadata["key"].Replace("/children", ""),
                    },
                })]
            end function
        `;
        expect(format(input)).to.equal(expected);
    });

    it('prevents double indentation when closing and opening indentors on the same line', () => {
        const input = undent`
            sub test()
                a = {
                       x: 1
                  } : b = {
                       y: 2
                  }
            end sub
        `;
        const expected = undent`
            sub test()
                a = {
                    x: 1
                } : b = {
                    y: 2
                }
            end sub
        `;
        expect(format(input)).to.equal(expected);
    });

    it('handles continue for loop', () => {
        const input = undent`
            sub main()
                    for i = 0 to 10
                    if true then continue for
                  end for
              end sub
        `;
        const expected = undent`
            sub main()
                for i = 0 to 10
                    if true then continue for
                end for
            end sub
        `;
        expect(format(input)).to.equal(expected);
    });

    it('handles continue while loop', () => {
        const input = undent`
            sub main()
                   while true
                        if true then continue while
            end while
            end sub
        `;
        const expected = undent`
            sub main()
                while true
                    if true then continue while
                end while
            end sub
        `;
        expect(format(input)).to.equal(expected);
    });

    it('handles double un-indent with nested arrays on same line', () => {
        const input = undent`
            sub main()
            a = [[
                        1
                   ]]
            end sub
        `;
        const expected = undent`
            sub main()
                a = [[
                    1
                ]]
            end sub
        `;
        expect(format(input)).to.equal(expected);
    });

    it('handles double un-indent with nested objects on same line', () => {
        const input = undent`
            sub main()
            a = [{
                         k: 1
                   }]
            end sub
        `;
        const expected = undent`
            sub main()
                a = [{
                    k: 1
                }]
            end sub
        `;
        expect(format(input)).to.equal(expected);
    });

    it('handles EOF after outdent token', () => {
        const input = undent`
            sub main()
               end sub`;
        const expected = undent`
            sub main()
            end sub`;
        expect(format(input)).to.equal(expected);
    });

    it('handles next followed by colon', () => {
        const input = undent`
            sub main()
                for i = 0 to 1
                   next : print "done"
            end sub
        `;
        const expected = undent`
            sub main()
                for i = 0 to 1
                next : print "done"
            end sub
        `;
        expect(format(input)).to.equal(expected);
    });
});
