/**
 * App init, start and stop functions
 * @module app
 */

const loop = require('./loop');


module.exports = {
  init: async (app) => {

    app.modules.logger.log("info", "app init");
  },
  start: async (app) => {
    app.modules.logger.log("info", "app start");
    // run the loop
    try {
      await loop(app);
    } catch (e) {
      throw e;
    }
  },
  stop: async (app) => {

    app.modules.logger.log("info", "app stop");
  }
};
