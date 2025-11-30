import type { Token } from 'brighterscript';
export declare function expectTokens(actual: Token[], expected: Array<Partial<Token> | string>): void;
/**
 * Shorthand for lexing a file and including whitespace
 */
export declare function lex(text: string): Token[];
