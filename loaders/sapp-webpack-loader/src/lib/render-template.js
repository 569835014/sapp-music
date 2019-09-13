const loaderUtils = require('loader-utils')
const fs = require('fs-extra')
const {resolve, join} = require('path')
const htmlMinifier = require('html-minifier');
const render = require('posthtml-render');
const assign = require('object-assign');

module.exports=function (__sAppParts__,config) {
    this.cacheable()
    const options = loaderUtils.getOptions(this)||{}
    const extension = options.extension || {
        style: 'wxss',
        template: 'wxml'
    }
    const dist = options.dist || 'dist'
    const wrappedTemplateQuote = str => `\`${str}\``;
    let sAppTemplateString = render(__sAppParts__.template[0].content, {});
    // 压缩，来自 Html-loader
    if (typeof config.minimize === 'boolean' ? config.minimize : options.minimize) {
        const minimizeOptions = assign({}, config);
        // 默认配置
        [
            'caseSensitive',
            'removeComments',
            'removeCommentsFromCDATA',
            'removeCDATASectionsFromCDATA',
            'collapseWhitespace',
            'conservativeCollapse',
            // 'removeAttributeQuotes',
            'useShortDoctype',
            'keepClosingSlash'
        ].forEach((name) => {
            if (typeof minimizeOptions[name] === 'undefined') {
                minimizeOptions[name] = true;
            }

        });
        sAppTemplateString = htmlMinifier.minify(sAppTemplateString, minimizeOptions);
    }
    const filename = loaderUtils.interpolateName(this, `[name].${extension.template}`, options)
    const folder = loaderUtils.interpolateName(this, `[folder]`, options)
    const dirname = loaderUtils.interpolateName(this, `[path]`, options)
    if (options.source && options.target) {
        let _path = dirname.replace(options.source, options.target)
        fs.outputFileSync(resolve(process.cwd(), `${_path}/${filename}`), sAppTemplateString, 'utf8')
    } else {
        fs.outputFileSync(resolve(process.cwd(), `${dist}/pages/${folder}/${filename}`), sAppTemplateString, 'utf8')
    }
    return ``
}
