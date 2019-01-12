const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const findCacheDir = require('find-cache-dir');
const WebappWebpackPlugin = require('../');

const { logo, mkdir, generate } = require('./util');

test.beforeEach(async t => t.context.root = await mkdir());

test('should allow disabling caching', async t => {
  const dist = path.join(t.context.root, 'dist');

  await generate({
    context: t.context.root,
    output: {
      path: dist,
    },
    plugins: [new WebappWebpackPlugin({ logo, cache: false })],
  });

  const cache = findCacheDir({ name: 'webapp-webpack-plugin' });

  t.pass(!fs.existsSync(cache));
});

test.afterEach(t => fs.remove(t.context.root));
