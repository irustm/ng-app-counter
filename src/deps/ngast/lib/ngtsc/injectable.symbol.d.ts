import { Symbol } from './symbol';
export declare class InjectableSymbol extends Symbol<'Injectable'> {
    protected readonly annotation = "Injectable";
    get deps(): import("@angular/compiler").R3DependencyMetadata[] | "invalid" | null;
    get metadata(): import("@angular/compiler").R3InjectableMetadata;
    getDependencies(): (InjectableSymbol | import("./module.symbol").NgModuleSymbol | import("./directive.symbol").DirectiveSymbol | import("./component.symbol").ComponentSymbol | import("./pipe.symbol").PipeSymbol | import("./provider").Provider)[];
}
