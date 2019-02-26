/**
 * Install and load the configured modules
 * @module init
 */

const fs = require("fs");

module.exports = async (app) => {
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

    // try to get the file
    let configObject;
    try {
      // load config
      const path = `${app.path}/config/${module_name}.json`;
      if (fs.existsSync(path)) {
        // load the config using the app.modules.jsonload modules
        configObject = await app.modules.jsonload(path);
      } else {
        configObject = {};
      }
    } catch (e) {
      throw e;
    }

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
