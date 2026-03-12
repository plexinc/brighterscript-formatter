import type { Token } from 'brighterscript';
import { TokenKind } from 'brighterscript';
export declare class MultiLineItemFormatter {
    /**
     * Handle indentation for an array of tokens
     */
    format(tokens: Token[]): Token[];
    /**
     * Determines if the current index is the start of a single-line array or AA.
     * Walks forward until we find the equal number of open and close curlies/squares, or a newline
     */
    isStartofSingleLineArrayOrAA(tokens: Token[], currentIndex: number, openKind: TokenKind, closeKind: TokenKind): boolean;
    /**
     * Detects when a line has both unbalanced square brackets and curly braces,
     * which indicates a pattern like `[m, {` that should not be reformatted.
     * Scans tokens from the given index until a newline is found.
     * @param tokens The array of tokens to scan.
     * @param currentIndex The index to start scanning from.
     * @returns {boolean} True if both curly and square brackets are unbalanced before a newline; otherwise, false.
     */
    isMultiUnbalancedOpenClosePair(tokens: Token[], currentIndex: number): boolean;
    isMatchingDoubleArrayOrArrayCurly(tokens: Token[], currentIndex: number): boolean;
    /**
     * Check if this is an array or object that starts on the same line as a 'return' statement
     * We want to preserve: return [...] or return {...}
     * Even if the contents span multiple lines
     */
    private isReturnArrayOrCurlyOnSameLine;
}
