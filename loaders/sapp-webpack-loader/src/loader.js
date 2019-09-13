const path = require('path');
const posthtml = require('posthtml');
const gen = require('@babel/generator').default;
const assign = require('object-assign');
const loaderUtils = require('loader-utils');
const renderTemplate =require('./lib/render-template')
function getLoaderConfig(context) {
    const query = loaderUtils.getOptions(context) || {};
    const configKey = query.config || 'sappWebpackLoader';
    const config = context.options && context.options.hasOwnProperty(configKey) ? context.options[configKey] : {};

    delete query.config;
    /**
     * sourceMap: 是否使用 css sourcemap
     * minimize： 是否压缩代码，压缩 css 和 html，css extract
     */
    return assign({sourceMap: false, minimize: false}, query, config);
}
function loader(content, callback) {
    const { rootContext = process.cwd(), resourcePath } = this;
    let output = '';
    const webpackContext = this;
    const config = getLoaderConfig(this);
    const shortFilePath = path.relative(rootContext, resourcePath).replace(/^(\.\.[\\\/])+/, '');

    const __sAppParts__ = posthtml([
        // separate script、template、style
        require('./lib/posthtml-sapp-selector')(),
        // optimize size
        require('./lib/posthtml-remove-indent')()

    ]).process(content, {
        // almost gave up
        // shit@ post html docs
        recognizeSelfClosing: true,
        sync: true
    }).tree.messages[0];
    const sAppStyle = __sAppParts__.style;
    if (sAppStyle.content) {
        output += require('./lib/calc-style-Import')({
            webpackContext,
            sAppStyle,
            rootContext,
            resourcePath
        }, config);
    }
    output=output.replace('node_modules/san-webpack-loader','loaders/sapp-webpack-loader/src')
    renderTemplate.call(this,__sAppParts__,config)
    const sAppScriptAst = require('./lib/move-template-into-script')(__sAppParts__, config);
    const scriptStr = gen(sAppScriptAst).code;
    const code=`${output} \n ${scriptStr}`
    return code
}
module.exports=loader
