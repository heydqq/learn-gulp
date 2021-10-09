const { series,parallel ,src,dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
function clean(cb) {
    // body omitted
    console.log('clean');
    cb();
}

function cssTranspile(cb) {
// body omitted
return new Promise((res,rej) => {
    setTimeout(() => {
        return res('cssTranspile')
    },1000)
})
}

function cssMinify(cb) {
    // body omitted
    console.log('cssMinify');
    cb();
}

function jsTranspile(cb) {
    // body omitted
    console.log('jsTranspile')
    cb();
}

function jsBundle(cb) {
    // body omitted
    console.log('jsBundle')
    cb();
}

function jsMinify(cb) {
// body omitted
    console.log('jsMinify')
    cb();
}
function removejson (){
    return src('src/*.json')
        .pipe(dest('output/'))
}
function publish(cb) {
    // body omitted
    console.log('publish')
    cb();
}
exports.default =  series(
    clean,
    parallel(
        cssTranspile,
        removejson,
        series(jsTranspile,jsBundle)
    ),
    parallel(
        cssMinify,
        jsMinify,
    ),
    publish
)


function addJs(){
    return src('src/*.js')
        .pipe(babel())
        .pipe(src('vendor/*.js'))
        .pipe(dest('output/'))
        .pipe(uglify())
        .pipe(rename({
            extname:'.min.js'
        }))
        .pipe(dest('output/'))
}

exports.addJs = addJs;