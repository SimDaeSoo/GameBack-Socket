const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const webpackConfig = merge(baseConfig, {
    mode: 'production'
});

module.exports = webpackConfig;