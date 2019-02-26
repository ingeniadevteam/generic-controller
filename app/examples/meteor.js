/**
 * Sends test data to the meteor server
 * @module meteor
 */

module.exports = async (app) => {
  let result;
  app.modules.logger.log("info", "running meteor example");
  // call a meteor method
  if (app.modules.meteor.userId) {
    try {
      result = await app.modules.meteor.call('station.bts_update', {
        mac: app.config.meteor.creds.password,
        state: {
          TEST: {
            "TEST1": 1
          }
        }
      });
      app.modules.logger.log("debug", "meteor result:", result);
    } catch (e) {
      app.modules.logger.log("error", "meteor", e.message);
    }
  }
};
