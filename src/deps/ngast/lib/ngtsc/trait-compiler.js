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
var __values = (this && this.__values) || function(o) {
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
import { TraitCompiler, TraitState } from '@angular/compiler-cli/src/ngtsc/transform';
import { FatalDiagnosticError } from '@angular/compiler-cli/src/ngtsc/diagnostics';
import { hasLocalAnnotation, hasDtsAnnotation } from './utils';
import { isFromDtsFile } from '@angular/compiler-cli/src/ngtsc/util/src/typescript';
/** TraitCompiler with friendly interface */
var NgastTraitCompiler = /** @class */ (function (_super) {
    __extends(NgastTraitCompiler, _super);
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
                    case TraitState.SKIPPED:
                    case TraitState.ERRORED:
                        continue;
                    case TraitState.PENDING:
                        throw new Error("Resolving a trait that hasn't been analyzed: " + node.name.text + " / " + Object.getPrototypeOf(trait.handler).constructor.name);
                    case TraitState.RESOLVED:
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
                    if (err instanceof FatalDiagnosticError) {
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
                    else if (isFromDtsFile(node)) {
                        var members = _this['reflector'].getMembersOfClass(node);
                        if (hasDtsAnnotation(members, annotation)) {
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
}(TraitCompiler));
export { NgastTraitCompiler };
//# sourceMappingURL=trait-compiler.js.map