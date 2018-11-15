#!/usr/bin/env node

const request = require('request');
const fs = require('fs');
const path = require('path');
const utils = require('./utils.js');
const argv = require('minimist')(process.argv.slice(2));
console.log(argv);

if (!process.env.MAKE_GIST_TOKEN) {
  console.log('No MAKE_GIST_TOKEN environment variable present.');
  process.exit(1);
}

const directory = path.resolve(argv._[0] || __dirname);
const description = argv.d || argv.description || 'made with https://github.com/mapsam/make-gist';
const allFiles = utils.getFiles(directory);
const files = utils.filterFiles(allFiles);
console.log(`Grabbing the following files from ${directory}:`);
files.forEach((file) => console.log(`- ${file.base}`));

utils.makeGist(files, description, (err, data) => {
  if (err) throw err;
  console.log(data.html_url);
});
