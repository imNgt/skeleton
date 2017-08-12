const path=require('path'), 
	gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoPreFixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    header = require('gulp-header'),
    liveReload = require('gulp-livereload'),
    cleanCSS = require('gulp-clean-css');


//开发者自定义配置
var srcPath=path.resolve(__dirname,'src');
var distPath=path.resolve(__dirname,'dist');
const projectPath='D:/app/ow/public/assets/front/'

//解析sass
gulp.task('sass', function () {
	console.log(srcPath)
    return gulp.src([srcPath + '/milligram.sass'])
        .pipe(sass())
        .pipe(autoPreFixer('last 101 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .on("error", notify.onError({
            message: "Error: <%= error.message %>"
        }))
        .pipe(gulp.dest(srcPath+"/css"))
        .pipe(gulp.dest(projectPath+"/css"))
        .pipe(notify({message: 'sass parse task complete'}));
});

//压缩css
gulp.task('mincss',['sass'],function () {
    return gulp.src([
        srcPath + '/css/milligram.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(header('/**\n * <%= file.relative %>\n * build at: <%= new Date() %>\n */\n'))
        .pipe(gulp.dest(distPath + '/min/'))
        .pipe(gulp.dest(projectPath + '/min/'))
        .pipe(notify({message: 'min css task complete'}))
});
//sass文件修改监听解析
gulp.task('watch', function () {
    gulp.watch(srcPath + '**/*.sass', ['sass']);
    gulp.watch(srcPath + '/css/*.css', ['mincss']);
    liveReload.listen();
    gulp.watch(srcPath + '**').on('change', liveReload.changed);
});



 