'use strict';

const fs = require('fs');
const resolve = require('path').resolve;
const cp = require('child_process');

// load all configured modules
const config = resolve(__dirname, 'config');
const configFiles = fs.readdirSync(config).map( (file) => {
  const splited = file.split('.');
  return {
    name: splited[0],
    ext: splited[splited.length - 1]
  };
});

for (let file of configFiles) {
  if (file.name === 'logger' || file.name === 'node-red'
      || file.name === 'app' || file.ext !== "json")
    continue;
  const result = cp.spawnSync('npm', ['install', `@clysema/${file.name}`]);
  if (result.status !== 0) {
    if (result.stderr) {
      console.error(`${result.stderr}`);
    }
  }
}
