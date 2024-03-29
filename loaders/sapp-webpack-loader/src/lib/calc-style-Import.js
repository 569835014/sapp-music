const path = require('path');
const {resolve, join} = path.posix;
const loaderUtils = require('loader-utils');

module.exports = function calceStyleImport({webpackContext, sAppStyle, rootContext, resourcePath}, {sourceMap, minimize}) {
    const isProduction = process.env.NODE_ENV === 'production';

    // 路径需要对windows环境区分处理，用path.posix处理，不然windows无法正常编译
    // linux系统确不能用，会导致绝对路径的开头斜杠失效
    if (/^win/.test(require('os').platform())) {
        rootContext = join(...rootContext.split(path.sep));
        resourcePath = join(...resourcePath.split(path.sep));
    }
    if (typeof sourceMap === 'boolean') {
        sourceMap = JSON.stringify(sourceMap);
    }
    const styleLoader = `!${rootContext}/node_modules/mini-css-extract-plugin/dist/loader.js?{hmr:${
        !isProduction},reloadAll: true}`;

    const cssLoader = `!css-loader?\{sourceMap:${sourceMap},importLoaders:1\}`;

    const postcssLoader = `!postcss-loader?sourceMap=${sourceMap}`;

    const options = loaderUtils.getOptions(webpackContext) || {};
    const stylusOptions = options.stylus;

    const cssLoaderMap = {
        stylus: `!stylus-loader?${stylusOptions ? JSON.stringify(stylusOptions) : ''}`,
        less: '!less-loader',
        scss: `!sass-loader?{sourceMap:${sourceMap}}`,
        sass: `!sass-loader?{sourceMap:${sourceMap}}`
    };

    const cssProcessorLoader = sAppStyle.attrs && cssLoaderMap[sAppStyle.attrs.lang] || '';

    // 拼接生成内联loader处理san样式
    const genStyleString = (...args) => {
        const startString = `import '!`;

        const endString =
            `!${rootContext}/node_modules/san-webpack-loader/lib/selector.js?type=style!${resourcePath}'\n`;

        return [
            startString,
            ...args,
            endString
        ].join('');
    };

    return genStyleString(styleLoader, cssLoader, postcssLoader, cssProcessorLoader);
};
