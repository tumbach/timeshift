import { Transform } from "node:stream";

export default class DelayStream extends Transform {
  constructor(delay) {
    super();
    this.buffer = [];
    this.startTime = Date.now();
    this.delay = delay;
  }

  _transform(chunk, encoding, callback) {
    console.log(chunk, encoding);
    this.buffer.push(chunk);
    const now = Date.now();
    if (now - this.startTime >= this.delay) {
      this.push(this.buffer.shift());
    }
    callback();
  }
}
