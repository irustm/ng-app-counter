var __extends = (this && this.__extends) || (function () {
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
import { Symbol } from './symbol';
import { assertDeps, exists } from './utils';
import { parseCss } from '../css-parser/parse-css';
import { WrappedNodeExpr } from '@angular/compiler';
var ComponentSymbol = /** @class */ (function (_super) {
    __extends(ComponentSymbol, _super);
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
        if (providers instanceof WrappedNodeExpr) {
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
}(Symbol));
export { ComponentSymbol };
//# sourceMappingURL=component.symbol.js.map