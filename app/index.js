/**
 * App init, start and stop functions
 * @module app
 */

const env = require('@clysema/env');
const jsonload = require('@clysema/jsonload');
const logger = require('@clysema/logger');

const init = require('./init');
const loop = require('./loop');

const app = {
  config: {},
  modules: {}
};

module.exports = {
  init: async (path, exitHook) => {
    // setup app path
    app.path = path;
    // setup the exitHook
    app.exitHook = exitHook;
    // setup the jsonload function
    app.modules.jsonload = jsonload;
    try {
      // setup env module
      app.modules.env = await env();
      // load the logger module
      app.modules.logger = await logger(app);
      // call module init
      // load the app config
      app.config.app = await jsonload(`${app.path}/config/app.json`) || {};
    } catch (e) { console.log(e.message); }

    app.modules.logger.log("info", "app init");
    // call init
    try { await init(app); }
    catch (e) { app.modules.logger.log("error", "init", e); }
  },
  start: async () => {
    app.modules.logger.log("info", "app start");
    // run the loop
    try {
      await loop(app);
    } catch (e) {
      throw e;
    }
  },
  stop: async () => {
    app.modules.logger.log("info", "app stop");
  }
};
