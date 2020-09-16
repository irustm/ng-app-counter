import {
    DirectiveSymbol,
    PipeSymbol,
    WorkspaceSymbols,
    NgModuleSymbol,
    InjectableSymbol,
    ComponentSymbol
} from './deps/ngast';
import {ClassRecord} from "@angular/compiler-cli/src/ngtsc/transform";
import {info, tryGetsProjectPath} from "./utils";
import {LazyRoute} from "@angular/compiler-cli/src/ngtsc/routing/src/analyzer";

export function ngcounter() {
    const projectPath = tryGetsProjectPath();

    const workspace = new WorkspaceSymbols(projectPath);

    console.log('Parsing...');

    const allModules: NgModuleSymbol[] = workspace.getAllModules();
    const allPipes: PipeSymbol[] = workspace.getAllPipes();
    const allInjectables: InjectableSymbol[] = workspace.getAllInjectable();
    const allDirectives: DirectiveSymbol[] = workspace.getAllDirectives();
    const allComponents: ComponentSymbol[] = workspace.getAllComponents();
    const classes: ClassRecord[] = workspace.getClassRecords();
    const listLazyRoutes: LazyRoute[] =  workspace.routeAnalyzer.listLazyRoutes();

    info(`Modules:`, allModules.length);
    info(`Lazy Routes:`, listLazyRoutes.length);
    info(`Pipes:`, allPipes.length);
    info(`Directives:`, allDirectives.length);
    info(`Components:`, allComponents.length);
    info(`Injectables:`, allInjectables.length);
    info(`Classes:`, classes.length);
}
