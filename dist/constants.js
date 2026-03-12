"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedClassIdentifierKinds = exports.CompositeKeywordStartingWords = exports.ConditionalCompileTokenKinds = exports.TypeTokens = exports.TokensBeforeNegativeNumericLiteral = exports.NumericLiteralTokenKinds = exports.CallableKeywordTokenKinds = exports.InterumSpacingTokenKinds = exports.OutdentSpacerTokenKinds = exports.IgnoreIndentSpacerByParentTokenKind = exports.IndentSpacerTokenKinds = exports.Keywords = exports.BasicKeywords = exports.CompositeKeywords = exports.DEFAULT_INDENT_SPACE_COUNT = void 0;
const brighterscript_1 = require("brighterscript");
exports.DEFAULT_INDENT_SPACE_COUNT = 4;
exports.CompositeKeywords = [
    brighterscript_1.TokenKind.EndFunction,
    brighterscript_1.TokenKind.EndIf,
    brighterscript_1.TokenKind.EndSub,
    brighterscript_1.TokenKind.EndWhile,
    brighterscript_1.TokenKind.ExitWhile,
    brighterscript_1.TokenKind.ExitFor,
    brighterscript_1.TokenKind.EndFor,
    brighterscript_1.TokenKind.HashElseIf,
    brighterscript_1.TokenKind.HashEndIf,
    brighterscript_1.TokenKind.EndClass,
    brighterscript_1.TokenKind.EndInterface,
    brighterscript_1.TokenKind.EndNamespace,
    brighterscript_1.TokenKind.EndTry,
    brighterscript_1.TokenKind.EndEnum
];
exports.BasicKeywords = [
    brighterscript_1.TokenKind.And,
    brighterscript_1.TokenKind.Eval,
    brighterscript_1.TokenKind.If,
    brighterscript_1.TokenKind.Then,
    brighterscript_1.TokenKind.Else,
    brighterscript_1.TokenKind.For,
    brighterscript_1.TokenKind.To,
    brighterscript_1.TokenKind.Step,
    brighterscript_1.TokenKind.Exit,
    brighterscript_1.TokenKind.Each,
    brighterscript_1.TokenKind.While,
    brighterscript_1.TokenKind.Function,
    brighterscript_1.TokenKind.Sub,
    brighterscript_1.TokenKind.As,
    brighterscript_1.TokenKind.Mod,
    brighterscript_1.TokenKind.Return,
    brighterscript_1.TokenKind.Print,
    brighterscript_1.TokenKind.Goto,
    brighterscript_1.TokenKind.Dim,
    brighterscript_1.TokenKind.Stop,
    brighterscript_1.TokenKind.AtStop,
    brighterscript_1.TokenKind.Void,
    brighterscript_1.TokenKind.Boolean,
    brighterscript_1.TokenKind.Integer,
    brighterscript_1.TokenKind.LongInteger,
    brighterscript_1.TokenKind.Float,
    brighterscript_1.TokenKind.Double,
    brighterscript_1.TokenKind.String,
    brighterscript_1.TokenKind.Object,
    brighterscript_1.TokenKind.Interface,
    brighterscript_1.TokenKind.Invalid,
    brighterscript_1.TokenKind.Dynamic,
    brighterscript_1.TokenKind.Or,
    brighterscript_1.TokenKind.Let,
    brighterscript_1.TokenKind.Next,
    brighterscript_1.TokenKind.Not,
    brighterscript_1.TokenKind.HashIf,
    brighterscript_1.TokenKind.HashElse,
    brighterscript_1.TokenKind.HashConst,
    brighterscript_1.TokenKind.Class,
    brighterscript_1.TokenKind.Namespace,
    brighterscript_1.TokenKind.Import,
    brighterscript_1.TokenKind.Try,
    brighterscript_1.TokenKind.Catch,
    brighterscript_1.TokenKind.Throw
];
exports.Keywords = [];
Array.prototype.push.apply(exports.Keywords, exports.CompositeKeywords);
Array.prototype.push.apply(exports.Keywords, exports.BasicKeywords);
/**
 * The list of tokens that should cause an indent
 */
exports.IndentSpacerTokenKinds = [
    brighterscript_1.TokenKind.Sub,
    brighterscript_1.TokenKind.For,
    brighterscript_1.TokenKind.ForEach,
    brighterscript_1.TokenKind.Function,
    brighterscript_1.TokenKind.If,
    brighterscript_1.TokenKind.LeftCurlyBrace,
    brighterscript_1.TokenKind.LeftSquareBracket,
    brighterscript_1.TokenKind.QuestionLeftSquare,
    brighterscript_1.TokenKind.While,
    brighterscript_1.TokenKind.HashIf,
    brighterscript_1.TokenKind.Class,
    brighterscript_1.TokenKind.Interface,
    brighterscript_1.TokenKind.Namespace,
    brighterscript_1.TokenKind.Try,
    brighterscript_1.TokenKind.Enum
];
/**
 * A map of tokenKinds that should not cause an indent keyed by the parent token kind
 * E.g. In 'interface', 'sub' and 'function' should not be indented
 */
