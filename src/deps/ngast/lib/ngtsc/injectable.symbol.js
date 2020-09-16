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
var InjectableSymbol = /** @class */ (function (_super) {
    __extends(InjectableSymbol, _super);
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
}(Symbol));
export { InjectableSymbol };
//# sourceMappingURL=injectable.symbol.js.map