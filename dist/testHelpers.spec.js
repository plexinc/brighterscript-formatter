"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lex = exports.expectTokens = void 0;
const brighterscript_1 = require("brighterscript");
const chai_1 = require("chai");
function expectTokens(actual, expected) {
    var _a;
    //convert expected tokens into more usable format
    expected = expected.map(x => {
        if (typeof x === 'string') {
            return {
                text: x
            };
        }
        else {
            return x;
        }
    });
    //append an Eof token if we were not provided with one
    if (((_a = expected[expected.length - 1]) === null || _a === void 0 ? void 0 : _a.kind) !== brighterscript_1.TokenKind.Eof) {
        expected.push({ kind: brighterscript_1.TokenKind.Eof });
    }
    const actualClones = [];
    for (let i = 0; i < actual.length; i++) {
        const expectedDiagnostic = expected[i];
        const actualDiagnostic = cloneObject(actual[i], expectedDiagnostic, ['kind', 'text', 'range']);
        actualClones.push(actualDiagnostic);
    }
    (0, chai_1.expect)(actualClones).to.eql(expected);
}
exports.expectTokens = expectTokens;
function cloneObject(original, template, defaultKeys) {
    const clone = {};
    let keys = Object.keys(template !== null && template !== void 0 ? template : {});
    //if there were no keys provided, use some sane defaults
    keys = keys.length > 0 ? keys : defaultKeys;
    //only compare the specified keys from actualDiagnostic
    for (const key of keys) {
        clone[key] = original[key];
    }
    return clone;
}
/**
 * Shorthand for lexing a file and including whitespace
 */
function lex(text) {
    return brighterscript_1.Lexer.scan(text, { includeWhitespace: true }).tokens;
}
exports.lex = lex;
//# sourceMappingURL=testHelpers.spec.js.map