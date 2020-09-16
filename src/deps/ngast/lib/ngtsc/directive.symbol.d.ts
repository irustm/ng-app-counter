import { Symbol } from './symbol';
export declare class DirectiveSymbol extends Symbol<'Directive'> {
    protected readonly annotation = "Directive";
    get deps(): import("@angular/compiler").R3DependencyMetadata[] | "invalid" | null;
    get metadata(): import("@angular/compiler").R3DirectiveMetadata;
    getProviders(): (import("./injectable.symbol").InjectableSymbol | import("./provider").Provider)[];
    getDependencies(): (import("./injectable.symbol").InjectableSymbol | import("./module.symbol").NgModuleSymbol | DirectiveSymbol | import("./component.symbol").ComponentSymbol | import("./pipe.symbol").PipeSymbol | import("./provider").Provider)[];
}
