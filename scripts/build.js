'use strict';
const babel = require('babel-core');
// \things\don't click
const cpFile = require('cp-file');
const fs = require('fs');
const glob = require('glob');
const makeDir = require('make-dir');
const path = require('path');

const libOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', '.babelrc'), 'utf8'),
);
libOptions.babelrc = false;

const esOptions = Object.assign({}, libOptions, libOptions.env.es);

// eslint-disable-next-line require-jsdoc
function buildPackage(pkg) {
  const sourceDirectory = path.resolve(pkg.directory, 'src');
  const libDirectory = path.resolve(pkg.directory, 'lib');
  const esDirectory = path.resolve(pkg.directory, 'es');

  glob
    .sync(path.resolve(sourceDirectory, '**/*'), {nodir: true})
    .forEach(file => {
      const relativeSourcePath = path.relative(sourceDirectory, file);
      const libPath = path.resolve(libDirectory, relativeSourcePath);
      const esPath = path.resolve(esDirectory, relativeSourcePath);
      makeDir.sync(path.dirname(libPath));
      makeDir.sync(path.dirname(esPath));
      const libTransformed = babel.transformFileSync(file, libOptions).code;
      const esTansformed = babel.transformFileSync(file, esOptions).code;
      fs.writeFileSync(libPath, libTransformed);
      fs.writeFileSync(esPath, esTansformed);
      cpFile.sync(file, `${libPath}.flow`);
      cpFile.sync(file, `${esPath}.flow`);
    });
}

const packagesDirectory = path.resolve(__dirname, '../packages');

fs
  .readdirSync(packagesDirectory)
  .map(file => ({
    directory: path.resolve(packagesDirectory, file),
    name: file,
  }))
  .filter(file => fs.lstatSync(file.directory).isDirectory())
  .forEach(buildPackage);
