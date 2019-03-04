/**
 * The app loop
 * @module loop
 */

const round = require('round-to');

const concurrent = require('./examples/concurrent');
const serial = require('./examples/serial');
const meteor = require('./examples/meteor');

module.exports = async (app) => {
  let t, sample_rate, mils, nextRun;
  // the loop
  while (true) {
    // get the time for rate pourposes
    t = process.hrtime();
    // setup a sample rate if not exist in app.config.app
    try { sample_rate = app.config.app.sample_rate }
    catch (e) { sample_rate = 3000; }


    // check some modules

    // the http (http/rest) module
    if (app.config.http) {
      // (simply setup app  object)
      app[app.config.http.app_vars] = { date: new Date() };

      app.modules.logger.log("debug",
        `HTTP server http://localhost:${app.config.http.port}`);
      if (app.config.http.rest) {
        app.modules.logger.log("debug",
          `REST endpoint http://localhost:${app.config.http.port}/${app.config.http.app_vars}`);
      }
    }

    // meteor module
    if (app.modules.meteor) {
      try { await meteor(app); }
      catch (e) { app.modules.logger.log("error", "meteor", e); }
    }

    // run the examples
    try { await concurrent(app); }
    catch (e) { app.modules.logger.log("error", "concurrent", e); }

    try { await serial(app); }
    catch (e) { app.modules.logger.log("error", "serial", e); }

    // setup next run
    t = process.hrtime(t);
    mils = t[0] * 1000 + t[1] / 1000000;
    nextRun = 0;
    if (mils < sample_rate) {
      nextRun = sample_rate - mils;
    }

    app.modules.logger.log("debug", "mils:", round(mils, 1), "next:",
      round(nextRun, 1), "rate:", round(mils + nextRun, 1));

    await new Promise(resolve => setTimeout(() => resolve(), nextRun));
  }
};
