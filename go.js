const fs = require('fs')
const fsa = require('fs').promises;
const Shen = require('shen-script');

(async () => {
  // console.log(process.argv);
  const filename = process.argv[2];
  if (!filename) {
    console.log('No filename given');
    return;
  }
  const exists = fs.existsSync(filename)
  if (!exists) {
    console.log(`"${filename}" doesn't exist`);
    return;
  }
  const source = await fsa.readFile(filename, { encoding: 'utf8' });
  const shen = await new Shen({});
  await shen.exec(source);
})();
