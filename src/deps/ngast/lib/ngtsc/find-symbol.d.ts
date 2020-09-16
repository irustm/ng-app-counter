import { ClassDeclaration } from '@angular/compiler-cli/src/ngtsc/reflection';
import { WorkspaceSymbols } from './workspace.symbols';
import { NgModuleSymbol } from './module.symbol';
import { InjectableSymbol } from './injectable.symbol';
import { DirectiveSymbol } from './directive.symbol';
import { ComponentSymbol } from './component.symbol';
import { PipeSymbol } from './pipe.symbol';
import { AnnotationNames } from './utils';
export declare type DeclarationSymbol = ComponentSymbol | DirectiveSymbol | PipeSymbol;
export declare const symbolFactory: {
    NgModule: (workspace: WorkspaceSymbols, node: ClassDeclaration) => NgModuleSymbol;
    Injectable: (workspace: WorkspaceSymbols, node: ClassDeclaration) => InjectableSymbol;
    Directive: (workspace: WorkspaceSymbols, node: ClassDeclaration) => DirectiveSymbol;
    Component: (workspace: WorkspaceSymbols, node: ClassDeclaration) => ComponentSymbol;
    Pipe: (workspace: WorkspaceSymbols, node: ClassDeclaration) => PipeSymbol;
};
export declare type SymbolFactory = typeof symbolFactory;
export declare type FactoryOutput<A extends AnnotationNames> = ReturnType<SymbolFactory[A]>;
export declare type FactoryOutputs = ReturnType<SymbolFactory[AnnotationNames]>;
