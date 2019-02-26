/**
 * Concurrent execution with retries.
 * @module concurrent
 */

let logger;
const RETRY_LIMIT = 2;

const request = async (batch) => {
  return new Promise((resolve, reject) => setTimeout(() => {
    // as an example, force a reject when the batch is 2
    if (batch === 2) reject();

    logger.log("debug", "batch", batch);
    resolve();
  }, batch * 250));
}

async function requestRetry (batch, iteration = 0) {
  try {
    return await request(batch);
  } catch (error) {
    if (iteration === RETRY_LIMIT) {
      return error;
    }
    return requestRetry(batch, iteration + 1);
  }
}

module.exports = async (app) => {
  // get the logger
  logger = app.modules.logger;
  logger.log("info", "running concurrent example");

  // https://philbooth.me/blog/back-off-and-retry-using-javascript-arrays-and-promises
  return Promise.all(
    [2, 1, 3].map(batch => requestRetry(batch))
  );
};
