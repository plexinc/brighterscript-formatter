"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Formatter_1 = require("../Formatter");
const undent_1 = require("undent");
describe('MultiLineItemFormatter', () => {
    let formatter;
    beforeEach(() => {
        formatter = new Formatter_1.Formatter();
    });
    it('preserves return array on same line', () => {
        const inputSameLine = `sub foo()\n    return [1, 2, 3]\nend sub`;
        const expectedSameLine = `sub foo()\n    return [1, 2, 3]\nend sub`;
        (0, chai_1.expect)(formatter.format(inputSameLine).trim()).to.equal(expectedSameLine.trim());
    });
    it('preserves isMatchingDoubleArrayOrArrayCurly [[ .. ]]', () => {
        const input = (0, undent_1.undent) `
        [[1, 2, 3]
        ]`;
        const expected = (0, undent_1.undent) `
        [
            [1, 2, 3]
        ]`;
        (0, chai_1.expect)(formatter.format(input).trim()).to.equal(expected.trim());
    });
    it('preserves isMatchingDoubleArrayOrArrayCurly [{ .. }]', () => {
        const input = (0, undent_1.undent) `
        [{1, 2, 3}
        ]`;
        const expected = (0, undent_1.undent) `
        [
            { 1, 2, 3 }
        ]`;
        (0, chai_1.expect)(formatter.format(input).trim()).to.equal(expected.trim());
    });
    it('preserves return object on same line (multi-line content)', () => {
        const input = `sub foo()\n    return {\n        a: 1\n    }\nend sub`;
        const expected = `sub foo()\n    return {\n        a: 1\n    }\nend sub`;
        (0, chai_1.expect)(formatter.format(input).trim()).to.equal(expected.trim());
    });
    it('preserves return object starting on same line but multiline', () => {
        const input = `sub foo()\n    return { a: 1,\n        b: 2\n    }\nend sub`;
        const expected = `sub foo()\n    return { a: 1,\n        b: 2\n    }\nend sub`;
        (0, chai_1.expect)(formatter.format(input).trim()).to.equal(expected.trim());
    });
    it('preserves multiple open/close pairs that are unbalanced', () => {
        const input = (0, undent_1.undent) `
            m.callback.Invoke([m, {
                "event": event,
                "data": data,
            }])
        `;
        const expected = (0, undent_1.undent) `
            m.callback.Invoke([m, {
                "event": event,
                "data": data,
            }])
        `;
        (0, chai_1.expect)(formatter.format(input).trim()).to.equal(expected.trim());
    });
});
//# sourceMappingURL=MultiLineItemFormatter.spec.js.map