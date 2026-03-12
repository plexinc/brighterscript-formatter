import type { Token } from 'brighterscript';
export declare class SortImportsFormatter {
    format(tokens: Token[]): Token[];
    private isImportStatement;
    private sortImportStatements;
}
