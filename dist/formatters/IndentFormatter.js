"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndentFormatter = void 0;
const brighterscript_1 = require("brighterscript");
const constants_1 = require("../constants");
const util_1 = require("../util");
const StructureIndentTokenKinds = [
    brighterscript_1.TokenKind.LeftSquareBracket,
    brighterscript_1.TokenKind.LeftCurlyBrace,
    brighterscript_1.TokenKind.QuestionLeftSquare
];
class IndentFormatter {
    /**
     * Handle indentation for an array of tokens
     */
    format(tokens, options, parser) {
        var _a;
        // The text used for each tab
        let tabText = options.indentStyle === 'tabs' ? '\t' : ' '.repeat((_a = options.indentSpaceCount) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_INDENT_SPACE_COUNT);
        //the tab count as it flows through the program. Starting point for each line's tabCount calculation.
        let globalTabCount = 0;
        //get a map of all if statements for easier lookups
        const ifStatements = this.getAllIfStatements(parser);
        let parentIndentTokenKinds = [];
        //the list of output tokens
        let result = [];
        //set the loop to run for a max of double the number of tokens we found so we don't end up with an infinite loop
        for (let lineTokens of this.splitTokensByLine(tokens)) {
            const { currentLineOffset, nextLineOffset } = this.processLine(lineTokens, tokens, ifStatements, parentIndentTokenKinds);
            //uncomment the next line to debug indent/outdent issues
            // console.log(currentLineOffset.toString().padStart(3, ' '), nextLineOffset.toString().padStart(3, ' '), lineTokens.map(x => x.text).join('').replace(/\r?\n/, '').replace(/^\s*/, ''));
            //compute the current line's tab count (default to 0 if we somehow went negative)
            let currentLineTabCount = Math.max(globalTabCount + currentLineOffset, 0);
            //update the offset for the next line (default to 0 if we somehow went negative)
            globalTabCount = Math.max(globalTabCount + nextLineOffset, 0);
            this.ensureTokenIndentation(lineTokens, currentLineTabCount, tabText);
            this.trimWhitespaceOnlyLines(lineTokens);
            //push these tokens to the result list
            result.push(...lineTokens);
        }
        return result;
    }
    processLine(lineTokens, tokens, ifStatements, parentIndentTokenKinds) {
        var _a;
        const getParentIndentTokenKind = () => {
            const parentIndentTokenKind = parentIndentTokenKinds.length > 0 ? parentIndentTokenKinds[parentIndentTokenKinds.length - 1].kind : undefined;
            return parentIndentTokenKind;
        };
        let currentLineOffset = 0;
        let nextLineOffset = 0;
        let foundIndentorThisLine = false;
        // Track the number of open indentors created on this line.
        // This is used to determine if we should suppress indentation for structure indentors (like `[` or `{`).
        // We only suppress if there is an *active* indentor on this line (e.g. `if ArrayContains([`).
        // If an indentor was closed (e.g. `m["key"] = {`), we should NOT suppress.
        let activeIndentorsOnThisLine = 0;
        for (let i = 0; i < lineTokens.length; i++) {
            let token = lineTokens[i];
            let previousNonWhitespaceToken = util_1.util.getPreviousNonWhitespaceToken(lineTokens, i);
            let nextNonWhitespaceToken = util_1.util.getNextNonWhitespaceToken(lineTokens, i);
            if ((previousNonWhitespaceToken === null || previousNonWhitespaceToken === void 0 ? void 0 : previousNonWhitespaceToken.kind) === brighterscript_1.TokenKind.Continue &&
                (token.kind === brighterscript_1.TokenKind.For || token.kind === brighterscript_1.TokenKind.While)) {
                continue;
            }
            //if the previous token was `else` and this token is `if`, skip this token. (we used to have a single token for `elseif` but it got split out in an update of brighterscript)
            if ((previousNonWhitespaceToken === null || previousNonWhitespaceToken === void 0 ? void 0 : previousNonWhitespaceToken.kind) === brighterscript_1.TokenKind.Else && token.kind === brighterscript_1.TokenKind.If) {
                foundIndentorThisLine = true;
                // `else if` implies an indentor (the `if` condition), even though the `If` token is skipped.
                // So we treat it as an active indentor for the purpose of suppression.
                activeIndentorsOnThisLine++;
                continue;
            }
            if (
            //if this is an indentor token
            constants_1.IndentSpacerTokenKinds.includes(token.kind) &&
                //is not being used as a key in an AA literal
                nextNonWhitespaceToken && nextNonWhitespaceToken.kind !== brighterscript_1.TokenKind.Colon) {
                //skip indent for 'function'|'sub' used as type (preceded by `as` keyword)
                if (constants_1.CallableKeywordTokenKinds.includes(token.kind) &&
                    //the previous token will be Whitespace, so verify that previousPrevious is 'as'
                    (previousNonWhitespaceToken === null || previousNonWhitespaceToken === void 0 ? void 0 : previousNonWhitespaceToken.kind) === brighterscript_1.TokenKind.As) {
                    continue;
                }
                //skip indent for single-line if statements
                let ifStatement = ifStatements.get(token);
                const endIfToken = this.getEndIfToken(ifStatement);
                if (ifStatement &&
                    (
                    //does not have an end if
                    !endIfToken ||
                        //end if is on same line as if
                        ifStatement.tokens.if.range.end.line === endIfToken.range.end.line)) {
                    //if there's an `else`, skip past it since it'll cause de-indent otherwise
                    if (ifStatement.tokens.else) {
                        i = tokens.indexOf(ifStatement.tokens.else);
                    }
                    continue;
                }
                // check for specifically mentioned tokens to NOT indent
                const parentIndentTokenKind = getParentIndentTokenKind();
                const parentIndentTokenKindsContainsSubOrFunction = parentIndentTokenKinds.some(x => x.kind === brighterscript_1.TokenKind.Sub || x.kind === brighterscript_1.TokenKind.Function);
                const tokenKindIsClass = token.kind === brighterscript_1.TokenKind.Class;
                const tokenKindIsEnum = token.kind === brighterscript_1.TokenKind.Enum;
                const tokenKindIsInterface = token.kind === brighterscript_1.TokenKind.Interface;
                const tokenKindIsNamespace = token.kind === brighterscript_1.TokenKind.Namespace;
                const tokenKindIsTry = token.kind === brighterscript_1.TokenKind.Try;
                // dont indent if parent is sub or function and this is a class, enum, interface, namespace, or try
                const preventIndent = parentIndentTokenKindsContainsSubOrFunction && (tokenKindIsClass || tokenKindIsEnum || tokenKindIsInterface || tokenKindIsNamespace || tokenKindIsTry);
                if (preventIndent) {
                    if (tokenKindIsTry && (lineTokens.length === 2 || lineTokens.length === 3)) {
                        nextLineOffset++;
                    }
                    continue;
                }
                if (parentIndentTokenKind && ((_a = constants_1.IgnoreIndentSpacerByParentTokenKind.get(parentIndentTokenKind)) === null || _a === void 0 ? void 0 : _a.includes(token.kind))) {
                    // This particular token should not be indented because it is listed in the ignore group for its parent
                    continue;
                }
                // Don't indent if this is a structure indentor (like `[` or `{`) and we've already found an indentor on this line.
                // This prevents double indentation for things like `if ArrayContains([` or `[[`
                let causedIndent = true;
                if (activeIndentorsOnThisLine > 0 && StructureIndentTokenKinds.includes(token.kind)) {
                    causedIndent = false;
                }
                if (causedIndent) {
                    nextLineOffset++;
                    activeIndentorsOnThisLine++;
                }
                foundIndentorThisLine = true;
                parentIndentTokenKinds.push({ kind: token.kind, causedIndent: causedIndent });
                //don't double indent if this is `[[...\n...]]` or `[{...\n...}]`
                if (
                //is open square
                token.kind === brighterscript_1.TokenKind.LeftSquareBracket &&
                    //next is an open curly or square
                    (nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.LeftCurlyBrace || nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.LeftSquareBracket) &&
                    //both tokens are on the same line
                    token.range.start.line === nextNonWhitespaceToken.range.start.line) {
                    //find the closer
                    let closer = util_1.util.getClosingToken(tokens, tokens.indexOf(token), brighterscript_1.TokenKind.LeftSquareBracket, brighterscript_1.TokenKind.RightSquareBracket);
                    let expectedClosingPreviousKind = nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.LeftSquareBracket ? brighterscript_1.TokenKind.RightSquareBracket : brighterscript_1.TokenKind.RightCurlyBrace;
                    let closingPrevious = closer && util_1.util.getPreviousNonWhitespaceToken(tokens, tokens.indexOf(closer), true);
                    /* istanbul ignore else (because I can't figure out how to make this happen but I think it's still necessary) */
                    if (closingPrevious && closingPrevious.kind === expectedClosingPreviousKind) {
                        //skip the next token
                        i++;
                    }
                }
            }
            else if (this.isOutdentToken(token, nextNonWhitespaceToken)) {
                //do not un-indent if this is a `next` or `endclass` token preceded by a period
                if ([brighterscript_1.TokenKind.Next, brighterscript_1.TokenKind.EndClass, brighterscript_1.TokenKind.Namespace, brighterscript_1.TokenKind.EndNamespace, brighterscript_1.TokenKind.Catch, brighterscript_1.TokenKind.EndTry].includes(token.kind) &&
                    previousNonWhitespaceToken && previousNonWhitespaceToken.kind === brighterscript_1.TokenKind.Dot) {
                    continue;
                }
                const popped = parentIndentTokenKinds.pop();
                if (popped === null || popped === void 0 ? void 0 : popped.causedIndent) {
                    nextLineOffset--;
                    activeIndentorsOnThisLine--;
                    if (activeIndentorsOnThisLine < 0) {
                        activeIndentorsOnThisLine = 0;
                    }
                }
                if (foundIndentorThisLine === false) {
                    let shouldDecrement = true;
                    //if this didn't cause an indent, and there is another outdenter on this line,
                    //then we shouldn't outdent the current line because the next outdenter will handle it
                    if (!(popped === null || popped === void 0 ? void 0 : popped.causedIndent)) {
                        for (let j = i + 1; j < lineTokens.length; j++) {
                            let nextTok = lineTokens[j];
                            if (nextTok.kind === brighterscript_1.TokenKind.Whitespace) {
                                continue;
                            }
                            let nextNextTok = util_1.util.getNextNonWhitespaceToken(lineTokens, j);
                            if (this.isOutdentToken(nextTok, nextNextTok)) {
                                shouldDecrement = false;
                                break;
                            }
                        }
                    }
                    if (shouldDecrement) {
                        currentLineOffset--;
                    }
                }
                //don't double un-indent if this is `[[...\n...]]` or `[{...\n...}]`
                if (
                //is closing curly or square
                (token.kind === brighterscript_1.TokenKind.RightCurlyBrace || token.kind === brighterscript_1.TokenKind.RightSquareBracket) &&
                    //next is closing square
                    nextNonWhitespaceToken && nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.RightSquareBracket &&
                    //both tokens are on the same line
                    token.range.start.line === nextNonWhitespaceToken.range.start.line) {
                    let opener = this.getOpeningToken(tokens, tokens.indexOf(nextNonWhitespaceToken), brighterscript_1.TokenKind.LeftSquareBracket, brighterscript_1.TokenKind.RightSquareBracket);
                    let openerNext = opener && util_1.util.getNextNonWhitespaceToken(tokens, tokens.indexOf(opener), true);
                    if (openerNext && (openerNext.kind === brighterscript_1.TokenKind.LeftCurlyBrace || openerNext.kind === brighterscript_1.TokenKind.LeftSquareBracket)) {
                        //skip the next token
                        i += 1;
                        continue;
                    }
                }
                //this is an interum token
            }
            else if (constants_1.InterumSpacingTokenKinds.includes(token.kind)) {
                //these need outdented, but don't change the tabCount
                currentLineOffset--;
            }
            //  else if (token.kind === TokenKind.return && foundIndentorThisLine) {
            //     //a return statement on the same line as an indentor means we don't want to indent
            //     tabCount--;
            // }
        }
        return {
            currentLineOffset: currentLineOffset,
            nextLineOffset: nextLineOffset
        };
    }
    /**
     * Ensure the list of tokens contains the correct number of tabs
     * @param tokens the array of tokens to be modified in-place
     * @param tabCount the number of tabs to indent the tokens by
     * @param tabText the string to use for each tab. For tabs, this is "\t", for spaces it would be something like "    " or "  "
     */
    ensureTokenIndentation(tokens, tabCount, tabText = '    ') {
        //do nothing if we have an empty tokens list
        if (!tokens || tokens.length === 0) {
            return tokens;
        }
        //merge all duplicate whitespace tokens into a single token
        util_1.util.dedupeWhitespace(tokens, true);
        //ensure there's a leading whitespace token if we're going to be adding whitespace
        if (tokens[0].kind !== brighterscript_1.TokenKind.Whitespace && tabCount > 0) {
            tokens.unshift({
                startIndex: -1,
                kind: brighterscript_1.TokenKind.Whitespace,
                text: ''
            });
        }
        if (tokens[0].kind === brighterscript_1.TokenKind.Whitespace) {
            tabCount = tabCount >= 0 ? tabCount : 0;
            //replace a whitespace's token text with the current indentation whitespace
            tokens[0].text = tabText.repeat(tabCount);
        }
        return tokens;
    }
    /**
     * Removing leading whitespace from whitespace-only lines.
     * This should only be called once the line has been whitespace-deduped
     */
    trimWhitespaceOnlyLines(tokens) {
        //if the first token is whitespace, and the next is EOL or EOF
        if (tokens[0].kind === brighterscript_1.TokenKind.Whitespace &&
            tokens.length === 2 &&
            (tokens[1].kind === brighterscript_1.TokenKind.Newline || tokens[1].kind === brighterscript_1.TokenKind.Eof)) {
            tokens.splice(0, 1);
        }
        return tokens;
    }
    /**
     * Find all if statements in this file
     */
    getAllIfStatements(parser) {
        const ifStatements = new Map();
        parser.ast.walk((0, brighterscript_1.createVisitor)({
            IfStatement: (statement) => {
                ifStatements.set(statement.tokens.if, statement);
            }
        }), {
            walkMode: brighterscript_1.WalkMode.visitAllRecursive
        });
        return ifStatements;
    }
    /**
     * Split the tokens by newline (including the newline or EOF as the last token in that array)
     */
    splitTokensByLine(tokens) {
        const result = [];
        let line = [];
        for (let token of tokens) {
            line.push(token);
            if (token.kind === brighterscript_1.TokenKind.Newline ||
                token.kind === brighterscript_1.TokenKind.Eof) {
                result.push(line);
                line = [];
            }
        }
        return result;
    }
    /**
     * if and elseIf statements are chained within the if statement. So we need to walk all the if stataments' elseBranch chains until we find the final one.
     * Then return the endIf token if it exists
     */
    getEndIfToken(ifStatement) {
        if ((0, brighterscript_1.isIfStatement)(ifStatement)) {
            while (true) {
                if ((0, brighterscript_1.isIfStatement)(ifStatement.elseBranch)) {
                    ifStatement = ifStatement.elseBranch;
                }
                else {
                    break;
                }
            }
            return ifStatement.tokens.endIf;
        }
    }
    /**
     * Given a kind like `}` or `]`, walk backwards until we find its match
     */
    getOpeningToken(tokens, currentIndex, openKind, closeKind) {
        let openCount = 0;
        for (let i = currentIndex; i >= 0; i--) {
            let token = tokens[i];
            if (token.kind === openKind) {
                openCount++;
            }
            else if (token.kind === closeKind) {
                openCount--;
            }
            if (openCount === 0) {
                return token;
            }
        }
    }
    /**
     * Determines if this is an outdent token
     */
    isOutdentToken(token, nextNonWhitespaceToken) {
        //this is a temporary fix for broken indentation for brighterscript ternary operations.
        const isSymbol = [brighterscript_1.TokenKind.RightCurlyBrace, brighterscript_1.TokenKind.RightSquareBracket].includes(token.kind);
        if (
        //this is an outdentor token
        constants_1.OutdentSpacerTokenKinds.includes(token.kind) &&
            nextNonWhitespaceToken &&
            (
            //is not a letter
            isSymbol ||
                //is not a symbol and is not being used as a key in an AA literal
                (!isSymbol &&
                    (nextNonWhitespaceToken.kind !== brighterscript_1.TokenKind.Colon ||
                        //allow these tokens to be followed by a colon (because they are valid statement separators)
                        [
                            brighterscript_1.TokenKind.EndIf,
                            brighterscript_1.TokenKind.EndFor,
                            brighterscript_1.TokenKind.EndWhile,
                            brighterscript_1.TokenKind.EndSub,
                            brighterscript_1.TokenKind.EndFunction,
                            brighterscript_1.TokenKind.EndTry,
                            brighterscript_1.TokenKind.EndClass,
                            brighterscript_1.TokenKind.EndNamespace,
                            brighterscript_1.TokenKind.Next,
                            brighterscript_1.TokenKind.EndInterface,
                            brighterscript_1.TokenKind.EndEnum
                        ].includes(token.kind)))) &&
            //is not a method call
            !(
            //certain symbols may appear next to an open paren, so exclude those
            ![brighterscript_1.TokenKind.RightSquareBracket].includes(token.kind) &&
                //open paren means method call
                nextNonWhitespaceToken.kind === brighterscript_1.TokenKind.LeftParen)) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.IndentFormatter = IndentFormatter;
//# sourceMappingURL=IndentFormatter.js.map