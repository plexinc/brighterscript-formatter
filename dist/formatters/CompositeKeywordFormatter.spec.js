"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const CompositeKeywordFormatter_1 = require("./CompositeKeywordFormatter");
describe('CompositeKeywordFormatter', () => {
    let Formatter;
    beforeEach(() => {
        Formatter = new CompositeKeywordFormatter_1.CompositeKeywordFormatter();
    });
    describe('getCompositeKeywordParts', () => {
        it('works', () => {
            let parts;
            parts = Formatter['getCompositeKeywordParts']({ text: 'endif' });
            (0, chai_1.expect)(parts[0]).to.equal('end');
            (0, chai_1.expect)(parts[1]).to.equal('if');
            parts = Formatter['getCompositeKeywordParts']({ text: 'end if' });
            (0, chai_1.expect)(parts[0]).to.equal('end');
            (0, chai_1.expect)(parts[1]).to.equal('if');
            parts = Formatter['getCompositeKeywordParts']({ text: 'elseif' });
            (0, chai_1.expect)(parts[0]).to.equal('else');
            (0, chai_1.expect)(parts[1]).to.equal('if');
            parts = Formatter['getCompositeKeywordParts']({ text: 'else if' });
            (0, chai_1.expect)(parts[0]).to.equal('else');
            (0, chai_1.expect)(parts[1]).to.equal('if');
        });
        it('works with conditional compile parts', () => {
            let parts;
            parts = Formatter['getCompositeKeywordParts']({ text: '#else if' });
            (0, chai_1.expect)(parts[0]).to.equal('#else');
            (0, chai_1.expect)(parts[1]).to.equal('if');
            parts = Formatter['getCompositeKeywordParts']({ text: '#\t else if' });
            (0, chai_1.expect)(parts[0]).to.equal('#\t else');
            (0, chai_1.expect)(parts[1]).to.equal('if');
            parts = Formatter['getCompositeKeywordParts']({ text: '#end if' });
            (0, chai_1.expect)(parts[0]).to.equal('#end');
            (0, chai_1.expect)(parts[1]).to.equal('if');
            parts = Formatter['getCompositeKeywordParts']({ text: '#\t end if' });
            (0, chai_1.expect)(parts[0]).to.equal('#\t end');
            (0, chai_1.expect)(parts[1]).to.equal('if');
        });
    });
});
//# sourceMappingURL=CompositeKeywordFormatter.spec.js.map