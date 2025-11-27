"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const testHelpers_spec_1 = require("../testHelpers.spec");
const undent_1 = require("undent");
const IndentFormatter_1 = require("./IndentFormatter");
const brighterscript_1 = require("brighterscript");
const util_1 = require("../util");
const FormattingOptions_1 = require("../FormattingOptions");
describe('IndentFormatter', () => {
    let formatter;
    beforeEach(() => {
        formatter = new IndentFormatter_1.IndentFormatter();
    });
    function format(text) {
        const options = (0, FormattingOptions_1.normalizeOptions)({});
        let { tokens } = brighterscript_1.Lexer.scan(text, { includeWhitespace: true });
        const parser = brighterscript_1.Parser.parse(tokens.filter(x => x.kind !== brighterscript_1.TokenKind.Whitespace), { mode: brighterscript_1.ParseMode.BrighterScript });
        util_1.util.dedupeWhitespace(tokens);
        tokens = formatter.format(tokens, options, parser);
        return tokens.map(x => x.text).join('');
    }
    describe('ensureTokenIndentation', () => {
        it('does nothing for empty or invalid tokens', () => {
            (0, chai_1.expect)(formatter['ensureTokenIndentation'](null, 0)).to.eql(null);
            (0, chai_1.expect)(formatter['ensureTokenIndentation']([], 0)).to.eql([]);
        });
        it('handles negative tab size', () => {
            (0, testHelpers_spec_1.expectTokens)(formatter['ensureTokenIndentation']((0, testHelpers_spec_1.lex)(`\tspeak()`), -2), ['', 'speak', '(', ')']);
        });
        it('does not add whitespace token if no indentation is needed', () => {
            (0, testHelpers_spec_1.expectTokens)(formatter['ensureTokenIndentation']((0, testHelpers_spec_1.lex)(`speak()`), 0), ['speak', '(', ')']);
        });
        it('dedupes side-by-side whitespace tokens into one', () => {
            (0, testHelpers_spec_1.expectTokens)(formatter['ensureTokenIndentation']((0, testHelpers_spec_1.lex)(` \t speak()`), 1), ['    ', 'speak', '(', ')']);
        });
        it('adds whitespace when missing', () => {
            (0, testHelpers_spec_1.expectTokens)(formatter['ensureTokenIndentation']((0, testHelpers_spec_1.lex)(`speak()`), 1), ['    ', 'speak', '(', ')']);
        });
        it('adds correct indentation when missing', () => {
            (0, testHelpers_spec_1.expectTokens)(formatter['ensureTokenIndentation']((0, testHelpers_spec_1.lex)(`speak()`), 3), ['            ', 'speak', '(', ')']);
        });
        it('uses supplied indentation char when provided', () => {
            (0, testHelpers_spec_1.expectTokens)(formatter['ensureTokenIndentation']((0, testHelpers_spec_1.lex)(`speak()`), 3, '\t'), ['\t\t\t', 'speak', '(', ')']);
        });
        it('handles single-line if with @stop inside #if block', () => {
            const input = (0, undent_1.undent) `
                #if DEBUG
                            ' When a colorsUrl is provided, there should always be a valid colorsUrlOriginId
                        if data.blur.colorsUrl <> invalid and IsInvalidOrEmpty(data.blur.colorsUrlOriginId) then @stop
                   #end if
            `;
            const expected = (0, undent_1.undent) `
                #if DEBUG
                    ' When a colorsUrl is provided, there should always be a valid colorsUrlOriginId
                    if data.blur.colorsUrl <> invalid and IsInvalidOrEmpty(data.blur.colorsUrlOriginId) then @stop
                #end if
            `;
            (0, chai_1.expect)(format(input)).to.equal(expected);
        });
    });
    describe('trimWhitespaceOnlyLines', () => {
        it('trims whitespace-only lines', () => {
            (0, testHelpers_spec_1.expectTokens)(formatter['trimWhitespaceOnlyLines']((0, testHelpers_spec_1.lex)(` `)), []);
        });
        it('leaves non-whitespace-only lines intact', () => {
            (0, testHelpers_spec_1.expectTokens)(formatter['trimWhitespaceOnlyLines']((0, testHelpers_spec_1.lex)(` speak()`)), [' ', 'speak', '(', ')']);
        });
    });
    it('handles array indentation in else if block', () => {
        const input = (0, undent_1.undent) `
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
        const expected = (0, undent_1.undent) `
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
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles object literal indentation after array access', () => {
        const input = (0, undent_1.undent) `
            sub test()
                  m["mainGroupCurrentBasePosition"] = {
                        "x": 0,
                    "y": 0
                }
            end sub
        `;
        const expected = (0, undent_1.undent) `
            sub test()
                m["mainGroupCurrentBasePosition"] = {
                    "x": 0,
                    "y": 0
                }
            end sub
        `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles indentation for })] with function call', () => {
        const input = (0, undent_1.undent) `
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
        const expected = (0, undent_1.undent) `
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
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('prevents double indentation when closing and opening indentors on the same line', () => {
        const input = (0, undent_1.undent) `
            sub test()
                a = {
                       x: 1
                  } : b = {
                       y: 2
                  }
            end sub
        `;
        const expected = (0, undent_1.undent) `
            sub test()
                a = {
                    x: 1
                } : b = {
                    y: 2
                }
            end sub
        `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles continue for loop', () => {
        const input = (0, undent_1.undent) `
            sub main()
                    for i = 0 to 10
                    if true then continue for
                  end for
              end sub
        `;
        const expected = (0, undent_1.undent) `
            sub main()
                for i = 0 to 10
                    if true then continue for
                end for
            end sub
        `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles continue while loop', () => {
        const input = (0, undent_1.undent) `
            sub main()
                   while true
                        if true then continue while
            end while
            end sub
        `;
        const expected = (0, undent_1.undent) `
            sub main()
                while true
                    if true then continue while
                end while
            end sub
        `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles double un-indent with nested arrays on same line', () => {
        const input = (0, undent_1.undent) `
            sub main()
            a = [[
                        1
                   ]]
            end sub
        `;
        const expected = (0, undent_1.undent) `
            sub main()
                a = [[
                    1
                ]]
            end sub
        `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles double un-indent with nested objects on same line', () => {
        const input = (0, undent_1.undent) `
            sub main()
            a = [{
                         k: 1
                   }]
            end sub
        `;
        const expected = (0, undent_1.undent) `
            sub main()
                a = [{
                    k: 1
                }]
            end sub
        `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles EOF after outdent token', () => {
        const input = (0, undent_1.undent) `
            sub main()
               end sub`;
        const expected = (0, undent_1.undent) `
            sub main()
            end sub`;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles next followed by colon', () => {
        const input = (0, undent_1.undent) `
            sub main()
                for i = 0 to 1
                   next : print "done"
            end sub
        `;
        const expected = (0, undent_1.undent) `
            sub main()
                for i = 0 to 1
                next : print "done"
            end sub
        `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
});
//# sourceMappingURL=IndentFormatter.spec.js.map