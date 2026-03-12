import type { Token } from 'brighterscript';
import { TokenKind } from 'brighterscript';
export interface TokenWithStartIndex extends Token {
    startIndex: number;
}
export declare const DEFAULT_INDENT_SPACE_COUNT = 4;
export declare const CompositeKeywords: TokenKind[];
export declare const BasicKeywords: TokenKind[];
export declare let Keywords: TokenKind[];
/**
 * The list of tokens that should cause an indent
 */
export declare let IndentSpacerTokenKinds: TokenKind[];
/**
 * A map of tokenKinds that should not cause an indent keyed by the parent token kind
 * E.g. In 'interface', 'sub' and 'function' should not be indented
 */
export declare let IgnoreIndentSpacerByParentTokenKind: Map<TokenKind, TokenKind[]>;
/**
 * The list of tokens that should cause an outdent
 */
export declare let OutdentSpacerTokenKinds: TokenKind[];
/**
 * The list of tokens that should cause an outdent followed by an immediate indent
 */
export declare let InterumSpacingTokenKinds: TokenKind[];
export declare let CallableKeywordTokenKinds: TokenKind[];
export declare let NumericLiteralTokenKinds: TokenKind[];
/**
 * Anytime one of these tokens are found before a minus sign,
 * we can safely assume the minus sign is associated with a negative numeric literal
 */
export declare let TokensBeforeNegativeNumericLiteral: TokenKind[];
export declare const TypeTokens: TokenKind[];
export declare const ConditionalCompileTokenKinds: TokenKind[];
export declare const CompositeKeywordStartingWords: string[];
export declare const AllowedClassIdentifierKinds: TokenKind[];
