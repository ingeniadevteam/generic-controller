'use strict';

const fs = require('fs');
const resolve = require('path').resolve;
const cp = require('child_process');

// load all configured modules
const config = resolve(__dirname, 'config');
const configFiles = fs.readdirSync(config).map( (file) => {
  return file.split('.')[0];
});

for (let file of configFiles) {
  if (file === 'logger' || file === 'node-red') continue;
  const result = cp.spawnSync('npm', ['install', `@clysema/${file}`]);
  if (result.status !== 0) {
    if (result.stderr) {
      console.error(`${result.stderr}`);
    }
  }
}
