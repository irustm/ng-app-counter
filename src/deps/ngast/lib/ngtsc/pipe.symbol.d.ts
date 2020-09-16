import { Symbol } from './symbol';
export declare class PipeSymbol extends Symbol<'Pipe'> {
    protected readonly annotation = "Pipe";
    get deps(): import("@angular/compiler").R3DependencyMetadata[] | null;
    get metadata(): import("@angular/compiler").R3PipeMetadata;
    getDependencies(): (import("./injectable.symbol").InjectableSymbol | import("./module.symbol").NgModuleSymbol | import("./directive.symbol").DirectiveSymbol | import("./component.symbol").ComponentSymbol | PipeSymbol | import("./provider").Provider)[];
}
