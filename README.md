# Generic Controller

## Description

An "easy to use", configuration based, generic controller app skeleton for Linux/Systemd devices.

## Features

* App skeleton with init, start and stop functions.
* Uncaught exception handler and exit hooks using async-exit-hook package.
* App uses env, jsonload and logger @clysema packages to init the app.
* You _must_ create a `config` folder that is gitignored.
* The `config` folder is used to configure the @clysema app packages in json format.
* The init function loads the configured packages into the app object.
* npm-preinstall takes care of installing the required packages.
* The start function runs the `loop.js` at app.config.sample_rate.
* The `lib` folder should contain the app code.

## Examples

There is some examples in the `examples` folder.

* Concurrent process
* Serial process
* Meteor method call


## Usage

```bash
npm install
npm run dev
```
