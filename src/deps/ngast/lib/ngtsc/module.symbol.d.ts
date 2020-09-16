import { Symbol } from './symbol';
import type { DeclarationSymbol } from './find-symbol';
import type { ComponentSymbol } from './component.symbol';
export declare class NgModuleSymbol extends Symbol<'NgModule'> {
    protected readonly annotation = "NgModule";
    get deps(): import("@angular/compiler").R3DependencyMetadata[] | null;
    get metadata(): import("@angular/compiler").R3NgModuleMetadata;
    get scope(): import("@angular/compiler-cli/src/ngtsc/scope").LocalModuleScope | "error" | null;
    getDependencies(): (import("./injectable.symbol").InjectableSymbol | NgModuleSymbol | import("./directive.symbol").DirectiveSymbol | ComponentSymbol | import("./pipe.symbol").PipeSymbol | import("./provider").Provider)[];
    /**
     * Get the providers of the module as InjectableSymbol
     */
    getProviders(): (import("./injectable.symbol").InjectableSymbol | import("./provider").Provider)[];
    getDeclarations(): DeclarationSymbol[];
    getImports(): NgModuleSymbol[];
    getExports(): (import("./injectable.symbol").InjectableSymbol | NgModuleSymbol | import("./directive.symbol").DirectiveSymbol | ComponentSymbol | import("./pipe.symbol").PipeSymbol | undefined)[];
    getBootstap(): ComponentSymbol[];
}
