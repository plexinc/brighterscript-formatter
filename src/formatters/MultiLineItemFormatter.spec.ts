
import { expect } from 'chai';
import { Formatter } from '../Formatter';

describe('MultiLineItemFormatter', () => {
    let formatter: Formatter;

    beforeEach(() => {
        formatter = new Formatter();
    });

    it('preserves return array on same line', () => {
        const inputSameLine = `sub foo()\n    return [1, 2, 3]\nend sub`;
        const expectedSameLine = `sub foo()\n    return [1, 2, 3]\nend sub`;
        expect(formatter.format(inputSameLine).trim()).to.equal(expectedSameLine.trim());
    });

    it('preserves return object on same line (multi-line content)', () => {
        const input = `sub foo()\n    return {\n        a: 1\n    }\nend sub`;
        const expected = `sub foo()\n    return {\n        a: 1\n    }\nend sub`;
        expect(formatter.format(input).trim()).to.equal(expected.trim());
    });

    it('preserves return object starting on same line but multiline', () => {
        const input = `sub foo()\n    return { a: 1,\n        b: 2\n    }\nend sub`;
        const expected = `sub foo()\n    return { a: 1,\n        b: 2\n    }\nend sub`;
        expect(formatter.format(input).trim()).to.equal(expected.trim());
    });
});
