"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRoutes = void 0;
const ts = require("typescript");
const fs_1 = require("fs");
const path_1 = require("path");
const modules_1 = require("./modules");
const routes_1 = require("./routes");
const defaultOptions = {
    redirects: false,
};
const normalizeOptions = (options) => (Object.assign(Object.assign({}, defaultOptions), options));
exports.parseRoutes = (tsconfig, exclude = [], inputOptions = {}) => {
    const options = normalizeOptions(inputOptions);
    modules_1.cleanModuleCache();
    const parseConfigHost = {
        fileExists: fs_1.existsSync,
        readDirectory: ts.sys.readDirectory,
        readFile: file => fs_1.readFileSync(file, 'utf8'),
        useCaseSensitiveFileNames: true
    };
    const config = ts.readConfigFile(tsconfig, path => fs_1.readFileSync(path).toString());
    const parsed = ts.parseJsonConfigFileContent(config.config, parseConfigHost, path_1.resolve(path_1.dirname(tsconfig)), {
        noEmit: true
    });
    const host = ts.createCompilerHost(parsed.options, true);
    const program = ts.createProgram(parsed.fileNames, parsed.options, host);
    const typeChecker = program.getTypeChecker();
    const toAbsolute = (file) => file.startsWith('/') || file.startsWith(process.cwd()) ? file : path_1.join(process.cwd(), file);
    const excludeFiles = new Set(exclude.map(toAbsolute));
    const visitTopLevelRoutes = (s, callback, n) => {
        if (excludeFiles.has(path_1.resolve(s.fileName))) {
            return;
        }
        if (!n) {
            return;
        }
        if (routes_1.isRoute(n, typeChecker, options.redirects)) {
            callback(n);
        }
        else {
            n.forEachChild(visitTopLevelRoutes.bind(null, s, callback));
        }
    };
    const mainPath = modules_1.findMainModule(program);
    if (!mainPath) {
        throw new Error('Cannot find the main application module');
    }
    const entryPoints = new Set([mainPath]);
    const collectEntryPoints = (n) => {
        const path = modules_1.getLazyEntryPoints(n, program, host);
        if (!path) {
            const childrenArray = routes_1.readChildren(n);
            if (childrenArray) {
                childrenArray.forEach(collectEntryPoints);
            }
            return;
        }
        entryPoints.add(path);
    };
    program.getSourceFiles().map(s => {
        s.forEachChild(visitTopLevelRoutes.bind(null, s, collectEntryPoints));
    });
    const registry = {};
    program.getSourceFiles().map(s => {
        s.forEachChild(visitTopLevelRoutes.bind(null, s, (n) => {
            const path = path_1.resolve(n.getSourceFile().fileName);
            const route = routes_1.getRoute(n, entryPoints, program, host);
            if (!route) {
                return;
            }
            const modulePath = modules_1.getModuleEntryPoint(path, entryPoints, program, host);
            const current = registry[modulePath] || {
                lazyRoutes: [],
                eagerRoutes: []
            };
            if (route.module) {
                current.lazyRoutes.push(route);
            }
            else {
                current.eagerRoutes.push(route);
            }
            registry[modulePath] = current;
        }));
    });
    const result = [];
    if (Object.keys(registry).length > 0) {
        const roots = modules_1.findRootModules(registry);
        for (const root of roots) {
            modules_1.collectRoutingModules(root, registry, result);
        }
    }
    return result;
};
//# sourceMappingURL=route-parser.js.map