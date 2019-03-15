/**
 * http module example
 * @module http
 */

module.exports = async (app) => {
  if (app.config.http.root) {
    app.modules.logger.log("debug",
      `try http://${app.config.http.host}:${app.config.http.port}`);
  }

  if (app.config.http.rest) {
    // GET
    if (app.config.http.get) {
      // (simply setup app  object in app[app.config.http.get])
      app[app.config.http.get] = { date: new Date() };
      app.modules.logger.log("debug",
        `try http://${app.config.http.host}:${app.config.http.port}/${app.config.http.get}`);
    }
    // POST
    if (app.config.http.post) {
      app.modules.logger.log("debug", `${app.config.http.post}:`,
        app[app.config.http.post]);
    }
  }
};
