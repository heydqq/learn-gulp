const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const clean = require('gulp-clean')
const gulpInstall = require('gulp-install')

const utils = require('./utils')
const checkComponents = require('./checkcomponents')
const config = require('./config')
const { copySync } = require('fs-extra')
const { updateSidebar } = require('./doctools/docUpdate');
const srcPath = config.srcPath
const distPath = config.distPath

module.exports = class BuildTask {
    constructor(id, entry) {
        if (!entry) return

        this.id = id
        this.entries = Array.isArray(config.entry) ? config.entry : [config.entry]
        this.copies = config.copy
        this.docPath = config.docPath
        this.srcMdPath = config.srcMdPath
        this.componentListMap = {}
        this.cachedComponentListMap = {}
        this.foldersMap = {}
        /**
         * this.foldersMap = {
         *      card\test1: []
         *          test1.wxss, test1.wxml, test1.json, test1.js
         *      ],
         *      ……
         * }
         */
        this.init()
    }
    
    /**
     * 拷贝文件
     */
    copy(copyFileList) {
        if (!copyFileList.length) return false

        return gulp
            .src(copyFileList, { cwd: srcPath, base: srcPath })
            .pipe(utils.logger())
            .pipe(gulp.dest(distPath))
    }

    /**
     * 获取 js或wxss 数据流
     */
    jsOrWxss(fileMap, type) {
        const fileList = type === 'js' ? this.componentListMap.jsFileList : this.componentListMap.wxssFileList
        const cachedFileList = type === 'js' ? this.cachedComponentListMap.jsFileList : this.cachedComponentListMap.wxssFileList

        if (
            fileList &&
            fileList.length &&
            !utils.compareArray(cachedFileList, fileList)
        ) {
            
            const webpackConfig = config.webpack
            const webpackCallback = (err, stats) => {
                if (!err) {
                    // eslint-disable-next-line no-console
                    console.log(
                        stats.toString({
                            assets: true,
                            cached: false,
                            colors: true,
                            children: false,
                            errors: true,
                            warnings: true,
                            version: true,
                            modules: false,
                            publicPath: true,
                        })
                    )
                } else {
                    // eslint-disable-next-line no-console
                    console.log(err)
                }
            }

            if (type === 'js' && !fileMap.index) {
                fileMap.index = path.resolve(
                    path.join(path.dirname(__dirname), '../src/index.ts')
                )
            }

            webpackConfig.entry = fileMap
            webpackConfig.output.path = distPath

            if (this.webpackWatcher) {
                this.webpackWatcher.close()
                this.webpackWatcher = null
            }

            if (config.isWatch) {
                this.webpackWatcher = webpack(webpackConfig).watch(
                    { ignored: /node_modules/ },
                    webpackCallback
                )
            } else {
                webpack(webpackConfig).run(webpackCallback)
            }
        }
    }

    /**
     * 安装依赖包
     */
    install() {
        return gulp.series(
            async () => {
                const previewDist = config.previewDist
                const previewPackageJsonPath = path.join(previewDist, 'package.json')
                const packageJson = utils.readJson(
                    path.resolve(__dirname, '../package.json')
                )
                const dependencies = packageJson.dependencies || {}
                const devPackage = {
                    "scripts": {
                        "tsc": "node ./node_modules/typescript/lib/tsc.js"
                    },
                    "dependencies": Object.assign(dependencies, {"typescript": packageJson.devDependencies.typescript})
                }
                await utils.writeFile(
                    previewPackageJsonPath,
                    JSON.stringify(devPackage, null, '\t')
                ) // write dev preview's package.json
            },
            () => {
                const previewDist = config.previewDist
                const previewPackageJsonPath = path.join(previewDist, 'package.json')

                return gulp
                    .src(previewPackageJsonPath)
                    .pipe(gulpInstall({ production: true }))
            }
        )
    }

    /**
     * 检查自定义组件
     */
     async componentCheck () {
        const entries = this.entries
        const mergeComponentListMap = {}
        for (let i = 0, len = entries.length; i < len; i++) {
            let entry = entries[i]
            entry = path.join(srcPath, `${entry}.json`)
            const newComponentListMap = await checkComponents(entry)

            utils.merge(mergeComponentListMap, newComponentListMap)
        }

        this.cachedComponentListMap = this.componentListMap
        this.componentListMap = mergeComponentListMap
    }

    /**
     * 写json到目标目录
     */
    componentJson() {
        const jsonFileList = this.componentListMap.jsonFileList

        if (jsonFileList && jsonFileList.length) {
            // 过滤掉index.json
            return this.copy(
                this.componentListMap.jsonFileList.filter(
                    (file) => file !== 'index.json'
                )
            )
        }
    }

    /**
     * 写wxml到目标目录
     */
    componentWxml() {
        const wxmlFileList = this.componentListMap.wxmlFileList

        if (
            wxmlFileList &&
            wxmlFileList.length &&
            /**
            * this.cachedComponentListMap.wxmlFileList：表示在检查自定义组件前的wxml路径列表
            * wxmlFileList：表示在检查自定义组件后的 新的 wxml路径列表
            * 此处比较的是路径数组，如果路径数组不发生变化的话[删除或新增]，是不会进行copy或构建的，为了防止不必要的编译
            * 如果监听到wxml文件发生变化的时候，会先将this.cachedComponentListMap.wxmlFileList置为null，再执行此方法
            */ 
            !utils.compareArray(this.cachedComponentListMap.wxmlFileList, wxmlFileList)
        ) {
            return this.copy(wxmlFileList)
        }
    }

    /**
     * 写wxs到目标目录
     */
    componentWxs() {

        const wxsFileList = this.componentListMap.wxsFileList

        if (
            wxsFileList &&
            wxsFileList.length &&
            !utils.compareArray(this.cachedComponentListMap.wxsFileList, wxsFileList)
        ) {
            return this.copy(wxsFileList)
        }
    }

    init() {
        const id = this.id

        /**---------------------------------------编译部分------------------------------------------ */

        /**
         * 拷贝 preview 到目标目录
         */
        let isPreviewExists = false
        gulp.task(
            `${id}-preview`,
            gulp.series(
                async () => {
                    const previewDist = config.previewDist

                    // isPreviewExists = await utils.checkFileExists(
                    //     path.join(previewDist, 'project.config.json')
                    // )
                },
                () => {
                    if (!isPreviewExists) {
                        const previewSrc = config.previewSrc
                        const previewDist = config.previewDist

                        return gulp
                            .src('**/*', { cwd: previewSrc, base: previewSrc })
                            .pipe(gulp.dest(previewDist))
                    } else {
                        const previewExampleSrc = path.join(config.previewSrc, 'example')
                        const previewExampleDist = path.join(config.previewDist, 'example')

                        return gulp
                            .src('**/*', { cwd: previewExampleSrc, base: previewExampleSrc })
                            .pipe(gulp.dest(previewExampleDist))
                    }
                }
            )
        )

        /**
         * 清空目标目录
         */
        gulp.task(`${id}-clean-dist`, () =>
            gulp
                .src(distPath, { read: false, allowEmpty: true })
                .pipe(utils.logger('clean'))
                .pipe(clean())
        )

        /**
         * 检查自定义组件
         */
        gulp.task(`${id}-component-check`, async () => {
            const entries = this.entries
            const mergeComponentListMap = {}
            for (let i = 0, len = entries.length; i < len; i++) {
                let entry = entries[i]
                entry = path.join(srcPath, `${entry}.json`)
                const newComponentListMap = await checkComponents(entry)

                utils.merge(mergeComponentListMap, newComponentListMap)
            }

            this.cachedComponentListMap = this.componentListMap
            this.componentListMap = mergeComponentListMap
        })

        /**
         * 安装依赖包
         */
        gulp.task(`${id}-install`, this.install())

        /**
         * 写 json 文件到目标目录
         */
        gulp.task(`${id}-component-json`, (done) => {
            this.componentJson()
            return done()
        })

        /**
         * 写 wxml 文件到目标目录
         */
        gulp.task(`${id}-component-wxml`, (done) => {
            this.componentWxml()
            return done()
        })

        /**
         * 生成 js 和wxss 文件到目标目录
         */
        gulp.task(`${id}-component-js&wxss`, (done) => {
            this.jsOrWxss(this.componentListMap.jsFileMap, 'js')
            this.jsOrWxss(this.componentListMap.wxssFileMap, 'wxss')
            return done()
        })

        /**
         * 写 wxs 文件到目标目录
         */
        gulp.task(`${id}-component-wxs`, (done) => {
            this.componentWxs()
            return done()
        })

        /**
         * 拷贝资源到目标目录
         */
        gulp.task(`${id}-copy`, done => {
            const copyList = this.copies
            const copyFileList = copyList.map(dir => {
                return path.join(__dirname, '../', dir)
            })

            if (copyFileList.length) return this.copy(copyFileList)

            return done()
        })

        /**
         * 拷贝README.md文件到doc/docs目录下
         */
        gulp.task(`${id}-copy-md`, done => {

            return gulp
                .src(this.srcMdPath)
                .pipe(utils.logger())
                .pipe(gulp.dest(this.docPath))

        })


        /**----------------------------------------监听变化部分---------------------------------------- */

        /**
         * 监听 preview 变化
         */
        gulp.task(`${id}-watch-preview`, () => {
            const previewSrc = config.previewSrc
            const previewDist = config.previewDist

            const watchCallback = (filePath, type) => {
                gulp
                    .src(filePath, {cwd: previewSrc, base: previewSrc, allowEmpty: true})
                    .pipe(utils.logger(type))
                    .pipe(gulp.dest(previewDist))
            }

            return gulp
                .watch('**/*', { cwd: previewSrc, base: previewSrc })
                .on('change', (filePath) => {
                    watchCallback(filePath, 'preview-change')
                })
                .on('add', (filePath) => {
                    watchCallback(filePath, 'preview-add')
                })
                .on('unlink', (filePath) => {
                    // console.log(filePath,'被删除了')
                    fs.unlinkSync(path.resolve(previewDist, filePath))
                })
        })

        /**
         * 监听安装包列表变化
         */
        gulp.task(`${id}-watch-install`, () =>
            gulp.watch(path.resolve(__dirname, '../package.json'), this.install())
        )

        /**
         * 监听src目录下文件的变化
         */
        gulp.task(`${id}-watch-srcFile`, () => {

            gulp.watch('**', {cwd: srcPath, base: srcPath, depth: 3})
            .on('add', filePath => {
                const dirPath = path.dirname(filePath)
                const fileName = path.basename(filePath)                

                const file = fileName.split('.')[0]
                const relative = path.relative(srcPath, dirPath)
                const fileBase =  utils.transformPath(path.join(relative, file)).substr(1)

                // console.log(dirPath, fileName, relative, fileBase, '====>')

                const suffix = fileName.split('.').pop()
                if (suffix === "md" || fileName === 'type.d.ts') {
                    return
                }

                // 读取文件所在目录下的所有文件
                let beforeFileList = fs.readdirSync(path.join(srcPath, dirPath))

                if (dirPath in this.foldersMap) {
                    this.foldersMap[dirPath].push(fileName)
                } else {
                    this.foldersMap[dirPath] = beforeFileList
                }
                
                // console.log(this.foldersMap,'====>this.foldersMap')
                const filePathList = this.foldersMap[dirPath]

                // 文件小于4个不足以构成一个微信组件文件夹
                if (filePathList.length < 4) {
                    return
                }
                if (filePathList.length >= 4 ) {
                    const componentsFiles1 = ['wxml', 'wxss', 'json', 'js'],
                        componentsFiles2 = ['wxml', 'wxss', 'json', 'ts'],
                        componentsFiles3 = ['wxml', 'scss', 'json', 'js'],
                        componentsFiles4 = ['wxml', 'scss', 'json', 'ts']


                    // 获取后缀名数组
                    const suffixArr = filePathList.map(itemFile => {
                        return itemFile.split('.')[1]
                    })

                    // 判断suffixArr中是否包含componentsFiles中的文件
                    const newList1 = componentsFiles1.filter((val) => {
                        return suffixArr.indexOf(val) > -1
                    }),
                        newList2 = componentsFiles2.filter((val) => {
                        return suffixArr.indexOf(val) > -1
                    }),
                        newList3 = componentsFiles3.filter((val) => {
                        return suffixArr.indexOf(val) > -1
                    }),
                        newList4 = componentsFiles4.filter((val) => {
                        return suffixArr.indexOf(val) > -1
                    })

                    if (newList1.length == componentsFiles1.length ||  newList2.length == componentsFiles2.length || newList3.length == componentsFiles3.length || newList4.length == componentsFiles4.length){
                        // console.log('是新增的微信组件')

                        // 获取到index.json文件，进行注册组件
                        let entry = this.entries[0]
                            entry = path.join(srcPath, `${entry}.json`)

                        let indexfile = utils.readJson(entry)

                        if ("usingComponents" in indexfile) {

                            // 处理同名 不同地址的组件注册
                            if (file in indexfile.usingComponents) {
                                let files = Object.keys(indexfile.usingComponents)
                                let a = files.filter(file => {
                                    return indexfile.usingComponents[file] === fileBase
                                })

                                !a.length && (indexfile.usingComponents[file + Math.floor(Math.random() * 1000)] = fileBase )
                            } else {
                                indexfile.usingComponents[file] = fileBase
                            }

                        } else {
                            indexfile["usingComponents"] = {}
                            indexfile.usingComponents[file] = fileBase
                        }

                        fs.writeFileSync( entry, JSON.stringify(indexfile, null, '\t'), 'utf8' ) 
                    }
                }
            })
            .on('unlinkDir', filePath => {
                filePath =  utils.transformPath(filePath)

                 // 获取到index.json文件，进行取消注册组件
                 let entry = this.entries[0]
                 entry = path.join(srcPath, `${entry}.json`)

                let indexfile = utils.readJson(entry)

                let comps = indexfile['usingComponents'] || {}
                Object.keys(comps).forEach(compKey => {
                    let arr = comps[compKey].substr(2).split('/')
                    arr.pop()
                    let url = arr.join('/')
                    if (filePath === url) {
                        delete indexfile['usingComponents'][compKey]
                        fs.writeFileSync( entry, JSON.stringify(indexfile, null, '\t'), 'utf8' ) 
                    }
                })
            })
        })

        /**
         * 监听 json 变化
         */
        gulp.task(`${id}-watch-json`, () => {

            let watchCallback = async (filePath, type) => {
                const dirPath = path.dirname(filePath)

                type !== 'unlink' && 
                gulp.src(filePath, { cwd: srcPath, base: srcPath })
                    .pipe(utils.logger(type))

                // 只对写入index.json的组件变化进行编译 || common文件夹下对应的文件发生变化时也要编译
                let index = this.componentListMap.jsonFileList.indexOf(filePath)
                if (index !== -1 || (dirPath.substr(0,6) === 'common' &&  type === 'change')) {
                    await this.componentCheck()
                    this.componentWxml()
                    this.componentWxs()
                    this.componentJson()
                    this.jsOrWxss(this.componentListMap.jsFileMap, 'js')
                    this.jsOrWxss(this.componentListMap.wxssFileMap, 'wxss')
                } 
            }

            gulp
                .watch('**/*.json', { cwd: srcPath, base: srcPath })
                .on('add', filePath => {
                    let jsonPath = path.join(srcPath, filePath)
                    let json = utils.readJson(jsonPath)

                    if (!json) {
                        json = {}
                        fs.writeFileSync( jsonPath, JSON.stringify(json, null, '\t'), 'utf8' ) 
                    }
                    
                    watchCallback(filePath, 'add')
                })
                .on('change', filePath => {
                    watchCallback(filePath, 'change')
                })
                .on('unlink', filePath => {
                    let index = this.componentListMap.jsonFileList.indexOf(filePath)
                    index !== -1 && fs.unlinkSync(path.resolve(distPath, filePath))
                })
        })

        /**
         * 监听 wxml 变化   
         * [如果直接监听wxmlFileList的话，删除文件再新增后监听不到文件的变化]
         */
        gulp.task(`${id}-watch-wxml`, () => {

            // `${id}-component-wxml`任务
            let watchCallback = (filePath, type) => {
                this.cachedComponentListMap.wxmlFileList = null
                const dirPath = path.dirname(filePath)

                gulp.src(filePath, { cwd: srcPath, base: srcPath })
                    .pipe(utils.logger(type))

                // 只对写入index.json的组件变化进行编译 || common文件夹下对应的文件发生变化时也要编译
                let index = this.componentListMap.wxmlFileList.indexOf(filePath)
                if (index !== -1 || (dirPath.substr(0,6) === 'common' &&  type === 'change')) {
                    this.componentWxml()
                }
            }

            return gulp
                .watch('**/*.wxml', { cwd: srcPath, base: srcPath })
                .on('add', filePath => {
                    watchCallback(filePath, 'add')
                })
                .on('change', filePath => {
                    watchCallback(filePath, 'change')
                })
                .on('unlink', filePath => {
                    let index = this.componentListMap.wxmlFileList.indexOf(filePath)
                    index !== -1 && fs.unlinkSync(path.resolve(distPath, filePath))
                })
        })

        /**
         * 监听 wxss 变化
         */
        gulp.task(`${id}-watch-wxss`, () => {

            // `${id}-component-check`, `${id}-component-wxss`, `${id}-component-js`
            let watchCallback = async (filePath, type) => {
                this.cachedComponentListMap.wxssFileList = null

                type !== 'unlink' && 
                gulp.src(filePath, { cwd: srcPath, base: srcPath })
                    .pipe(utils.logger(type))

                let index = this.componentListMap.wxssFileList.indexOf(filePath)

                // 只对写入index.json的组件变化进行编译
                if (index !== -1) {
                    if ( type == 'add' || type === 'unlink') {
                        await this.componentCheck()
                        this.jsOrWxss(this.componentListMap.wxssFileMap, 'wxss')
                    }
                    if ( type === 'change') {
                        this.jsOrWxss(this.componentListMap.wxssFileMap, 'wxss')
                    }
                }

                // common文件夹变化监听
                const dirPath = path.dirname(filePath)
                if (dirPath.substr(0,6) === 'common' &&  type === 'change') {
                    this.jsOrWxss(this.componentListMap.wxssFileMap, 'wxss')
                }
            }

            return gulp
                .watch(['**/*.scss', '**/*.wxss'], { cwd: srcPath, base: srcPath })
                .on('add', filePath => {
                    watchCallback(filePath, 'add')
                })
                .on('change', filePath => {
                    watchCallback(filePath, 'change')
                })
                .on('unlink', filePath => {
                    watchCallback(filePath, 'unlink')
                })
        })

        /**
         * 监听 js 变化
         */
        gulp.task(`${id}-watch-js`, () => {

             // `${id}-component-check`, `${id}-component-js`
             let watchCallback = async (filePath, type) => {
                this.cachedComponentListMap.jsFileList = null

                type !== 'unlink' && 
                gulp.src(filePath, { cwd: srcPath, base: srcPath })
                    .pipe(utils.logger(type))

                let key = filePath.split('.')[0]
                let index = Object.keys(this.componentListMap.jsFileMap).indexOf(key)

                // 只对写入index.json的组件变化进行编译
                if (index !== -1 ) {
                    if ( type == 'add' || type === 'unlink') {
                        await this.componentCheck()
                        this.jsOrWxss(this.componentListMap.jsFileMap, 'js')
                    }
                    if ( type === 'change') {
                        this.jsOrWxss(this.componentListMap.jsFileMap, 'js')
                    }
                }

                // common文件夹变化监听
                const dirPath = path.dirname(filePath)
                if ((dirPath.substr(0,6) === 'common' || dirPath.substr(0,5) === 'utils') &&  type === 'change') {
                    this.jsOrWxss(this.componentListMap.jsFileMap, 'js')
                }
            }
            return gulp
                .watch(['**/*.js', '**/*.ts'], { cwd: srcPath, base: srcPath })
                .on('add', filePath => {
                    watchCallback(filePath, 'add')
                })
                .on('change', filePath => {
                    watchCallback(filePath, 'change')
                })
                .on('unlink', filePath => {
                    watchCallback(filePath, 'unlink')
                })
        })

        /**
         * 监听 wxs 变化
         */
        gulp.task(`${id}-watch-wxs`, () => {

            // `${id}-component-wxs`任务
            let watchCallback = (filePath, type) => {

                this.cachedComponentListMap.wxsFileList = null
                const dirPath = path.dirname(filePath)

                gulp.src(filePath, { cwd: srcPath, base: srcPath })
                    .pipe(utils.logger(type))

                // 只对写入index.json的组件变化进行编译 || common文件夹下对应的文件发生变化时也进行编译
                let index = this.componentListMap.wxsFileList.indexOf(filePath)
                if (index !== -1 || (dirPath.substr(0,6) === 'common' &&  type === 'change')) {
                    this.componentWxs()
                }
            }

            return gulp
                .watch( '**/*.wxs', { cwd: srcPath, base: srcPath } )
                .on('add', filePath => {
                    watchCallback(filePath, 'add')
                })
                .on('change', filePath => {
                    watchCallback(filePath, 'change')
                })
                .on('unlink', filePath => {
                    let index = this.componentListMap.wxsFileList.indexOf(filePath)
                    index !== -1 && fs.unlinkSync(path.resolve(distPath, filePath))
                })
        })

        /**
         * 监听copy资源的变化
         */
        gulp.task(`${id}-watch-copy`, () => {
            const copyList = this.copies
            const copyFileList = copyList.map(dir => {
                return path.join(__dirname, '../', dir)
            })

            const watchCallback = filePath => this.copy([filePath])

            return gulp
                .watch(copyFileList, { cwd: srcPath, base: srcPath })
                .on('change', watchCallback)
                .on('add', watchCallback)
                .on('unlink', (filePath) => {
                    fs.unlinkSync(path.resolve(distPath, filePath))
                })
        })

        /**
         * 监听md文件的变化
         */
        gulp.task(`${id}-watch-md`, () => {

            let copyMD = (filePath, type) => {
                gulp.src(filePath, { base: 'src' })
                .pipe(utils.logger())
                .pipe(gulp.dest(this.docPath));
            }

            return gulp
                .watch(this.srcMdPath)
                .on('add', filePath => {
                    copyMD(filePath, 'add');
                    updateSidebar(filePath, 'add')
                })
                .on('change', filePath => {
                    copyMD(filePath, 'change')
                    updateSidebar(filePath, 'change')
                })
                .on('unlink', filePath => {
                    const newfilePath = filePath.replace(/\\/g, '/');
                    // 目标父文件夹路径
                    const destPath = path.dirname(newfilePath).replace('src', 'doc/docs');
                    // 目标文件路径
                    const targetFilePath = path.join(this.docPath, newfilePath.replace('src/', ''));

                    utils.checkFileExists(targetFilePath)
                        .then(status => {
                            if (status) {
                                gulp.src(destPath)
                                    .pipe(utils.logger('del'))
                                    .pipe(clean())

                                
                            }
                        })

                    updateSidebar(filePath, 'unlink')
                })
        })
    }
}
