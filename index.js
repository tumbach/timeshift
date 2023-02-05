import { Transform } from "node:stream";
import request from "request";
import nodeshout from "nodeshout";

import config from "./config.js";
const { delayHours, sourceUrl, destination, mounts } = config;

class DelayStream extends Transform {
  constructor(delay) {
    super();
    this.buffer = [];
    this.startTime = Date.now();
    this.delay = delay;
  }

  _transform(chunk, encoding, callback) {
    this.buffer.push(chunk);
    const now = Date.now();
    if (now - this.startTime >= this.delay) {
      this.push(this.buffer.shift());
    }
    callback();
  }
}

let previousDelay = 0;
let input = request(sourceUrl);

input.on('error', err => {
  console.error(`Error connecting to Icecast source: ${err.message}`);
  console.log('Attempting to reconnect...');

  // Restart the input stream
  input = request(sourceUrl);
});

delayHours.forEach((delayHours, index) => {
  const delay = (delayHours - delayHours[index - 1] || 0) * 3600000;
  previousDelay += delay;
  const delayStream = new DelayStream(previousDelay);

  const shout = nodeshout.create();
  shout.setHost(destination.host);
  shout.setPort(destination.port);
  shout.setPassword(destination.password);
  shout.setMount(mounts[index]);
  shout.setFormat(destination.format);
  shout.open();

  input
    .pipe(delayStream)
    .on('data', chunk => {
      shout.send(chunk, chunk.length);
      shout.sync();
    });
});
