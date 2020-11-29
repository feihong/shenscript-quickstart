
/*
Copy of https://github.com/rkoeninger/ShenScript/blob/master/scripts/repl.js
This file isn't needed to run Shen code, but it isn't included in the bundle you get from npm
*/
const fs                    = require('fs');
const { addAsyncFunctions } = require('awaitify-stream');
const Shen                  = require('shen-script');

const InStream = class {
  constructor(stream, name) {
    this.name = name;
    this.stream = addAsyncFunctions(stream);
    this.buf = '';
    this.pos = 0;
  }
  async read() {
    if (this.pos < this.buf.length) {
      return this.buf[this.pos] === 13 ? (this.pos++, this.read()) : this.buf[this.pos++];
    }
    const b = await this.stream.readAsync();
    return b === null ? -1 : (this.buf = b, this.pos = 0, this.read());
  }
  close() { return this.stream.close(); }
};

const OutStream = class {
  constructor(stream, name) {
    this.name = name;
    this.stream = stream;
  }
  write(b) { return this.stream.write(String.fromCharCode(b)); }
  close() { return this.stream.close(); }
};

(async () => {
  const { caller, toList } = await new Shen({
    InStream,
    OutStream,
    openRead:  path => new InStream(fs.createReadStream(path), `filein=${path}`),
    openWrite: path => new OutStream(fs.createWriteStream(path), `fileout=${path}`),
    stinput:  new InStream(process.stdin, 'stinput'),
    stoutput: new OutStream(process.stdout, 'stoutput'),
    sterror:  new OutStream(process.stderr, 'sterror')
  });
  await caller('shen.x.launcher.main')(toList(['shen', 'repl']));
})();
