import type { Parser, Token } from 'brighterscript';
import type { FormattingOptions } from '../FormattingOptions';
export declare class InteriorWhitespaceFormatter {
    /**
     * Force all Whitespace between tokens to be exactly 1 space wide
     */
    format(tokens: Token[], parser: Parser, options: FormattingOptions): Token[];
    /**
    * Format spacing between various tokens that are more specific than `formatInteriorWhitespace`
    */
    private formatTokenSpacing;
    /**
     * Ensure exactly 1 or 0 spaces between all literal associative array keys and the colon after it
     */
    private formatSpaceBetweenAssociativeArrayLiteralKeyAndColon;
    /**
     * Remove Whitespace tokens backwards until a non-Whitespace token is encountered
     * @param startIndex the index of the non-Whitespace token to start with. This function will start iterating at `startIndex - 1`
     */
    private removeWhitespaceTokensBackwards;
    /**
     * Determine if the current token appears to be the negative sign for a variable identifier token
     */
    private looksLikeNegativeVariable;
    /**
     * Remove Whitespace until the next non-Whitespace character.
     * This operates on the array itself
     */
    removeWhitespace(tokens: Token[], index: number): void;
    /**
     * Determine if the current token appears to be the negative sign for a numeric literal
     */
    looksLikeNegativeNumericLiteral(tokens: Token[], index: number): boolean;
}
