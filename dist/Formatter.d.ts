import type { FormattingOptions } from './FormattingOptions';
export declare class Formatter {
    /**
     * Construct a new formatter. The options provided here will be normalized exactly once,
     * and stored on the formatter instance.
     */
    constructor(formattingOptions?: FormattingOptions);
    /**
     * The formatting options provided in the constructor. Can be undefined if none were provided
     */
    formattingOptions?: FormattingOptions;
    /**
     * The default number of spaces when indenting with spaces
     */
    static DEFAULT_INDENT_SPACE_COUNT: number;
    private formatters;
    /**
     * Format the given input.
     * @param inputText the text to format
     * @param formattingOptions options specifying formatting preferences
     */
    format(inputText: string, formattingOptions?: FormattingOptions): string;
    /**
     * Format the given input and return the formatted text as well as a source map
     * @param inputText the text to format
     * @param sourcePath the path to the file being formatted (used for sourcemap generator)
     * @param formattingOptions options specifying formatting preferences
     * @returns an object with property `code` holding the formatted code, and `map` holding the source map.
     */
    formatWithSourceMap(inputText: string, sourcePath: string, formattingOptions?: FormattingOptions): import("source-map").CodeWithSourceMap;
    /**
     * Format the given input.
     * @param inputText the text to format
     * @param formattingOptions options specifying formatting preferences
     */
    getFormattedTokens(inputText: string, formattingOptions?: FormattingOptions): import("brighterscript").Token[];
    /**
     * Convert the character at the specified index to upper case
     * @deprecated
     */
    upperCaseLetter: (text: string, index: number) => string;
}
