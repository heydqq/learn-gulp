/*
 * @Description: 
 * @Author: duanwensheng
 * @Date: 2021-08-02 23:35:57
 */
const gulp = require('gulp')
const config = require('./tools/config') // webpack配置
const BuildTask = require('./tools/build')
const utils = require('./tools/utils')
const id = 'WonderUI'

/**
 * 构建相关任务
 */

// 构建任务实例
new BuildTask(id, config.entry)

//写文件到目标目录
gulp.task(
    `${id}-build`,
    gulp.series(
        `${id}-clean-dist`,
        `${id}-component-check`,
        gulp.parallel(
            `${id}-component-json`,
            `${id}-component-wxml`,
            `${id}-component-js&wxss`,
            `${id}-component-wxs`,
            `${id}-copy`,
            `${id}-copy-md`
        )
    )
)

// 监听json\wxml\wxss\js\wxs\preview\install文件的变化   [将对应的文件写入对应目录中，并开启监听]
gulp.task(
    'watch',
    gulp.series(
        `${id}-build`,
        `${id}-preview`,
        `${id}-install`,
        gulp.parallel(
            `${id}-watch-srcFile`,
            `${id}-watch-json`,
            `${id}-watch-wxml`,
            `${id}-watch-js`,
            `${id}-watch-wxss`,
            `${id}-watch-wxs`,
            `${id}-watch-copy`,
            `${id}-watch-preview`,
            `${id}-watch-install`,
            `${id}-watch-md`
        )
    )
)

// 开发模式构建不开启监听
gulp.task('dev', gulp.series(`${id}-build`, `${id}-preview`, `${id}-install`))

// 生产环境构建
gulp.task('default', gulp.series(`${id}-build`))
