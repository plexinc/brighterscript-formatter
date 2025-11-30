import type { Token } from 'brighterscript';
import type { FormattingOptions } from '../FormattingOptions';
export declare class TrailingWhitespaceFormatter {
    /**
     * Remove all trailing Whitespace
     */
    format(tokens: Token[], options: FormattingOptions): Token[];
}
