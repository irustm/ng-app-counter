import { WorkspaceSymbols } from './workspace.symbols';
import { ClassDeclaration, Decorator } from '@angular/compiler-cli/src/ngtsc/reflection';
import { Declaration } from 'typescript';
import { Trait, AnalyzedTrait, ResolvedTrait } from '@angular/compiler-cli/src/ngtsc/transform';
import { R3DependencyMetadata } from '@angular/compiler';
import { AnnotationNames } from './utils';
import { FactoryOutput } from './find-symbol';
import { NgModuleAnalysis } from '@angular/compiler-cli/src/ngtsc/annotations/src/ng_module';
import { PipeHandlerData } from '@angular/compiler-cli/src/ngtsc/annotations/src/pipe';
import { InjectableHandlerData } from '@angular/compiler-cli/src/ngtsc/annotations/src/injectable';
import { DirectiveHandlerData } from '@angular/compiler-cli/src/ngtsc/annotations/src/directive';
import { ComponentAnalysisData } from '@angular/compiler-cli/src/ngtsc/annotations/src/component';
declare const handlerName: {
    readonly NgModule: "NgModuleDecoratorHandler";
    readonly Pipe: "PipeDecoratorHandler";
    readonly Injectable: "InjectableDecoratorHandler";
    readonly Directive: "DirectiveDecoratorHandler";
    readonly Component: "ComponentDecoratorHandler";
};
export interface HandlerData {
    'NgModuleDecoratorHandler': NgModuleAnalysis;
    'PipeDecoratorHandler': PipeHandlerData;
    'InjectableDecoratorHandler': InjectableHandlerData;
    'DirectiveDecoratorHandler': DirectiveHandlerData;
    'ComponentDecoratorHandler': ComponentAnalysisData;
}
declare type GetHandlerData<A extends keyof typeof handlerName> = HandlerData[(typeof handlerName)[A]];
export declare const filterByHandler: <A extends "NgModule" | "Pipe" | "Injectable" | "Directive" | "Component">(annotation: A) => (trait: Trait<Decorator, any, unknown>) => trait is Trait<Decorator, GetHandlerData<A>, unknown>;
export declare const isAnalysed: <A, B, C>(trait?: import("@angular/compiler-cli/src/ngtsc/transform").PendingTrait<A, B, C> | import("@angular/compiler-cli/src/ngtsc/transform").SkippedTrait<A, B, C> | AnalyzedTrait<A, B, C> | ResolvedTrait<A, B, C> | import("@angular/compiler-cli/src/ngtsc/transform").ErroredTrait<A, B, C> | undefined) => trait is AnalyzedTrait<A, B, C> | ResolvedTrait<A, B, C>;
export declare abstract class Symbol<A extends AnnotationNames> {
    protected workspace: WorkspaceSymbols;
    node: ClassDeclaration<Declaration>;
    protected readonly abstract annotation: A;
    protected readonly abstract deps: R3DependencyMetadata[] | 'invalid' | null;
    private _trait;
    private _path;
    constructor(workspace: WorkspaceSymbols, node: ClassDeclaration<Declaration>);
    get name(): string;
    get path(): string;
    get diagnostics(): import("typescript").Diagnostic[] | null;
    get isAnalysed(): boolean;
    get record(): import("@angular/compiler-cli/src/ngtsc/transform").ClassRecord | null;
    get analysis(): Readonly<GetHandlerData<A>>;
    private get trait();
    analyse(): void;
    protected ensureAnalysis(): void;
    isSymbol(name: AnnotationNames): this is FactoryOutput<A>;
}
export {};
