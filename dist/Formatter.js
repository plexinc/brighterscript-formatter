"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
const brighterscript_1 = require("brighterscript");
const source_map_1 = require("source-map");
const constants_1 = require("./constants");
const FormattingOptions_1 = require("./FormattingOptions");
const CompositeKeywordFormatter_1 = require("./formatters/CompositeKeywordFormatter");
const IndentFormatter_1 = require("./formatters/IndentFormatter");
const InteriorWhitespaceFormatter_1 = require("./formatters/InteriorWhitespaceFormatter");
const KeywordCaseFormatter_1 = require("./formatters/KeywordCaseFormatter");
const MultiLineItemFormatter_1 = require("./formatters/MultiLineItemFormatter");
const TrailingWhitespaceFormatter_1 = require("./formatters/TrailingWhitespaceFormatter");
const util_1 = require("./util");
const SortImportsFormatter_1 = require("./formatters/SortImportsFormatter");
class Formatter {
    /**
     * Construct a new formatter. The options provided here will be normalized exactly once,
     * and stored on the formatter instance.
     */
    constructor(formattingOptions) {
        this.formatters = {
            indent: new IndentFormatter_1.IndentFormatter(),
            multiLineItem: new MultiLineItemFormatter_1.MultiLineItemFormatter(),
            compositeKeyword: new CompositeKeywordFormatter_1.CompositeKeywordFormatter(),
            keywordCase: new KeywordCaseFormatter_1.KeywordCaseFormatter(),
            trailingWhitespace: new TrailingWhitespaceFormatter_1.TrailingWhitespaceFormatter(),
            interiorWhitespace: new InteriorWhitespaceFormatter_1.InteriorWhitespaceFormatter(),
            sortImports: new SortImportsFormatter_1.SortImportsFormatter()
        };
        /**
         * Convert the character at the specified index to upper case
         * @deprecated
         */
        //TODO this was moved, and has been left here for backwards compatibility reasons. Remove in the next major release.
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.upperCaseLetter = KeywordCaseFormatter_1.KeywordCaseFormatter.prototype['upperCaseLetter'];
        if (formattingOptions) {
            this.formattingOptions = (0, FormattingOptions_1.normalizeOptions)(formattingOptions);
        }
    }
    /**
     * Format the given input.
     * @param inputText the text to format
     * @param formattingOptions options specifying formatting preferences
     */
    format(inputText, formattingOptions) {
        let tokens = this.getFormattedTokens(inputText, formattingOptions);
        //join all tokens back together into a single string
        return tokens.map(x => x.text).join('');
    }
    /**
     * Format the given input and return the formatted text as well as a source map
     * @param inputText the text to format
     * @param sourcePath the path to the file being formatted (used for sourcemap generator)
     * @param formattingOptions options specifying formatting preferences
     * @returns an object with property `code` holding the formatted code, and `map` holding the source map.
     */
    formatWithSourceMap(inputText, sourcePath, formattingOptions) {
        let tokens = this.getFormattedTokens(inputText, formattingOptions);
        let chunks = [];
        for (let token of tokens) {
            if (token.range) {
                chunks.push(new source_map_1.SourceNode(
                //BrighterScript line numbers are 0-based, but source-map expects 1-based
                token.range.start.line + 1, token.range.start.character, sourcePath, token.text));
            }
            else {
                chunks.push(token.text);
            }
        }
        return new source_map_1.SourceNode(null, null, sourcePath, chunks).toStringWithSourceMap();
    }
    /**
     * Format the given input.
     * @param inputText the text to format
     * @param formattingOptions options specifying formatting preferences
     */
    getFormattedTokens(inputText, formattingOptions) {
        /**
         * Choose options in this order:
         *  1. The provided options
         *  2. The options from this instance property
         *  3. The default options
         */
        let options = (0, FormattingOptions_1.normalizeOptions)(Object.assign(Object.assign({}, this.formattingOptions), formattingOptions));
        let { tokens } = brighterscript_1.Lexer.scan(inputText, {
            includeWhitespace: true
        });
        let parser = brighterscript_1.Parser.parse(
        //strip out whitespace because the parser can't handle that
        tokens.filter(x => x.kind !== brighterscript_1.TokenKind.Whitespace), 
        //parse all files in brightERscript mode (all .brs is valid .bs anyway, right?)
        {
            mode: brighterscript_1.ParseMode.BrighterScript
        });
        if (options.formatMultiLineObjectsAndArrays) {
            tokens = this.formatters.multiLineItem.format(tokens);
        }
        if (options.compositeKeywords) {
            tokens = this.formatters.compositeKeyword.format(tokens, options);
        }
        tokens = this.formatters.keywordCase.format(tokens, options);
        if (options.removeTrailingWhiteSpace) {
            tokens = this.formatters.trailingWhitespace.format(tokens, options);
        }
        if (options.formatInteriorWhitespace) {
            tokens = this.formatters.interiorWhitespace.format(tokens, parser, options);
        }
        if (options.sortImports) {
            tokens = this.formatters.sortImports.format(tokens);
        }
        //dedupe side-by-side Whitespace tokens
        util_1.util.dedupeWhitespace(tokens);
        if (options.formatIndent) {
            tokens = this.formatters.indent.format(tokens, options, parser);
        }
        return tokens;
    }
}
exports.Formatter = Formatter;
/**
 * The default number of spaces when indenting with spaces
 */
Formatter.DEFAULT_INDENT_SPACE_COUNT = constants_1.DEFAULT_INDENT_SPACE_COUNT;
//# sourceMappingURL=Formatter.js.map