
import { expect } from 'chai';
import { Formatter } from '../Formatter';

describe('insertSpaceAroundParameterAssignment', () => {
    let formatter: Formatter;

    beforeEach(() => {
        formatter = new Formatter();
    });

    it('formats empty objects in function parameters correctly', () => {
        const input = `
sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
    print "hello"
end sub
`;
        const expected = `
sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions = {} as object)
    print "hello"
end sub
`;
        // By default insertSpaceBetweenEmptyCurlyBraces is false (checking this assumption)
        expect(formatter.format(input).trim()).to.equal(expected.trim());
    });

    it('formats empty objects in function parameters correctly with explicit option false', () => {
        const input = `
sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
    print "hello"
end sub
`;
        const expected = `
sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions = {} as object)
    print "hello"
end sub
`;
        expect(formatter.format(input, { insertSpaceBetweenEmptyCurlyBraces: false }).trim()).to.equal(expected.trim());
    });

    it('formats empty objects in function parameters correctly with explicit option true', () => {
        const input = `
sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
    print "hello"
end sub
`;
        const expected = `
sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions = { } as object)
    print "hello"
end sub
`;
        expect(formatter.format(input, { insertSpaceBetweenEmptyCurlyBraces: true }).trim()).to.equal(expected.trim());
    });

    it('formats empty objects in function parameters correctly with insertSpaceAroundParameterAssignment: false', () => {
        const input = `
sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
    print "hello"
end sub
`;
        const expected = `
sub PlaybackSession_MakeDecisionAndSetContent(decisionOptions={} as object)
    print "hello"
end sub
`;
        expect(formatter.format(input, { insertSpaceAroundParameterAssignment: false }).trim()).to.equal(expected.trim());
    });

    it('handles nested parentheses in function parameters correctly', () => {
        const input = `
sub foo(a = (1 + 2), b = 3)
    print "hello"
end sub
`;
        const expected = `
sub foo(a=(1 + 2), b=3)
    print "hello"
end sub
`;
        expect(formatter.format(input, { insertSpaceAroundParameterAssignment: false }).trim()).to.equal(expected.trim());
    });

    it('handles simple assignments in function parameters correctly', () => {
        const input = `
sub foo(a = 1, b = 3)
    print "hello"
end sub
`;
        const expected = `
sub foo(a=1, b=3)
    print "hello"
end sub
`;
        expect(formatter.format(input, { insertSpaceAroundParameterAssignment: false }).trim()).to.equal(expected.trim());
    });

    it('handles optional chaining in default parameter values', () => {
        const input = `
sub foo(a = m?.call?())
    print "hello"
end sub
`;
        const expected = `
sub foo(a=m?.call?())
    print "hello"
end sub
`;
        expect(formatter.format(input, { insertSpaceAroundParameterAssignment: false }).trim()).to.equal(expected.trim());
    });

});
