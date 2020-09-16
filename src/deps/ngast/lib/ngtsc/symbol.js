import { TraitState } from '@angular/compiler-cli/src/ngtsc/transform';
var handlerName = {
    'NgModule': 'NgModuleDecoratorHandler',
    'Pipe': 'PipeDecoratorHandler',
    'Injectable': 'InjectableDecoratorHandler',
    'Directive': 'DirectiveDecoratorHandler',
    'Component': 'ComponentDecoratorHandler'
};
export var filterByHandler = function (annotation) { return function (trait) {
    return trait.handler.name === handlerName[annotation];
}; };
export var isAnalysed = function (trait) {
    return (trait === null || trait === void 0 ? void 0 : trait.state) === TraitState.ANALYZED || (trait === null || trait === void 0 ? void 0 : trait.state) === TraitState.RESOLVED;
};
var Symbol = /** @class */ (function () {
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
            return ((_a = this.trait) === null || _a === void 0 ? void 0 : _a.state) === TraitState.ERRORED ? this.trait.diagnostics : null;
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
            if (((_a = this.trait) === null || _a === void 0 ? void 0 : _a.state) === TraitState.ERRORED) {
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
export { Symbol };
//# sourceMappingURL=symbol.js.map