exports.IgnoreIndentSpacerByParentTokenKind = new Map([
    [brighterscript_1.TokenKind.Interface, [
            brighterscript_1.TokenKind.Sub,
            brighterscript_1.TokenKind.Function,
            brighterscript_1.TokenKind.Enum,
            brighterscript_1.TokenKind.Class
        ]]
]);
/**
 * The list of tokens that should cause an outdent
 */
exports.OutdentSpacerTokenKinds = [
    brighterscript_1.TokenKind.RightCurlyBrace,
    brighterscript_1.TokenKind.RightSquareBracket,
    brighterscript_1.TokenKind.EndFunction,
    brighterscript_1.TokenKind.EndIf,
    brighterscript_1.TokenKind.EndSub,
    brighterscript_1.TokenKind.EndWhile,
    brighterscript_1.TokenKind.EndFor,
    brighterscript_1.TokenKind.Next,
    brighterscript_1.TokenKind.HashEndIf,
    brighterscript_1.TokenKind.EndClass,
    brighterscript_1.TokenKind.EndInterface,
    brighterscript_1.TokenKind.EndNamespace,
    brighterscript_1.TokenKind.EndTry,
    brighterscript_1.TokenKind.EndEnum
];
/**
 * The list of tokens that should cause an outdent followed by an immediate indent
 */
exports.InterumSpacingTokenKinds = [
    brighterscript_1.TokenKind.Else,
    brighterscript_1.TokenKind.HashElse,
    brighterscript_1.TokenKind.HashElseIf,
    brighterscript_1.TokenKind.Catch
];
exports.CallableKeywordTokenKinds = [
    brighterscript_1.TokenKind.Function,
    brighterscript_1.TokenKind.Sub
];
exports.NumericLiteralTokenKinds = [
    brighterscript_1.TokenKind.IntegerLiteral,
    brighterscript_1.TokenKind.FloatLiteral,
    brighterscript_1.TokenKind.DoubleLiteral,
    brighterscript_1.TokenKind.LongIntegerLiteral
];
/**
 * Anytime one of these tokens are found before a minus sign,
 * we can safely assume the minus sign is associated with a negative numeric literal
 */
exports.TokensBeforeNegativeNumericLiteral = [
    brighterscript_1.TokenKind.QuestionLeftParen,
    brighterscript_1.TokenKind.Plus,
    brighterscript_1.TokenKind.Minus,
    brighterscript_1.TokenKind.Star,
    brighterscript_1.TokenKind.Forwardslash,
    brighterscript_1.TokenKind.Backslash,
    brighterscript_1.TokenKind.PlusEqual,
    brighterscript_1.TokenKind.ForwardslashEqual,
    brighterscript_1.TokenKind.MinusEqual,
    brighterscript_1.TokenKind.StarEqual,
    brighterscript_1.TokenKind.BackslashEqual,
    brighterscript_1.TokenKind.Equal,
    brighterscript_1.TokenKind.LessGreater,
    brighterscript_1.TokenKind.Greater,
    brighterscript_1.TokenKind.GreaterEqual,
    brighterscript_1.TokenKind.Less,
    brighterscript_1.TokenKind.LessEqual,
    brighterscript_1.TokenKind.LeftShift,
    brighterscript_1.TokenKind.RightShift,
    brighterscript_1.TokenKind.Return,
    brighterscript_1.TokenKind.To,
    brighterscript_1.TokenKind.Step,
    brighterscript_1.TokenKind.Colon,
    brighterscript_1.TokenKind.Semicolon,
    brighterscript_1.TokenKind.Comma,
    brighterscript_1.TokenKind.LeftSquareBracket,
    brighterscript_1.TokenKind.LeftParen,
    brighterscript_1.TokenKind.If,
    brighterscript_1.TokenKind.Print,
    brighterscript_1.TokenKind.While,
    brighterscript_1.TokenKind.Or,
    brighterscript_1.TokenKind.And,
    brighterscript_1.TokenKind.Not,
    brighterscript_1.TokenKind.Newline
];
exports.TypeTokens = [
    brighterscript_1.TokenKind.Boolean,
    brighterscript_1.TokenKind.Double,
    brighterscript_1.TokenKind.Dynamic,
    brighterscript_1.TokenKind.Float,
    brighterscript_1.TokenKind.Function,
    brighterscript_1.TokenKind.Integer,
    brighterscript_1.TokenKind.Invalid,
    brighterscript_1.TokenKind.LongInteger,
    brighterscript_1.TokenKind.Object,
    brighterscript_1.TokenKind.String,
    brighterscript_1.TokenKind.Void
];
exports.ConditionalCompileTokenKinds = [
    brighterscript_1.TokenKind.HashConst,
    brighterscript_1.TokenKind.HashElse,
    brighterscript_1.TokenKind.HashElseIf,
    brighterscript_1.TokenKind.HashEndIf,
    brighterscript_1.TokenKind.HashError,
    brighterscript_1.TokenKind.HashIf
];
exports.CompositeKeywordStartingWords = ['end', 'exit', 'else', '#end', '#else'];
exports.AllowedClassIdentifierKinds = [brighterscript_1.TokenKind.Identifier, ...brighterscript_1.AllowedLocalIdentifiers];
//# sourceMappingURL=constants.js.map