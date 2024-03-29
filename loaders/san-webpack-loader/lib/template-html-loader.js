/**
 * @file 将 template 中的 img:src 转成 publicPath 路径
 * @author ksky521@gmail.com
 */

const render = require('posthtml-render');
const htmlLoader = require('html-loader');

module.exports = function (content) {
  console.log(content)
    const sAppTemplateString = render(content, {});

    content = htmlLoader(sAppTemplateString);
    console.log(content);
    return content;
};
