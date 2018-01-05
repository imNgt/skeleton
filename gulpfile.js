const path = require('path'),
	gulp = require('gulp'),
	gulpZip = require('gulp-zip'),
	GulpSSH = require('gulp-ssh'),
	sass = require('gulp-sass'),
	autoPreFixer = require('gulp-autoprefixer'),
	minifyCss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	header = require('gulp-header'),
	cleanCSS = require('gulp-clean-css'),
	config = require('./config.js')
	
//路径配置
const zipPath = __dirname
const srcPath = path.resolve(__dirname, 'src')
const distPath = path.resolve(__dirname, 'www/build')

const SSHObj = new GulpSSH({
	ignoreErrors: false,
	sshConfig: config.sshConfig
})


//解析sass
gulp.task('sass', function () {
	return gulp.src([
		srcPath + '/scss/main.scss'
	])
		.pipe(sass())
		.on("error", notify.onError({
			message: "Error: <%= error.message %>"
		}))
		.pipe(autoPreFixer('last 101 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(distPath + "/css"))
		.pipe(notify({ message: 'sass parse task complete' }))
})

//压缩css
gulp.task('mincss', ['sass'], function () {
	return gulp.src([
		distPath + '/css/main.css'
	])
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		// .pipe(rename("main.min.css"))
		.pipe(header('/**\n * <%= file.relative %>\n * build at: <%= new Date() %>\n */\n'))
		.pipe(gulp.dest(distPath + '/css/'))
		.pipe(notify({ message: 'min css task complete' }))
})

//文件修改监听
gulp.task('watch', function () {
	gulp.watch(srcPath + '/scss/**/*.scss', ['sass'])
	gulp.watch(srcPath + '/css/*.css', ['mincss'])
})
//生产
gulp.task('build', ['sass', 'mincss'])

//同步到远程
gulp.task('zip', function () {
	return gulp.src([
		path.resolve(zipPath + '**/**.**'),
		path.resolve(zipPath + '**/src/**/**'),
		path.resolve(zipPath + '**/www/**/**'),
		path.resolve(zipPath + '**/file/**/**')
	])
		.pipe(gulpZip('skeleton.zip'))
		.pipe(gulp.dest('./zip/'))
})

gulp.task('write', ['zip'], function () {
	return gulp.src('./zip/skeleton.zip')
		.pipe(SSHObj.sftp('write', '/home/project/skeleton.zip'))
})

gulp.task('push', ['write'], function () {
	return SSHObj
		.shell(['cd /home/project', 'unzip -uo skeleton.zip', 'rm -fv skeleton.zip'], { filePath: 'skeleton.zip' })
		.pipe(gulp.dest('logs'))
})
