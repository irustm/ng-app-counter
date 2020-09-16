import { Declaration } from 'typescript';
import { ClassDeclaration } from '@angular/compiler-cli/src/ngtsc/reflection';
import { TraitCompiler, ClassRecord } from '@angular/compiler-cli/src/ngtsc/transform';
import { AnnotationNames } from './utils';
/** TraitCompiler with friendly interface */
export declare class NgastTraitCompiler extends TraitCompiler {
    /** Perform analysis for one node */
    analyzeNode(node: ClassDeclaration<Declaration>): void;
    resolveNode(node: ClassDeclaration<Declaration>): void;
    allRecords(annotation?: AnnotationNames): ClassRecord[];
}
