const fs = require('fs');
const path = require('path');
const { ConcatSource, RawSource } = require('webpack-sources');
class JsWebpackPlugin {
  constructor(options = {}) {
    this.options = Object.assign({}, options, {
      main: 'app',
    });
  }

  apply(compiler) {
    const { splitChunks } = compiler.options.optimization;
    const { options } = this;
    // compiler.hooks.thisCompilation.tap('SplitChunksPlugin', compilation => {
    //   let alreadyOptimized = false;
    //   compilation.hooks.unseal.tap('SplitChunksPlugin', () => {
    //     alreadyOptimized = true;
    //   });
    //   compilation.hooks.afterOptimizeChunkModules.tap(
    //     'SplitChunksPlugin',
    //     chunks => {
    //       console.info(chunks);
    //     }
    //   );
    //   compilation.hooks.optimizeChunksAdvanced.tap(
    //     'SplitChunksPlugin',
    //     chunks => {
    //       console.info(chunks);
    //     }
    //   );
    // });
    compiler.hooks.compilation.tap('JsWebpackPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync({
        name: 'SplitChunksPlugin',
      }, (chunks, callback) => {
        debugger
        let main = null;
        chunks.findIndex((chunk, _index) => {
          if (chunk.name === options.main || (chunk.id + '').endsWith(options.id)) {
            main = chunk;
            return true;
          }
        });
        if (!main) return callback();
        let requireStr = '';
        chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            if (chunk.chunkReason) {
              requireStr += `require('${file}'); \n`;
            }
          });
        });
        main.files.forEach(file => {
          const asset = compilation.assets[file];
          // 获取文件本身
          let code = asset.source() || '';
          code = code.replace('// inject', requireStr);
          compilation.assets[file] = new RawSource(code);
        });
        // compilation.assets[file] = new ConcatSource(
        //     '\/**Sweet Banner**\/',
        //     '\n',
        //     compilation.assets[file]
        // );
        callback();
      });
      // compilation.hooks.module.tap("JsWebpackPlugin", (module, data) => {
      //     debugger
      //     console.info(module)
      // })
    });
  }
}
module.exports = JsWebpackPlugin;
