/**
 * Serial execution with retries and rate limit
 * @module serial
 */

let logger;
const RETRY_LIMIT = 2;
const BACKOFF_INTERVAL = 1000;

const request = async (batch) => {
  return new Promise((resolve, reject) => setTimeout(() => {
    // as an example, force a reject when the batch is 2
    if (batch === 2) reject(2);

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

    if (error === 2) {
      return new Promise(resolve => {
        setTimeout(() => {
          requestRetry(batch, iteration + 1)
            .then(resolve);
        }, BACKOFF_INTERVAL);
      });
    }

    return requestRetry(batch, iteration + 1);
  }
}

module.exports = async (app) => {
  // get the logger
  logger = app.modules.logger;
  logger.log("info", "running serial example");

  // https://philbooth.me/blog/back-off-and-retry-using-javascript-arrays-and-promises
  return [2, 1, 3].reduce(async (promise, batch) => {
    let responses = await promise;
    responses.push(await requestRetry(batch));

    return responses;
  }, Promise.resolve([]));
};
