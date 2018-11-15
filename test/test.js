const test = require('tape');
const nock = require('nock');
const path = require('path');
const utils = require('../utils.js');

test('[utils] getFiles - gets all files from a directory', (assert) => {
  const base = path.resolve(__dirname);
  const expected = [
    {
      root: '/',
      dir: `${base}/fixtures`,
      base: '.DS_Store',
      ext: '',
      name: '.DS_Store'
    },
    {
      root: '/',
      dir: `${base}/fixtures`,
      base: 'package-lock.json',
      ext: '.json',
      name: 'package-lock'
    },
    {
      root: '/',
      dir: `${base}/fixtures`,
      base: 'something.txt',
      ext: '.txt',
      name: 'something'
    },
    {
      root: '/',
      dir: `${base}/fixtures`,
      base: 'test-directory',
      ext: '',
      name: 'test-directory'
    }
  ];
  const files = utils.getFiles(__dirname + '/fixtures');
  assert.deepEqual(files, expected, 'expected files');
  assert.end();
});

test('[utils] filterFiles - filters all files', (assert) => {
  const base = path.resolve(__dirname);
  const input = utils.getFiles(__dirname + '/fixtures');

  const expected = [
    {
      root: '/',
      dir: `${base}/fixtures`,
      base: 'something.txt',
      ext: '.txt',
      name: 'something'
    }
  ];

  const files = utils.filterFiles(input);
  assert.deepEqual(files, expected, 'expected files');
  assert.end();
});

test('[utils] makeGist - fails with no files', (assert) => {
  const base = path.resolve(__dirname);

  const input = [];

  utils.makeGist(input, (err, body) => {
    assert.ok(err);
    assert.equal(err.message, 'No files provided.');
    assert.end();
  });
});


test('[utils] makeGist - fails with no MAKE_GIST_TOKEN present', (assert) => {
  const base = path.resolve(__dirname);
  nock('https://api.github.com')
    .post('/gists')
    .reply(401, { message: 'Bad credentials', documentation_url: 'https://developer.github.com/v3' });

  const input = [
    {
      root: '/',
      dir: `${base}/fixtures`,
      base: 'something.txt',
      ext: '.txt',
      name: 'something'
    }
  ];

  utils.makeGist(input, (err, body) => {
    assert.ok(err);
    assert.equal(err.message, 'Recevied a 401. {"message":"Bad credentials","documentation_url":"https://developer.github.com/v3"}');
    assert.end();
  });
});

test('[utils] makeGist - success', (assert) => {
  process.env.MAKE_GIST_TOKEN = 'fake-token';
  const base = path.resolve(__dirname);
  nock('https://api.github.com')
    .post('/gists', function() {
      assert.equal(this.headers.authorization, 'token fake-token');
      assert.equal(this.body, '{"description":"created with \\"make gist\\"","public":false,"files":{"something.txt":{"content":"This is something\\n"}}}');
      return true;
    })
    .reply(201, { html_url: 'https://gist.github.com/1234' });

  const input = [
    {
      root: '/',
      dir: `${base}/fixtures`,
      base: 'something.txt',
      ext: '.txt',
      name: 'something'
    }
  ];

  utils.makeGist(input, (err, body) => {
    assert.ifError(err);
    assert.deepEqual(body, { html_url: 'https://gist.github.com/1234' });
    assert.end();
  });
});
