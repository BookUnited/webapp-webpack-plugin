const test = require('ava');
const path = require('path');
const fs = require('fs-extra');
const WebappWebpackPlugin = require('../');

const { logo, mkdir, generate } = require('./util');

test.beforeEach(async t => t.context.root = await mkdir());

test('should allow configuring cache directory', async t => {
  const dist = path.join(t.context.root, 'dist');
  const cache = path.join(t.context.root, 'cache');

  await generate({
    context: t.context.root,
    output: {
      path: dist,
    },
    plugins: [new WebappWebpackPlugin({ logo, cache })],
  });

  t.pass(fs.existsSync(cache));
  t.pass(fs.lstatSync(cache).isDirectory());
  t.pass(fs.readdirSync(cache).length);
});

test.afterEach(t => fs.remove(t.context.root));
