import type { Token } from 'brighterscript';
import type { FormattingOptions } from '../FormattingOptions';
export declare class KeywordCaseFormatter {
    /**
     * Handle indentation for an array of tokens
     */
    format(tokens: Token[], options: FormattingOptions): Token[];
    /**
     * Convert the character at the specified index to upper case
     */
    private upperCaseLetter;
    /**
     * Determine if the token is a type keyword (meaning preceded by `as` token)
     * @param token
     */
    isType(tokens: Token[], token: Token): boolean;
}
