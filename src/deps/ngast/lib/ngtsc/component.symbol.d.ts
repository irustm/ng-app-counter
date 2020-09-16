import { Symbol } from './symbol';
import { CssAst } from '../css-parser/css-ast';
export declare class ComponentSymbol extends Symbol<'Component'> {
    protected readonly annotation = "Component";
    private assertScope;
    get deps(): import("@angular/compiler").R3DependencyMetadata[] | "invalid" | null;
    get metadata(): Pick<import("@angular/compiler").R3ComponentMetadata, "host" | "template" | "styles" | "encapsulation" | "animations" | "viewProviders" | "relativeContextFilePath" | "i18nUseExternalIds" | "interpolation" | "changeDetection" | "name" | "type" | "internalType" | "typeArgumentCount" | "typeSourceSpan" | "deps" | "selector" | "queries" | "viewQueries" | "lifecycle" | "inputs" | "outputs" | "usesInheritance" | "fullInheritance" | "exportAs" | "providers">;
    getScope(): import("@angular/compiler-cli/src/ngtsc/scope").LocalModuleScope | "error" | null;
    /** Return the list of available selectors for the template */
    getSelectorScope(): string[];
    /** Return the list of pipe available for the template */
    getPipeScope(): string[];
    getProviders(): (import("./injectable.symbol").InjectableSymbol | import("./provider").Provider)[];
    getDependencies(): (import("./injectable.symbol").InjectableSymbol | import("./module.symbol").NgModuleSymbol | import("./directive.symbol").DirectiveSymbol | ComponentSymbol | import("./pipe.symbol").PipeSymbol | import("./provider").Provider)[];
    getStylesAst(): CssAst[] | null;
    getTemplateAst(): import("@angular/compiler").TmplAstNode[];
}
