import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import webpack from 'webpack';
import merge from 'webpack-merge';
import dircompare from 'dir-compare';

import {tapAsync} from '../lib/util';

const fixtures = path.resolve(__dirname, 'fixtures');
module.exports.expected = path.resolve(fixtures, 'expected');
module.exports.logo = path.resolve(fixtures, 'logo.svg');

module.exports.mkdir = () => fs.mkdtemp(path.join(os.tmpdir(), 'WWP'));

module.exports.generate = (config) => {
  config = merge(
    {
      entry: path.resolve(fixtures, 'entry.js'),
    },
    config,
  );

  config.plugins
    .filter(plugin => plugin.constructor.name === 'HtmlWebpackPlugin')
    .forEach(plugin => {
      plugin.options.chunks = [];
    });

  const compiler = webpack(config);

  tapAsync(compiler, 'emit', 'Test', ({assets}, callback) => {
    Object.keys(assets)
      .filter(asset => asset.match(/.js$/))
      .forEach(asset => {
        delete assets[asset];
      });

    callback();
  });

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => (err || stats.hasErrors())
      ? reject(err || stats.toJson().errors)
      : resolve(stats)
    );
  });
};

module.exports.compare = async (a, b) => {
  const diff = await dircompare.compare(a, b, {
    compareContent: true,
  });

  return diff.diffSet.filter(({state}) => state !== 'equal').map(({path1, name1, path2, name2}) => (
    `${path.join(path1 || '', name1 + '')} ≠ ${path.join(path2 || '', name2 + '')}`)
  );
};
