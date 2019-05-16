/**
 * Setup the app init, start and stop
 * @module main
 */

const exitHook = require('async-exit-hook');
const bootstrap = require('./bootstrap');
const app = require('./app');

// setup the app.path
app.path = process.cwd();

// setup the exitHook
app.exitHook = exitHook;

// setup the process title
process.title = process.env.npm_package_name || "controller";

// setup an uncaught exception handler
exitHook.uncaughtExceptionHandler(err => {
  console.log(`${process.env.npm_package_name} Uncaught Exception:`, err);
  process.exit(1);
});

// setup an exit hook to call app.stop()
exitHook(() => {
  try {
    app.stop(app);
  } catch (e) {
    console.error(`${process.title} stop`, e);
  }
});

// run a self invoked async function
(
  async () => {
    try {
      // bootstrap the app
      await bootstrap(app);
    } catch (e) {
      console.error(`${process.title} bootstrap`, e);
      process.exit(1);
    }
    try {
      // call init
      await app.init(app);
    } catch (e) {
      console.error(`${process.title} init`, e);
      process.exit(1);
    }
    try {
      // call start
      await app.start(app);
    } catch (e) {
      console.error(`${process.title} app`, e);
    }
  }
)();
