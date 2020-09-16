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
var NgModuleSymbol = /** @class */ (function (_super) {
    __extends(NgModuleSymbol, _super);
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
}(Symbol));
export { NgModuleSymbol };
//# sourceMappingURL=module.symbol.js.map