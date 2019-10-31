const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const webpackConfig = merge(baseConfig, {
    mode: 'development',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../dist')
    },
});

module.exports = webpackConfig;