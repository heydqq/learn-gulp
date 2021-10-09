/*
 * @Description: 小程序文档系统自动化维护脚本
 * @Author: duanwensheng
 * @Date: 2021-08-03 22:41:35
 */
const utils = require('../utils');
const path = require('path');
const fs = require('fs');

const docSidebarPath = path.resolve(__dirname, '../../doc/docs/.vuepress/sidebar.json');
const dirJsonPath = path.resolve(__dirname, './dir.json');

/**
 * 判断目录是否已配置
 * @params dirArr 目录数组
 * @params target 待判数组
 * @return num 数组索引 不配置返回 -1
*/
const getDirIndex = (dirArr, target) => {
    let dirIndex = -1;
    if (!dirArr || !Array.isArray(dirArr)) {
        return dirIndex;
    }

    dirArr.forEach((item, index) => {
        if (item[0] === target.path) {
            dirIndex = index;
        }
    })

    return dirIndex;
}


/**
 * 配置同步函数
 * @param filepath 更新的文件路径
 * @param type 操作类型 add | unlink
 */
const updateSidebar = (filepath = '', type = 'add') => {
    if (!filepath) {
        console.error(`[error: updateSidebar can't find the file]`)
        return ;
    }

    const newfilePath = filepath.replace(/\\/g, '/');
    let gatalogue = utils.readJson(dirJsonPath);
    let isUpdate = false; // 是否需要刷新doc 下配置目录

    // src/tabs/README.md
    const key = /\/\w+\//.exec(newfilePath)[0];
    const target = gatalogue[key];
    // console.log('key target:', key, target, CATALOGUE);

    if (!target && (type === 'add' || type == 'change')) {
        console.log(`${'WARNING'.yellow}: can not find ${key} in ${`dir.json`.yellow}, please update it first!`);
        return ;
    }

    if (!target && type === 'unlink') {
        return ;
    }

    const content = utils.readJson(docSidebarPath);
    // const content = require(docSidebarPath);
    const sidebar = content.sidebar;

    if (type === 'add' || type === 'change') {

        let existPrimary = false; // 是否存在一级目录
        sidebar.forEach(primarydir => {
            const children = primarydir['children'];

            if (primarydir.title === target.type) {
                existPrimary = true;

                if (Array.isArray(children) && getDirIndex(children, target) === -1) {
                    children.push([target.path, target.title]);
                    isUpdate = true;
                } 
                 
                if (!Array.isArray(children)){
                    primarydir['children'] = [[target.path, target.title]]
                    isUpdate = true;
                }
            }
        })

        // 添加一级目录
        if (!existPrimary) {
            sidebar.push({
                title: target.type,
                collapsable: false,
			    sidebarDepth: 0,
                children: [[target.path, target.title]]
            })
        }
    }

    if (type === 'unlink') {
        let delPrimaryDirIndex = -1; // 需删除的一级目录索引

        sidebar.forEach((primarydir, index) => {
            const children = primarydir['children'];
            const delIndex = getDirIndex(children, target);
            if ( primarydir.title === target.type && delIndex !== -1) {

                // let delIndex = getDirIndex(children, target);
                // console.log('delIndex:', delIndex);

                children.splice(delIndex, 1);
                isUpdate = true;
                // 更新 dir.json
                delete gatalogue[key];
                fs.writeFileSync(path.resolve(dirJsonPath), JSON.stringify(gatalogue, null, '\t'), 'utf8');
                // 若一级目录下无二级目录 则删掉一级目录
                if (children.length === 0) {
                    delPrimaryDirIndex = index
                }
                
            }
        })

        if (delPrimaryDirIndex !== -1) {
            sidebar.splice(delPrimaryDirIndex, 1);
        }

    }

    if (isUpdate) {
        
        content.sidebar = sidebar;
    
        fs.writeFileSync(path.resolve(__dirname, docSidebarPath), JSON.stringify(content, null, '\t'), 'utf8');
    }

    console.log(`${'UPDATE SUCCESS!'.green}`);

}

    
module.exports = {
    updateSidebar
}

