const path = require('path');
const gulp = require('gulp');
const gulpZip = require('gulp-zip');
const GulpSSH = require('gulp-ssh');
const config =require('./config.js');

const zipPath=__dirname;

var SSHObj = new GulpSSH({
    ignoreErrors: false,
    sshConfig: config.sshConfig
});



gulp.task('zip', function () {
	return gulp.src([
			path.resolve(zipPath+'**/**.**'),
			path.resolve(zipPath+'**/src/**/**'),
			path.resolve(zipPath+'**/www/**/**'),
			path.resolve(zipPath+'**/file/**/**')
		])
        .pipe(gulpZip('skeleton.zip'))
        .pipe(gulp.dest('./zip/'));
});

gulp.task('write', ['zip'],function () {
    return gulp.src('./zip/skeleton.zip')
        .pipe(SSHObj.sftp('write', '/home/project/skeleton.zip'));
});


gulp.task('push',['write'], function () {
    return SSHObj
        .shell(['cd /home/project','unzip -uo skeleton.zip','rm -fv skeleton.zip'], {filePath: 'skeleton.zip'})
        .pipe(gulp.dest('logs'));
});
