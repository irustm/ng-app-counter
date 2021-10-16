"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLazyEntryPoints = exports.getModuleEntryPoint = exports.cleanModuleCache = exports.getModulePathFromRoute = exports.findMainModule = exports.collectRoutingModules = exports.findRootModule = exports.findRootModules = void 0;
const ts = require("typescript");
const path_1 = require("path");
const fs_1 = require("fs");
const routes_1 = require("./routes");
exports.findRootModules = (registry) => {
    const roots = getRootModules(registry);
    roots.length > 1 && console.log("Root Modules:", roots.length);
    return roots;
};
exports.findRootModule = (registry) => {
    const roots = getRootModules(registry);
    if (roots.length > 1) {
        throw new Error('Multiple root routing modules found ' + roots.join(', '));
    }
    return roots[0];
};
function getRootModules(registry) {
    const childModules = new Set();
    const traverseRoute = (route) => {
        if (route.module) {
            childModules.add(route.module);
        }
        route.children.forEach(traverseRoute);
    };
    const allModulePaths = Object.keys(registry);
    allModulePaths.forEach(path => {
        const declaration = registry[path];
        // It's possible if the declaration does not exist
        // See https://github.com/guess-js/guess/issues/311
        if (declaration) {
            declaration.eagerRoutes.forEach(traverseRoute);
            declaration.lazyRoutes.forEach(traverseRoute);
        }
    });
    return allModulePaths.filter(m => !childModules.has(m));
}
exports.collectRoutingModules = (rootFile, registry, result, parentFilePath = rootFile, currentRoutePath = '', existing = new Set()) => {
    const declaration = registry[rootFile];
    // It's possible if the declaration does not exist
    // See https://github.com/guess-js/guess/issues/311
    if (!declaration) {
        return;
    }
    const process = (r, routePath = currentRoutePath) => {
        if (r.module) {
            // tslint:disable-next-line: no-use-before-declare
            return processLazyRoute(r, routePath);
        }
        // tslint:disable-next-line: no-use-before-declare
        return processRoute(r, routePath);
    };
    const processRoute = (r, routePath = currentRoutePath) => {
        const path = (routePath + '/' + r.path).replace(/\/$/, '');
        r.children.forEach(route => process(route, path));
        if (!existing.has(path)) {
            const routingModule = {
                path,
                lazy: parentFilePath !== rootFile && r.redirectTo === undefined,
                modulePath: rootFile,
                parentModulePath: parentFilePath,
            };
            if (r.redirectTo !== undefined) {
                routingModule.redirectTo = r.redirectTo;
            }
            result.push(routingModule);
            existing.add(path);
        }
    };
    const processLazyRoute = (r, routePath = currentRoutePath) => {
        const path = (routePath + '/' + r.path).replace(/\/$/, '');
        r.children.forEach(route => process(route, path));
        exports.collectRoutingModules(r.module, registry, result, rootFile, path);
    };
    declaration.eagerRoutes.forEach(r => processRoute(r));
    declaration.lazyRoutes.forEach(r => processLazyRoute(r));
};
exports.findMainModule = (program) => {
    const tryFindMainModule = (n, sf) => {
        if (n.kind === ts.SyntaxKind.Identifier &&
            n.text === 'bootstrapModule') {
            const propAccess = n.parent;
            if (!propAccess ||
                propAccess.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                return null;
            }
            const tempExpr = propAccess.parent;
            if (!tempExpr || tempExpr.kind !== ts.SyntaxKind.CallExpression) {
                return null;
            }
            const expr = tempExpr;
            const module = expr.arguments[0];
            const tc = program.getTypeChecker();
            const symbol = tc.getTypeAtLocation(module).getSymbol();
            if (!symbol) {
                return null;
            }
            const decl = symbol.getDeclarations();
            if (!decl) {
                return null;
            }
            return path_1.resolve(decl[0].getSourceFile().fileName);
        }
        let mainPath = null;
        n.forEachChild(c => {
            if (mainPath) {
                return mainPath;
            }
            mainPath = tryFindMainModule(c, sf);
        });
        return mainPath;
    };
    return program.getSourceFiles().reduce((a, sf) => {
        if (a) {
            return a;
        }
        let mainPath = null;
        sf.forEachChild(n => {
            if (mainPath) {
                return;
            }
            mainPath = tryFindMainModule(n, sf);
        });
        return mainPath;
    }, null);
};
const isImportDeclaration = (node) => {
    return node.kind === ts.SyntaxKind.ImportDeclaration;
};
const isReExportDeclaration = (node) => {
    return (node.kind === ts.SyntaxKind.ExportDeclaration && node.exportClause === undefined);
};
const normalizeFilePath = (path) => {
    return path_1.join(...path.split(/\//).map((part, index) => (part === '' && index === 0) ? path_1.sep : part));
};
exports.getModulePathFromRoute = (parentPath, loadChildren, program, host) => {
    const childModule = loadChildren.split('#')[0];
    const { resolvedModule } = ts.resolveModuleName(childModule, parentPath, program.getCompilerOptions(), host);
    if (resolvedModule) {
        return normalizeFilePath(resolvedModule.resolvedFileName);
    }
    const childModuleFile = childModule + '.ts';
    const parentSegments = path_1.dirname(parentPath).split(path_1.sep);
    const childSegments = childModuleFile.split('/');
    const max = Math.min(parentSegments.length, childSegments.length);
    let maxCommon = 0;
    for (let i = 1; i < max; i += 1) {
        for (let j = 0; j < i; j += 1) {
            let common = 0;
            if (parentSegments[parentSegments.length - 1 - j] === childSegments[j]) {
                common++;
                maxCommon = Math.max(maxCommon, common);
            }
            else {
                // breaking here
                common = 0;
                j = i;
            }
        }
    }
    const path = path_1.join(path_1.dirname(parentPath), childModuleFile
        .split('/')
        .slice(maxCommon, childSegments.length)
        .join('/'));
    // This early failure provides better error message compared to the
    // generic "Multiple root routing modules" error.
    if (!fs_1.existsSync(path)) {
        throw new Error(`The relative path "${loadChildren}" to "${parentPath}" cannot be resolved to a module`);
    }
    return path;
};
const imports = (parent, child, program, host, importCache, visited = {}) => {
    if (importCache[parent] && importCache[parent][child] !== undefined) {
        return importCache[parent][child];
    }
    importCache[parent] = importCache[parent] || {};
    const sf = program.getSourceFile(parent);
    if (!sf) {
        importCache[parent][child] = false;
        return false;
    }
    if (visited[parent]) {
        importCache[parent][child] = false;
        return false;
    }
    visited[parent] = true;
    let found = false;
    sf.forEachChild(n => {
        if (found) {
            return;
        }
        if (!isImportDeclaration(n) && !isReExportDeclaration(n)) {
            return;
        }
        const path = n.moduleSpecifier.text;
        const { resolvedModule } = ts.resolveModuleName(path, parent, program.getCompilerOptions(), host);
        if (resolvedModule === undefined) {
            return;
        }
        const fullPath = normalizeFilePath(resolvedModule.resolvedFileName);
        if (fullPath === child) {
            found = true;
        }
        // We don't want to dig into node_modules to find an entry point.
        if (!found && fs_1.existsSync(fullPath) && !fullPath.includes('node_modules')) {
            found = imports(fullPath, child, program, host, importCache, visited);
        }
    });
    importCache[parent][child] = found;
    return found;
};
let cache = {};
exports.cleanModuleCache = () => (cache = {});
// This can potentially break if there's a lazy module
// that is not only loaded lazily but also imported
// inside of a parent module.
//
// For example, `app.module.ts` lazily loads `bar.module.ts`
// in the same time `app.module.ts` imports `bar.module.ts`
// this way the module entry point will be `app.module.ts`.
exports.getModuleEntryPoint = (path, entryPoints, program, host) => {
    const parents = [...entryPoints].filter(e => imports(e, path, program, host, cache));
    // If no parents, this could be the root module
    if (parents.length === 0) {
        return path;
    }
    if (parents.length > 1) {
        throw new Error(`Module ${path} belongs to more than one module: ${parents.join(', ')}`);
    }
    return parents[0];
};
exports.getLazyEntryPoints = (node, program, host) => {
    const value = routes_1.readLoadChildren(node, program.getTypeChecker());
    if (!value) {
        return null;
    }
    const parent = path_1.resolve(node.getSourceFile().fileName);
    const module = exports.getModulePathFromRoute(parent, value, program, host);
    return module;
};
//# sourceMappingURL=modules.js.map