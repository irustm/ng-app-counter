import * as minimist from 'minimist';
import * as chalk from 'chalk';
import { existsSync } from 'fs';
import { ProjectSymbols, DirectiveSymbol, ProviderSymbol, PipeSymbol, ModuleSymbol } from 'ngast';

import { resourceResolver } from './utils/resource';
import { ModuleTree } from './utils/module-tree';

export function ngcounter() {
  const error = message => {
    console.error(chalk.default.bgRed.white(message));
    };
  const info = (message, count1?, count2?) => {
    console.log(chalk.default.green(message)
      + ` ${count1 ? chalk.default.blue(count1) : ''}`
      + ` ${count2 ? '/ ' + chalk.default.yellowBright(count2) : ''}`
    );
  }

  let projectPath = (minimist(process.argv.slice(2)) as any).p;
  if (!projectPath) {
    projectPath = './tsconfig.json';
  }
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

  const allModules: ModuleSymbol[] = projectSymbols.getModules();
  const allPipes: PipeSymbol[] = projectSymbols.getPipes();
  const allProviders: ProviderSymbol[] = projectSymbols.getProviders();
  const allDirectives: DirectiveSymbol[] = projectSymbols.getDirectives();
  const treeMod = new ModuleTree();
  
  if (!parseError) {
    console.log("")
    console.log("Results:")
    console.log("")
    // Count modules
    let ng_nodeModules = allModules.filter(el => el.symbol.filePath.indexOf('node_modules') !== -1);
    info(`Modules:`, allModules.length - ng_nodeModules.length, ng_nodeModules.length);
    // Count lazy modules
    if (allModules && allModules[0]) {
        info(`Lazy Modules: `, treeMod.getLazyModules(allModules[0]).length);
    }
    
    // Count pipes
    let pipes_nodeModules = allPipes.filter(el => el.symbol.filePath.indexOf('node_modules') !== -1);
    info(`Pipes: `, allPipes.length - pipes_nodeModules.length, pipes_nodeModules.length);
    // info2(`Pipes from node_modules: ${}`);
  

    let componentCounts = 0;
    let node_modules_componentCounts = 0;
    let node_modules_DirectivesCounts = 0;
    //   let privateComponentCounts = 0;
    allDirectives.forEach(el => {
      try {
        if (el.isComponent()) {
          // Component
          componentCounts += 1;
          if (el.symbol.filePath.indexOf('node_modules') !== -1) {
            node_modules_componentCounts += 1;
          }
        } else {
          // Directive
          if (el.symbol.filePath.indexOf('node_modules') !== -1) {
            node_modules_DirectivesCounts += 1;
          }
        }
      } catch (e) {
        // Component
        // exception only component
        componentCounts += 1;
        if (el.symbol.filePath.indexOf('node_modules') !== -1) {
          node_modules_componentCounts += 1;
        }
      }
    });
    
    info(`Directives: `, allDirectives.length - componentCounts - node_modules_DirectivesCounts, node_modules_DirectivesCounts);
    info(`Components: `, componentCounts - node_modules_componentCounts, node_modules_componentCounts);
    
    // Count providers
    info(`Providers: ${allProviders.length}`);
    console.log(``);
    info('', 24, 12)
    console.log(`Blue - in project`);
    console.log(`Yellow - in node_modules`);
  } else {
    error(parseError);
  }
}
