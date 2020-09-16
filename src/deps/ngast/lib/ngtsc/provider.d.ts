import type { WorkspaceSymbols } from './workspace.symbols';
import { InjectableSymbol } from './injectable.symbol';
import { Reference } from '@angular/compiler-cli/src/ngtsc/imports';
import { DynamicValue } from '@angular/compiler-cli/src/ngtsc/partial_evaluator';
import { Expression } from 'typescript';
declare const useKeys: readonly ["useValue", "useFactory", "useExisting"];
declare type UseKey = typeof useKeys[number];
interface ProviderMetadata {
    provide: Reference | DynamicValue | string;
    /** The key used by the provider  */
    useKey: UseKey;
    /** The content of the useKey */
    value: any;
}
export declare function getProviderMetadata(provider: Map<any, any>): ProviderMetadata | null;
export declare class Provider {
    protected workspace: WorkspaceSymbols;
    metadata: ProviderMetadata;
    constructor(workspace: WorkspaceSymbols, metadata: ProviderMetadata);
    get name(): string | undefined;
}
export declare class ProviderRegistry {
    private workspace;
    /** List of all the providers that are not injectables */
    private providers;
    constructor(workspace: WorkspaceSymbols);
    /** Record all providers in every NgModule, Component & Directive */
    recordAll(): void;
    /** Find all providers of a provider expression */
    recordProviders(expression: Expression | null): void;
    /** Get all providers from a list of providers in a decorator NgModule, Directive, Component */
    getAllProviders(expression: Expression | null): (InjectableSymbol | Provider)[];
    /** Return the provider for a token previously stored */
    getProvider(token: any): Provider | undefined;
}
export {};
