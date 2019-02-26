/**
 * Setup the app init, start and stop
 * @module main
 */

const exitHook = require('async-exit-hook');
const app = require('./app');

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
    app.stop();
  } catch (e) {
    console.error(`${process.title} stop`, e);
  }
});

// run a self invoked async function
(
  async () => {
    try {
      // call init with the current dir as root path reference
      await app.init(process.cwd(), exitHook);
    } catch (e) {
      console.error(`${process.title} init`, e);
      process.exit(1);
    }
    try {
      // call start
      await app.start();
    } catch (e) {
      console.error(`${process.title} app`, e);
    }
  }
)();
