import { ModuleSymbol } from 'ngast';
import { isAbsolute, normalize, join, sep } from 'path';
import { Trie } from './trie';

export const getId = (symbol: { name: string; filePath: string }) => {
  return `${symbol.filePath}#${symbol.name}`;
};
const ModuleIndex = new Trie<ModuleSymbol>((str: string) => str.split(/\/|#/));

export class ModuleTree {
  getLazyModules(model: ModuleSymbol): string[] {
    const summary = model.getModuleSummary();
    if (!summary) {
      return [];
    } else {
      const routes = summary.providers.filter(s => {
        return s.provider.token.identifier && s.provider.token.identifier.reference.name === 'ROUTES';
      });
      if (!routes) {
        return [];
      }
      const currentDeclarations = routes.pop();
      if (!currentDeclarations) {
        return [];
      } else {
        const declarations = currentDeclarations.provider.useValue as any[];
        if (!declarations) {
          return [];
        } else {
          const result: string[] = [];
          _collectLoadChildren(declarations)
            .map(loadChildren => this._loadChildrenToSymbolId(model, loadChildren))
            // .map(id => ModuleIndex.get(id))
            .forEach(d => {
              // Add to result array only if there is not
              // This is because duplicities stop drawing related modules
              if (d && result.indexOf(d) === -1) { result.push(d); }
            });
          return result;
        }
      }
    }
  }
  private _loadChildrenToSymbolId(model: ModuleSymbol, moduleUri: string) {
    const currentPath = model.symbol.filePath;
    const moduleUriParts = moduleUri.split('#');
    if (!/\.js|\.ts/.test(moduleUriParts[0])) {
      moduleUriParts[0] = moduleUriParts[0] + '.ts';
    }
    if (!isAbsolute(moduleUriParts[0])) {
      const parentParts = currentPath.split('/');
      parentParts.pop();
      const childParts = moduleUriParts[0].split('/');
      let longestMatch = 0;
      // console.log(moduleUriParts[0], currentPath);
      const findLongestPrefix = (a: string[], b: string[], astart: number, bstart: number) => {
        const max = Math.min(a.length - astart, b.length - bstart);
        let matchLen = 0;
        for (let i = 0; i < max; i += 1) {
          if (a[i + astart] === b[i + bstart]) {
            matchLen += 1;
          } else {
            return matchLen;
          }
        }
        return matchLen;
      };
      for (let i = 0; i < parentParts.length; i += 1) {
        for (let j = 0; j < childParts.length; j += 1) {
          const currentPrefix = findLongestPrefix(parentParts, childParts, i, j);
          if (currentPrefix > longestMatch) {
            longestMatch = currentPrefix;
          }
        }
      }
      const parentPath = parentParts.slice(0, parentParts.length - longestMatch).join('/');
      moduleUriParts[0] = normalize(join(parentPath, moduleUriParts[0]))
      .split(sep)
      .join('/');
    }
    return getId({
      name: moduleUriParts[1],
      filePath: moduleUriParts[0]
    });
  }
}
function _collectLoadChildren(routes: any[]): string[] {
  return routes.reduce((m, r) => {
    if (r.loadChildren && typeof r.loadChildren === 'string') {
      return m.concat(r.loadChildren);
    } else if (Array.isArray(r)) {
      return m.concat(_collectLoadChildren(r));
    } else if (r.children) {
      return m.concat(_collectLoadChildren(r.children));
    } else {
      return m;
    }
  }, []);
}

