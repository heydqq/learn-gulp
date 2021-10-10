const { src,dest,task } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const ts = require('gulp-typescript');

task('clean',function () {
    return del([
        'output/**/*'
    ])
})

task('cssTransfer',function () {
    return src(['src/**/*.scss','!src/common/**/*.scss'],{
            base:'src'
        })
        .pipe(sass().on('error',sass.logError))
        .pipe(dest('output'))
})

task('jsonTransfer',function (){
    return src('src/**/*.json',{
            base:'src'
        })
        .pipe(dest('output'))
})

task('wxmlTransfer',function (){
    return src('src/**/*.wxml',{
            base:'src'
        })
        .pipe(dest('output'))
})

task('jsTransfer',function (){
    return src('src/**/*.js',{
            base:'src'
        })
        .pipe(dest('output'))
})

task('tsTransfer',function(){
    return src('src/**/*.ts',{
            base:'src'
        })
        .pipe(ts({
            declaration:true,
            lib:['es2016']
        }))
        .pipe(dest('output'))
})

task('wxsTransfer',function (){
    return src('src/**/*.wxs',{
            base:'src'
        })
        .pipe(dest('output'))
})
