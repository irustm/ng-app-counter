import * as minimist from 'minimist';
import * as chalk from 'chalk';
import {existsSync} from 'fs';

export const error = message => {
    console.error(chalk.default.bgRed.white(message));
};
export const info = (message, count1?, count2?) => {
    console.log(
        chalk.default.green(message) +
        ` ${chalk.default.blue(count1)}` +
        ` ${count2 ? '/ ' + chalk.default.yellowBright(count2) : ''}`
    );
};

export function tryGetsProjectPath(): string {
    let projectPath = (minimist(process.argv.slice(2)) as any).p;
    if (!projectPath) {
        projectPath = './tsconfig.app.json';
    }

    if (!existsSync(projectPath)) {
        error('Cannot find tsconfig at "' + projectPath + '".');
        process.exit(1);
    }

    return projectPath;
}
