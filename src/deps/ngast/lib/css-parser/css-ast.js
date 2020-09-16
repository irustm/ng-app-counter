/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { CssToken, CssTokenType } from './css-lexer';
export var BlockType;
(function (BlockType) {
    BlockType[BlockType["Import"] = 0] = "Import";
    BlockType[BlockType["Charset"] = 1] = "Charset";
    BlockType[BlockType["Namespace"] = 2] = "Namespace";
    BlockType[BlockType["Supports"] = 3] = "Supports";
    BlockType[BlockType["Keyframes"] = 4] = "Keyframes";
    BlockType[BlockType["MediaQuery"] = 5] = "MediaQuery";
    BlockType[BlockType["Selector"] = 6] = "Selector";
    BlockType[BlockType["FontFace"] = 7] = "FontFace";
    BlockType[BlockType["Page"] = 8] = "Page";
    BlockType[BlockType["Document"] = 9] = "Document";
    BlockType[BlockType["Viewport"] = 10] = "Viewport";
    BlockType[BlockType["Unsupported"] = 11] = "Unsupported";
})(BlockType || (BlockType = {}));
var CssAst = /** @class */ (function () {
    function CssAst(location) {
        this.location = location;
    }
    Object.defineProperty(CssAst.prototype, "start", {
        get: function () { return this.location.start; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CssAst.prototype, "end", {
        get: function () { return this.location.end; },
        enumerable: false,
        configurable: true
    });
    return CssAst;
}());
export { CssAst };
var CssStyleValueAst = /** @class */ (function (_super) {
    __extends(CssStyleValueAst, _super);
    function CssStyleValueAst(location, tokens, strValue) {
        var _this = _super.call(this, location) || this;
        _this.tokens = tokens;
        _this.strValue = strValue;
        return _this;
    }
    CssStyleValueAst.prototype.visit = function (visitor, context) { return visitor.visitCssValue(this); };
    return CssStyleValueAst;
}(CssAst));
export { CssStyleValueAst };
var CssRuleAst = /** @class */ (function (_super) {
    __extends(CssRuleAst, _super);
    function CssRuleAst(location) {
        return _super.call(this, location) || this;
    }
    return CssRuleAst;
}(CssAst));
export { CssRuleAst };
var CssBlockRuleAst = /** @class */ (function (_super) {
    __extends(CssBlockRuleAst, _super);
    function CssBlockRuleAst(location, type, block, name) {
        if (name === void 0) { name = null; }
        var _this = _super.call(this, location) || this;
        _this.location = location;
        _this.type = type;
        _this.block = block;
        _this.name = name;
        return _this;
    }
    CssBlockRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssBlock(this.block, context);
    };
    return CssBlockRuleAst;
}(CssRuleAst));
export { CssBlockRuleAst };
var CssKeyframeRuleAst = /** @class */ (function (_super) {
    __extends(CssKeyframeRuleAst, _super);
    function CssKeyframeRuleAst(location, name, block) {
        return _super.call(this, location, BlockType.Keyframes, block, name) || this;
    }
    CssKeyframeRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssKeyframeRule(this, context);
    };
    return CssKeyframeRuleAst;
}(CssBlockRuleAst));
export { CssKeyframeRuleAst };
var CssKeyframeDefinitionAst = /** @class */ (function (_super) {
    __extends(CssKeyframeDefinitionAst, _super);
    function CssKeyframeDefinitionAst(location, steps, block) {
        var _this = _super.call(this, location, BlockType.Keyframes, block, mergeTokens(steps, ',')) || this;
        _this.steps = steps;
        return _this;
    }
    CssKeyframeDefinitionAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssKeyframeDefinition(this, context);
    };
    return CssKeyframeDefinitionAst;
}(CssBlockRuleAst));
export { CssKeyframeDefinitionAst };
var CssBlockDefinitionRuleAst = /** @class */ (function (_super) {
    __extends(CssBlockDefinitionRuleAst, _super);
    function CssBlockDefinitionRuleAst(location, strValue, type, query, block) {
        var _this = _super.call(this, location, type, block) || this;
        _this.strValue = strValue;
        _this.query = query;
        var firstCssToken = query.tokens[0];
        _this.name = new CssToken(firstCssToken.index, firstCssToken.column, firstCssToken.line, CssTokenType.Identifier, _this.strValue);
        return _this;
    }
    CssBlockDefinitionRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssBlock(this.block, context);
    };
    return CssBlockDefinitionRuleAst;
}(CssBlockRuleAst));
export { CssBlockDefinitionRuleAst };
var CssMediaQueryRuleAst = /** @class */ (function (_super) {
    __extends(CssMediaQueryRuleAst, _super);
    function CssMediaQueryRuleAst(location, strValue, query, block) {
        return _super.call(this, location, strValue, BlockType.MediaQuery, query, block) || this;
    }
    CssMediaQueryRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssMediaQueryRule(this, context);
    };
    return CssMediaQueryRuleAst;
}(CssBlockDefinitionRuleAst));
export { CssMediaQueryRuleAst };
var CssAtRulePredicateAst = /** @class */ (function (_super) {
    __extends(CssAtRulePredicateAst, _super);
    function CssAtRulePredicateAst(location, strValue, tokens) {
        var _this = _super.call(this, location) || this;
        _this.strValue = strValue;
        _this.tokens = tokens;
        return _this;
    }
    CssAtRulePredicateAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssAtRulePredicate(this, context);
    };
    return CssAtRulePredicateAst;
}(CssAst));
export { CssAtRulePredicateAst };
var CssInlineRuleAst = /** @class */ (function (_super) {
    __extends(CssInlineRuleAst, _super);
    function CssInlineRuleAst(location, type, value) {
        var _this = _super.call(this, location) || this;
        _this.type = type;
        _this.value = value;
        return _this;
    }
    CssInlineRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssInlineRule(this, context);
    };
    return CssInlineRuleAst;
}(CssRuleAst));
export { CssInlineRuleAst };
var CssSelectorRuleAst = /** @class */ (function (_super) {
    __extends(CssSelectorRuleAst, _super);
    function CssSelectorRuleAst(location, selectors, block) {
        var _this = _super.call(this, location, BlockType.Selector, block) || this;
        _this.selectors = selectors;
        _this.strValue = selectors.map(function (selector) { return selector.strValue; }).join(',');
        return _this;
    }
    CssSelectorRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssSelectorRule(this, context);
    };
    return CssSelectorRuleAst;
}(CssBlockRuleAst));
export { CssSelectorRuleAst };
var CssDefinitionAst = /** @class */ (function (_super) {
    __extends(CssDefinitionAst, _super);
    function CssDefinitionAst(location, property, value) {
        var _this = _super.call(this, location) || this;
        _this.property = property;
        _this.value = value;
        return _this;
    }
    CssDefinitionAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssDefinition(this, context);
    };
    return CssDefinitionAst;
}(CssAst));
export { CssDefinitionAst };
var CssSelectorPartAst = /** @class */ (function (_super) {
    __extends(CssSelectorPartAst, _super);
    function CssSelectorPartAst(location) {
        return _super.call(this, location) || this;
    }
    return CssSelectorPartAst;
}(CssAst));
export { CssSelectorPartAst };
var CssSelectorAst = /** @class */ (function (_super) {
    __extends(CssSelectorAst, _super);
    function CssSelectorAst(location, selectorParts) {
        var _this = _super.call(this, location) || this;
        _this.selectorParts = selectorParts;
        _this.strValue = selectorParts.map(function (part) { return part.strValue; }).join('');
        return _this;
    }
    CssSelectorAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssSelector(this, context);
    };
    return CssSelectorAst;
}(CssSelectorPartAst));
export { CssSelectorAst };
var CssSimpleSelectorAst = /** @class */ (function (_super) {
    __extends(CssSimpleSelectorAst, _super);
    function CssSimpleSelectorAst(location, tokens, strValue, pseudoSelectors, operator) {
        var _this = _super.call(this, location) || this;
        _this.tokens = tokens;
        _this.strValue = strValue;
        _this.pseudoSelectors = pseudoSelectors;
        _this.operator = operator;
        return _this;
    }
    CssSimpleSelectorAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssSimpleSelector(this, context);
    };
    return CssSimpleSelectorAst;
}(CssSelectorPartAst));
export { CssSimpleSelectorAst };
var CssPseudoSelectorAst = /** @class */ (function (_super) {
    __extends(CssPseudoSelectorAst, _super);
    function CssPseudoSelectorAst(location, strValue, name, tokens, innerSelectors) {
        var _this = _super.call(this, location) || this;
        _this.strValue = strValue;
        _this.name = name;
        _this.tokens = tokens;
        _this.innerSelectors = innerSelectors;
        return _this;
    }
    CssPseudoSelectorAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssPseudoSelector(this, context);
    };
    return CssPseudoSelectorAst;
}(CssSelectorPartAst));
export { CssPseudoSelectorAst };
var CssBlockAst = /** @class */ (function (_super) {
    __extends(CssBlockAst, _super);
    function CssBlockAst(location, entries) {
        var _this = _super.call(this, location) || this;
        _this.entries = entries;
        return _this;
    }
    CssBlockAst.prototype.visit = function (visitor, context) { return visitor.visitCssBlock(this, context); };
    return CssBlockAst;
}(CssAst));
export { CssBlockAst };
/*
 a style block is different from a standard block because it contains
 css prop:value definitions. A regular block can contain a list of Ast entries.
 */
