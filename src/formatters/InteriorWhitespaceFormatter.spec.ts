
import { expect } from 'chai';
import { undent } from 'undent';
import { normalizeOptions } from '../FormattingOptions';
import { Lexer, Parser, ParseMode, TokenKind } from 'brighterscript';
import { util } from '../util';
import { InteriorWhitespaceFormatter } from './InteriorWhitespaceFormatter';
import type { FormattingOptions } from '../FormattingOptions';

describe('insertSpaceAroundParameterAssignment', () => {
    let interiorWhitespaceFormatter: InteriorWhitespaceFormatter;

    beforeEach(() => {
        interiorWhitespaceFormatter = new InteriorWhitespaceFormatter();
    });

    function format(text: string, formattingOptions = {} as FormattingOptions) {
        const options = normalizeOptions(formattingOptions);
        let { tokens } = Lexer.scan(text, { includeWhitespace: true });
        const parser = Parser.parse(
            tokens.filter(x => x.kind !== TokenKind.Whitespace),
            { mode: ParseMode.BrighterScript }
        );
        util.dedupeWhitespace(tokens);
        tokens = interiorWhitespaceFormatter.format(tokens, parser, options);
        return tokens.map(x => x.text).join('');
    }

    it('formats empty objects in function parameters correctly', () => {
        const input = undent`
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
                print "hello"
            end sub
        `;
        const expected = undent`
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions = {} as object)
                print "hello"
            end sub
        `;
        expect(format(input)).to.equal(expected);
    });

    it('formats empty objects in function parameters correctly with explicit option false', () => {
        const input = undent`
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
                print "hello"
            end sub
        `;
        const expected = undent`
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions = {} as object)
                print "hello"
            end sub
        `;
        expect(format(input, { insertSpaceBetweenEmptyCurlyBraces: false })).to.equal(expected);
    });

    it('formats empty objects in function parameters correctly with explicit option true', () => {
        const input = undent`
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
                print "hello"
            end sub
        `;
        const expected = undent`
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions = { } as object)
                print "hello"
            end sub
        `;
        expect(format(input, { insertSpaceBetweenEmptyCurlyBraces: true })).to.equal(expected);
    });

    it('formats empty objects in function parameters correctly with insertSpaceAroundParameterAssignment: false', () => {
        const input = undent`
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions   =   {} as object)
                print "hello"
            end sub
        `;
        const expected = undent`
            sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
                print "hello"
            end sub
        `;
        expect(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
    });

    it('handles nested parentheses in function parameters correctly', () => {
        const input = undent`
            sub foo(a = (1 + 2), b = 3)
                print "hello"
            end sub
        `;
        const expected = undent`
            sub foo(a=(1 + 2), b=3)
                print "hello"
            end sub
        `;
        expect(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
    });

    it('handles simple assignments in function parameters correctly', () => {
        const input = undent`
            sub foo(a = 1, b = 3)
                print "hello"
            end sub
        `;
        const expected = undent`
            sub foo(a=1, b=3)
                print "hello"
            end sub
        `;
        expect(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
    });

    it('handles optional chaining in default parameter values', () => {
        const input = undent`
            sub foo(a = m?.call?())
                print "hello"
            end sub
        `;
        const expected = undent`
            sub foo(a=m?.call?())
                print "hello"
            end sub
        `;
        expect(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(expected);
    });

    it('handles AA literal with key and colon on same line', () => {
        const input = undent`
                sub main()
                    a = {
                        key: "value"
                    }
                end sub
            `;
        expect(format(input)).to.equal(input);
    });

    it('handles ReplacementIdentifier', () => {
        const input = undent`
                sub main()
                    print @{chromaIcons.STOP}
                end sub
            `;
        expect(format(input)).to.equal(input);
    });

    it('handles anonymous function with insertSpaceAroundParameterAssignment: false', () => {
        const input = undent`
                sub main()
                    a = sub(a=1)
                    end sub
                end sub
            `;
        expect(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(input);
    });

    it('handles parameter assignment without spaces with insertSpaceAroundParameterAssignment: false', () => {
        const input = undent`
                sub main(a=1)
                end sub
            `;
        expect(format(input, { insertSpaceAroundParameterAssignment: false })).to.equal(input);
    });

    it('handles sub with invalid next token', () => {
        const input = undent`
                sub =
            `;
        expect(format(input)).to.equal(input);
    });

    it('handles incomplete parameter assignment (EOF)', () => {
        const input = undent`
                sub main(a=
            `;
        const expected = undent`
                sub main(a =
            `;
        expect(format(input)).to.equal(expected);
    });

    it('handles } followed by non-] token', () => {
        const input = undent`
                sub main()
                    a = {
                        k: 1
                    }
                    b = 2
                end sub
            `;
        expect(format(input)).to.equal(input);
    });

    it('handles ]] on different lines', () => {
        const input = undent`
                sub main()
                    a = [
                        [
                            1
                        ]
                    ]
                end sub
            `;
        expect(format(input)).to.equal(input);
    });

    it('handles unmatched brackets', () => {
        const input = undent`
                sub main()
                    a = [[
                        1
                    ]
                end sub
            `;
        expect(format(input)).to.equal(input);
    });

    it('handles nested arrays with content', () => {
        const input = undent`
                sub main()
                    a = [ 1, [2] ]
                end sub
            `;
        const expected = undent`
                sub main()
                    a = [1, [2]]
                end sub
            `;
        expect(format(input)).to.equal(expected);
    });

    it('handles EOF after ]', () => {
        const input = undent`
                sub main()
                    a = [1]`;
        expect(format(input)).to.equal(input);
    });

    it('handles sub at EOF', () => {
        const input = 'sub';
        expect(format(input)).to.equal(input);
    });

    it('handles sub name at EOF', () => {
        const input = 'sub main';
        expect(format(input)).to.equal(input);
    });

    it('handles sub main(=)', () => {
        const input = 'sub main(=)';
        const expected = 'sub main( =)';
        expect(format(input)).to.equal(expected);
    });

    it('handles sub main =', () => {
        const input = 'sub main =';
        expect(format(input)).to.equal(input);
    });
});
