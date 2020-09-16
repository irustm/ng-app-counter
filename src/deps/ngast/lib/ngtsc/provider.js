var __read = (this && this.__read) || function (o, n) {
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
import { Reference } from '@angular/compiler-cli/src/ngtsc/imports';
import { DynamicValue } from '@angular/compiler-cli/src/ngtsc/partial_evaluator';
import { isClassDeclaration, isIdentifier } from 'typescript';
import { WrappedNodeExpr } from '@angular/compiler';
import { isAnalysed, filterByHandler } from './symbol';
/////////
// WIP //
/////////
var useKeys = ['useValue', 'useFactory', 'useExisting'];
export function getProviderMetadata(provider) {
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
            if (this.metadata.provide instanceof Reference) {
                if (isClassDeclaration(this.metadata.provide.node)) {
                    return (_a = this.metadata.provide.node.name) === null || _a === void 0 ? void 0 : _a.text;
                }
            }
            if (this.metadata.provide instanceof DynamicValue) {
                if (isIdentifier(this.metadata.provide.node)) {
                    return this.metadata.provide.node.text;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    return Provider;
}());
export { Provider };
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
            for (var _d = __values(getAllAnalysis('NgModule')), _e = _d.next(); !_e.done; _e = _d.next()) {
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
            for (var _f = __values(getAllAnalysis('Component')), _g = _f.next(); !_g.done; _g = _f.next()) {
                var analysis = _g.value;
                var providers = analysis === null || analysis === void 0 ? void 0 : analysis.meta.providers;
                if (providers instanceof WrappedNodeExpr) {
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
            for (var _h = __values(getAllAnalysis('Directive')), _j = _h.next(); !_j.done; _j = _h.next()) {
                var analysis = _j.value;
                var providers = analysis === null || analysis === void 0 ? void 0 : analysis.meta.providers;
                if (providers instanceof WrappedNodeExpr) {
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
export { ProviderRegistry };
// TODO: check to use declaration instead of Identifier ...
function getKeyFromProvide(provide) {
    if (provide) {
        if (provide instanceof DynamicValue && isIdentifier(provide.node)) {
            return provide.node;
        }
        else if (typeof provide === 'string') {
            return provide;
        }
    }
}
//# sourceMappingURL=provider.js.map