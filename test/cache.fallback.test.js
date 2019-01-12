const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const findCacheDir = require('find-cache-dir');
const WebappWebpackPlugin = require('../');

const { logo, mkdir, generate } = require('./util');

test.beforeEach(async t => t.context.root = await mkdir());

test('should cache assets', async t => {
  const plugin = new WebappWebpackPlugin({ logo });

  await generate({
    context: t.context.root,
    output: {
      path: path.join(t.context.root, 'dist'),
    },
    plugins: [plugin],
  });

  const cache = path.resolve(t.context.root, '.wwp-cache');

  t.pass(fs.existsSync(cache));
  t.pass(fs.lstatSync(cache).isDirectory());
  t.pass(fs.readdirSync(cache).length);
});

test.afterEach(t => fs.remove(t.context.root));
