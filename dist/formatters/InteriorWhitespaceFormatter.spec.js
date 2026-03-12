"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const undent_1 = require("undent");
const FormattingOptions_1 = require("../FormattingOptions");
const brighterscript_1 = require("brighterscript");
const util_1 = require("../util");
const InteriorWhitespaceFormatter_1 = require("./InteriorWhitespaceFormatter");
describe('interiorWhitespaceFormatter', () => {
    let interiorWhitespaceFormatter;
    beforeEach(() => {
        interiorWhitespaceFormatter = new InteriorWhitespaceFormatter_1.InteriorWhitespaceFormatter();
    });
    function format(text, formattingOptions = {}) {
        const options = (0, FormattingOptions_1.normalizeOptions)(formattingOptions);
        let { tokens } = brighterscript_1.Lexer.scan(text, { includeWhitespace: true });
        const parser = brighterscript_1.Parser.parse(tokens.filter(x => x.kind !== brighterscript_1.TokenKind.Whitespace), { mode: brighterscript_1.ParseMode.BrighterScript });
        util_1.util.dedupeWhitespace(tokens);
        tokens = interiorWhitespaceFormatter.format(tokens, parser, options);
        return tokens.map(x => x.text).join('');
    }
    it('formats empty objects in function parameters correctly', () => {
        const input = (0, undent_1.undent) `
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
                print "hello"
            end sub
        `;
        const expected = (0, undent_1.undent) `
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions = {} as object)
                print "hello"
            end sub
        `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles AA literal with key and colon on same line', () => {
        const input = (0, undent_1.undent) `
                sub main()
                    a = {
                        key: "value"
                    }
                end sub
            `;
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    it('handles ReplacementIdentifier', () => {
        const input = (0, undent_1.undent) `
                sub main()
                    print @{chromaIcons.STOP}
                end sub
            `;
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    it('handles sub with invalid next token', () => {
        const input = (0, undent_1.undent) `
                sub =
            `;
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    it('handles incomplete parameter assignment (EOF)', () => {
        const input = (0, undent_1.undent) `
                sub main(a=
            `;
        const expected = (0, undent_1.undent) `
                sub main(a =
            `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles } followed by non-] token', () => {
        const input = (0, undent_1.undent) `
                sub main()
                    a = {
                        k: 1
                    }
                    b = 2
                end sub
            `;
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    it('handles ]] on different lines', () => {
        const input = (0, undent_1.undent) `
                sub main()
                    a = [
                        [
                            1
                        ]
                    ]
                end sub
            `;
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    it('handles unmatched brackets', () => {
        const input = (0, undent_1.undent) `
                sub main()
                    a = [[
                        1
                    ]
                end sub
            `;
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    it('handles nested arrays with content', () => {
        const input = (0, undent_1.undent) `
                sub main()
                    a = [ 1, [2] ]
                end sub
            `;
        const expected = (0, undent_1.undent) `
                sub main()
                    a = [1, [2]]
                end sub
            `;
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles EOF after ]', () => {
        const input = (0, undent_1.undent) `
                sub main()
                    a = [1]`;
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    it('handles sub at EOF', () => {
        const input = 'sub';
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    it('handles sub name at EOF', () => {
        const input = 'sub main';
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    it('handles sub main(=)', () => {
        const input = 'sub main(=)';
        const expected = 'sub main( =)';
        (0, chai_1.expect)(format(input)).to.equal(expected);
    });
    it('handles sub main =', () => {
        const input = 'sub main =';
        (0, chai_1.expect)(format(input)).to.equal(input);
    });
    describe('insertSpaceBetweenEmptyCurlyBraces', () => {
        it('formats empty objects in function parameters correctly with explicit option false', () => {
            const input = (0, undent_1.undent) `
                sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
                    print "hello"
                end sub
            `;
            const expected = (0, undent_1.undent) `
                sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions = {} as object)
                    print "hello"
                end sub
            `;
            (0, chai_1.expect)(format(input, { insertSpaceBetweenEmptyCurlyBraces: false })).to.equal(expected);
        });
        it('formats empty objects in function parameters correctly with explicit option true', () => {
            const input = (0, undent_1.undent) `
                sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
                    print "hello"
                end sub
            `;
            const expected = (0, undent_1.undent) `
                sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions = { } as object)
                    print "hello"
                end sub
            `;
            (0, chai_1.expect)(format(input, { insertSpaceBetweenEmptyCurlyBraces: true })).to.equal(expected);
        });
    });
    describe('insertSpaceAroundParameterAssignment()', () => {
        it('handles anonymous function with insertSpaceAroundParameterAssignment: false', () => {
            const input = (0, undent_1.undent) `
                    sub main()
                        a = sub(a=1)
                        end sub
                    end sub
                `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(input);
        });
        it('handles parameter assignment without spaces with insertSpaceAroundParameterAssignment: false', () => {
            const input = (0, undent_1.undent) `
                    sub main(a=1)
                    end sub
                `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(input);
        });
        it('adds spaces around parameter assignment when insertSpaceAroundParameterAssignment is true (default)', () => {
            const input = (0, undent_1.undent) `
                    sub main(a=1)
                    end sub
                `;
            const expected = (0, undent_1.undent) `
                    sub main(a = 1)
                    end sub
                `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: true })).to.equal(expected);
        });
        it('handles function parameter assignment without spaces with insertSpaceAroundParameterAssignment: false', () => {
            const input = (0, undent_1.undent) `
                    function main(a    =    1)
                    end function
                `;
            const expected = (0, undent_1.undent) `
                    function main(a=1)
                    end function
                `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
        });
        it('handles function with no default values having insertSpaceAroundParameterAssignment: false', () => {
            const input = (0, undent_1.undent) `
                    function longInteger(a as boolean)
                    end function
                `;
            const expected = (0, undent_1.undent) `
                    function longInteger(a as boolean)
                    end function
                `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
        });
        it('handles function parameter assignment with spaces with insertSpaceAroundParameterAssignment: false', () => {
            const input = (0, undent_1.undent) `
                    function longInteger(a    =    1,   b    =    2)
                    end function
                `;
            const expected = (0, undent_1.undent) `
                    function longInteger(a=1, b=2)
                    end function
                `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
        });
        it('handles anonymous function parameter assignment without spaces with insertSpaceAroundParameterAssignment: false', () => {
            const input = (0, undent_1.undent) `
                    a = function(a   =     1)
                    end function
                `;
            const expected = (0, undent_1.undent) `
                    a = function(a=1)
                    end function
                `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
        });
        it('handles complex assignment without spaces with insertSpaceAroundParameterAssignment: false', () => {
            const input = (0, undent_1.undent) `
                    sub init()
                        uiResolution = {};

                        m.global.AddFields({
                            "mainInit": false,
                            "exitChannel": false,
                            "hasExitedChannel": false,

                            ' UI resolution fields.
                            "uiResolution": uiResolution,
                            "isFHD": (uiResolution.name = "FHD"),
                            "isHD": (uiResolution.name = "HD"),
                            "isSD": (uiResolution.name = "SD"),
                        })
                    end sub
                `;
            const expected = (0, undent_1.undent) `
                    sub init()
                        uiResolution = {};

                        m.global.AddFields({
                            "mainInit": false,
                            "exitChannel": false,
                            "hasExitedChannel": false,

                            ' UI resolution fields.
                            "uiResolution": uiResolution,
                            "isFHD": (uiResolution.name = "FHD"),
                            "isHD": (uiResolution.name = "HD"),
                            "isSD": (uiResolution.name = "SD"),
                        })
                    end sub
                `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
        });
        it('formats empty objects in function parameters correctly with insertSpaceAroundParameterAssignment: false', () => {
            const input = (0, undent_1.undent) `
                sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions   =   {} as object)
                    print "hello"
                end sub
            `;
            const expected = (0, undent_1.undent) `
                sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
                    print "hello"
                end sub
            `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
        });
        it('handles nested parentheses in function parameters correctly', () => {
            const input = (0, undent_1.undent) `
                sub foo(a = (1 + 2), b = 3)
                    print "hello"
                end sub
            `;
            const expected = (0, undent_1.undent) `
                sub foo(a=(1 + 2), b=3)
                    print "hello"
                end sub
            `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
        });
        it('handles simple assignments in function parameters correctly', () => {
            const input = (0, undent_1.undent) `
                sub foo(a = 1, b = 3)
                    print "hello"
                end sub
            `;
            const expected = (0, undent_1.undent) `
                sub foo(a=1, b=3)
                    print "hello"
                end sub
            `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
        });
        it('handles optional chaining in default parameter values', () => {
            const input = (0, undent_1.undent) `
                sub foo(a = m?.call?())
                    print "hello"
                end sub
            `;
            const expected = (0, undent_1.undent) `
                sub foo(a=m?.call?())
                    print "hello"
                end sub
            `;
            (0, chai_1.expect)(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
        });
    });
});
//# sourceMappingURL=InteriorWhitespaceFormatter.spec.js.map