const qs = require('querystring');
const fs=require('fs-extra');
const {resolve}=require('path')
const loaderUtils = require('loader-utils');
const minify = require('html-minifier').minify;
const isProd = (function () {
    return (process.env.NODE_ENV === 'production'||process.env.NODE_ENV === 'prod')
})();
// Loader that compiles raw template into JavaScript functions.
// This is injected by the global pitcher (../pitch) for template
// selection requests initiated from vue files.
module.exports = function (source) {
    this.cacheable()
    const options = loaderUtils.getOptions(this)||{}
    const extension = options.extension || {
        style: 'wxss',
        template: 'wxml'
    }
    const dist = options.dist || 'dist'
    let code = isProd ? minify(source,{
        removeComments: true,
        collapseWhitespace: true,
        minifyJS:true,
        minifyCSS:true,
        collapseInlineTagWhitespace:true,
        collapseBooleanAttributes:true,
        keepClosingSlash:true
    }) : source
    const filename = loaderUtils.interpolateName(this, `[name].${extension.template}`, options)
    const folder = loaderUtils.interpolateName(this, `[folder]`, options)
    const dirname = loaderUtils.interpolateName(this, `[path]`, options)
    if (options.source && options.target) {
        let _path = dirname.replace(options.source, options.target)
        fs.outputFileSync(resolve(process.cwd(), `${_path}/${filename}`), code, 'utf8')
    } else {
        fs.outputFileSync(resolve(process.cwd(), `${dist}/pages/${folder}/${filename}`), code, 'utf8')
    }
    return ``
}
