require('shelljs/global')
const { resolve } = require('path')
const fs = require('fs')
const webpack = require('webpack')
const _ = require('lodash')
const config=require('./config')
const appConfig=require('../src/config')
rm('-rf',[
    resolve(config.distPath,'./','components'),
    resolve(config.distPath,'./','pages'),
    resolve(config.distPath,'./','*.js'),
    resolve(config.distPath,'./','*.acss'),
    resolve(config.distPath,'./','*-update.json'),
])
debugger
fs.writeFileSync(resolve(config.distPath, './app.json'), JSON.stringify(appConfig.json), 'utf8')
const webpackConf = require(`./webpack.${process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'}.conf`)
const compiler = webpack(webpackConf)
compiler.watch({}, (err, stats) => {
    if (err) process.stdout.write(err)
    console.log('[webpack:build]', stats.toString({
        chunks: false,
        colors: true
    }))
})
