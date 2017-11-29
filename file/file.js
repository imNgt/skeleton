var fs = require('fs');
var path = require('path');  

exports.getAllFiles=function (dir) {
	let filesArr =[];
	filesArr= fs.readdirSync(dir);
	return filesArr;
}

exports.aligetAllFiles = function (dir, callback) {
	var filesArr = [];
	dir = ///$/.test(dir) ? dir : dir + '/';
	(function dir(dirpath, fn) {
	  var files = fs.readdirSync(dirpath);
	  exports.async(files, function (item, next) {
		var info = fs.statSync(dirpath + item);
		if (info.isDirectory()) {
		  dir(dirpath + item + '/', function () {
			next();
		  });
		} else {
		  filesArr.push(dirpath + item);
		  callback && callback(dirpath + item);
		  next();
		}
	  }, function (err) {
		!err && fn && fn();
	  });
	})(dir);
	return filesArr;
  }