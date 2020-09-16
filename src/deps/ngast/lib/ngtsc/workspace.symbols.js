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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { createProgram, createModuleResolutionCache, getOriginalNode, isIdentifier, isToken } from 'typescript';
import { WrappedNodeExpr } from '@angular/compiler';
import { readConfiguration } from '@angular/compiler-cli';
import { NgCompilerHost } from '@angular/compiler-cli/src/ngtsc/core';
import { InjectableDecoratorHandler, PipeDecoratorHandler, DirectiveDecoratorHandler, NoopReferencesRegistry, NgModuleDecoratorHandler, ComponentDecoratorHandler } from '@angular/compiler-cli/src/ngtsc/annotations';
import { NgtscCompilerHost, LogicalFileSystem, NodeJSFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { TypeScriptReflectionHost } from '@angular/compiler-cli/src/ngtsc/reflection';
import { PartialEvaluator } from '@angular/compiler-cli/src/ngtsc/partial_evaluator';
import { IncrementalDriver } from '@angular/compiler-cli/src/ngtsc/incremental';
import { DefaultImportTracker, Reference, ReferenceEmitter, LogicalProjectStrategy, RelativePathStrategy, PrivateExportAliasingHost, LocalIdentifierStrategy, AbsoluteModuleStrategy, AliasStrategy, UnifiedModulesStrategy, UnifiedModulesAliasingHost, ModuleResolver } from '@angular/compiler-cli/src/ngtsc/imports';
import { InjectableClassRegistry, CompoundMetadataRegistry, DtsMetadataReader, LocalMetadataRegistry, CompoundMetadataReader } from '@angular/compiler-cli/src/ngtsc/metadata';
import { MetadataDtsModuleScopeResolver, LocalModuleScopeRegistry } from '@angular/compiler-cli/src/ngtsc/scope';
import { getSourceFileOrNull, isDtsPath, isFromDtsFile } from '@angular/compiler-cli/src/ngtsc/util/src/typescript';
import { NgModuleRouteAnalyzer } from '@angular/compiler-cli/src/ngtsc/routing';
import { CycleAnalyzer, ImportGraph } from '@angular/compiler-cli/src/ngtsc/cycles';
import { AdapterResourceLoader } from '@angular/compiler-cli/src/ngtsc/resource';
import { ReferenceGraph } from '@angular/compiler-cli/src/ngtsc/entry_point';
import { DtsTransformRegistry } from '@angular/compiler-cli/src/ngtsc/transform';
import { NOOP_PERF_RECORDER } from '@angular/compiler-cli/src/ngtsc/perf';
import { ModuleWithProvidersScanner } from '@angular/compiler-cli/src/ngtsc/modulewithproviders';
import { NgModuleSymbol } from './module.symbol';
import { NgastTraitCompiler } from './trait-compiler';
import { ComponentSymbol } from './component.symbol';
import { symbolFactory } from './find-symbol';
import { InjectableSymbol } from './injectable.symbol';
import { DirectiveSymbol } from './directive.symbol';
import { PipeSymbol } from './pipe.symbol';
import { getDtsAnnotation, getLocalAnnotation } from './utils';
import { ProviderRegistry } from './provider';
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
            for (var references_1 = __values(references), references_1_1 = references_1.next(); !references_1_1.done; references_1_1 = references_1.next()) {
                var node = references_1_1.value.node;
                var sourceFile = node.getSourceFile();
                if (sourceFile === undefined) {
                    sourceFile = getOriginalNode(node).getSourceFile();
                }
                // Only record local references (not references into .d.ts files).
                if (sourceFile === undefined || !isDtsPath(sourceFile.fileName)) {
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
        if (fs === void 0) { fs = new NodeJSFileSystem(); }
        if (perfRecorder === void 0) { perfRecorder = NOOP_PERF_RECORDER; }
        this.tsconfigPath = tsconfigPath;
        this.fs = fs;
        this.perfRecorder = perfRecorder;
        this.toolkit = {};
        this.isCore = false;
        this.analysed = false;
        var config = readConfiguration(this.tsconfigPath);
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
                var depScopeReader = new MetadataDtsModuleScopeResolver(_this.dtsReader, _this.aliasingHost);
                return new LocalModuleScopeRegistry(_this.localMetaReader, depScopeReader, _this.refEmitter, _this.aliasingHost);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "evaluator", {
        /** Evaluate typecript Expression & update the dependancy graph accordingly */
        get: function () {
            var _this = this;
            return this.lazy('evaluator', function () { return new PartialEvaluator(_this.reflector, _this.checker, _this.incrementalDriver.depGraph); });
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
        if (token instanceof WrappedNodeExpr) {
            if (isIdentifier(token.node)) {
                var decl = this.reflector.getDeclarationOfIdentifier(token.node);
                if ((decl === null || decl === void 0 ? void 0 : decl.node) && this.reflector.isClass(decl.node)) {
                    return this.getSymbol(decl.node);
                }
                else if (decl === null || decl === void 0 ? void 0 : decl.node) {
                    return this.providerRegistry.getProvider(decl.node);
                }
            }
            else if (isToken(token.node)) {
                return this.providerRegistry.getProvider(token.node);
            }
        }
    };
    /** Find a symbol based on the class expression */
    WorkspaceSymbols.prototype.getSymbol = function (node) {
        var isDts = isFromDtsFile(node);
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
                var baseHost = new NgtscCompilerHost(_this.fs, _this.options);
                return NgCompilerHost.wrap(baseHost, _this.rootNames, _this.options, _this.oldProgram || null);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "program", {
        /** Typescript program */
        get: function () {
            var _this = this;
            return this.lazy('program', function () { return createProgram({
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
            return this.lazy('injectableHandler', function () { return new InjectableDecoratorHandler(_this.reflector, _this.defaultImportTracker, _this.isCore, _this.options.strictInjectionParameters || false, _this.injectableRegistry); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "pipeHandler", {
        /** Handler for @Pipe() annotations */
        get: function () {
            var _this = this;
            return this.lazy('pipeHandler', function () { return new PipeDecoratorHandler(_this.reflector, _this.evaluator, _this.metaRegistry, _this.scopeRegistry, _this.defaultImportTracker, _this.injectableRegistry, _this.isCore); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "directiveHandler", {
        /** Handler for @Directive() annotations */
        get: function () {
            var _this = this;
            return this.lazy('directiveHandler', function () { return new DirectiveDecoratorHandler(_this.reflector, _this.evaluator, _this.metaRegistry, _this.scopeRegistry, _this.metaReader, _this.defaultImportTracker, _this.injectableRegistry, _this.isCore, !!_this.options.annotateForClosureCompiler, !!_this.options.compileNonExportedClasses); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "moduleHandler", {
        /** Handler for @NgModule() annotations */
        get: function () {
            var _this = this;
            return this.lazy('moduleHandler', function () { return new NgModuleDecoratorHandler(_this.reflector, _this.evaluator, _this.metaReader, _this.metaRegistry, _this.scopeRegistry, _this.referencesRegistry, _this.isCore, _this.routeAnalyzer, _this.refEmitter, _this.host.factoryTracker, _this.defaultImportTracker, !!_this.options.annotateForClosureCompiler, _this.injectableRegistry, _this.options.i18nInLocale); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "componentHandler", {
        /** Handler for @Component() annotations */
        get: function () {
            var _this = this;
            return this.lazy('componentHandler', function () { return new ComponentDecoratorHandler(_this.reflector, _this.evaluator, _this.metaRegistry, _this.metaReader, _this.scopeReader, _this.scopeRegistry, _this.isCore, _this.resourceManager, _this.host.rootDirs, _this.options.preserveWhitespaces || false, _this.options.i18nUseExternalIds !== false, _this.options.enableI18nLegacyMessageIdFormat !== false, _this.options.i18nNormalizeLineEndingsInICUs, _this.moduleResolver, _this.cycleAnalyzer, _this.refEmitter, _this.defaultImportTracker, _this.incrementalDriver.depGraph, _this.injectableRegistry, !!_this.options.annotateForClosureCompiler); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "reflector", {
        /** Static reflection of declarations using the TypeScript type checker */
        get: function () {
            var _this = this;
            return this.lazy('reflector', function () { return new TypeScriptReflectionHost(_this.checker); });
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
            return this.lazy('metaRegistry', function () { return new CompoundMetadataRegistry([_this.localMetaReader, _this.scopeRegistry]); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "metaReader", {
        /** Register metadata from local declaration files (.d.ts) */
        get: function () {
            var _this = this;
            return this.lazy('metaReader', function () { return new CompoundMetadataReader([_this.localMetaReader, _this.dtsReader]); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "defaultImportTracker", {
        /** Registers and records usages of Identifers that came from default import statements (import X from 'some/module') */
        get: function () {
            return this.lazy('defaultImportTracker', function () { return new DefaultImportTracker(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "injectableRegistry", {
        /** Keeps track of classes that can be constructed via dependency injection (e.g. injectables, directives, pipes) */
        get: function () {
            var _this = this;
            return this.lazy('injectableRegistry', function () { return new InjectableClassRegistry(_this.reflector); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "incrementalDriver", {
        // @todo() support oldProgram https://github.com/angular/angular/blob/master/packages/compiler-cli/src/ngtsc/core/src/compiler.ts#L130
        get: function () {
            var _this = this;
            return this.lazy('incrementalDriver', function () { return IncrementalDriver.fresh(_this.program); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "resourceManager", {
        /** (pre)Load resources using cache */
        get: function () {
            var _this = this;
            return this.lazy('resourceManager', function () { return new AdapterResourceLoader(_this.host, _this.options); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "moduleResolver", {
        /** Resolve the module source-files references in lazy-loaded routes */
        get: function () {
            var _this = this;
            return this.lazy('moduleResolver', function () {
                var moduleResolutionCache = createModuleResolutionCache(_this.host.getCurrentDirectory(), function (fileName) { return _this.host.getCanonicalFileName(fileName); });
                return new ModuleResolver(_this.program, _this.options, _this.host, moduleResolutionCache);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "entryPoint", {
        /** Entry source file of the host */
        get: function () {
            return this.host.entryPoint !== null ? getSourceFileOrNull(this.program, this.host.entryPoint) : null;
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
                        aliasingHost = new PrivateExportAliasingHost(_this.reflector);
                    }
                }
                else {
                    aliasingHost = new UnifiedModulesAliasingHost(_this.host.unifiedModulesHost);
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
                        localImportStrategy = new LogicalProjectStrategy(_this.reflector, new LogicalFileSystem(__spread(_this.host.rootDirs), _this.host));
                    }
                    else {
                        localImportStrategy = new RelativePathStrategy(_this.reflector);
                    }
                    refEmitter = new ReferenceEmitter([
                        new LocalIdentifierStrategy(),
                        new AbsoluteModuleStrategy(_this.program, _this.checker, _this.moduleResolver, _this.reflector),
                        localImportStrategy,
                    ]);
                }
                else {
                    refEmitter = new ReferenceEmitter([
                        new LocalIdentifierStrategy(),
                        new AliasStrategy(),
                        new UnifiedModulesStrategy(_this.reflector, _this.host.unifiedModulesHost),
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
            return this.lazy('localMetaReader', function () { return new LocalMetadataRegistry(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "dtsReader", {
        /** A `MetadataReader` that can read metadata from `.d.ts` files, which have static Ivy properties */
        get: function () {
            var _this = this;
            return this.lazy('dtsReader', function () { return new DtsMetadataReader(_this.checker, _this.reflector); });
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
                    var exportReferenceGraph = new ReferenceGraph();
                    referencesRegistry = new ReferenceGraphAdapter(exportReferenceGraph);
                }
                else {
                    referencesRegistry = new NoopReferencesRegistry();
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
                var importGraph = new ImportGraph(_this.moduleResolver);
                return new CycleAnalyzer(importGraph);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "dtsTransforms", {
        /** Keeps track of declaration transform (`DtsTransform`) per source file */
        get: function () {
            return this.lazy('dtsTransforms', function () { return new DtsTransformRegistry(); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "mwpScanner", {
        /** Scan `ModuleWithProvider` classes */
        get: function () {
            var _this = this;
            return this.lazy('mwpScanner', function () { return new ModuleWithProvidersScanner(_this.reflector, _this.evaluator, _this.refEmitter); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WorkspaceSymbols.prototype, "routeAnalyzer", {
        /** Analyze lazy loaded routes */
        get: function () {
            var _this = this;
            return this.lazy('routeAnalyzer', function () { return new NgModuleRouteAnalyzer(_this.moduleResolver, _this.evaluator); });
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
            for (var _e = __values(this.program.getSourceFiles()), _f = _e.next(); !_f.done; _f = _e.next()) {
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
            for (var _g = __values(this.scopeRegistry.getCompilationScopes()), _h = _g.next(); !_h.done; _h = _g.next()) {
                var scope = _h.value;
                var file = scope.declaration.getSourceFile();
                var ngModuleFile = scope.ngModule.getSourceFile();
                depGraph.addTransitiveDependency(ngModuleFile, file);
                depGraph.addDependency(file, ngModuleFile);
                var meta = this.metaReader.getDirectiveMetadata(new Reference(scope.declaration));
                // For components
                if (meta !== null && meta.isComponent) {
                    depGraph.addTransitiveResources(ngModuleFile, file);
                    try {
                        for (var _j = (e_4 = void 0, __values(scope.directives)), _k = _j.next(); !_k.done; _k = _j.next()) {
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
                        for (var _l = (e_5 = void 0, __values(scope.pipes)), _m = _l.next(); !_m.done; _m = _l.next()) {
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
export { WorkspaceSymbols };
//# sourceMappingURL=workspace.symbols.js.map