# ng-app-counter

Count the number of Modules, Lazy Modules, Pipes, Providers, Directives, Components and Routes used in an Angular application.

This tool uses [ngast](https://github.com/ng-ast/ngast) and [quess-parser](https://github.com/guess-js/guess/tree/master/packages/guess-parser) for parse routers

<img width="300" src="https://raw.githubusercontent.com/irustm/ng-app-counter/master/assets/screenv050.png" alt="screen angular counter">

## Usage

```bash
npx ng-app-counter

# or to define a tsconfig
npx ng-app-counter -p ./project/tsconfig.json
```

Or
```
npm install --save-dev ng-app-counter


// package.json section scripts
 "scripts": {
    "count": "ng-app-counter",
    ...

```
Run `npm run count `

## Stat of use

<img src="https://raw.githubusercontent.com/irustm/ng-app-counter/master/assets/classes.jpg" alt="screen angular counter stat" width="800">

## License
MIT
