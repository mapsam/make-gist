const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports.filterFiles = (files) => {
  const ignore = [
    'package-lock.json',
    'yarn.lock',
    '.DS_Store'
  ];

  return files.filter((file) => {
    return !ignore.includes(file.base) && !fs.lstatSync(`${file.dir}/${file.base}`).isDirectory();
  });
};

module.exports.getFiles = (location) => {
  return fs.readdirSync(location).map((file) => path.parse(path.resolve(location, file)))
};

module.exports.makeGist = (files, title, callback) => {
  if (!files.length) return callback(new Error('No files provided.'));

  const requestBody = {
    description: title,
    public: false,
    files: {}
  };

  files.forEach((file) => {
    try {
      requestBody.files[file.base] = {
        content: fs.readFileSync(`${file.dir}/${file.base}`, 'utf-8')
      };
    } catch (err) {
      return callback(err);
    }
  });

  const params = {
    url: 'https://api.github.com/gists',
    json: requestBody,
    headers: {
      'Authorization': `token ${process.env.MAKE_GIST_TOKEN}`,
      'User-Agent': 'make-gist-npm'
    }
  };

  request.post(params, (err, response, body) => {
    if (err) throw err;
    if (response.statusCode !== 201) {
      return callback(new Error(`Recevied a ${response.statusCode}. ${JSON.stringify(body)}`));
    }
    return callback(null, body);
  });
};
