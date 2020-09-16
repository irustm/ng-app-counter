import { Expression } from '@angular/compiler';
import { FileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { ClassDeclaration } from '@angular/compiler-cli/src/ngtsc/reflection';
import { PartialEvaluator } from '@angular/compiler-cli/src/ngtsc/partial_evaluator';
import { LocalModuleScopeRegistry } from '@angular/compiler-cli/src/ngtsc/scope';
import { NgModuleRouteAnalyzer } from '@angular/compiler-cli/src/ngtsc/routing';
import { PerfRecorder } from '@angular/compiler-cli/src/ngtsc/perf';
import { NgModuleSymbol } from './module.symbol';
import { NgastTraitCompiler } from './trait-compiler';
import { ComponentSymbol } from './component.symbol';
import { FactoryOutput } from './find-symbol';
import { InjectableSymbol } from './injectable.symbol';
import { DirectiveSymbol } from './directive.symbol';
import { PipeSymbol } from './pipe.symbol';
import { AnnotationNames } from './utils';
import { ProviderRegistry } from './provider';
export declare class WorkspaceSymbols {
    private tsconfigPath;
    private fs;
    private perfRecorder;
    private options;
    private rootNames;
    private toolkit;
    private isCore;
    private analysed;
    private oldProgram;
    constructor(tsconfigPath: string, fs?: FileSystem, perfRecorder?: PerfRecorder);
    /** Process all classes in the program */
    get traitCompiler(): NgastTraitCompiler;
    /** Collects information about local NgModules, Directives, Components, and Pipes (declare in the ts.Program) */
    get scopeRegistry(): LocalModuleScopeRegistry;
    /** Evaluate typecript Expression & update the dependancy graph accordingly */
    get evaluator(): PartialEvaluator;
    /** Keep track of the providers other than Injectable */
    get providerRegistry(): ProviderRegistry;
    getClassRecords(): import("@angular/compiler-cli/src/ngtsc/transform").ClassRecord[];
    getAllModules(): NgModuleSymbol[];
    getAllComponents(): ComponentSymbol[];
    getAllDirectives(): DirectiveSymbol[];
    getAllInjectable(): InjectableSymbol[];
    getAllPipes(): PipeSymbol[];
    /** Find a symbol based on the class expression */
    findSymbol(token: Expression): InjectableSymbol | NgModuleSymbol | DirectiveSymbol | ComponentSymbol | PipeSymbol | import("./provider").Provider | undefined;
    /** Find a symbol based on the class expression */
    getSymbol<A extends AnnotationNames>(node: ClassDeclaration): FactoryOutput<A> | undefined;
    /** Angular wrapper around the typescript host compiler */
    private get host();
    /** Typescript program */
    private get program();
    /** Handler for @Injectable() annotations */
    private get injectableHandler();
    /** Handler for @Pipe() annotations */
    private get pipeHandler();
    /** Handler for @Directive() annotations */
    private get directiveHandler();
    /** Handler for @NgModule() annotations */
    private get moduleHandler();
    /** Handler for @Component() annotations */
    private get componentHandler();
    /** Static reflection of declarations using the TypeScript type checker */
    private get reflector();
    /** Typescript type checker use to semantically analyze a source file */
    private get checker();
    /** Register metadata from local NgModules, Directives, Components, and Pipes */
    private get metaRegistry();
    /** Register metadata from local declaration files (.d.ts) */
    private get metaReader();
    /** Registers and records usages of Identifers that came from default import statements (import X from 'some/module') */
    private get defaultImportTracker();
    /** Keeps track of classes that can be constructed via dependency injection (e.g. injectables, directives, pipes) */
    private get injectableRegistry();
    private get incrementalDriver();
    /** (pre)Load resources using cache */
    private get resourceManager();
    /** Resolve the module source-files references in lazy-loaded routes */
    private get moduleResolver();
    /** Entry source file of the host */
    private get entryPoint();
    /** Generates and consumes alias re-exports */
    private get aliasingHost();
    /** Generates `Expression`s which refer to `Reference`s in a given context. */
    private get refEmitter();
    /** A registry of directive, pipe, and module metadata for types defined in the current compilation */
    private get localMetaReader();
    /** A `MetadataReader` that can read metadata from `.d.ts` files, which have static Ivy properties */
    private get dtsReader();
    /** Read information about the compilation scope of components. */
    private get scopeReader();
    /** Used by DecoratorHandlers to register references during analysis */
    private get referencesRegistry();
    /** Analyzes a `ts.Program` for cycles. */
    private get cycleAnalyzer();
    /** Keeps track of declaration transform (`DtsTransform`) per source file */
    private get dtsTransforms();
    /** Scan `ModuleWithProvider` classes */
    private get mwpScanner();
    /** Analyze lazy loaded routes */
    get routeAnalyzer(): NgModuleRouteAnalyzer;
    /** Lazy load & memorize every tool in the `WorkspaceSymbols`'s toolkit */
    private lazy;
    /** Perform analysis on all projects */
    private analyzeAll;
    private ensureAnalysis;
}
