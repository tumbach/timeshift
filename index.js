import { PassThrough } from "node:stream";
import { pipeline } from "node:stream/promises";
import got from "got";
import nodeshout from "nodeshout";
import DelayStream from "./DelayStream.js";
import config from "./config.js";
const { delayHours, sourceUrl, destination, mounts } = config;

nodeshout.init();

let accumulatedDelay = 0;
let inputStream = requestStream(sourceUrl);
let streams = [];
const sortedMounts = mounts.sort((a, b) => a.localeCompare(b));
const sortedDelayHours = delayHours.sort((a, b) => a - b);

function requestStream(url) {
  console.log(`Connecting to ${url}...`)
  let input = got.stream(url);
  input.once('response', data => {
    console.log(`Connected.`)
  });
  input.once('error', err => {
    input.destroy();
    console.error(`Error connecting to Icecast source: ${err.message}`);
    requestStream(url); // Restart the input stream
  });
  input.once('retry', () => {
    console.log('Attempting to reconnect...');
  });
  return input;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

sortedDelayHours.map((delayHours, index) => {
  const shout = nodeshout.create();
  shout.setHost(destination.host);
  shout.setPort(destination.port);
  shout.setPassword(destination.password);
  shout.setMount(sortedMounts[index]);
  shout.setFormat(destination.format);
  console.log(`Connecting to mount ${sortedMounts[index]}...`);
  let errorCode = shout.open();
  if (errorCode < 0) {
    const error = getKeyByValue(nodeshout.ErrorTypes, errorCode);
    console.log(`Error while connecting to mount ${sortedMounts[index]}: ${error}`);
    return;
  }

  const delay = (delayHours - delayHours[index - 1] || 0) * 3600000;
  accumulatedDelay += delay;
  const delayStream = new DelayStream(accumulatedDelay);
  delayStream.on('data', async chunk => {
    shout.send(chunk, chunk.length);
    const delay = shout.delay();
    await sleep(delay);
  });
  streams.push(delayStream);
});

(async () => {
  try {
    await pipeline(
      inputStream,
      new PassThrough(), // catches HTTP errors
      ...streams
    );
    console.log('Pipeline exited');
  } catch (e) {
    console.error('Pipeline failed', e);
  }
})();
