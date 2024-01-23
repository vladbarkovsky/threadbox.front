# Introduction

Threadbox is anonymous imageboard for sharing texts and images.

# Getting Started

1. Clone `threadbox.front` repository. It is important to clone repository in the same directory as the `treadbox.api`, since api-client.ts and permissions.ts are generated by server to constant paths.

1. Install [Node Version Manager](https://github.com/nvm-sh/nvm#important-notes) (nvm).

1. Install Node.js 20.9.0 using nvm.

1. Install Angular CLI 17.0.8 `npm i @angular/cli@17.0.8`.

1. Install project dependencies `npm i`.

1. Allow untrusted SSL on localhost in your browser. If you are using Google Chrome, enable chrome://flags/#temporary-unexpire-flags-m118, reload browser, enable chrome://flags/#allow-insecure-localhost and reload again.

1. I you already launched server, compile client app `npm start`. Application local port is [4200](https://localhost:4200). The app will automatically reload if you change any of the source files.

1. For comfort development it is worth to install workspace recommended extensions for Visual Studio Code (type '@recommended' in Extensions search input). When installing Angular Language Service select v17.0.3.

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

TODO: Add icomoon guide
