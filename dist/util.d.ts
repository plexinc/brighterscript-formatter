import type { Token } from 'brighterscript';
import { TokenKind } from 'brighterscript';
export declare class Util {
    /**
     * Get the tokens for the whole line starting at the given index (including the Newline or EOF token at the end)
     * @param startIndex
     * @param tokens
     */
    getLineTokens(startIndex: number, tokens: Token[]): {
        startIndex: number;
        stopIndex: number;
        tokens: Token[];
    };
    /**
     * Get the first token before the index that is NOT Whitespace
     */
    getPreviousNonWhitespaceToken(tokens: Token[], startIndex: number, stopAtNewline?: boolean): Token | undefined;
    /**
     * Get the first token after the index that is NOT Whitespace. Returns undefined if stopAtNewLine===true and found a newline,
     * or if we found the EOF token
     */
    getNextNonWhitespaceToken(tokens: Token[], index: number, stopAtNewLine?: boolean): Token | undefined;
    /**
     * Find the matching closing token for open square or open curly
     */
    getClosingToken(tokens: Token[], currentIndex: number, openKind: TokenKind, closeKind: TokenKind): Token | undefined;
    /**
     * Helper function used to print the tokens to console
     */
    printTokens(tokens: Token[]): string;
    /**
     * Merge multiple side-by-side whitespace tokens into a single token containing all the whitespace.
     * @param tokens the array of tokens to modify in-place
     * @param leadingOnly stop processing if a non-whitespace token is encountered
     */
    dedupeWhitespace(tokens: Token[], leadingOnly?: boolean): void;
}
declare const util: Util;
export { util };
