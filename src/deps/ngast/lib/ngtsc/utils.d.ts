import { ClassDeclaration as ngClassDeclaration, ClassMember } from '@angular/compiler-cli/src/ngtsc/reflection';
import { ClassDeclaration as tsClassDeclaration, Decorator, NodeArray } from 'typescript';
import { R3DependencyMetadata } from '@angular/compiler';
export declare const annotationNames: readonly ["NgModule", "Pipe", "Injectable", "Directive", "Component"];
export declare const annotationTheta: {
    ɵmod: string;
    ɵdir: string;
    ɵinj: string;
    ɵpipe: string;
    ɵcmp: string;
};
declare type ClassDeclaration = ngClassDeclaration | tsClassDeclaration;
export declare type AnnotationNames = typeof annotationNames[number];
export declare function getDecoratorName(decorator: Decorator): string | false;
/** Verify if class is decorated with an annotation */
export declare function hasLocalAnnotation(node: ClassDeclaration, name: AnnotationNames): boolean | undefined;
/** Vrify if the dts class has the static annotation */
export declare function hasDtsAnnotation(members: ClassMember[], name: AnnotationNames): boolean;
/** Get the name of the annotation of the local class if any */
export declare function getLocalAnnotation(decorators?: NodeArray<Decorator>): AnnotationNames | undefined;
/** Ge the name of the annotation of a dts class if any */
export declare function getDtsAnnotation(members?: ClassMember[]): AnnotationNames | undefined;
export declare function assertDeps(deps: R3DependencyMetadata[] | 'invalid' | null, name: string): asserts deps is R3DependencyMetadata[];
export declare const exists: <T>(value: T | null | undefined) => value is T;
export {};
