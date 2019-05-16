/**
 * Install and load the configured modules
 * @module bootstrap
 */

const fs = require("fs");

const env = require('@clysema/env');
const jsonload = require('@clysema/jsonload');
const logger = require('@clysema/logger');

module.exports = async (app) => {
  // setup app.config object
  app.config = {};
  // setup default modules
  app.modules = {};
  app.modules.env = await env();
  app.modules.jsonload = await jsonload;
  app.modules.logger = await logger(app);

  app.modules.logger.log("info", "app bootstrap");

  // get a list of configured modules
  const configFiles = await fs.readdirSync(`${app.path}/config`);

  const reqs = configFiles.map( async (file) => {
    // get module_name
    const fileSplit = file.split('.');
    const module_name = fileSplit[0];
    const extension = fileSplit[fileSplit.length - 1];

    if (extension !== "json") return;

    // exclude logger and node-red config
    if (module_name === 'logger' || !module_name) return;
    if (module_name === 'node-red') {
      app.modules.logger.log('info', 'node-red config preset');
      return;
    };

    try {
      // load the app config
      app.config.app = await jsonload(`${app.path}/config/app.json`) || {};
    } catch (e) { app.modules.logger.log("warn", "config/app.json not found"); }

    // setup the new module
    try {
      // add module to the app object
      app.modules[module_name] = await require(`@clysema/${module_name}`)(app);
      // log loaded
      app.modules.logger.log('info', module_name, 'module loaded');
    } catch (e) {
      app.modules.logger.log('error', module_name, e.message);
    }

  });

  // http://stackabuse.com/node-js-async-await-in-es7/
  await Promise.all(reqs);

  app.modules.logger.log('info', 'all modules loaded');
};
