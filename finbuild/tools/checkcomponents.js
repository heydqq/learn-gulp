const path = require('path')

const utils = require('./utils')

/**
 * 检测是否包含其他自定义组件
 */
const checkProps = ['usingComponents', 'componentGenerics']
async function checkIncludedComponents(jsonPath, componentListMap) {
    const json = utils.readJson(jsonPath)
    if (!json) throw new Error(`json is not valid: "${jsonPath}"`)

    const { dirPath, fileName, fileBase } = utils.getJsonPathInfo(jsonPath)
    // console.log(dirPath, fileName, fileBase, '-------->>')

    for (let i = 0, len = checkProps.length; i < len; i++) {
        const checkProp = checkProps[i]
        const checkPropValue = json[checkProp] || {}
        const keys = Object.keys(checkPropValue)

        for (let j = 0, jlen = keys.length; j < jlen; j++) {
            const key = keys[j]
            let value = typeof checkPropValue[key] === 'object' ? checkPropValue[key].default : checkPropValue[key]
            if (!value) continue

            value = utils.transformPath(value, path.sep)

            // 检查相对路径
            const componentPath = `${path.join(dirPath, value)}.json`
            const isExists = await utils.checkFileExists(componentPath)
            if (isExists) {
                await checkIncludedComponents(componentPath, componentListMap)
            }
        }
    }

    // 进入存储
    let exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.wxml`))
    if (exists) {
        componentListMap.wxmlFileList.push(`${fileBase}.wxml`)
    }

    // ----strat----  wxssFileList
    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.scss`))
    exists && componentListMap.wxssFileList.push(`${fileBase}.scss`)

    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.wxss`))
    exists && componentListMap.wxssFileList.push(`${fileBase}.wxss`)
    // ----end-----

    // ---- start-----  wxssFileMap
    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.scss`))
    if (exists) {
        componentListMap.wxssFileMap[fileBase] = `${path.join(dirPath, fileName)}.scss`
    }

    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.wxss`))
    if (exists) {
        componentListMap.wxssFileMap[fileBase] = `${path.join(dirPath, fileName)}.wxss`
    }
    // ---- end-----

    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.json`))
    exists && componentListMap.jsonFileList.push(`${fileBase}.json`)

    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.wxs`))
    exists && componentListMap.wxsFileList.push(`${fileBase}.wxs`)

    // ----start----  jsFileList 
    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.ts`))
    exists && componentListMap.jsFileList.push(`${fileBase}.ts`)

    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.js`))
    exists && componentListMap.jsFileList.push(`${fileBase}.js`)
    // ----end----

    // ----start----  jsFileMap
    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.ts`))
    if (exists) {
        componentListMap.jsFileMap[fileBase] = `${path.join(dirPath, fileName)}.ts`
    }

    exists = await utils.checkFileExists(path.join(dirPath, `${fileName}.js`))
    if (exists) {
        componentListMap.jsFileMap[fileBase] = `${path.join(dirPath, fileName)}.js`
    }
    // ----end-----
}

module.exports = async function (entry) {
    const componentListMap = {
        wxmlFileList: [],       // .wxml
        wxssFileList: [],       // .scss & .wxss
        jsonFileList: [],       // .json
        jsFileList: [],         // .ts & .js
        wxsFileList: [],        // .wxs

        jsFileMap: {}, // 为 webpack entry 所用
        wxssFileMap: {} // 为 webpack entry 所用
    }

    const isExists = await utils.checkFileExists(entry)
    if (!isExists) {
        const { dirPath, fileName, fileBase } = getJsonPathInfo(entry)

        componentListMap.jsFileList.push(`${fileBase}.ts`)
        componentListMap.jsFileMap[fileBase] = `${path.join(dirPath, fileName)}.ts`

        /**
        componentListMap = 
            { 
                wxmlFileList: [],           
                wxssFileList: [],       
                jsonFileList: [],       
                jsFileList: [ 'index.ts' ],
                wxsFileList: [],
                
                jsFileMap: { 
                    index: 'D:\\iwork\\WonderUI\\src\\index.ts' 
                }, 
                wxssFileMap: { 
                    index: 'D:\\iwork\\WonderUI\\src\\index.wxss' 
                },
            }
         */
        return componentListMap
    }

    await checkIncludedComponents(entry, componentListMap)

    return componentListMap
}
