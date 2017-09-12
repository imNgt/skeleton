const path = require('path'),
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

//路径配置
let SRCPATH = path.resolve(__dirname, 'source');
let DISTPATH = path.resolve(__dirname, 'dist');

//解析sass
gulp.task('sass', function () {
	return gulp.src([
		SRCPATH + '/scss/main.scss'
	])
		.pipe(sass())
		.on("error", notify.onError({
			message: "Error: <%= error.message %>"
		}))
		.pipe(autoPreFixer('last 101 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(SRCPATH + "/css"))
		.pipe(notify({ message: 'sass parse task complete' }));
});

//压缩css
gulp.task('mincss', ['sass'], function () {
	return gulp.src([
		SRCPATH + '/css/main.css',
		SRCPATH + '/css/compatibility.css'
	])
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(header('/**\n * <%= file.relative %>\n * build at: <%= new Date() %>\n */\n'))
		.pipe(gulp.dest(DISTPATH + '/css/'))
		.pipe(notify({ message: 'min css task complete' }))
});

gulp.task('scripts', function () {
	return gulp.src([
		SRCPATH + "/js/components/skeleton.js",
		SRCPATH + "/js/components/page.js",
		SRCPATH + "/js/components/modal.js",
		SRCPATH + "/js/components/select.js"
	]).pipe(concat('skeleton.js'))
		.pipe(header('/**\n * <%= file.relative %>\n * build at: <%= new Date() %>\n */\n'))
		.pipe(gulp.dest(DISTPATH + "/js/"))
		.pipe(rename("skeleton.min.js"))
		.pipe(uglify({
			mangle: true,
			toplevel: true
		}))
		.on("error", notify.onError({
			message: "Error: <%= error.message %>"
		}))
		.pipe(gulp.dest(DISTPATH + '/js/'))
		.pipe(notify({ message: 'Scripts task complete' }));
});

//文件修改监听
gulp.task('watch', function () {
	gulp.watch(SRCPATH + '/scss/**/*.scss', ['sass']);
	gulp.watch(SRCPATH + '/css/*.css', ['mincss']);
	gulp.watch(SRCPATH + '/js/**/*.js', ['scripts']);
	liveReload.listen();
	gulp.watch(SRCPATH + '**').on('change', liveReload.changed);
});
