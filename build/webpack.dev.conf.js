const merge = require('webpack-merge');
const base = require('./webpack.base.conf')
const webpack =require('webpack')

module.exports = merge(base, {
    mode: "development",
    devtool: 'source-map',
    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_ENV':JSON.stringify(process.env.NODE_ENV),
            'WEBPACK_MODE':JSON.stringify('development')
        })
    ]
})
