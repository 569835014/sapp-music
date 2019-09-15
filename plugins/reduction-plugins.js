const fs=require('fs');
const path=require('path')
const { parseComponent } = require('vue-template-compiler')
const loaders=['smallmina-loader','sapp-webpack-loader','rx-loader']
const { ConcatSource, RawSource } = require('webpack-sources');
function includes(loader){
    return loaders.some((name)=>{
        return loader.includes(name)
    })
}
class ReductionPlugins {
    constructor(config) {
        this.config = config

    }
    apply(compiler) {
        const rules=compiler.options.module.rules;
        const file='foot.mina';
        let options
        rules.findIndex((rule)=>{
            if(rule['test'].test(file)){
                if(rule.loader&&loaders.includes(rule.loader)){
                    options=rule.options;
                    return true
                }else if(rule.use instanceof Array) {
                    return rule.use.some((_rule) => {
                        if (_rule.loader && loaders.includes(_rule.loader)) {
                            options = _rule.options;
                            return true
                        }
                    })
                }
            }
        })

        compiler.hooks.emit.tapAsync('ReductionPlugins',function (result,cb) {
            const   rest={}
            result.entries.forEach((item)=>{
                item.loaders.findIndex((list)=>{
                    if(includes(list.loader)){
                        const key=item.id+''.replace('/src','')
                        rest[key]=Object.assign({},list.options)
                        rest[key].resource=item.resource
                        return true
                    }
                })
            })
            for(let key in result.assets){
                const asset=result.assets[key]
                if(key.includes('.css')){
                    const extension=options.extension||{
                        style: 'acss',
                        template: 'axml',
                    }
                    const newKey=key.replace('.css','.'+extension.style)
                    let code = asset.source() || '';
                    // rpx前面有空格
                    code=code.replace(/ rpx/g,'rpx');
                    result.assets[newKey]=new RawSource(code);
                    delete result.assets[key]
                }
            }
            if(options.rest){
                for(let key in rest){
                    const id=key.replace('mina','js')
                    const item=rest[key]
                    const asstes=result.assets[id];
                    let size=0
                    asstes.source=function () {
                        const content=fs.readFileSync(path.resolve(item.resource),'utf-8')
                        const parts=parseComponent(content).script||''
                        size=parts.content.length;
                        return parts.content
                    }
                    asstes.size=function () {
                        return size
                    }
                    result.assets[id]=asstes;
                }
            }
            cb()
        })
    }
}
module.exports=ReductionPlugins
