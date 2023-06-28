# Introduction

Threadbox is anonymous imageboard for sharing texts and images.

# Getting Started

1. Clone `threadbox.front` repository. It is important to clone repository in the same directory as the `treadbox.api`, since the code for connecting to the server endpoints is generated by a constant path.

2. Install [Node Version Manager](https://github.com/nvm-sh/nvm#important-notes) (nvm).

3. Install Node.js 16.17.1 using nvm.

4. Install Angular command-line interface `npm install -g @angular/cli`.

5. Install project dependencies `npm i`.

6. I you already launched server, compile client app `npm start`. Application local port is [4200](http://localhost:4200). The app will automatically reload if you change any of the source files.

7. For comfort development it is worth to install recommended extensions for Visual Studio Code. When installing Angular Language Service select version 13.0.0.

Don't use Angular DevTools extension for Chrome - for unknown reasons it does not allow the app to work.

All endpoints that you add on server automatically generated by server on launch in Debug configuration. See `api-client.ts` file.

Prettier automatically formats all changes on creating local commits.

# Build and Test

TODO: Describe and show how to build your code and run the tests.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Icons

TODO: Normal icons will be added soon.

Use icons in .svg format. Icons folder path is `src/app/assets/icons`.

Example:

```
  <img
   src="assets/icons/iconmonstr-pencil-square-filled.svg"
   alt="iconmonstr-pencil-square-filled.svg"
   width="30"
  />
```
