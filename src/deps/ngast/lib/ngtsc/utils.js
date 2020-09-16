import { isCallExpression } from 'typescript';
import { AssertionError } from 'assert';
export var annotationNames = ['NgModule', 'Pipe', 'Injectable', 'Directive', 'Component'];
export var annotationTheta = {
    'ɵmod': 'NgModule',
    'ɵdir': 'Directive',
    'ɵinj': 'Injectable',
    'ɵpipe': 'Pipe',
    'ɵcmp': 'Component',
};
export function getDecoratorName(decorator) {
    var expression = decorator.expression;
    return isCallExpression(expression) && expression.expression.getText();
}
/** Verify if class is decorated with an annotation */
export function hasLocalAnnotation(node, name) {
    var _a;
    return (_a = node.decorators) === null || _a === void 0 ? void 0 : _a.some(function (decorator) { return getDecoratorName(decorator) === name; });
}
/** Vrify if the dts class has the static annotation */
export function hasDtsAnnotation(members, name) {
    return members === null || members === void 0 ? void 0 : members.some(function (m) { return m.isStatic && m.name in annotationTheta; });
}
/** Get the name of the annotation of the local class if any */
export function getLocalAnnotation(decorators) {
    return decorators === null || decorators === void 0 ? void 0 : decorators.map(getDecoratorName).find(function (name) { return annotationNames.includes(name); });
}
/** Ge the name of the annotation of a dts class if any */
export function getDtsAnnotation(members) {
    var member = members === null || members === void 0 ? void 0 : members.find(function (m) { return m.isStatic && m.name in annotationTheta; });
    return member ? annotationTheta[member.name] : undefined;
}
export function assertDeps(deps, name) {
    if (!deps || deps === 'invalid') {
        throw new AssertionError({ message: "Invalid depenancies in \"" + name + "\"." });
    }
}
export var exists = function (value) { return !!(value !== null && value !== void 0 ? value : false); };
//# sourceMappingURL=utils.js.map