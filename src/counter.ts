import * as minimist from 'minimist';
import { ProjectSymbols } from 'ngast';
import { resourceResolver } from './utils/resource';
import { ModuleTree } from './utils/module-tree';
import { existsSync } from 'fs';
import * as chalk from 'chalk';
ngcounter()
export function ngcounter() {
  const error = message => {
    console.error(chalk.default.bgRed.white(message));
    };
  const info = message => {
    console.error(chalk.default.green(message));
  }

  let projectPath = (minimist(process.argv.slice(2)) as any).p;
  if (!projectPath) {
    projectPath = './tsconfig.json';
  }
//   if (typeof projectPath !== 'string') {
//     error(
//       'Specify the path to the root "tsconfig" file of your project with the "-p" flag'
//     );
//     process.exit(1);
//   }
  if (!existsSync(projectPath)) {
    error('Cannot find tsconfig at "' + projectPath + '".');
    process.exit(1);
  }
  console.log('Parsing...');
  let parseError: any = null;
  const projectSymbols = new ProjectSymbols(
    projectPath,
    resourceResolver,
    e => (parseError = e)
  );
  const allModules = projectSymbols.getModules();
  const allPipes = projectSymbols.getPipes();
  const allProviders = projectSymbols.getProviders();
  const allDirectives = projectSymbols.getDirectives();
  const treeMod = new ModuleTree();
  if (!parseError) {
    info("Results:")    
    info(`Modules: ${allModules.length}`);
    if (allModules && allModules[0]) {
        info(`Lazy Modules: ${treeMod.getLazyModules(allModules[0]).length}`);
    }
    info(`Pipes: ${allPipes.length}`);
    info(`Providers: ${allProviders.length}`);
    let componentCounts = 0;
    //   let privateComponentCounts = 0;
    allDirectives.forEach(el => {
      try {
        if (el.isComponent()) {
          componentCounts += 1;
          //  if (el.symbol.name.indexOf('ɵ') !== -1) {
          //      privateComponentCounts += 1;
          //  }
        }
      } catch (e) {
        // exception only component
        componentCounts += 1;
        // console.log(el.symbol.name);
      }
    });
    info(`Directives: ${allDirectives.length - componentCounts}`);
    info(`Components: ${componentCounts}`);
    //   console.log(`privateComponentCounts: ${privateComponentCounts}`);
  } else {
    error(parseError);
  }
}
