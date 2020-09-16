(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/compiler-cli/src/ngtsc/transform'), require('typescript'), require('assert'), require('@angular/compiler'), require('@angular/compiler-cli'), require('@angular/compiler-cli/src/ngtsc/core'), require('@angular/compiler-cli/src/ngtsc/annotations'), require('@angular/compiler-cli/src/ngtsc/file_system'), require('@angular/compiler-cli/src/ngtsc/reflection'), require('@angular/compiler-cli/src/ngtsc/partial_evaluator'), require('@angular/compiler-cli/src/ngtsc/incremental'), require('@angular/compiler-cli/src/ngtsc/imports'), require('@angular/compiler-cli/src/ngtsc/metadata'), require('@angular/compiler-cli/src/ngtsc/scope'), require('@angular/compiler-cli/src/ngtsc/util/src/typescript'), require('@angular/compiler-cli/src/ngtsc/routing'), require('@angular/compiler-cli/src/ngtsc/cycles'), require('@angular/compiler-cli/src/ngtsc/resource'), require('@angular/compiler-cli/src/ngtsc/entry_point'), require('@angular/compiler-cli/src/ngtsc/perf'), require('@angular/compiler-cli/src/ngtsc/modulewithproviders'), require('@angular/compiler-cli/src/ngtsc/diagnostics')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/compiler-cli/src/ngtsc/transform', 'typescript', 'assert', '@angular/compiler', '@angular/compiler-cli', '@angular/compiler-cli/src/ngtsc/core', '@angular/compiler-cli/src/ngtsc/annotations', '@angular/compiler-cli/src/ngtsc/file_system', '@angular/compiler-cli/src/ngtsc/reflection', '@angular/compiler-cli/src/ngtsc/partial_evaluator', '@angular/compiler-cli/src/ngtsc/incremental', '@angular/compiler-cli/src/ngtsc/imports', '@angular/compiler-cli/src/ngtsc/metadata', '@angular/compiler-cli/src/ngtsc/scope', '@angular/compiler-cli/src/ngtsc/util/src/typescript', '@angular/compiler-cli/src/ngtsc/routing', '@angular/compiler-cli/src/ngtsc/cycles', '@angular/compiler-cli/src/ngtsc/resource', '@angular/compiler-cli/src/ngtsc/entry_point', '@angular/compiler-cli/src/ngtsc/perf', '@angular/compiler-cli/src/ngtsc/modulewithproviders', '@angular/compiler-cli/src/ngtsc/diagnostics'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ngast = {}, global.transform, global.typescript, global.assert, global.compiler, global.compilerCli, global.core, global.annotations, global.file_system, global.reflection, global.partial_evaluator, global.incremental, global.imports, global.metadata, global.scope, global.typescript$1, global.routing, global.cycles, global.resource, global.entry_point, global.perf, global.modulewithproviders, global.diagnostics));
}(this, (function (exports, transform, typescript, assert, compiler, compilerCli, core, annotations, file_system, reflection, partial_evaluator, incremental, imports, metadata, scope, typescript$1, routing, cycles, resource, entry_point, perf, modulewithproviders, diagnostics) { 'use strict';

    var handlerName = {
        'NgModule': 'NgModuleDecoratorHandler',
        'Pipe': 'PipeDecoratorHandler',
        'Injectable': 'InjectableDecoratorHandler',
        'Directive': 'DirectiveDecoratorHandler',
        'Component': 'ComponentDecoratorHandler'
    };
    var filterByHandler = function (annotation) { return function (trait) {
        return trait.handler.name === handlerName[annotation];
    }; };
    var isAnalysed = function (trait) {
        return (trait === null || trait === void 0 ? void 0 : trait.state) === transform.TraitState.ANALYZED || (trait === null || trait === void 0 ? void 0 : trait.state) === transform.TraitState.RESOLVED;
    };
    var Symbol$1 = /** @class */ (function () {
        function Symbol(workspace, node) {
            this.workspace = workspace;
            this.node = node;
        }
        Object.defineProperty(Symbol.prototype, "name", {
            get: function () {
                return this.node.name.getText();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Symbol.prototype, "path", {
            get: function () {
                if (!this._path) {
                    this._path = this.node.getSourceFile().fileName;
                }
                return this._path;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Symbol.prototype, "diagnostics", {
            get: function () {
                var _a;
                return ((_a = this.trait) === null || _a === void 0 ? void 0 : _a.state) === transform.TraitState.ERRORED ? this.trait.diagnostics : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Symbol.prototype, "isAnalysed", {
            get: function () {
                return isAnalysed(this.trait);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Symbol.prototype, "record", {
            get: function () {
                return this.workspace.traitCompiler.recordFor(this.node);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Symbol.prototype, "analysis", {
            get: function () {
                var _a;
                this.ensureAnalysis();
                if (((_a = this.trait) === null || _a === void 0 ? void 0 : _a.state) === transform.TraitState.ERRORED) {
                    var message = "An error occurred during analysis of \"" + this.name + "\". ";
                    var solution = "Check diagnostics in [" + this.annotation + "Symbol].diagnostics. ";
                    throw new Error(message + solution);
                }
                // As we analyzed the node above it should be ok...
                if (isAnalysed(this.trait)) {
                    return this.trait.analysis;
                }
                else {
                    throw new Error("Analysis for node " + this.name + " couldn't be completed");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Symbol.prototype, "trait", {
            get: function () {
                var _a;
                if (!this._trait) {
                    this._trait = (_a = this.record) === null || _a === void 0 ? void 0 : _a.traits.find(filterByHandler(this.annotation));
                }
                return this._trait;
            },
            enumerable: false,
            configurable: true
        });
        Symbol.prototype.analyse = function () {
            var _a, _b;
            (_a = this.workspace.traitCompiler) === null || _a === void 0 ? void 0 : _a.analyzeNode(this.node);
            (_b = this.workspace.traitCompiler) === null || _b === void 0 ? void 0 : _b.resolveNode(this.node);
            // @question should we record NgModule Scope dependencies here ???
        };
        Symbol.prototype.ensureAnalysis = function () {
            if (!this.record) {
                this.analyse();
            }
        };
        Symbol.prototype.isSymbol = function (name) {
            return this.annotation === name;
        };
        return Symbol;
    }());

    var annotationNames = ['NgModule', 'Pipe', 'Injectable', 'Directive', 'Component'];
    var annotationTheta = {
        'ɵmod': 'NgModule',
        'ɵdir': 'Directive',
        'ɵinj': 'Injectable',
        'ɵpipe': 'Pipe',
        'ɵcmp': 'Component',
    };
    function getDecoratorName(decorator) {
        var expression = decorator.expression;
        return typescript.isCallExpression(expression) && expression.expression.getText();
    }
    /** Verify if class is decorated with an annotation */
    function hasLocalAnnotation(node, name) {
        var _a;
        return (_a = node.decorators) === null || _a === void 0 ? void 0 : _a.some(function (decorator) { return getDecoratorName(decorator) === name; });
    }
    /** Vrify if the dts class has the static annotation */
    function hasDtsAnnotation(members, name) {
        return members === null || members === void 0 ? void 0 : members.some(function (m) { return m.isStatic && m.name in annotationTheta; });
    }
    /** Get the name of the annotation of the local class if any */
    function getLocalAnnotation(decorators) {
        return decorators === null || decorators === void 0 ? void 0 : decorators.map(getDecoratorName).find(function (name) { return annotationNames.includes(name); });
    }
    /** Ge the name of the annotation of a dts class if any */
    function getDtsAnnotation(members) {
        var member = members === null || members === void 0 ? void 0 : members.find(function (m) { return m.isStatic && m.name in annotationTheta; });
        return member ? annotationTheta[member.name] : undefined;
    }
    function assertDeps(deps, name) {
        if (!deps || deps === 'invalid') {
            throw new assert.AssertionError({ message: "Invalid depenancies in \"" + name + "\"." });
        }
    }
    var exists = function (value) { return !!(value !== null && value !== void 0 ? value : false); };

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var $EOF = 0;
    var $TAB = 9;
    var $LF = 10;
    var $VTAB = 11;
    var $FF = 12;
    var $CR = 13;
    var $SPACE = 32;
    var $BANG = 33;
    var $DQ = 34;
    var $HASH = 35;
    var $$ = 36;
    var $PERCENT = 37;
    var $AMPERSAND = 38;
    var $SQ = 39;
    var $LPAREN = 40;
    var $RPAREN = 41;
    var $STAR = 42;
    var $PLUS = 43;
    var $COMMA = 44;
    var $MINUS = 45;
    var $PERIOD = 46;
    var $SLASH = 47;
    var $COLON = 58;
    var $SEMICOLON = 59;
    var $EQ = 61;
    var $GT = 62;
    var $QUESTION = 63;
    var $0 = 48;
    var $9 = 57;
    var $A = 65;
    var $Z = 90;
    var $LBRACKET = 91;
    var $BACKSLASH = 92;
    var $RBRACKET = 93;
    var $CARET = 94;
    var $_ = 95;
    var $a = 97;
    var $z = 122;
    var $LBRACE = 123;
    var $RBRACE = 125;
    var $NBSP = 160;
    var $PIPE = 124;
    var $TILDA = 126;
    var $AT = 64;
    function isWhitespace(code) {
        return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
    }
    function isDigit(code) {
        return $0 <= code && code <= $9;
    }
    function isAsciiLetter(code) {
        return code >= $a && code <= $z || code >= $A && code <= $Z;
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ParseLocation = /** @class */ (function () {
        function ParseLocation(file, offset, line, col) {
            this.file = file;
            this.offset = offset;
            this.line = line;
            this.col = col;
        }
        ParseLocation.prototype.toString = function () {
            return this.offset != null ? this.file.url + "@" + this.line + ":" + this.col : this.file.url;
        };
        ParseLocation.prototype.moveBy = function (delta) {
            var source = this.file.content;
            var len = source.length;
            var offset = this.offset;
            var line = this.line;
            var col = this.col;
            while (offset > 0 && delta < 0) {
                offset--;
                delta++;
                var ch = source.charCodeAt(offset);
                if (ch == $LF) {
                    line--;
                    var priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode($LF));
                    col = priorLine > 0 ? offset - priorLine : offset;
                }
                else {
                    col--;
                }
            }
            while (offset < len && delta > 0) {
                var ch = source.charCodeAt(offset);
                offset++;
                delta--;
                if (ch == $LF) {
                    line++;
                    col = 0;
                }
                else {
                    col++;
                }
            }
            return new ParseLocation(this.file, offset, line, col);
        };
        // Return the source around the location
        // Up to `maxChars` or `maxLines` on each side of the location
        ParseLocation.prototype.getContext = function (maxChars, maxLines) {
            var content = this.file.content;
            var startOffset = this.offset;
            if (startOffset != null) {
                if (startOffset > content.length - 1) {
                    startOffset = content.length - 1;
                }
                var endOffset = startOffset;
                var ctxChars = 0;
                var ctxLines = 0;
                while (ctxChars < maxChars && startOffset > 0) {
                    startOffset--;
                    ctxChars++;
                    if (content[startOffset] == '\n') {
                        if (++ctxLines == maxLines) {
                            break;
                        }
                    }
                }
                ctxChars = 0;
                ctxLines = 0;
                while (ctxChars < maxChars && endOffset < content.length - 1) {
                    endOffset++;
                    ctxChars++;
                    if (content[endOffset] == '\n') {
                        if (++ctxLines == maxLines) {
                            break;
                        }
                    }
                }
                return {
                    before: content.substring(startOffset, this.offset),
                    after: content.substring(this.offset, endOffset + 1),
                };
            }
            return null;
        };
        return ParseLocation;
    }());
    var ParseSourceFile = /** @class */ (function () {
        function ParseSourceFile(content, url) {
            this.content = content;
            this.url = url;
        }
        return ParseSourceFile;
    }());
    var ParseSourceSpan = /** @class */ (function () {
        function ParseSourceSpan(start, end, details) {
            if (details === void 0) { details = null; }
            this.start = start;
            this.end = end;
            this.details = details;
        }
        ParseSourceSpan.prototype.toString = function () {
            return this.start.file.content.substring(this.start.offset, this.end.offset);
        };
        return ParseSourceSpan;
    }());
    var ParseErrorLevel;
    (function (ParseErrorLevel) {
        ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
        ParseErrorLevel[ParseErrorLevel["ERROR"] = 1] = "ERROR";
    })(ParseErrorLevel || (ParseErrorLevel = {}));
    var ParseError = /** @class */ (function () {
        function ParseError(span, msg, level) {
            if (level === void 0) { level = ParseErrorLevel.ERROR; }
            this.span = span;
            this.msg = msg;
            this.level = level;
        }
        ParseError.prototype.toString = function () {
            var ctx = this.span.start.getContext(100, 3);
            var contextStr = ctx ? " (\"" + ctx.before + "[" + ParseErrorLevel[this.level] + " ->]" + ctx.after + "\")" : '';
            var details = this.span.details ? ", " + this.span.details : '';
            return "" + this.msg + contextStr + ": " + this.span.start + details;
        };
        return ParseError;
    }());

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var CssTokenType;
    (function (CssTokenType) {
        CssTokenType[CssTokenType["EOF"] = 0] = "EOF";
        CssTokenType[CssTokenType["String"] = 1] = "String";
        CssTokenType[CssTokenType["Comment"] = 2] = "Comment";
        CssTokenType[CssTokenType["Identifier"] = 3] = "Identifier";
        CssTokenType[CssTokenType["Number"] = 4] = "Number";
        CssTokenType[CssTokenType["IdentifierOrNumber"] = 5] = "IdentifierOrNumber";
        CssTokenType[CssTokenType["AtKeyword"] = 6] = "AtKeyword";
        CssTokenType[CssTokenType["Character"] = 7] = "Character";
        CssTokenType[CssTokenType["Whitespace"] = 8] = "Whitespace";
        CssTokenType[CssTokenType["Invalid"] = 9] = "Invalid";
    })(CssTokenType || (CssTokenType = {}));
    var CssLexerMode;
    (function (CssLexerMode) {
        CssLexerMode[CssLexerMode["ALL"] = 0] = "ALL";
        CssLexerMode[CssLexerMode["ALL_TRACK_WS"] = 1] = "ALL_TRACK_WS";
        CssLexerMode[CssLexerMode["SELECTOR"] = 2] = "SELECTOR";
        CssLexerMode[CssLexerMode["PSEUDO_SELECTOR"] = 3] = "PSEUDO_SELECTOR";
        CssLexerMode[CssLexerMode["PSEUDO_SELECTOR_WITH_ARGUMENTS"] = 4] = "PSEUDO_SELECTOR_WITH_ARGUMENTS";
        CssLexerMode[CssLexerMode["ATTRIBUTE_SELECTOR"] = 5] = "ATTRIBUTE_SELECTOR";
        CssLexerMode[CssLexerMode["AT_RULE_QUERY"] = 6] = "AT_RULE_QUERY";
        CssLexerMode[CssLexerMode["MEDIA_QUERY"] = 7] = "MEDIA_QUERY";
        CssLexerMode[CssLexerMode["BLOCK"] = 8] = "BLOCK";
        CssLexerMode[CssLexerMode["KEYFRAME_BLOCK"] = 9] = "KEYFRAME_BLOCK";
        CssLexerMode[CssLexerMode["STYLE_BLOCK"] = 10] = "STYLE_BLOCK";
        CssLexerMode[CssLexerMode["STYLE_VALUE"] = 11] = "STYLE_VALUE";
        CssLexerMode[CssLexerMode["STYLE_VALUE_FUNCTION"] = 12] = "STYLE_VALUE_FUNCTION";
        CssLexerMode[CssLexerMode["STYLE_CALC_FUNCTION"] = 13] = "STYLE_CALC_FUNCTION";
    })(CssLexerMode || (CssLexerMode = {}));
    var LexedCssResult = /** @class */ (function () {
        function LexedCssResult(error, token) {
            this.error = error;
            this.token = token;
        }
        return LexedCssResult;
    }());
    function generateErrorMessage(input, message, errorValue, index, row, column) {
        return message + " at column " + row + ":" + column + " in expression [" +
            findProblemCode(input, errorValue, index, column) + ']';
    }
    function findProblemCode(input, errorValue, index, column) {
        var endOfProblemLine = index;
        var current = charCode(input, index);
        while (current > 0 && !isNewline(current)) {
            current = charCode(input, ++endOfProblemLine);
        }
        var choppedString = input.substring(0, endOfProblemLine);
        var pointerPadding = '';
        for (var i = 0; i < column; i++) {
            pointerPadding += ' ';
        }
        var pointerString = '';
        for (var i = 0; i < errorValue.length; i++) {
            pointerString += '^';
        }
        return choppedString + '\n' + pointerPadding + pointerString + '\n';
    }
    var CssToken = /** @class */ (function () {
        function CssToken(index, column, line, type, strValue) {
            this.index = index;
            this.column = column;
            this.line = line;
            this.type = type;
            this.strValue = strValue;
            this.numValue = charCode(strValue, 0);
        }
        return CssToken;
    }());
    var CssLexer = /** @class */ (function () {
        function CssLexer() {
        }
        CssLexer.prototype.scan = function (text, trackComments) {
            if (trackComments === void 0) { trackComments = false; }
            return new CssScanner(text, trackComments);
        };
        return CssLexer;
    }());
    function cssScannerError(token, message) {
        var error = Error('CssParseError: ' + message);
        error[ERROR_RAW_MESSAGE] = message;
        error[ERROR_TOKEN] = token;
        return error;
    }
    var ERROR_TOKEN = 'ngToken';
    var ERROR_RAW_MESSAGE = 'ngRawMessage';
    function getRawMessage(error) {
        return error[ERROR_RAW_MESSAGE];
    }
    function _trackWhitespace(mode) {
        switch (mode) {
            case CssLexerMode.SELECTOR:
            case CssLexerMode.PSEUDO_SELECTOR:
            case CssLexerMode.ALL_TRACK_WS:
            case CssLexerMode.STYLE_VALUE:
                return true;
            default:
                return false;
        }
    }
    var CssScanner = /** @class */ (function () {
        function CssScanner(input, _trackComments) {
            if (_trackComments === void 0) { _trackComments = false; }
            this.input = input;
            this._trackComments = _trackComments;
            this.length = 0;
            this.index = -1;
            this.column = -1;
            this.line = 0;
            /** @internal */
            this._currentMode = CssLexerMode.BLOCK;
            /** @internal */
            this._currentError = null;
            this.length = this.input.length;
            this.peekPeek = this.peekAt(0);
            this.advance();
        }
        CssScanner.prototype.getMode = function () { return this._currentMode; };
        CssScanner.prototype.setMode = function (mode) {
            if (this._currentMode != mode) {
                if (_trackWhitespace(this._currentMode) && !_trackWhitespace(mode)) {
                    this.consumeWhitespace();
                }
                this._currentMode = mode;
            }
        };
        CssScanner.prototype.advance = function () {
            if (isNewline(this.peek)) {
                this.column = 0;
                this.line++;
            }
            else {
                this.column++;
            }
            this.index++;
            this.peek = this.peekPeek;
            this.peekPeek = this.peekAt(this.index + 1);
        };
        CssScanner.prototype.peekAt = function (index) {
            return index >= this.length ? $EOF : this.input.charCodeAt(index);
        };
        CssScanner.prototype.consumeEmptyStatements = function () {
            this.consumeWhitespace();
            while (this.peek == $SEMICOLON) {
                this.advance();
                this.consumeWhitespace();
            }
        };
        CssScanner.prototype.consumeWhitespace = function () {
            while (isWhitespace(this.peek) || isNewline(this.peek)) {
                this.advance();
                if (!this._trackComments && isCommentStart(this.peek, this.peekPeek)) {
                    this.advance(); // /
                    this.advance(); // *
                    while (!isCommentEnd(this.peek, this.peekPeek)) {
                        if (this.peek == $EOF) {
                            this.error('Unterminated comment');
                        }
                        this.advance();
                    }
                    this.advance(); // *
                    this.advance(); // /
                }
            }
        };
        CssScanner.prototype.consume = function (type, value) {
            if (value === void 0) { value = null; }
            var mode = this._currentMode;
            this.setMode(_trackWhitespace(mode) ? CssLexerMode.ALL_TRACK_WS : CssLexerMode.ALL);
            var previousIndex = this.index;
            var previousLine = this.line;
            var previousColumn = this.column;
            var next = undefined;
            var output = this.scan();
            if (output != null) {
                // just incase the inner scan method returned an error
                if (output.error != null) {
                    this.setMode(mode);
                    return output;
                }
                next = output.token;
            }
            if (next == null) {
                next = new CssToken(this.index, this.column, this.line, CssTokenType.EOF, 'end of file');
            }
            var isMatchingType = false;
            if (type == CssTokenType.IdentifierOrNumber) {
                // TODO (matsko): implement array traversal for lookup here
                isMatchingType = next.type == CssTokenType.Number || next.type == CssTokenType.Identifier;
            }
            else {
                isMatchingType = next.type == type;
            }
            // before throwing the error we need to bring back the former
            // mode so that the parser can recover...
            this.setMode(mode);
            var error = null;
            if (!isMatchingType || (value != null && value != next.strValue)) {
                var errorMessage = CssTokenType[next.type] + ' does not match expected ' + CssTokenType[type] + ' value';
                if (value != null) {
                    errorMessage += ' ("' + next.strValue + '" should match "' + value + '")';
                }
                error = cssScannerError(next, generateErrorMessage(this.input, errorMessage, next.strValue, previousIndex, previousLine, previousColumn));
            }
            return new LexedCssResult(error, next);
        };
        CssScanner.prototype.scan = function () {
            var trackWS = _trackWhitespace(this._currentMode);
            if (this.index == 0 && !trackWS) { // first scan
                this.consumeWhitespace();
            }
            var token = this._scan();
            if (token == null)
                return null;
            var error = this._currentError;
            this._currentError = null;
            if (!trackWS) {
                this.consumeWhitespace();
            }
            return new LexedCssResult(error, token);
        };
        /** @internal */
        CssScanner.prototype._scan = function () {
            var peek = this.peek;
            var peekPeek = this.peekPeek;
            if (peek == $EOF)
                return null;
            if (isCommentStart(peek, peekPeek)) {
                // even if comments are not tracked we still lex the
                // comment so we can move the pointer forward
                var commentToken = this.scanComment();
                if (this._trackComments) {
                    return commentToken;
                }
            }
            if (_trackWhitespace(this._currentMode) && (isWhitespace(peek) || isNewline(peek))) {
                return this.scanWhitespace();
            }
            peek = this.peek;
            peekPeek = this.peekPeek;
            if (peek == $EOF)
                return null;
            if (isStringStart(peek, peekPeek)) {
                return this.scanString();
            }
            // something like url(cool)
            if (this._currentMode == CssLexerMode.STYLE_VALUE_FUNCTION) {
                return this.scanCssValueFunction();
            }
            var isModifier = peek == $PLUS || peek == $MINUS;
            var digitA = isModifier ? false : isDigit(peek);
            var digitB = isDigit(peekPeek);
            if (digitA || (isModifier && (peekPeek == $PERIOD || digitB)) ||
                (peek == $PERIOD && digitB)) {
                return this.scanNumber();
            }
            if (peek == $AT) {
                return this.scanAtExpression();
            }
            if (isIdentifierStart(peek, peekPeek)) {
                return this.scanIdentifier();
            }
            if (isValidCssCharacter(peek, this._currentMode)) {
                return this.scanCharacter();
            }
            return this.error("Unexpected character [" + String.fromCharCode(peek) + "]");
        };
        CssScanner.prototype.scanComment = function () {
            if (this.assertCondition(isCommentStart(this.peek, this.peekPeek), 'Expected comment start value')) {
                return null;
            }
            var start = this.index;
            var startingColumn = this.column;
            var startingLine = this.line;
            this.advance(); // /
            this.advance(); // *
            while (!isCommentEnd(this.peek, this.peekPeek)) {
                if (this.peek == $EOF) {
                    this.error('Unterminated comment');
                }
                this.advance();
            }
            this.advance(); // *
            this.advance(); // /
            var str = this.input.substring(start, this.index);
            return new CssToken(start, startingColumn, startingLine, CssTokenType.Comment, str);
        };
        CssScanner.prototype.scanWhitespace = function () {
            var start = this.index;
            var startingColumn = this.column;
            var startingLine = this.line;
            while (isWhitespace(this.peek) && this.peek != $EOF) {
                this.advance();
            }
            var str = this.input.substring(start, this.index);
            return new CssToken(start, startingColumn, startingLine, CssTokenType.Whitespace, str);
        };
        CssScanner.prototype.scanString = function () {
            if (this.assertCondition(isStringStart(this.peek, this.peekPeek), 'Unexpected non-string starting value')) {
                return null;
            }
            var target = this.peek;
            var start = this.index;
            var startingColumn = this.column;
            var startingLine = this.line;
            var previous = target;
            this.advance();
            while (!isCharMatch(target, previous, this.peek)) {
                if (this.peek == $EOF || isNewline(this.peek)) {
                    this.error('Unterminated quote');
                }
                previous = this.peek;
                this.advance();
            }
            if (this.assertCondition(this.peek == target, 'Unterminated quote')) {
                return null;
            }
            this.advance();
            var str = this.input.substring(start, this.index);
            return new CssToken(start, startingColumn, startingLine, CssTokenType.String, str);
        };
        CssScanner.prototype.scanNumber = function () {
            var start = this.index;
            var startingColumn = this.column;
            if (this.peek == $PLUS || this.peek == $MINUS) {
                this.advance();
            }
            var periodUsed = false;
            while (isDigit(this.peek) || this.peek == $PERIOD) {
                if (this.peek == $PERIOD) {
                    if (periodUsed) {
                        this.error('Unexpected use of a second period value');
                    }
                    periodUsed = true;
                }
                this.advance();
            }
            var strValue = this.input.substring(start, this.index);
            return new CssToken(start, startingColumn, this.line, CssTokenType.Number, strValue);
        };
        CssScanner.prototype.scanIdentifier = function () {
            if (this.assertCondition(isIdentifierStart(this.peek, this.peekPeek), 'Expected identifier starting value')) {
                return null;
            }
            var start = this.index;
            var startingColumn = this.column;
            while (isIdentifierPart(this.peek)) {
                this.advance();
            }
            var strValue = this.input.substring(start, this.index);
            return new CssToken(start, startingColumn, this.line, CssTokenType.Identifier, strValue);
        };
        CssScanner.prototype.scanCssValueFunction = function () {
            var start = this.index;
            var startingColumn = this.column;
            var parenBalance = 1;
            while (this.peek != $EOF && parenBalance > 0) {
                this.advance();
                if (this.peek == $LPAREN) {
                    parenBalance++;
                }
                else if (this.peek == $RPAREN) {
                    parenBalance--;
                }
            }
            var strValue = this.input.substring(start, this.index);
            return new CssToken(start, startingColumn, this.line, CssTokenType.Identifier, strValue);
        };
        CssScanner.prototype.scanCharacter = function () {
            var start = this.index;
            var startingColumn = this.column;
            if (this.assertCondition(isValidCssCharacter(this.peek, this._currentMode), charStr(this.peek) + ' is not a valid CSS character')) {
                return null;
            }
            var c = this.input.substring(start, start + 1);
            this.advance();
            return new CssToken(start, startingColumn, this.line, CssTokenType.Character, c);
        };
        CssScanner.prototype.scanAtExpression = function () {
            if (this.assertCondition(this.peek == $AT, 'Expected @ value')) {
                return null;
            }
            var start = this.index;
            var startingColumn = this.column;
            this.advance();
            if (isIdentifierStart(this.peek, this.peekPeek)) {
                var ident = this.scanIdentifier();
                var strValue = '@' + ident.strValue;
                return new CssToken(start, startingColumn, this.line, CssTokenType.AtKeyword, strValue);
            }
            else {
                return this.scanCharacter();
            }
        };
        CssScanner.prototype.assertCondition = function (status, errorMessage) {
            if (!status) {
                this.error(errorMessage);
                return true;
            }
            return false;
        };
        CssScanner.prototype.error = function (message, errorTokenValue, doNotAdvance) {
            if (errorTokenValue === void 0) { errorTokenValue = null; }
            if (doNotAdvance === void 0) { doNotAdvance = false; }
            var index = this.index;
            var column = this.column;
            var line = this.line;
            errorTokenValue = errorTokenValue || String.fromCharCode(this.peek);
            var invalidToken = new CssToken(index, column, line, CssTokenType.Invalid, errorTokenValue);
            var errorMessage = generateErrorMessage(this.input, message, errorTokenValue, index, line, column);
            if (!doNotAdvance) {
                this.advance();
            }
            this._currentError = cssScannerError(invalidToken, errorMessage);
            return invalidToken;
        };
        return CssScanner;
    }());
    function isCharMatch(target, previous, code) {
        return code == target && previous != $BACKSLASH;
    }
    function isCommentStart(code, next) {
        return code == $SLASH && next == $STAR;
    }
    function isCommentEnd(code, next) {
        return code == $STAR && next == $SLASH;
    }
    function isStringStart(code, next) {
        var target = code;
        if (target == $BACKSLASH) {
            target = next;
        }
        return target == $DQ || target == $SQ;
    }
    function isIdentifierStart(code, next) {
        var target = code;
        if (target == $MINUS) {
            target = next;
        }
        return isAsciiLetter(target) || target == $BACKSLASH || target == $MINUS ||
            target == $_;
    }
    function isIdentifierPart(target) {
        return isAsciiLetter(target) || target == $BACKSLASH || target == $MINUS ||
            target == $_ || isDigit(target);
    }
    function isValidPseudoSelectorCharacter(code) {
        switch (code) {
            case $LPAREN:
            case $RPAREN:
                return true;
            default:
                return false;
        }
    }
    function isValidKeyframeBlockCharacter(code) {
        return code == $PERCENT;
    }
    function isValidAttributeSelectorCharacter(code) {
        // value^*|$~=something
        switch (code) {
            case $$:
            case $PIPE:
            case $CARET:
            case $TILDA:
            case $STAR:
            case $EQ:
                return true;
            default:
                return false;
        }
    }
    function isValidSelectorCharacter(code) {
        // selector [ key   = value ]
        // IDENT    C IDENT C IDENT C
        // #id, .class, *+~>
        // tag:PSEUDO
        switch (code) {
            case $HASH:
            case $PERIOD:
            case $TILDA:
            case $STAR:
            case $PLUS:
            case $GT:
            case $COLON:
            case $PIPE:
            case $COMMA:
            case $LBRACKET:
            case $RBRACKET:
                return true;
            default:
                return false;
        }
    }
    function isValidStyleBlockCharacter(code) {
        // key:value;
        // key:calc(something ... )
        switch (code) {
            case $HASH:
            case $SEMICOLON:
            case $COLON:
            case $PERCENT:
            case $SLASH:
            case $BACKSLASH:
            case $BANG:
            case $PERIOD:
            case $LPAREN:
            case $RPAREN:
                return true;
            default:
                return false;
        }
    }
    function isValidMediaQueryRuleCharacter(code) {
        // (min-width: 7.5em) and (orientation: landscape)
        switch (code) {
            case $LPAREN:
            case $RPAREN:
            case $COLON:
            case $PERCENT:
            case $PERIOD:
                return true;
            default:
                return false;
        }
    }
    function isValidAtRuleCharacter(code) {
        // @document url(http://www.w3.org/page?something=on#hash),
        switch (code) {
            case $LPAREN:
            case $RPAREN:
            case $COLON:
            case $PERCENT:
            case $PERIOD:
            case $SLASH:
            case $BACKSLASH:
            case $HASH:
            case $EQ:
            case $QUESTION:
            case $AMPERSAND:
            case $STAR:
            case $COMMA:
            case $MINUS:
            case $PLUS:
                return true;
            default:
                return false;
        }
    }
    function isValidStyleFunctionCharacter(code) {
        switch (code) {
            case $PERIOD:
            case $MINUS:
            case $PLUS:
            case $STAR:
            case $SLASH:
            case $LPAREN:
            case $RPAREN:
            case $COMMA:
                return true;
            default:
                return false;
        }
    }
    function isValidBlockCharacter(code) {
        // @something { }
        // IDENT
        return code == $AT;
    }
    function isValidCssCharacter(code, mode) {
        switch (mode) {
            case CssLexerMode.ALL:
            case CssLexerMode.ALL_TRACK_WS:
                return true;
            case CssLexerMode.SELECTOR:
                return isValidSelectorCharacter(code);
            case CssLexerMode.PSEUDO_SELECTOR_WITH_ARGUMENTS:
                return isValidPseudoSelectorCharacter(code);
            case CssLexerMode.ATTRIBUTE_SELECTOR:
                return isValidAttributeSelectorCharacter(code);
            case CssLexerMode.MEDIA_QUERY:
                return isValidMediaQueryRuleCharacter(code);
            case CssLexerMode.AT_RULE_QUERY:
                return isValidAtRuleCharacter(code);
            case CssLexerMode.KEYFRAME_BLOCK:
                return isValidKeyframeBlockCharacter(code);
            case CssLexerMode.STYLE_BLOCK:
            case CssLexerMode.STYLE_VALUE:
                return isValidStyleBlockCharacter(code);
            case CssLexerMode.STYLE_CALC_FUNCTION:
                return isValidStyleFunctionCharacter(code);
            case CssLexerMode.BLOCK:
                return isValidBlockCharacter(code);
            default:
                return false;
        }
    }
    function charCode(input, index) {
        return index >= input.length ? $EOF : input.charCodeAt(index);
    }
    function charStr(code) {
        return String.fromCharCode(code);
    }
    function isNewline(code) {
        switch (code) {
            case $FF:
            case $CR:
            case $LF:
            case $VTAB:
                return true;
            default:
                return false;
        }
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var BlockType;
    (function (BlockType) {
        BlockType[BlockType["Import"] = 0] = "Import";
        BlockType[BlockType["Charset"] = 1] = "Charset";
        BlockType[BlockType["Namespace"] = 2] = "Namespace";
        BlockType[BlockType["Supports"] = 3] = "Supports";
        BlockType[BlockType["Keyframes"] = 4] = "Keyframes";
        BlockType[BlockType["MediaQuery"] = 5] = "MediaQuery";
        BlockType[BlockType["Selector"] = 6] = "Selector";
        BlockType[BlockType["FontFace"] = 7] = "FontFace";
        BlockType[BlockType["Page"] = 8] = "Page";
        BlockType[BlockType["Document"] = 9] = "Document";
        BlockType[BlockType["Viewport"] = 10] = "Viewport";
        BlockType[BlockType["Unsupported"] = 11] = "Unsupported";
    })(BlockType || (BlockType = {}));
    var CssAst = /** @class */ (function () {
        function CssAst(location) {
            this.location = location;
        }
        Object.defineProperty(CssAst.prototype, "start", {
            get: function () { return this.location.start; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CssAst.prototype, "end", {
            get: function () { return this.location.end; },
            enumerable: false,
            configurable: true
        });
        return CssAst;
    }());
    var CssStyleValueAst = /** @class */ (function (_super) {
        __extends(CssStyleValueAst, _super);
        function CssStyleValueAst(location, tokens, strValue) {
            var _this = _super.call(this, location) || this;
            _this.tokens = tokens;
            _this.strValue = strValue;
            return _this;
        }
        CssStyleValueAst.prototype.visit = function (visitor, context) { return visitor.visitCssValue(this); };
        return CssStyleValueAst;
    }(CssAst));
    var CssRuleAst = /** @class */ (function (_super) {
        __extends(CssRuleAst, _super);
        function CssRuleAst(location) {
            return _super.call(this, location) || this;
        }
        return CssRuleAst;
    }(CssAst));
    var CssBlockRuleAst = /** @class */ (function (_super) {
        __extends(CssBlockRuleAst, _super);
        function CssBlockRuleAst(location, type, block, name) {
            if (name === void 0) { name = null; }
            var _this = _super.call(this, location) || this;
            _this.location = location;
            _this.type = type;
            _this.block = block;
            _this.name = name;
            return _this;
        }
        CssBlockRuleAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssBlock(this.block, context);
        };
        return CssBlockRuleAst;
    }(CssRuleAst));
    var CssKeyframeRuleAst = /** @class */ (function (_super) {
        __extends(CssKeyframeRuleAst, _super);
        function CssKeyframeRuleAst(location, name, block) {
            return _super.call(this, location, BlockType.Keyframes, block, name) || this;
        }
        CssKeyframeRuleAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssKeyframeRule(this, context);
        };
        return CssKeyframeRuleAst;
    }(CssBlockRuleAst));
    var CssKeyframeDefinitionAst = /** @class */ (function (_super) {
        __extends(CssKeyframeDefinitionAst, _super);
        function CssKeyframeDefinitionAst(location, steps, block) {
            var _this = _super.call(this, location, BlockType.Keyframes, block, mergeTokens(steps, ',')) || this;
            _this.steps = steps;
            return _this;
        }
        CssKeyframeDefinitionAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssKeyframeDefinition(this, context);
        };
        return CssKeyframeDefinitionAst;
    }(CssBlockRuleAst));
    var CssBlockDefinitionRuleAst = /** @class */ (function (_super) {
        __extends(CssBlockDefinitionRuleAst, _super);
        function CssBlockDefinitionRuleAst(location, strValue, type, query, block) {
            var _this = _super.call(this, location, type, block) || this;
            _this.strValue = strValue;
            _this.query = query;
            var firstCssToken = query.tokens[0];
            _this.name = new CssToken(firstCssToken.index, firstCssToken.column, firstCssToken.line, CssTokenType.Identifier, _this.strValue);
            return _this;
        }
        CssBlockDefinitionRuleAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssBlock(this.block, context);
        };
        return CssBlockDefinitionRuleAst;
    }(CssBlockRuleAst));
    var CssMediaQueryRuleAst = /** @class */ (function (_super) {
        __extends(CssMediaQueryRuleAst, _super);
        function CssMediaQueryRuleAst(location, strValue, query, block) {
            return _super.call(this, location, strValue, BlockType.MediaQuery, query, block) || this;
        }
        CssMediaQueryRuleAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssMediaQueryRule(this, context);
        };
        return CssMediaQueryRuleAst;
    }(CssBlockDefinitionRuleAst));
    var CssAtRulePredicateAst = /** @class */ (function (_super) {
        __extends(CssAtRulePredicateAst, _super);
        function CssAtRulePredicateAst(location, strValue, tokens) {
            var _this = _super.call(this, location) || this;
            _this.strValue = strValue;
            _this.tokens = tokens;
            return _this;
        }
        CssAtRulePredicateAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssAtRulePredicate(this, context);
        };
        return CssAtRulePredicateAst;
    }(CssAst));
    var CssInlineRuleAst = /** @class */ (function (_super) {
        __extends(CssInlineRuleAst, _super);
        function CssInlineRuleAst(location, type, value) {
            var _this = _super.call(this, location) || this;
            _this.type = type;
            _this.value = value;
            return _this;
        }
        CssInlineRuleAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssInlineRule(this, context);
        };
        return CssInlineRuleAst;
    }(CssRuleAst));
    var CssSelectorRuleAst = /** @class */ (function (_super) {
        __extends(CssSelectorRuleAst, _super);
        function CssSelectorRuleAst(location, selectors, block) {
            var _this = _super.call(this, location, BlockType.Selector, block) || this;
            _this.selectors = selectors;
            _this.strValue = selectors.map(function (selector) { return selector.strValue; }).join(',');
            return _this;
        }
        CssSelectorRuleAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssSelectorRule(this, context);
        };
        return CssSelectorRuleAst;
    }(CssBlockRuleAst));
    var CssDefinitionAst = /** @class */ (function (_super) {
        __extends(CssDefinitionAst, _super);
        function CssDefinitionAst(location, property, value) {
            var _this = _super.call(this, location) || this;
            _this.property = property;
            _this.value = value;
            return _this;
        }
        CssDefinitionAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssDefinition(this, context);
        };
        return CssDefinitionAst;
    }(CssAst));
    var CssSelectorPartAst = /** @class */ (function (_super) {
        __extends(CssSelectorPartAst, _super);
        function CssSelectorPartAst(location) {
            return _super.call(this, location) || this;
        }
        return CssSelectorPartAst;
    }(CssAst));
    var CssSelectorAst = /** @class */ (function (_super) {
        __extends(CssSelectorAst, _super);
        function CssSelectorAst(location, selectorParts) {
            var _this = _super.call(this, location) || this;
            _this.selectorParts = selectorParts;
            _this.strValue = selectorParts.map(function (part) { return part.strValue; }).join('');
            return _this;
        }
        CssSelectorAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssSelector(this, context);
        };
        return CssSelectorAst;
    }(CssSelectorPartAst));
    var CssSimpleSelectorAst = /** @class */ (function (_super) {
        __extends(CssSimpleSelectorAst, _super);
        function CssSimpleSelectorAst(location, tokens, strValue, pseudoSelectors, operator) {
            var _this = _super.call(this, location) || this;
            _this.tokens = tokens;
            _this.strValue = strValue;
            _this.pseudoSelectors = pseudoSelectors;
            _this.operator = operator;
            return _this;
        }
        CssSimpleSelectorAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssSimpleSelector(this, context);
        };
        return CssSimpleSelectorAst;
    }(CssSelectorPartAst));
    var CssPseudoSelectorAst = /** @class */ (function (_super) {
        __extends(CssPseudoSelectorAst, _super);
        function CssPseudoSelectorAst(location, strValue, name, tokens, innerSelectors) {
            var _this = _super.call(this, location) || this;
            _this.strValue = strValue;
            _this.name = name;
            _this.tokens = tokens;
            _this.innerSelectors = innerSelectors;
            return _this;
        }
        CssPseudoSelectorAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssPseudoSelector(this, context);
        };
        return CssPseudoSelectorAst;
    }(CssSelectorPartAst));
    var CssBlockAst = /** @class */ (function (_super) {
        __extends(CssBlockAst, _super);
        function CssBlockAst(location, entries) {
            var _this = _super.call(this, location) || this;
            _this.entries = entries;
            return _this;
        }
        CssBlockAst.prototype.visit = function (visitor, context) { return visitor.visitCssBlock(this, context); };
        return CssBlockAst;
    }(CssAst));
    /*
     a style block is different from a standard block because it contains
     css prop:value definitions. A regular block can contain a list of Ast entries.
     */
    var CssStylesBlockAst = /** @class */ (function (_super) {
        __extends(CssStylesBlockAst, _super);
        function CssStylesBlockAst(location, definitions) {
            var _this = _super.call(this, location, definitions) || this;
            _this.definitions = definitions;
            return _this;
        }
        CssStylesBlockAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssStylesBlock(this, context);
        };
        return CssStylesBlockAst;
    }(CssBlockAst));
    var CssStyleSheetAst = /** @class */ (function (_super) {
        __extends(CssStyleSheetAst, _super);
        function CssStyleSheetAst(location, rules) {
            var _this = _super.call(this, location) || this;
            _this.rules = rules;
            return _this;
        }
        CssStyleSheetAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssStyleSheet(this, context);
        };
        return CssStyleSheetAst;
    }(CssAst));
    var CssUnknownRuleAst = /** @class */ (function (_super) {
        __extends(CssUnknownRuleAst, _super);
        function CssUnknownRuleAst(location, ruleName, tokens) {
            var _this = _super.call(this, location) || this;
            _this.ruleName = ruleName;
            _this.tokens = tokens;
            return _this;
        }
        CssUnknownRuleAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssUnknownRule(this, context);
        };
        return CssUnknownRuleAst;
    }(CssRuleAst));
    var CssUnknownTokenListAst = /** @class */ (function (_super) {
        __extends(CssUnknownTokenListAst, _super);
        function CssUnknownTokenListAst(location, name, tokens) {
            var _this = _super.call(this, location) || this;
            _this.name = name;
            _this.tokens = tokens;
            return _this;
        }
        CssUnknownTokenListAst.prototype.visit = function (visitor, context) {
            return visitor.visitCssUnknownTokenList(this, context);
        };
        return CssUnknownTokenListAst;
    }(CssRuleAst));
    function mergeTokens(tokens, separator) {
        if (separator === void 0) { separator = ''; }
        var mainToken = tokens[0];
        var str = mainToken.strValue;
        for (var i = 1; i < tokens.length; i++) {
            str += separator + tokens[i].strValue;
        }
        return new CssToken(mainToken.index, mainToken.column, mainToken.line, mainToken.type, str);
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var SPACE_OPERATOR = ' ';
    var SLASH_CHARACTER = '/';
    var GT_CHARACTER = '>';
    var TRIPLE_GT_OPERATOR_STR = '>>>';
    var DEEP_OPERATOR_STR = '/deep/';
    var EOF_DELIM_FLAG = 1;
    var RBRACE_DELIM_FLAG = 2;
    var LBRACE_DELIM_FLAG = 4;
    var COMMA_DELIM_FLAG = 8;
    var COLON_DELIM_FLAG = 16;
    var SEMICOLON_DELIM_FLAG = 32;
    var NEWLINE_DELIM_FLAG = 64;
    var RPAREN_DELIM_FLAG = 128;
    var LPAREN_DELIM_FLAG = 256;
    var SPACE_DELIM_FLAG = 512;
    function _pseudoSelectorSupportsInnerSelectors(name) {
        return ['not', 'host', 'host-context'].indexOf(name) >= 0;
    }
    function isSelectorOperatorCharacter(code) {
        switch (code) {
            case $SLASH:
            case $TILDA:
            case $PLUS:
            case $GT:
                return true;
            default:
                return isWhitespace(code);
        }
    }
    function getDelimFromCharacter(code) {
        switch (code) {
            case $EOF:
                return EOF_DELIM_FLAG;
            case $COMMA:
                return COMMA_DELIM_FLAG;
            case $COLON:
                return COLON_DELIM_FLAG;
            case $SEMICOLON:
                return SEMICOLON_DELIM_FLAG;
            case $RBRACE:
                return RBRACE_DELIM_FLAG;
            case $LBRACE:
                return LBRACE_DELIM_FLAG;
            case $RPAREN:
                return RPAREN_DELIM_FLAG;
            case $SPACE:
            case $TAB:
                return SPACE_DELIM_FLAG;
            default:
                return isNewline(code) ? NEWLINE_DELIM_FLAG : 0;
        }
    }
    function characterContainsDelimiter(code, delimiters) {
        return (getDelimFromCharacter(code) & delimiters) > 0;
    }
    var ParsedCssResult = /** @class */ (function () {
        function ParsedCssResult(errors, ast) {
            this.errors = errors;
            this.ast = ast;
        }
        return ParsedCssResult;
    }());
    var CssParser = /** @class */ (function () {
        function CssParser() {
            this._errors = [];
        }
        /**
         * @param css the CSS code that will be parsed
         * @param url the name of the CSS file containing the CSS source code
         */
        CssParser.prototype.parse = function (css, url) {
            var lexer = new CssLexer();
            this._file = new ParseSourceFile(css, url);
            this._scanner = lexer.scan(css, false);
            var ast = this._parseStyleSheet(EOF_DELIM_FLAG);
            var errors = this._errors;
            this._errors = [];
            var result = new ParsedCssResult(errors, ast);
            this._file = null;
            this._scanner = null;
            return result;
        };
        /** @internal */
        CssParser.prototype._parseStyleSheet = function (delimiters) {
            var results = [];
            this._scanner.consumeEmptyStatements();
            while (this._scanner.peek != $EOF) {
                this._scanner.setMode(CssLexerMode.BLOCK);
                results.push(this._parseRule(delimiters));
            }
            var span = null;
            if (results.length > 0) {
                var firstRule = results[0];
                // we collect the last token like so incase there was an
                // EOF token that was emitted sometime during the lexing
                span = this._generateSourceSpan(firstRule, this._lastToken);
            }
            return new CssStyleSheetAst(span, results);
        };
        /** @internal */
        CssParser.prototype._getSourceContent = function () { return this._scanner != null ? this._scanner.input : ''; };
        /** @internal */
        CssParser.prototype._extractSourceContent = function (start, end) {
            return this._getSourceContent().substring(start, end + 1);
        };
        /** @internal */
        CssParser.prototype._generateSourceSpan = function (start, end) {
            if (end === void 0) { end = null; }
            var startLoc;
            if (start instanceof CssAst) {
                startLoc = start.location.start;
            }
            else {
                var token = start;
                if (token == null) {
                    // the data here is invalid, however, if and when this does
                    // occur, any other errors associated with this will be collected
                    token = this._lastToken;
                }
                startLoc = new ParseLocation(this._file, token.index, token.line, token.column);
            }
            if (end == null) {
                end = this._lastToken;
            }
            var endLine = -1;
            var endColumn = -1;
            var endIndex = -1;
            if (end instanceof CssAst) {
                endLine = end.location.end.line;
                endColumn = end.location.end.col;
                endIndex = end.location.end.offset;
            }
            else if (end instanceof CssToken) {
                endLine = end.line;
                endColumn = end.column;
                endIndex = end.index;
            }
            var endLoc = new ParseLocation(this._file, endIndex, endLine, endColumn);
            return new ParseSourceSpan(startLoc, endLoc);
        };
        /** @internal */
        CssParser.prototype._resolveBlockType = function (token) {
            switch (token.strValue) {
                case '@-o-keyframes':
                case '@-moz-keyframes':
                case '@-webkit-keyframes':
                case '@keyframes':
                    return BlockType.Keyframes;
                case '@charset':
                    return BlockType.Charset;
                case '@import':
                    return BlockType.Import;
                case '@namespace':
                    return BlockType.Namespace;
                case '@page':
                    return BlockType.Page;
                case '@document':
                    return BlockType.Document;
                case '@media':
                    return BlockType.MediaQuery;
                case '@font-face':
                    return BlockType.FontFace;
                case '@viewport':
                    return BlockType.Viewport;
                case '@supports':
                    return BlockType.Supports;
                default:
                    return BlockType.Unsupported;
            }
        };
        /** @internal */
        CssParser.prototype._parseRule = function (delimiters) {
            if (this._scanner.peek == $AT) {
                return this._parseAtRule(delimiters);
            }
            return this._parseSelectorRule(delimiters);
        };
        /** @internal */
        CssParser.prototype._parseAtRule = function (delimiters) {
            var start = this._getScannerIndex();
            this._scanner.setMode(CssLexerMode.BLOCK);
            var token = this._scan();
            var startToken = token;
            this._assertCondition(token.type == CssTokenType.AtKeyword, "The CSS Rule " + token.strValue + " is not a valid [@] rule.", token);
            var block;
            var type = this._resolveBlockType(token);
            var span;
            var tokens;
            var endToken;
            var end;
            var strValue;
            var query;
            switch (type) {
                case BlockType.Charset:
                case BlockType.Namespace:
                case BlockType.Import:
                    var value = this._parseValue(delimiters);
                    this._scanner.setMode(CssLexerMode.BLOCK);
                    this._scanner.consumeEmptyStatements();
                    span = this._generateSourceSpan(startToken, value);
                    return new CssInlineRuleAst(span, type, value);
                case BlockType.Viewport:
                case BlockType.FontFace:
                    block = this._parseStyleBlock(delimiters);
                    span = this._generateSourceSpan(startToken, block);
                    return new CssBlockRuleAst(span, type, block);
                case BlockType.Keyframes:
                    tokens = this._collectUntilDelim(delimiters | RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG);
                    // keyframes only have one identifier name
                    var name_1 = tokens[0];
                    block = this._parseKeyframeBlock(delimiters);
                    span = this._generateSourceSpan(startToken, block);
                    return new CssKeyframeRuleAst(span, name_1, block);
                case BlockType.MediaQuery:
                    this._scanner.setMode(CssLexerMode.MEDIA_QUERY);
                    tokens = this._collectUntilDelim(delimiters | RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG);
                    endToken = tokens[tokens.length - 1];
                    // we do not track the whitespace after the mediaQuery predicate ends
                    // so we have to calculate the end string value on our own
                    end = endToken.index + endToken.strValue.length - 1;
                    strValue = this._extractSourceContent(start, end);
                    span = this._generateSourceSpan(startToken, endToken);
                    query = new CssAtRulePredicateAst(span, strValue, tokens);
                    block = this._parseBlock(delimiters);
                    strValue = this._extractSourceContent(start, this._getScannerIndex() - 1);
                    span = this._generateSourceSpan(startToken, block);
                    return new CssMediaQueryRuleAst(span, strValue, query, block);
                case BlockType.Document:
                case BlockType.Supports:
                case BlockType.Page:
                    this._scanner.setMode(CssLexerMode.AT_RULE_QUERY);
                    tokens = this._collectUntilDelim(delimiters | RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG);
                    endToken = tokens[tokens.length - 1];
                    // we do not track the whitespace after this block rule predicate ends
                    // so we have to calculate the end string value on our own
                    end = endToken.index + endToken.strValue.length - 1;
                    strValue = this._extractSourceContent(start, end);
                    span = this._generateSourceSpan(startToken, tokens[tokens.length - 1]);
                    query = new CssAtRulePredicateAst(span, strValue, tokens);
                    block = this._parseBlock(delimiters);
                    strValue = this._extractSourceContent(start, block.end.offset);
                    span = this._generateSourceSpan(startToken, block);
                    return new CssBlockDefinitionRuleAst(span, strValue, type, query, block);
                // if a custom @rule { ... } is used it should still tokenize the insides
                default:
                    var listOfTokens_1 = [];
                    var tokenName = token.strValue;
                    this._scanner.setMode(CssLexerMode.ALL);
                    this._error(generateErrorMessage(this._getSourceContent(), "The CSS \"at\" rule \"" + tokenName + "\" is not allowed to used here", token.strValue, token.index, token.line, token.column), token);
                    this._collectUntilDelim(delimiters | LBRACE_DELIM_FLAG | SEMICOLON_DELIM_FLAG)
                        .forEach(function (token) { listOfTokens_1.push(token); });
                    if (this._scanner.peek == $LBRACE) {
                        listOfTokens_1.push(this._consume(CssTokenType.Character, '{'));
                        this._collectUntilDelim(delimiters | RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG)
                            .forEach(function (token) { listOfTokens_1.push(token); });
                        listOfTokens_1.push(this._consume(CssTokenType.Character, '}'));
                    }
                    endToken = listOfTokens_1[listOfTokens_1.length - 1];
                    span = this._generateSourceSpan(startToken, endToken);
                    return new CssUnknownRuleAst(span, tokenName, listOfTokens_1);
            }
        };
        /** @internal */
        CssParser.prototype._parseSelectorRule = function (delimiters) {
            var start = this._getScannerIndex();
            var selectors = this._parseSelectors(delimiters);
            var block = this._parseStyleBlock(delimiters);
            var ruleAst;
            var span;
            var startSelector = selectors[0];
            if (block != null) {
                span = this._generateSourceSpan(startSelector, block);
                ruleAst = new CssSelectorRuleAst(span, selectors, block);
            }
            else {
                var name_2 = this._extractSourceContent(start, this._getScannerIndex() - 1);
                var innerTokens_1 = [];
                selectors.forEach(function (selector) {
                    selector.selectorParts.forEach(function (part) {
                        part.tokens.forEach(function (token) { innerTokens_1.push(token); });
                    });
                });
                var endToken = innerTokens_1[innerTokens_1.length - 1];
                span = this._generateSourceSpan(startSelector, endToken);
                ruleAst = new CssUnknownTokenListAst(span, name_2, innerTokens_1);
            }
            this._scanner.setMode(CssLexerMode.BLOCK);
            this._scanner.consumeEmptyStatements();
            return ruleAst;
        };
        /** @internal */
        CssParser.prototype._parseSelectors = function (delimiters) {
            delimiters |= LBRACE_DELIM_FLAG | SEMICOLON_DELIM_FLAG;
            var selectors = [];
            var isParsingSelectors = true;
            while (isParsingSelectors) {
                selectors.push(this._parseSelector(delimiters));
                isParsingSelectors = !characterContainsDelimiter(this._scanner.peek, delimiters);
                if (isParsingSelectors) {
                    this._consume(CssTokenType.Character, ',');
                    isParsingSelectors = !characterContainsDelimiter(this._scanner.peek, delimiters);
                    if (isParsingSelectors) {
                        this._scanner.consumeWhitespace();
                    }
                }
            }
            return selectors;
        };
        /** @internal */
        CssParser.prototype._scan = function () {
            var output = this._scanner.scan();
            var token = output.token;
            var error = output.error;
            if (error != null) {
                this._error(getRawMessage(error), token);
            }
            this._lastToken = token;
            return token;
        };
        /** @internal */
        CssParser.prototype._getScannerIndex = function () { return this._scanner.index; };
        /** @internal */
        CssParser.prototype._consume = function (type, value) {
            if (value === void 0) { value = null; }
            var output = this._scanner.consume(type, value);
            var token = output.token;
            var error = output.error;
            if (error != null) {
                this._error(getRawMessage(error), token);
            }
            this._lastToken = token;
            return token;
        };
        /** @internal */
        CssParser.prototype._parseKeyframeBlock = function (delimiters) {
            delimiters |= RBRACE_DELIM_FLAG;
            this._scanner.setMode(CssLexerMode.KEYFRAME_BLOCK);
            var startToken = this._consume(CssTokenType.Character, '{');
            var definitions = [];
            while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
                definitions.push(this._parseKeyframeDefinition(delimiters));
            }
            var endToken = this._consume(CssTokenType.Character, '}');
            var span = this._generateSourceSpan(startToken, endToken);
            return new CssBlockAst(span, definitions);
        };
        /** @internal */
        CssParser.prototype._parseKeyframeDefinition = function (delimiters) {
            var start = this._getScannerIndex();
            var stepTokens = [];
            delimiters |= LBRACE_DELIM_FLAG;
            while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
                stepTokens.push(this._parseKeyframeLabel(delimiters | COMMA_DELIM_FLAG));
                if (this._scanner.peek != $LBRACE) {
                    this._consume(CssTokenType.Character, ',');
                }
            }
            var stylesBlock = this._parseStyleBlock(delimiters | RBRACE_DELIM_FLAG);
            var span = this._generateSourceSpan(stepTokens[0], stylesBlock);
            var ast = new CssKeyframeDefinitionAst(span, stepTokens, stylesBlock);
            this._scanner.setMode(CssLexerMode.BLOCK);
            return ast;
        };
        /** @internal */
        CssParser.prototype._parseKeyframeLabel = function (delimiters) {
            this._scanner.setMode(CssLexerMode.KEYFRAME_BLOCK);
            return mergeTokens(this._collectUntilDelim(delimiters));
        };
        /** @internal */
        CssParser.prototype._parsePseudoSelector = function (delimiters) {
            var start = this._getScannerIndex();
            delimiters &= ~COMMA_DELIM_FLAG;
            // we keep the original value since we may use it to recurse when :not, :host are used
            var startingDelims = delimiters;
            var startToken = this._consume(CssTokenType.Character, ':');
            var tokens = [startToken];
            if (this._scanner.peek == $COLON) { // ::something
                tokens.push(this._consume(CssTokenType.Character, ':'));
            }
            var innerSelectors = [];
            this._scanner.setMode(CssLexerMode.PSEUDO_SELECTOR);
            // host, host-context, lang, not, nth-child are all identifiers
            var pseudoSelectorToken = this._consume(CssTokenType.Identifier);
            var pseudoSelectorName = pseudoSelectorToken.strValue;
            tokens.push(pseudoSelectorToken);
            // host(), lang(), nth-child(), etc...
            if (this._scanner.peek == $LPAREN) {
                this._scanner.setMode(CssLexerMode.PSEUDO_SELECTOR_WITH_ARGUMENTS);
                var openParenToken = this._consume(CssTokenType.Character, '(');
                tokens.push(openParenToken);
                // :host(innerSelector(s)), :not(selector), etc...
                if (_pseudoSelectorSupportsInnerSelectors(pseudoSelectorName)) {
                    var innerDelims = startingDelims | LPAREN_DELIM_FLAG | RPAREN_DELIM_FLAG;
                    if (pseudoSelectorName == 'not') {
                        // the inner selector inside of :not(...) can only be one
                        // CSS selector (no commas allowed) ... This is according
                        // to the CSS specification
                        innerDelims |= COMMA_DELIM_FLAG;
                    }
                    // :host(a, b, c) {
                    this._parseSelectors(innerDelims).forEach(function (selector, index) {
                        innerSelectors.push(selector);
                    });
                }
                else {
                    // this branch is for things like "en-us, 2k + 1, etc..."
                    // which all end up in pseudoSelectors like :lang, :nth-child, etc..
                    var innerValueDelims = delimiters | LBRACE_DELIM_FLAG | COLON_DELIM_FLAG |
                        RPAREN_DELIM_FLAG | LPAREN_DELIM_FLAG;
                    while (!characterContainsDelimiter(this._scanner.peek, innerValueDelims)) {
                        var token = this._scan();
                        tokens.push(token);
                    }
                }
                var closeParenToken = this._consume(CssTokenType.Character, ')');
                tokens.push(closeParenToken);
            }
            var end = this._getScannerIndex() - 1;
            var strValue = this._extractSourceContent(start, end);
            var endToken = tokens[tokens.length - 1];
            var span = this._generateSourceSpan(startToken, endToken);
            return new CssPseudoSelectorAst(span, strValue, pseudoSelectorName, tokens, innerSelectors);
        };
        /** @internal */
        CssParser.prototype._parseSimpleSelector = function (delimiters) {
            var start = this._getScannerIndex();
            delimiters |= COMMA_DELIM_FLAG;
            this._scanner.setMode(CssLexerMode.SELECTOR);
            var selectorCssTokens = [];
            var pseudoSelectors = [];
            var previousToken = undefined;
            var selectorPartDelimiters = delimiters | SPACE_DELIM_FLAG;
            var loopOverSelector = !characterContainsDelimiter(this._scanner.peek, selectorPartDelimiters);
            var hasAttributeError = false;
            while (loopOverSelector) {
                var peek = this._scanner.peek;
                switch (peek) {
                    case $COLON:
                        var innerPseudo = this._parsePseudoSelector(delimiters);
                        pseudoSelectors.push(innerPseudo);
                        this._scanner.setMode(CssLexerMode.SELECTOR);
                        break;
                    case $LBRACKET:
                        // we set the mode after the scan because attribute mode does not
                        // allow attribute [] values. And this also will catch any errors
                        // if an extra "[" is used inside.
                        selectorCssTokens.push(this._scan());
                        this._scanner.setMode(CssLexerMode.ATTRIBUTE_SELECTOR);
                        break;
                    case $RBRACKET:
                        if (this._scanner.getMode() != CssLexerMode.ATTRIBUTE_SELECTOR) {
                            hasAttributeError = true;
                        }
                        // we set the mode early because attribute mode does not
                        // allow attribute [] values
                        this._scanner.setMode(CssLexerMode.SELECTOR);
                        selectorCssTokens.push(this._scan());
                        break;
                    default:
                        if (isSelectorOperatorCharacter(peek)) {
                            loopOverSelector = false;
                            continue;
                        }
                        var token = this._scan();
                        previousToken = token;
                        selectorCssTokens.push(token);
                        break;
                }
                loopOverSelector = !characterContainsDelimiter(this._scanner.peek, selectorPartDelimiters);
            }
            hasAttributeError =
                hasAttributeError || this._scanner.getMode() == CssLexerMode.ATTRIBUTE_SELECTOR;
            if (hasAttributeError) {
                this._error("Unbalanced CSS attribute selector at column " + previousToken.line + ":" + previousToken.column, previousToken);
            }
            var end = this._getScannerIndex() - 1;
            // this happens if the selector is not directly followed by
            // a comma or curly brace without a space in between
            var operator = null;
            var operatorScanCount = 0;
            var lastOperatorToken = null;
            if (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
                while (operator == null && !characterContainsDelimiter(this._scanner.peek, delimiters) &&
                    isSelectorOperatorCharacter(this._scanner.peek)) {
                    var token = this._scan();
                    var tokenOperator = token.strValue;
                    operatorScanCount++;
                    lastOperatorToken = token;
                    if (tokenOperator != SPACE_OPERATOR) {
                        switch (tokenOperator) {
                            case SLASH_CHARACTER:
                                // /deep/ operator
                                var deepToken = this._consume(CssTokenType.Identifier);
                                var deepSlash = this._consume(CssTokenType.Character);
                                var index = lastOperatorToken.index;
                                var line = lastOperatorToken.line;
                                var column = lastOperatorToken.column;
                                if (deepToken != null && deepToken.strValue.toLowerCase() == 'deep' &&
                                    deepSlash.strValue == SLASH_CHARACTER) {
                                    token = new CssToken(lastOperatorToken.index, lastOperatorToken.column, lastOperatorToken.line, CssTokenType.Identifier, DEEP_OPERATOR_STR);
                                }
                                else {
                                    var text = SLASH_CHARACTER + deepToken.strValue + deepSlash.strValue;
                                    this._error(generateErrorMessage(this._getSourceContent(), text + " is an invalid CSS operator", text, index, line, column), lastOperatorToken);
                                    token = new CssToken(index, column, line, CssTokenType.Invalid, text);
                                }
                                break;
                            case GT_CHARACTER:
                                // >>> operator
                                if (this._scanner.peek == $GT && this._scanner.peekPeek == $GT) {
                                    this._consume(CssTokenType.Character, GT_CHARACTER);
                                    this._consume(CssTokenType.Character, GT_CHARACTER);
                                    token = new CssToken(lastOperatorToken.index, lastOperatorToken.column, lastOperatorToken.line, CssTokenType.Identifier, TRIPLE_GT_OPERATOR_STR);
                                }
                                break;
                        }
                        operator = token;
                    }
                }
                // so long as there is an operator then we can have an
                // ending value that is beyond the selector value ...
                // otherwise it's just a bunch of trailing whitespace
                if (operator != null) {
                    end = operator.index;
                }
            }
            this._scanner.consumeWhitespace();
            var strValue = this._extractSourceContent(start, end);
            // if we do come across one or more spaces inside of
            // the operators loop then an empty space is still a
            // valid operator to use if something else was not found
            if (operator == null && operatorScanCount > 0 && this._scanner.peek != $LBRACE) {
                operator = lastOperatorToken;
            }
            // please note that `endToken` is reassigned multiple times below
            // so please do not optimize the if statements into if/elseif
            var startTokenOrAst = null;
            var endTokenOrAst = null;
            if (selectorCssTokens.length > 0) {
                startTokenOrAst = startTokenOrAst || selectorCssTokens[0];
                endTokenOrAst = selectorCssTokens[selectorCssTokens.length - 1];
            }
            if (pseudoSelectors.length > 0) {
                startTokenOrAst = startTokenOrAst || pseudoSelectors[0];
                endTokenOrAst = pseudoSelectors[pseudoSelectors.length - 1];
            }
            if (operator != null) {
                startTokenOrAst = startTokenOrAst || operator;
                endTokenOrAst = operator;
            }
            var span = this._generateSourceSpan(startTokenOrAst, endTokenOrAst);
            return new CssSimpleSelectorAst(span, selectorCssTokens, strValue, pseudoSelectors, operator);
        };
        /** @internal */
        CssParser.prototype._parseSelector = function (delimiters) {
            delimiters |= COMMA_DELIM_FLAG;
            this._scanner.setMode(CssLexerMode.SELECTOR);
            var simpleSelectors = [];
            while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
                simpleSelectors.push(this._parseSimpleSelector(delimiters));
                this._scanner.consumeWhitespace();
            }
            var firstSelector = simpleSelectors[0];
            var lastSelector = simpleSelectors[simpleSelectors.length - 1];
            var span = this._generateSourceSpan(firstSelector, lastSelector);
            return new CssSelectorAst(span, simpleSelectors);
        };
        /** @internal */
        CssParser.prototype._parseValue = function (delimiters) {
            delimiters |= RBRACE_DELIM_FLAG | SEMICOLON_DELIM_FLAG | NEWLINE_DELIM_FLAG;
            this._scanner.setMode(CssLexerMode.STYLE_VALUE);
            var start = this._getScannerIndex();
            var tokens = [];
            var wsStr = '';
            var previous = undefined;
            while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
                var token = void 0;
                if (previous != null && previous.type == CssTokenType.Identifier &&
                    this._scanner.peek == $LPAREN) {
                    token = this._consume(CssTokenType.Character, '(');
                    tokens.push(token);
                    this._scanner.setMode(CssLexerMode.STYLE_VALUE_FUNCTION);
                    token = this._scan();
                    tokens.push(token);
                    this._scanner.setMode(CssLexerMode.STYLE_VALUE);
                    token = this._consume(CssTokenType.Character, ')');
                    tokens.push(token);
                }
                else {
                    token = this._scan();
                    if (token.type == CssTokenType.Whitespace) {
                        wsStr += token.strValue;
                    }
                    else {
                        wsStr = '';
                        tokens.push(token);
                    }
                }
                previous = token;
            }
            var end = this._getScannerIndex() - 1;
            this._scanner.consumeWhitespace();
            var code = this._scanner.peek;
            if (code == $SEMICOLON) {
                this._consume(CssTokenType.Character, ';');
            }
            else if (code != $RBRACE) {
                this._error(generateErrorMessage(this._getSourceContent(), "The CSS key/value definition did not end with a semicolon", previous.strValue, previous.index, previous.line, previous.column), previous);
            }
            var strValue = this._extractSourceContent(start, end);
            var startToken = tokens[0];
            var endToken = tokens[tokens.length - 1];
            var span = this._generateSourceSpan(startToken, endToken);
            return new CssStyleValueAst(span, tokens, strValue);
        };
        /** @internal */
        CssParser.prototype._collectUntilDelim = function (delimiters, assertType) {
            if (assertType === void 0) { assertType = null; }
            var tokens = [];
            while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
                var val = assertType != null ? this._consume(assertType) : this._scan();
                tokens.push(val);
            }
            return tokens;
        };
        /** @internal */
        CssParser.prototype._parseBlock = function (delimiters) {
            delimiters |= RBRACE_DELIM_FLAG;
            this._scanner.setMode(CssLexerMode.BLOCK);
            var startToken = this._consume(CssTokenType.Character, '{');
            this._scanner.consumeEmptyStatements();
            var results = [];
            while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
                results.push(this._parseRule(delimiters));
            }
            var endToken = this._consume(CssTokenType.Character, '}');
            this._scanner.setMode(CssLexerMode.BLOCK);
            this._scanner.consumeEmptyStatements();
            var span = this._generateSourceSpan(startToken, endToken);
            return new CssBlockAst(span, results);
        };
        /** @internal */
        CssParser.prototype._parseStyleBlock = function (delimiters) {
            delimiters |= RBRACE_DELIM_FLAG | LBRACE_DELIM_FLAG;
            this._scanner.setMode(CssLexerMode.STYLE_BLOCK);
            var startToken = this._consume(CssTokenType.Character, '{');
            if (startToken.numValue != $LBRACE) {
                return null;
            }
            var definitions = [];
            this._scanner.consumeEmptyStatements();
            while (!characterContainsDelimiter(this._scanner.peek, delimiters)) {
                definitions.push(this._parseDefinition(delimiters));
                this._scanner.consumeEmptyStatements();
            }
            var endToken = this._consume(CssTokenType.Character, '}');
            this._scanner.setMode(CssLexerMode.STYLE_BLOCK);
            this._scanner.consumeEmptyStatements();
            var span = this._generateSourceSpan(startToken, endToken);
            return new CssStylesBlockAst(span, definitions);
        };
        /** @internal */
        CssParser.prototype._parseDefinition = function (delimiters) {
            this._scanner.setMode(CssLexerMode.STYLE_BLOCK);
            var prop = this._consume(CssTokenType.Identifier);
            var parseValue = false;
            var value = null;
            var endToken = prop;
            // the colon value separates the prop from the style.
            // there are a few cases as to what could happen if it
            // is missing
            switch (this._scanner.peek) {
                case $SEMICOLON:
                case $RBRACE:
                case $EOF:
                    parseValue = false;
                    break;
                default:
                    var propStr_1 = [prop.strValue];
                    if (this._scanner.peek != $COLON) {
                        // this will throw the error
                        var nextValue = this._consume(CssTokenType.Character, ':');
                        propStr_1.push(nextValue.strValue);
                        var remainingTokens = this._collectUntilDelim(delimiters | COLON_DELIM_FLAG | SEMICOLON_DELIM_FLAG, CssTokenType.Identifier);
                        if (remainingTokens.length > 0) {
                            remainingTokens.forEach(function (token) { propStr_1.push(token.strValue); });
                        }
                        endToken = prop =
                            new CssToken(prop.index, prop.column, prop.line, prop.type, propStr_1.join(' '));
                    }
                    // this means we've reached the end of the definition and/or block
                    if (this._scanner.peek == $COLON) {
                        this._consume(CssTokenType.Character, ':');
                        parseValue = true;
                    }
                    break;
            }
            if (parseValue) {
                value = this._parseValue(delimiters);
                endToken = value;
            }
            else {
                this._error(generateErrorMessage(this._getSourceContent(), "The CSS property was not paired with a style value", prop.strValue, prop.index, prop.line, prop.column), prop);
            }
            var span = this._generateSourceSpan(prop, endToken);
            return new CssDefinitionAst(span, prop, value);
        };
        /** @internal */
        CssParser.prototype._assertCondition = function (status, errorMessage, problemToken) {
            if (!status) {
                this._error(errorMessage, problemToken);
                return true;
            }
            return false;
        };
        /** @internal */
        CssParser.prototype._error = function (message, problemToken) {
            var length = problemToken.strValue.length;
            var error = CssParseError.create(this._file, 0, problemToken.line, problemToken.column, length, message);
            this._errors.push(error);
        };
        return CssParser;
    }());
    var CssParseError = /** @class */ (function (_super) {
        __extends$1(CssParseError, _super);
        function CssParseError(span, message) {
            return _super.call(this, span, message) || this;
        }
        CssParseError.create = function (file, offset, line, col, length, errMsg) {
            var start = new ParseLocation(file, offset, line, col);
            var end = new ParseLocation(file, offset, line, col + length);
            var span = new ParseSourceSpan(start, end);
            return new CssParseError(span, 'CSS Parse Error: ' + errMsg);
        };
        return CssParseError;
    }(ParseError));

    var parseCss = function (text) {
        var parser = new CssParser();
        return parser.parse(text, '').ast;
    };

    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var ComponentSymbol = /** @class */ (function (_super) {
        __extends$2(ComponentSymbol, _super);
        function ComponentSymbol() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.annotation = 'Component';
            return _this;
        }
        ComponentSymbol.prototype.assertScope = function () {
            var scope = this.getScope();
            if (scope === 'error') {
                throw new Error("Could not find scope for component " + this.name + ". Check [ComponentSymbol].diagnostics");
            }
            else {
                return scope;
            }
        };
        Object.defineProperty(ComponentSymbol.prototype, "deps", {
            get: function () {
                return this.metadata.deps;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ComponentSymbol.prototype, "metadata", {
            get: function () {
                return this.analysis.meta;
            },
            enumerable: false,
            configurable: true
        });
        ComponentSymbol.prototype.getScope = function () {
            this.ensureAnalysis();
            return this.workspace.scopeRegistry.getScopeForComponent(this.node);
        };
        /** Return the list of available selectors for the template */
        ComponentSymbol.prototype.getSelectorScope = function () {
            var scope = this.assertScope();
            if (!scope) {
                return [];
            }
            else {
                return scope.compilation.directives.map(function (d) { return d.selector; })
                    .filter(exists)
                    .map(function (selector) { return selector.split(',').map(function (s) { return s.trim(); }); })
                    .flat();
            }
        };
        /** Return the list of pipe available for the template */
        ComponentSymbol.prototype.getPipeScope = function () {
            var _a;
            var scope = this.assertScope();
            return (_a = scope === null || scope === void 0 ? void 0 : scope.compilation.pipes.map(function (p) { return p.name; })) !== null && _a !== void 0 ? _a : [];
        };
        ComponentSymbol.prototype.getProviders = function () {
            var providers = this.analysis.meta.providers;
            if (providers instanceof compiler.WrappedNodeExpr) {
                return this.workspace.providerRegistry.getAllProviders(providers.node);
            }
            else {
                return [];
            }
        };
        ComponentSymbol.prototype.getDependencies = function () {
            var _this = this;
            assertDeps(this.deps, this.name);
            return this.deps.map(function (dep) { return _this.workspace.findSymbol(dep.token); }).filter(exists);
        };
        ComponentSymbol.prototype.getStylesAst = function () {
            return this.metadata.styles.map(function (s) { return parseCss(s); });
        };
        ComponentSymbol.prototype.getTemplateAst = function () {
            return this.metadata.template.nodes;
        };
        return ComponentSymbol;
    }(Symbol$1));

    var __extends$3 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var DirectiveSymbol = /** @class */ (function (_super) {
        __extends$3(DirectiveSymbol, _super);
        function DirectiveSymbol() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.annotation = 'Directive';
            return _this;
        }
        Object.defineProperty(DirectiveSymbol.prototype, "deps", {
            get: function () {
                return this.metadata.deps;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DirectiveSymbol.prototype, "metadata", {
            get: function () {
                return this.analysis.meta;
            },
            enumerable: false,
            configurable: true
        });
        DirectiveSymbol.prototype.getProviders = function () {
            var providers = this.analysis.meta.providers;
            if (providers instanceof compiler.WrappedNodeExpr) {
                return this.workspace.providerRegistry.getAllProviders(providers.node);
            }
            else {
                return [];
            }
        };
        DirectiveSymbol.prototype.getDependencies = function () {
            var _this = this;
            assertDeps(this.deps, this.name);
            return this.deps.map(function (dep) { return _this.workspace.findSymbol(dep.token); }).filter(exists);
        };
        return DirectiveSymbol;
    }(Symbol$1));

    var __extends$4 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var InjectableSymbol = /** @class */ (function (_super) {
        __extends$4(InjectableSymbol, _super);
        function InjectableSymbol() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.annotation = 'Injectable';
            return _this;
        }
        Object.defineProperty(InjectableSymbol.prototype, "deps", {
            get: function () {
                var _a;
                return this.metadata.userDeps
                    ? (_a = this.metadata) === null || _a === void 0 ? void 0 : _a.userDeps : this.analysis.ctorDeps;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(InjectableSymbol.prototype, "metadata", {
            get: function () {
                return this.analysis.meta;
            },
            enumerable: false,
            configurable: true
        });
        InjectableSymbol.prototype.getDependencies = function () {
            var _this = this;
            assertDeps(this.deps, this.name);
            return this.deps.map(function (dep) { return _this.workspace.findSymbol(dep.token); }).filter(exists);
        };
        return InjectableSymbol;
    }(Symbol$1));

    var __extends$5 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var NgModuleSymbol = /** @class */ (function (_super) {
        __extends$5(NgModuleSymbol, _super);
        function NgModuleSymbol() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.annotation = 'NgModule';
            return _this;
        }
        Object.defineProperty(NgModuleSymbol.prototype, "deps", {
            get: function () {
                return this.analysis.inj.deps;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgModuleSymbol.prototype, "metadata", {
            get: function () {
                return this.analysis.mod;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgModuleSymbol.prototype, "scope", {
            get: function () {
                this.ensureAnalysis();
                return this.workspace.scopeRegistry.getScopeOfModule(this.node);
            },
            enumerable: false,
            configurable: true
        });
        NgModuleSymbol.prototype.getDependencies = function () {
            var _this = this;
            assertDeps(this.deps, this.name);
            return this.deps.map(function (dep) { return _this.workspace.findSymbol(dep.token); }).filter(exists);
        };
        /**
         * Get the providers of the module as InjectableSymbol
         */
        NgModuleSymbol.prototype.getProviders = function () {
            return this.workspace.providerRegistry.getAllProviders(this.analysis.providers);
        };
        NgModuleSymbol.prototype.getDeclarations = function () {
            var _this = this;
            return this.analysis.declarations.map(function (ref) { return _this.workspace.getSymbol(ref.node); });
        };
        NgModuleSymbol.prototype.getImports = function () {
            var _this = this;
            return this.analysis.imports.map(function (ref) { return _this.workspace.getSymbol(ref.node); });
        };
        NgModuleSymbol.prototype.getExports = function () {
            var _this = this;
            return this.analysis.exports.map(function (ref) { return _this.workspace.getSymbol(ref.node); });
        };
        NgModuleSymbol.prototype.getBootstap = function () {
            var _this = this;
            return this.metadata.bootstrap.map(function (ref) { return _this.workspace.findSymbol(ref.value); });
        };
        return NgModuleSymbol;
    }(Symbol$1));

    var __extends$6 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var PipeSymbol = /** @class */ (function (_super) {
        __extends$6(PipeSymbol, _super);
        function PipeSymbol() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.annotation = 'Pipe';
            return _this;
        }
        Object.defineProperty(PipeSymbol.prototype, "deps", {
            get: function () {
                return this.metadata.deps;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PipeSymbol.prototype, "metadata", {
            get: function () {
                return this.analysis.meta;
            },
            enumerable: false,
            configurable: true
        });
        PipeSymbol.prototype.getDependencies = function () {
            var _this = this;
            assertDeps(this.deps, this.name);
            return this.deps.map(function (dep) { return _this.workspace.findSymbol(dep.token); }).filter(exists);
        };
        return PipeSymbol;
    }(Symbol$1));

    var __extends$7 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __values = (undefined && undefined.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    /** TraitCompiler with friendly interface */
    var NgastTraitCompiler = /** @class */ (function (_super) {
        __extends$7(NgastTraitCompiler, _super);
        function NgastTraitCompiler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** Perform analysis for one node */
        NgastTraitCompiler.prototype.analyzeNode = function (node) {
            this.analyzeClass(node, null);
        };
        NgastTraitCompiler.prototype.resolveNode = function (node) {
            var e_1, _a, e_2, _b;
            var record = this.recordFor(node);
            try {
                for (var _c = __values((record === null || record === void 0 ? void 0 : record.traits) || []), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var trait = _d.value;
                    var handler = trait.handler;
                    switch (trait.state) {
                        case transform.TraitState.SKIPPED:
                        case transform.TraitState.ERRORED:
                            continue;
                        case transform.TraitState.PENDING:
                            throw new Error("Resolving a trait that hasn't been analyzed: " + node.name.text + " / " + Object.getPrototypeOf(trait.handler).constructor.name);
                        case transform.TraitState.RESOLVED:
                            throw new Error("Resolving an already resolved trait");
                    }
                    if (handler.resolve === undefined) {
                        // No resolution of this trait needed - it's considered successful by default.
                        trait = trait.toResolved(null);
                        continue;
                    }
                    var result = void 0;
                    try {
                        result = handler.resolve(node, trait.analysis);
                    }
                    catch (err) {
                        if (err instanceof diagnostics.FatalDiagnosticError) {
                            trait = trait.toErrored([err.toDiagnostic()]);
                            continue;
                        }
                        else {
                            throw err;
                        }
                    }
                    if (result.diagnostics !== undefined && result.diagnostics.length > 0) {
                        trait = trait.toErrored(result.diagnostics);
                    }
                    else {
                        if (result.data !== undefined) {
                            trait = trait.toResolved(result.data);
                        }
                        else {
                            trait = trait.toResolved(null);
                        }
                    }
                    // @question reexportMap is a private property of TraitCompiler, I'm not sure how I can access it in another way
                    if (result.reexports !== undefined) {
                        var fileName = node.getSourceFile().fileName;
                        if (!this['reexportMap'].has(fileName)) {
                            this['reexportMap'].set(fileName, new Map());
                        }
                        var fileReexports = this['reexportMap'].get(fileName);
                        try {
                            for (var _e = (e_2 = void 0, __values(result.reexports)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var reexport = _f.value;
                                fileReexports.set(reexport.asAlias, [reexport.fromModule, reexport.symbolName]);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        NgastTraitCompiler.prototype.allRecords = function (annotation) {
            var _this = this;
            var records = [];
            this.fileToClasses.forEach(function (nodes) {
                nodes.forEach(function (node) {
                    var record = _this.recordFor(node);
                    if (record) {
                        if (!annotation) {
                            records.push(record);
                        }
                        else if (typescript$1.isFromDtsFile(node)) {
                            var members = _this['reflector'].getMembersOfClass(node);
                            if (hasDtsAnnotation(members)) {
                                records.push(record);
                            }
                        }
                        else if (hasLocalAnnotation(record.node, annotation)) {
                            records.push(record);
                        }
                    }
                });
            });
            return records;
        };
        return NgastTraitCompiler;
    }(transform.TraitCompiler));

    var symbolFactory = {
        'NgModule': function (workspace, node) { return new NgModuleSymbol(workspace, node); },
        'Injectable': function (workspace, node) { return new InjectableSymbol(workspace, node); },
        'Directive': function (workspace, node) { return new DirectiveSymbol(workspace, node); },
        'Component': function (workspace, node) { return new ComponentSymbol(workspace, node); },
        'Pipe': function (workspace, node) { return new PipeSymbol(workspace, node); },
    };

    var __read = (undefined && undefined.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __values$1 = (undefined && undefined.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    /////////
    // WIP //
    /////////
    var useKeys = ['useValue', 'useFactory', 'useExisting'];
    function getProviderMetadata(provider) {
        var provide = provider.get('provide');
        if (!provide) {
            return null;
        }
        var useKey = useKeys.find(function (key) { return provider.has(key); });
        if (!useKey) {
            return null;
        }
        var value = provider.get(useKey);
        return { provide: provide, useKey: useKey, value: value };
    }
    var Provider = /** @class */ (function () {
        function Provider(workspace, metadata) {
            this.workspace = workspace;
            this.metadata = metadata;
        }
        Object.defineProperty(Provider.prototype, "name", {
            get: function () {
                var _a;
                if (typeof this.metadata.provide === 'string') {
                    return this.metadata.provide;
                }
                if (this.metadata.provide instanceof imports.Reference) {
                    if (typescript.isClassDeclaration(this.metadata.provide.node)) {
                        return (_a = this.metadata.provide.node.name) === null || _a === void 0 ? void 0 : _a.text;
                    }
                }
                if (this.metadata.provide instanceof partial_evaluator.DynamicValue) {
                    if (typescript.isIdentifier(this.metadata.provide.node)) {
                        return this.metadata.provide.node.text;
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        return Provider;
    }());
    // TODO : It doesn't looks like a good idea to map with the real value instead of the token...
    var ProviderRegistry = /** @class */ (function () {
        function ProviderRegistry(workspace) {
            this.workspace = workspace;
            /** List of all the providers that are not injectables */
            this.providers = new Map();
        }
        /** Record all providers in every NgModule, Component & Directive */
        ProviderRegistry.prototype.recordAll = function () {
            var e_1, _a, e_2, _b, e_3, _c;
            var _this = this;
            // Helper fn to get all analysis of an annotation
            var getAllAnalysis = function (annotation) {
                var records = _this.workspace.traitCompiler.allRecords(annotation);
                return records.map(function (record) {
                    var _a = __read(record.traits.filter(filterByHandler(annotation))
                        .filter(isAnalysed)
                        .map(function (trait) { return trait.analysis; }), 1), analysis = _a[0];
                    return analysis;
                });
            };
            try {
                for (var _d = __values$1(getAllAnalysis('NgModule')), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var analysis = _e.value;
                    if (analysis) {
                        this.recordProviders(analysis.providers);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var _f = __values$1(getAllAnalysis('Component')), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var analysis = _g.value;
                    var providers = analysis === null || analysis === void 0 ? void 0 : analysis.meta.providers;
                    if (providers instanceof compiler.WrappedNodeExpr) {
                        this.recordProviders(providers.node);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var _h = __values$1(getAllAnalysis('Directive')), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var analysis = _j.value;
                    var providers = analysis === null || analysis === void 0 ? void 0 : analysis.meta.providers;
                    if (providers instanceof compiler.WrappedNodeExpr) {
                        this.recordProviders(providers.node);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        /** Find all providers of a provider expression */
        ProviderRegistry.prototype.recordProviders = function (expression) {
            var _this = this;
            if (expression) {
                var resolveValue = this.workspace.evaluator.evaluate(expression);
                var visit_1 = function (value) {
                    if (Array.isArray(value)) {
                        value.forEach(visit_1);
                    }
                    else if (value instanceof Map) {
                        var metadata = getProviderMetadata(value);
                        var key = getKeyFromProvide(metadata === null || metadata === void 0 ? void 0 : metadata.provide);
                        if (metadata && key) {
                            var provider = new Provider(_this.workspace, metadata);
                            _this.providers.set(key, provider);
                        }
                    }
                };
                visit_1(resolveValue);
            }
        };
        /** Get all providers from a list of providers in a decorator NgModule, Directive, Component */
        ProviderRegistry.prototype.getAllProviders = function (expression) {
            var _this = this;
            var result = [];
            if (expression) {
                var resolveValue = this.workspace.evaluator.evaluate(expression);
                var addInjectable_1 = function (ref) {
                    var symbol = _this.workspace.getSymbol(ref.node);
                    if (symbol) {
                        result.push(symbol);
                    }
                };
                var addProvider_1 = function (value) {
                    var key = getKeyFromProvide(value);
                    if (key && _this.providers.has(key)) {
                        var provider = _this.providers.get(key);
                        if (provider)
                            result.push(provider);
                    }
                };
                var visit_2 = function (value) {
                    if (Array.isArray(value)) {
                        value.forEach(visit_2);
                    }
                    else if (value instanceof Map) {
                        if (value.has('useClass')) {
                            addInjectable_1(value.get('useClass'));
                        }
                        else {
                            addProvider_1(value.get('provide'));
                        }
                    }
                    else {
                        addInjectable_1(value);
                    }
                };
                visit_2(resolveValue);
            }
            return result;
        };
        /** Return the provider for a token previously stored */
        ProviderRegistry.prototype.getProvider = function (token) {
            var value = this.workspace.evaluator.evaluate(token);
            var key = getKeyFromProvide(value);
            if (key && this.providers.has(key)) {
                return this.providers.get(key);
            }
        };
        return ProviderRegistry;
    }());
    // TODO: check to use declaration instead of Identifier ...
    function getKeyFromProvide(provide) {
        if (provide) {
            if (provide instanceof partial_evaluator.DynamicValue && typescript.isIdentifier(provide.node)) {
                return provide.node;
            }
            else if (typeof provide === 'string') {
                return provide;
            }
        }
    }

    var __values$2 = (undefined && undefined.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var __read$1 = (undefined && undefined.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spread = (undefined && undefined.__spread) || function () {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$1(arguments[i]));
        return ar;
    };
    // code from :
    // https://github.com/angular/angular/blob/9.1.x/packages/compiler-cli/src/ngtsc/core/src/compiler.ts#L821
    var ReferenceGraphAdapter = /** @class */ (function () {
        function ReferenceGraphAdapter(graph) {
            this.graph = graph;
        }
        ReferenceGraphAdapter.prototype.add = function (source) {
            var e_1, _a;
            var references = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                references[_i - 1] = arguments[_i];
            }
            try {
                for (var references_1 = __values$2(references), references_1_1 = references_1.next(); !references_1_1.done; references_1_1 = references_1.next()) {
                    var node = references_1_1.value.node;
                    var sourceFile = node.getSourceFile();
                    if (sourceFile === undefined) {
                        sourceFile = typescript.getOriginalNode(node).getSourceFile();
                    }
                    // Only record local references (not references into .d.ts files).
                    if (sourceFile === undefined || !typescript$1.isDtsPath(sourceFile.fileName)) {
                        this.graph.add(source, node);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (references_1_1 && !references_1_1.done && (_a = references_1.return)) _a.call(references_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return ReferenceGraphAdapter;
    }());
    // All the code here comes from the ngtsc Compiler file, for more detail see :
    // https://github.com/angular/angular/blob/9.1.x/packages/compiler-cli/src/ngtsc/core/src/compiler.ts
    var WorkspaceSymbols = /** @class */ (function () {
        function WorkspaceSymbols(tsconfigPath, fs, perfRecorder) {
            if (fs === void 0) { fs = new file_system.NodeJSFileSystem(); }
            if (perfRecorder === void 0) { perfRecorder = perf.NOOP_PERF_RECORDER; }
            this.tsconfigPath = tsconfigPath;
            this.fs = fs;
            this.perfRecorder = perfRecorder;
            this.toolkit = {};
            this.isCore = false;
            this.analysed = false;
            var config = compilerCli.readConfiguration(this.tsconfigPath);
            this.options = config.options;
            this.rootNames = config.rootNames;
        }
        Object.defineProperty(WorkspaceSymbols.prototype, "traitCompiler", {
            /////////////////////////////
            // ------ PUBLIC API ----- //
            /////////////////////////////
            /** Process all classes in the program */
            get: function () {
                var _this = this;
                return this.lazy('traitCompiler', function () { return new NgastTraitCompiler([_this.componentHandler, _this.directiveHandler, _this.pipeHandler, _this.injectableHandler, _this.moduleHandler], _this.reflector, _this.perfRecorder, _this.incrementalDriver, _this.options.compileNonExportedClasses !== false, _this.dtsTransforms); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "scopeRegistry", {
            /** Collects information about local NgModules, Directives, Components, and Pipes (declare in the ts.Program) */
            get: function () {
                var _this = this;
                return this.lazy('scopeRegistry', function () {
                    var depScopeReader = new scope.MetadataDtsModuleScopeResolver(_this.dtsReader, _this.aliasingHost);
                    return new scope.LocalModuleScopeRegistry(_this.localMetaReader, depScopeReader, _this.refEmitter, _this.aliasingHost);
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "evaluator", {
            /** Evaluate typecript Expression & update the dependancy graph accordingly */
            get: function () {
                var _this = this;
                return this.lazy('evaluator', function () { return new partial_evaluator.PartialEvaluator(_this.reflector, _this.checker, _this.incrementalDriver.depGraph); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "providerRegistry", {
            /** Keep track of the providers other than Injectable */
            get: function () {
                var _this = this;
                return this.lazy('providerRegistry', function () { return new ProviderRegistry(_this); });
            },
            enumerable: false,
            configurable: true
        });
        WorkspaceSymbols.prototype.getClassRecords = function () {
            this.ensureAnalysis();
            return this.traitCompiler.allRecords();
        };
        WorkspaceSymbols.prototype.getAllModules = function () {
            var _this = this;
            this.ensureAnalysis();
            return this.traitCompiler.allRecords('NgModule').map(function (_a) {
                var node = _a.node;
                return new NgModuleSymbol(_this, node);
            });
        };
        WorkspaceSymbols.prototype.getAllComponents = function () {
            var _this = this;
            this.ensureAnalysis();
            return this.traitCompiler.allRecords('Component').map(function (_a) {
                var node = _a.node;
                return new ComponentSymbol(_this, node);
            });
        };
        WorkspaceSymbols.prototype.getAllDirectives = function () {
            var _this = this;
            this.ensureAnalysis();
            return this.traitCompiler.allRecords('Directive').map(function (_a) {
                var node = _a.node;
                return new DirectiveSymbol(_this, node);
            });
        };
        WorkspaceSymbols.prototype.getAllInjectable = function () {
            var _this = this;
            this.ensureAnalysis();
            return this.traitCompiler.allRecords('Injectable').map(function (_a) {
                var node = _a.node;
                return new InjectableSymbol(_this, node);
            });
        };
        WorkspaceSymbols.prototype.getAllPipes = function () {
            var _this = this;
            this.ensureAnalysis();
            return this.traitCompiler.allRecords('Pipe').map(function (_a) {
                var node = _a.node;
                return new PipeSymbol(_this, node);
            });
        };
        /** Find a symbol based on the class expression */
        WorkspaceSymbols.prototype.findSymbol = function (token) {
            if (token instanceof compiler.WrappedNodeExpr) {
                if (typescript.isIdentifier(token.node)) {
                    var decl = this.reflector.getDeclarationOfIdentifier(token.node);
                    if ((decl === null || decl === void 0 ? void 0 : decl.node) && this.reflector.isClass(decl.node)) {
                        return this.getSymbol(decl.node);
                    }
                    else if (decl === null || decl === void 0 ? void 0 : decl.node) {
                        return this.providerRegistry.getProvider(decl.node);
                    }
                }
                else if (typescript.isToken(token.node)) {
                    return this.providerRegistry.getProvider(token.node);
                }
            }
        };
        /** Find a symbol based on the class expression */
        WorkspaceSymbols.prototype.getSymbol = function (node) {
            var isDts = typescript$1.isFromDtsFile(node);
            var annotation;
            if (isDts) {
                var members = this.reflector.getMembersOfClass(node);
                annotation = getDtsAnnotation(members);
            }
            else {
                annotation = getLocalAnnotation(node.decorators);
            }
            if (annotation && (annotation in symbolFactory)) {
                var factory = symbolFactory[annotation];
                return factory(this, node);
            }
        };
        Object.defineProperty(WorkspaceSymbols.prototype, "host", {
            /////////////////////////
            // ----- PRIVATE ----- //
            /////////////////////////
            /** Angular wrapper around the typescript host compiler */
            // TODO: add reusable program
            get: function () {
                var _this = this;
                return this.lazy('host', function () {
                    var baseHost = new file_system.NgtscCompilerHost(_this.fs, _this.options);
                    return core.NgCompilerHost.wrap(baseHost, _this.rootNames, _this.options, _this.oldProgram || null);
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "program", {
            /** Typescript program */
            get: function () {
                var _this = this;
                return this.lazy('program', function () { return typescript.createProgram({
                    host: _this.host,
                    rootNames: _this.host.inputFiles,
                    options: _this.options
                }); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "injectableHandler", {
            /** Handler for @Injectable() annotations */
            get: function () {
                var _this = this;
                return this.lazy('injectableHandler', function () { return new annotations.InjectableDecoratorHandler(_this.reflector, _this.defaultImportTracker, _this.isCore, _this.options.strictInjectionParameters || false, _this.injectableRegistry); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "pipeHandler", {
            /** Handler for @Pipe() annotations */
            get: function () {
                var _this = this;
                return this.lazy('pipeHandler', function () { return new annotations.PipeDecoratorHandler(_this.reflector, _this.evaluator, _this.metaRegistry, _this.scopeRegistry, _this.defaultImportTracker, _this.injectableRegistry, _this.isCore); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "directiveHandler", {
            /** Handler for @Directive() annotations */
            get: function () {
                var _this = this;
                return this.lazy('directiveHandler', function () { return new annotations.DirectiveDecoratorHandler(_this.reflector, _this.evaluator, _this.metaRegistry, _this.scopeRegistry, _this.metaReader, _this.defaultImportTracker, _this.injectableRegistry, _this.isCore, !!_this.options.annotateForClosureCompiler, !!_this.options.compileNonExportedClasses); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "moduleHandler", {
            /** Handler for @NgModule() annotations */
            get: function () {
                var _this = this;
                return this.lazy('moduleHandler', function () { return new annotations.NgModuleDecoratorHandler(_this.reflector, _this.evaluator, _this.metaReader, _this.metaRegistry, _this.scopeRegistry, _this.referencesRegistry, _this.isCore, _this.routeAnalyzer, _this.refEmitter, _this.host.factoryTracker, _this.defaultImportTracker, !!_this.options.annotateForClosureCompiler, _this.injectableRegistry, _this.options.i18nInLocale); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "componentHandler", {
            /** Handler for @Component() annotations */
            get: function () {
                var _this = this;
                return this.lazy('componentHandler', function () { return new annotations.ComponentDecoratorHandler(_this.reflector, _this.evaluator, _this.metaRegistry, _this.metaReader, _this.scopeReader, _this.scopeRegistry, _this.isCore, _this.resourceManager, _this.host.rootDirs, _this.options.preserveWhitespaces || false, _this.options.i18nUseExternalIds !== false, _this.options.enableI18nLegacyMessageIdFormat !== false, _this.options.i18nNormalizeLineEndingsInICUs, _this.moduleResolver, _this.cycleAnalyzer, _this.refEmitter, _this.defaultImportTracker, _this.incrementalDriver.depGraph, _this.injectableRegistry, !!_this.options.annotateForClosureCompiler); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "reflector", {
            /** Static reflection of declarations using the TypeScript type checker */
            get: function () {
                var _this = this;
                return this.lazy('reflector', function () { return new reflection.TypeScriptReflectionHost(_this.checker); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "checker", {
            /** Typescript type checker use to semantically analyze a source file */
            get: function () {
                var _this = this;
                return this.lazy('checker', function () { return _this.program.getTypeChecker(); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "metaRegistry", {
            /** Register metadata from local NgModules, Directives, Components, and Pipes */
            get: function () {
                var _this = this;
                return this.lazy('metaRegistry', function () { return new metadata.CompoundMetadataRegistry([_this.localMetaReader, _this.scopeRegistry]); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "metaReader", {
            /** Register metadata from local declaration files (.d.ts) */
            get: function () {
                var _this = this;
                return this.lazy('metaReader', function () { return new metadata.CompoundMetadataReader([_this.localMetaReader, _this.dtsReader]); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "defaultImportTracker", {
            /** Registers and records usages of Identifers that came from default import statements (import X from 'some/module') */
            get: function () {
                return this.lazy('defaultImportTracker', function () { return new imports.DefaultImportTracker(); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "injectableRegistry", {
            /** Keeps track of classes that can be constructed via dependency injection (e.g. injectables, directives, pipes) */
            get: function () {
                var _this = this;
                return this.lazy('injectableRegistry', function () { return new metadata.InjectableClassRegistry(_this.reflector); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "incrementalDriver", {
            // @todo() support oldProgram https://github.com/angular/angular/blob/master/packages/compiler-cli/src/ngtsc/core/src/compiler.ts#L130
            get: function () {
                var _this = this;
                return this.lazy('incrementalDriver', function () { return incremental.IncrementalDriver.fresh(_this.program); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "resourceManager", {
            /** (pre)Load resources using cache */
            get: function () {
                var _this = this;
                return this.lazy('resourceManager', function () { return new resource.AdapterResourceLoader(_this.host, _this.options); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "moduleResolver", {
            /** Resolve the module source-files references in lazy-loaded routes */
            get: function () {
                var _this = this;
                return this.lazy('moduleResolver', function () {
                    var moduleResolutionCache = typescript.createModuleResolutionCache(_this.host.getCurrentDirectory(), function (fileName) { return _this.host.getCanonicalFileName(fileName); });
                    return new imports.ModuleResolver(_this.program, _this.options, _this.host, moduleResolutionCache);
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "entryPoint", {
            /** Entry source file of the host */
            get: function () {
                return this.host.entryPoint !== null ? typescript$1.getSourceFileOrNull(this.program, this.host.entryPoint) : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "aliasingHost", {
            /** Generates and consumes alias re-exports */
            get: function () {
                var _this = this;
                return this.lazy('aliasingHost', function () {
                    var aliasingHost = null;
                    var _a = _this.options, _useHostForImportGeneration = _a._useHostForImportGeneration, generateDeepReexports = _a.generateDeepReexports;
                    if (_this.host.unifiedModulesHost === null || !_useHostForImportGeneration) {
                        if (_this.entryPoint === null && generateDeepReexports === true) {
                            aliasingHost = new imports.PrivateExportAliasingHost(_this.reflector);
                        }
                    }
                    else {
                        aliasingHost = new imports.UnifiedModulesAliasingHost(_this.host.unifiedModulesHost);
                    }
                    return aliasingHost;
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "refEmitter", {
            /** Generates `Expression`s which refer to `Reference`s in a given context. */
            get: function () {
                var _this = this;
                return this.lazy('refEmitter', function () {
                    var _a = _this.options, rootDir = _a.rootDir, rootDirs = _a.rootDirs, _useHostForImportGeneration = _a._useHostForImportGeneration;
                    var refEmitter;
                    if (_this.host.unifiedModulesHost === null || !_useHostForImportGeneration) {
                        var localImportStrategy = void 0;
                        if (rootDir !== undefined || (rootDirs === null || rootDirs === void 0 ? void 0 : rootDirs.length)) {
                            localImportStrategy = new imports.LogicalProjectStrategy(_this.reflector, new file_system.LogicalFileSystem(__spread(_this.host.rootDirs), _this.host));
                        }
                        else {
                            localImportStrategy = new imports.RelativePathStrategy(_this.reflector);
                        }
                        refEmitter = new imports.ReferenceEmitter([
                            new imports.LocalIdentifierStrategy(),
                            new imports.AbsoluteModuleStrategy(_this.program, _this.checker, _this.moduleResolver, _this.reflector),
                            localImportStrategy,
                        ]);
                    }
                    else {
                        refEmitter = new imports.ReferenceEmitter([
                            new imports.LocalIdentifierStrategy(),
                            new imports.AliasStrategy(),
                            new imports.UnifiedModulesStrategy(_this.reflector, _this.host.unifiedModulesHost),
                        ]);
                    }
                    return refEmitter;
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "localMetaReader", {
            /** A registry of directive, pipe, and module metadata for types defined in the current compilation */
            get: function () {
                return this.lazy('localMetaReader', function () { return new metadata.LocalMetadataRegistry(); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "dtsReader", {
            /** A `MetadataReader` that can read metadata from `.d.ts` files, which have static Ivy properties */
            get: function () {
                var _this = this;
                return this.lazy('dtsReader', function () { return new metadata.DtsMetadataReader(_this.checker, _this.reflector); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "scopeReader", {
            /** Read information about the compilation scope of components. */
            get: function () {
                return this.scopeRegistry;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "referencesRegistry", {
            /** Used by DecoratorHandlers to register references during analysis */
            get: function () {
                var _this = this;
                return this.lazy('referencesRegistry', function () {
                    var referencesRegistry;
                    if (_this.entryPoint !== null) {
                        var exportReferenceGraph = new entry_point.ReferenceGraph();
                        referencesRegistry = new ReferenceGraphAdapter(exportReferenceGraph);
                    }
                    else {
                        referencesRegistry = new annotations.NoopReferencesRegistry();
                    }
                    return referencesRegistry;
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "cycleAnalyzer", {
            /** Analyzes a `ts.Program` for cycles. */
            get: function () {
                var _this = this;
                return this.lazy('cycleAnalyzer', function () {
                    var importGraph = new cycles.ImportGraph(_this.moduleResolver);
                    return new cycles.CycleAnalyzer(importGraph);
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "dtsTransforms", {
            /** Keeps track of declaration transform (`DtsTransform`) per source file */
            get: function () {
                return this.lazy('dtsTransforms', function () { return new transform.DtsTransformRegistry(); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "mwpScanner", {
            /** Scan `ModuleWithProvider` classes */
            get: function () {
                var _this = this;
                return this.lazy('mwpScanner', function () { return new modulewithproviders.ModuleWithProvidersScanner(_this.reflector, _this.evaluator, _this.refEmitter); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorkspaceSymbols.prototype, "routeAnalyzer", {
            /** Analyze lazy loaded routes */
            get: function () {
                var _this = this;
                return this.lazy('routeAnalyzer', function () { return new routing.NgModuleRouteAnalyzer(_this.moduleResolver, _this.evaluator); });
            },
            enumerable: false,
            configurable: true
        });
        /** Lazy load & memorize every tool in the `WorkspaceSymbols`'s toolkit */
        WorkspaceSymbols.prototype.lazy = function (key, load) {
            if (!this.toolkit[key]) {
                this.toolkit[key] = load();
            }
            return this.toolkit[key];
        };
        /** Perform analysis on all projects */
        WorkspaceSymbols.prototype.analyzeAll = function () {
            var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
            var _this = this;
            // Analyse all files
            var analyzeSpan = this.perfRecorder.start('analyze');
            var _loop_1 = function (sf) {
                if (sf.isDeclarationFile) {
                    return "continue";
                }
                var analyzeFileSpan = this_1.perfRecorder.start('analyzeFile', sf);
                this_1.traitCompiler.analyzeSync(sf);
                // Scan for ModuleWithProvider
                var addTypeReplacement = function (node, type) {
                    _this.dtsTransforms.getReturnTypeTransform(sf).addTypeReplacement(node, type);
                };
                this_1.mwpScanner.scan(sf, { addTypeReplacement: addTypeReplacement });
                this_1.perfRecorder.stop(analyzeFileSpan);
            };
            var this_1 = this;
            try {
                for (var _e = __values$2(this.program.getSourceFiles()), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var sf = _f.value;
                    _loop_1(sf);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.perfRecorder.stop(analyzeSpan);
            // Resolve compilation
            this.traitCompiler.resolve();
            // Record NgModule Scope dependencies
            var recordSpan = this.perfRecorder.start('recordDependencies');
            var depGraph = this.incrementalDriver.depGraph;
            try {
                for (var _g = __values$2(this.scopeRegistry.getCompilationScopes()), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var scope = _h.value;
                    var file = scope.declaration.getSourceFile();
                    var ngModuleFile = scope.ngModule.getSourceFile();
                    depGraph.addTransitiveDependency(ngModuleFile, file);
                    depGraph.addDependency(file, ngModuleFile);
                    var meta = this.metaReader.getDirectiveMetadata(new imports.Reference(scope.declaration));
                    // For components
                    if (meta !== null && meta.isComponent) {
                        depGraph.addTransitiveResources(ngModuleFile, file);
                        try {
                            for (var _j = (e_4 = void 0, __values$2(scope.directives)), _k = _j.next(); !_k.done; _k = _j.next()) {
                                var directive = _k.value;
                                depGraph.addTransitiveDependency(file, directive.ref.node.getSourceFile());
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        try {
                            for (var _l = (e_5 = void 0, __values$2(scope.pipes)), _m = _l.next(); !_m.done; _m = _l.next()) {
                                var pipe = _m.value;
                                depGraph.addTransitiveDependency(file, pipe.ref.node.getSourceFile());
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.perfRecorder.stop(recordSpan);
            // Calculate which files need to be emitted
            this.incrementalDriver.recordSuccessfulAnalysis(this.traitCompiler);
            this.analysed = true;
        };
        WorkspaceSymbols.prototype.ensureAnalysis = function () {
            if (!this.analysed) {
                this.analyzeAll();
                this.providerRegistry.recordAll();
                // TODO: Implements the ProviderRegistry to keep track of FactoryProvider, ValueProvider, ...
            }
        };
        return WorkspaceSymbols;
    }());

    exports.ComponentSymbol = ComponentSymbol;
    exports.DirectiveSymbol = DirectiveSymbol;
    exports.InjectableSymbol = InjectableSymbol;
    exports.NgModuleSymbol = NgModuleSymbol;
    exports.NgastTraitCompiler = NgastTraitCompiler;
    exports.PipeSymbol = PipeSymbol;
    exports.Symbol = Symbol$1;
    exports.WorkspaceSymbols = WorkspaceSymbols;
    exports.annotationNames = annotationNames;
    exports.annotationTheta = annotationTheta;
    exports.assertDeps = assertDeps;
    exports.exists = exists;
    exports.filterByHandler = filterByHandler;
    exports.getDecoratorName = getDecoratorName;
    exports.getDtsAnnotation = getDtsAnnotation;
    exports.getLocalAnnotation = getLocalAnnotation;
    exports.hasDtsAnnotation = hasDtsAnnotation;
    exports.hasLocalAnnotation = hasLocalAnnotation;
    exports.isAnalysed = isAnalysed;
    exports.symbolFactory = symbolFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