var CssStylesBlockAst = /** @class */ (function (_super) {
    __extends(CssStylesBlockAst, _super);
    function CssStylesBlockAst(location, definitions) {
        var _this = _super.call(this, location, definitions) || this;
        _this.definitions = definitions;
        return _this;
    }
    CssStylesBlockAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssStylesBlock(this, context);
    };
    return CssStylesBlockAst;
}(CssBlockAst));
export { CssStylesBlockAst };
var CssStyleSheetAst = /** @class */ (function (_super) {
    __extends(CssStyleSheetAst, _super);
    function CssStyleSheetAst(location, rules) {
        var _this = _super.call(this, location) || this;
        _this.rules = rules;
        return _this;
    }
    CssStyleSheetAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssStyleSheet(this, context);
    };
    return CssStyleSheetAst;
}(CssAst));
export { CssStyleSheetAst };
var CssUnknownRuleAst = /** @class */ (function (_super) {
    __extends(CssUnknownRuleAst, _super);
    function CssUnknownRuleAst(location, ruleName, tokens) {
        var _this = _super.call(this, location) || this;
        _this.ruleName = ruleName;
        _this.tokens = tokens;
        return _this;
    }
    CssUnknownRuleAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssUnknownRule(this, context);
    };
    return CssUnknownRuleAst;
}(CssRuleAst));
export { CssUnknownRuleAst };
var CssUnknownTokenListAst = /** @class */ (function (_super) {
    __extends(CssUnknownTokenListAst, _super);
    function CssUnknownTokenListAst(location, name, tokens) {
        var _this = _super.call(this, location) || this;
        _this.name = name;
        _this.tokens = tokens;
        return _this;
    }
    CssUnknownTokenListAst.prototype.visit = function (visitor, context) {
        return visitor.visitCssUnknownTokenList(this, context);
    };
    return CssUnknownTokenListAst;
}(CssRuleAst));
export { CssUnknownTokenListAst };
export function mergeTokens(tokens, separator) {
    if (separator === void 0) { separator = ''; }
    var mainToken = tokens[0];
    var str = mainToken.strValue;
    for (var i = 1; i < tokens.length; i++) {
        str += separator + tokens[i].strValue;
    }
    return new CssToken(mainToken.index, mainToken.column, mainToken.line, mainToken.type, str);
}
//# sourceMappingURL=css-ast.js.map