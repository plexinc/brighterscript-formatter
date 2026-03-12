import type { Token } from 'brighterscript';
import type { FormattingOptions } from '../FormattingOptions';
export declare class CompositeKeywordFormatter {
    /**
     * Handle indentation for an array of tokens
     */
    format(tokens: Token[], options: FormattingOptions): Token[];
    private getCompositeKeywordParts;
}
