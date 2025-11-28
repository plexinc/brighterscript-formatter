import type { Token, Parser } from 'brighterscript';
import { TokenKind } from 'brighterscript';
import type { FormattingOptions } from '../FormattingOptions';
export declare class IndentFormatter {
    /**
     * Handle indentation for an array of tokens
     */
    format(tokens: Token[], options: FormattingOptions, parser: Parser): Token[];
    private processLine;
    /**
     * Ensure the list of tokens contains the correct number of tabs
     * @param tokens the array of tokens to be modified in-place
     * @param tabCount the number of tabs to indent the tokens by
     * @param tabText the string to use for each tab. For tabs, this is "\t", for spaces it would be something like "    " or "  "
     */
    private ensureTokenIndentation;
    /**
     * Removing leading whitespace from whitespace-only lines.
     * This should only be called once the line has been whitespace-deduped
     */
    private trimWhitespaceOnlyLines;
    /**
     * Find all if statements in this file
     */
    private getAllIfStatements;
    /**
     * Split the tokens by newline (including the newline or EOF as the last token in that array)
     */
    private splitTokensByLine;
    /**
     * if and elseIf statements are chained within the if statement. So we need to walk all the if stataments' elseBranch chains until we find the final one.
     * Then return the endIf token if it exists
     */
    private getEndIfToken;
    /**
     * Given a kind like `}` or `]`, walk backwards until we find its match
     */
    getOpeningToken(tokens: Token[], currentIndex: number, openKind: TokenKind, closeKind: TokenKind): Token | undefined;
    /**
     * Determines if this is an outdent token
     */
    isOutdentToken(token: Token, nextNonWhitespaceToken?: Token): boolean;
}
