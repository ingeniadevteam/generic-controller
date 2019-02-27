(development notes)

# Init the node project

```
mkdir generic-controller2
cd generic-controller2
# https://philna.sh/blog/2019/01/10/how-to-start-a-node-js-project/
```

# Use async-exit-hook

Uncaught exception handler and exit hooks using [async-exit-hook](https://github.com/tapppi/async-exit-hook) package.

# Publish npm packages

Created `clysema` npm account and published some packages like:

* [@clysema/jsonload](https://www.npmjs.com/package/@clysema/jsonload)
* [@clysema/env](https://www.npmjs.com/package/@clysema/env)
* [@clysema/logger](https://www.npmjs.com/package/@clysema/logger)

# Develop a package

Start [here](https://medium.freecodecamp.org/how-to-make-a-beautiful-tiny-npm-package-and-publish-it-2881d4307f78).

Take a look at some @clysema packages.

## 1. NPM init

Read [NPM.md](./NPM.md), create a fancy named folder and run `npm init` inside.

* Choose a package name like `@clysema/package_name` or whatever
* Write a description
* Setup the repository field when you have it

## 2. Write the validation file

The config file for the package will be something like:
```json
{
  "param1": 1,
  "param2": 2
}
```
(This config will be placed as the package_name.json file in the config directory of the app)

This config should be validated using joi:

package_name/validation.js
```js
const joi = require('joi');

const config = joi.object({
  param1: joi.string().required(),
  param2: joi.string().required(),
}).unknown();

module.exports = async function (obj) {
  // validate the config object
  const validation = joi.validate(obj, config);
  if (validation.error) {
    const errors = [];
    validation.error.details.forEach( detail => {
      errors.push(detail.message);
    });
    throw new Error(`client validation error: ${errors.join(", ")}`);
  }
  return validation.value;
};
```

## 3. Write the code

Start validating the config:

package_name/index.js
```js
const validation =  require("./validation");

module.exports = async (app) => {
  try {
    // load the json object using the jsonload app module
    const config = await app.modules.jsonload(`${app.path}/config/my_module.json`);
    // validate and setup the config in the app.config object
    app.config.my_module = await validation(config);
  } catch (e) {
    throw e;
  }

  // return the module functionality ...
  return app.config.my_module.param1 + app.config.my_module.param2;
};
```


## 4. Publish package or update

```
npm version [major,minor,patch]
npm publish .
```

## 5. Use the module in the app

app/loop.js
```js
let sum = 0;
try {
  sum = await app.modules.my_module(app);
  app.modules.logger.log("debug", sum);
} catch (e) {
  app.modules.logger.log("error", "my_module", e.message);
}
```
