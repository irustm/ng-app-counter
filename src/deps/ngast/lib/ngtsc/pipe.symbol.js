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
var PipeSymbol = /** @class */ (function (_super) {
    __extends(PipeSymbol, _super);
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
}(Symbol));
export { PipeSymbol };
//# sourceMappingURL=pipe.symbol.js.map