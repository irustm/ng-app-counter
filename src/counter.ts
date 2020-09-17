import {
    DirectiveSymbol,
    PipeSymbol,
    WorkspaceSymbols,
    NgModuleSymbol,
    InjectableSymbol,
    ComponentSymbol
} from './deps/ngast';
import {ClassRecord} from "@angular/compiler-cli/src/ngtsc/transform";
import { info, tryGetsProjectPath} from "./utils";
import { parseAngularRoutes } from "guess-parser";
import {trySendData, sendData} from "./send";

export function ngcounter() {
    const projectPath = tryGetsProjectPath();

    const workspace = new WorkspaceSymbols(projectPath);

    console.log('\nParse modules...\n');

    const allModules: NgModuleSymbol[] = workspace.getAllModules();
    const allPipes: PipeSymbol[] = workspace.getAllPipes();
    const allInjectables: InjectableSymbol[] = workspace.getAllInjectable();
    const allDirectives: DirectiveSymbol[] = workspace.getAllDirectives();
    const allComponents: ComponentSymbol[] = workspace.getAllComponents();
    const classes: ClassRecord[] = workspace.getClassRecords();

    info(`Modules:`, allModules.length);
    info(`Pipes:`, allPipes.length);
    info(`Directives:`, allDirectives.length);
    info(`Components:`, allComponents.length);
    info(`Injectables:`, allInjectables.length);
    info(`Classes:`, classes.length);

    console.log("\nParse routes...\n");
    let lazyRoutesLength = 0;
    let allRoutesLength = 0;

    try {
        const allRoutes = parseAngularRoutes(projectPath) || [];

        const lazyRoutes = allRoutes.filter(r => r.lazy);

        info(`All routes:`, allRoutesLength = allRoutes.length);
        info(`Lazy routes:`, lazyRoutesLength = lazyRoutes.length);

    } catch (e) {
        console.error(e);
    }

    trySendData({
        allModules: allModules.length,
        allPipes: allPipes.length,
        allDirectives: allDirectives.length,
        allComponents: allComponents.length,
        allInjectables: allInjectables.length,
        classes: classes.length,
        allRoutes: allRoutesLength,
        lazyRoutes: lazyRoutesLength
    });
}
