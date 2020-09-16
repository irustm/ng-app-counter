import { CssParser } from './css-parser';
export var parseCss = function (text) {
    var parser = new CssParser();
    return parser.parse(text, '').ast;
};
//# sourceMappingURL=parse-css.js.map