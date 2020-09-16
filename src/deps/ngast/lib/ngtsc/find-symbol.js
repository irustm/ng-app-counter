import { NgModuleSymbol } from './module.symbol';
import { InjectableSymbol } from './injectable.symbol';
import { DirectiveSymbol } from './directive.symbol';
import { ComponentSymbol } from './component.symbol';
import { PipeSymbol } from './pipe.symbol';
export var symbolFactory = {
    'NgModule': function (workspace, node) { return new NgModuleSymbol(workspace, node); },
    'Injectable': function (workspace, node) { return new InjectableSymbol(workspace, node); },
    'Directive': function (workspace, node) { return new DirectiveSymbol(workspace, node); },
    'Component': function (workspace, node) { return new ComponentSymbol(workspace, node); },
    'Pipe': function (workspace, node) { return new PipeSymbol(workspace, node); },
};
//# sourceMappingURL=find-symbol.js.map