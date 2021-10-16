"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoute = exports.getRoute = exports.readChildren = exports.readLoadChildren = void 0;
const ts = require("typescript");
const ts_evaluator_1 = require("ts-evaluator");
const modules_1 = require("./modules");
const path_1 = require("path");
const getObjectProp = (node, prop) => {
    const vals = node.properties.values();
    for (const val of vals) {
        if (val.kind !== ts.SyntaxKind.PropertyAssignment) {
            continue;
        }
        const value = val;
        if (value.name.kind !== ts.SyntaxKind.Identifier) {
            continue;
        }
        const name = value.name.text;
        if (name === prop) {
            return value.initializer;
        }
    }
    return null;
};
exports.readLoadChildren = (node, typeChecker) => {
    const expr = getObjectProp(node, 'loadChildren');
    if (!expr) {
        return null;
    }
    if (expr.kind === ts.SyntaxKind.StringLiteral) {
        return expr.text;
    }
    let result = null;
    const visitor = (n) => {
        if (n.kind === ts.SyntaxKind.ImportKeyword) {
            const parent = n.parent;
            const arg = parent.arguments[0];
            const res = ts_evaluator_1.evaluate({
                node: arg,
                typeChecker: typeChecker
            });
            if (res.success) {
                result = res.value;
            }
        }
        if (result) {
            return;
        }
        n.forEachChild(visitor);
    };
    expr.forEachChild(visitor);
    // Fallback to when loadChildren looks like:
    // loadChildren: 'foo' + '/' + 'bar'
    if (!result) {
        const res = ts_evaluator_1.evaluate({
            node: expr,
            typeChecker: typeChecker
        });
        if (res.success) {
            result = res.value;
        }
    }
    return result;
};
const readPath = (node, typeChecker) => {
    const expr = getObjectProp(node, 'path');
    if (!expr) {
        return null;
    }
    const val = ts_evaluator_1.evaluate({
        node: expr,
        typeChecker
    });
    if (val.success) {
        return val.value;
    }
    return null;
};
const readRedirect = (node, typeChecker) => {
    const expr = getObjectProp(node, 'redirectTo');
    if (!expr) {
        return null;
    }
    const val = ts_evaluator_1.evaluate({
        node: expr,
        typeChecker
    });
    if (val.success) {
        return val.value;
    }
    return null;
};
exports.readChildren = (node) => {
    const expr = getObjectProp(node, 'children');
    if (!expr) {
        return null;
    }
    return expr.elements;
};
exports.getRoute = (node, entryPoints, program, host) => {
    const path = readPath(node, program.getTypeChecker());
    if (path === null) {
        return null;
    }
    const childrenArray = exports.readChildren(node);
    let children = [];
    if (childrenArray) {
        children = childrenArray
            .map(c => {
            if (c.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
                return null;
            }
            return exports.getRoute(c, entryPoints, program, host);
        })
            .filter(e => e !== null);
    }
    const route = { path, children };
    const redirectTo = readRedirect(node, program.getTypeChecker());
    if (redirectTo) {
        route.redirectTo = redirectTo;
    }
    const loadChildren = exports.readLoadChildren(node, program.getTypeChecker());
    if (loadChildren) {
        const parent = modules_1.getModuleEntryPoint(path_1.resolve(node.getSourceFile().fileName), entryPoints, program, host);
        const module = modules_1.getModulePathFromRoute(parent, loadChildren, program, host);
        return Object.assign(Object.assign({}, route), { module });
    }
    return route;
};
exports.isRoute = (n, typeChecker, redirects) => {
    if (n.kind !== ts.SyntaxKind.ObjectLiteralExpression ||
        !n.parent ||
        n.parent.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
        return false;
    }
    const objLiteral = n;
    const path = readPath(objLiteral, typeChecker) !== null;
    const redirectTo = redirects && readRedirect(objLiteral, typeChecker) !== null;
    const children = !!exports.readChildren(objLiteral);
    const loadChildren = !!exports.readLoadChildren(objLiteral, typeChecker);
    const component = !!getObjectProp(objLiteral, 'component');
    return (path && children) || (path && component) || (path && loadChildren) || (path && redirectTo);
};
//# sourceMappingURL=routes.js.map