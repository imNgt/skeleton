var fs = require('fs');
var path = require('path');  

exports.getAllFiles=(dir) =>{
	let filesArr =[]
	;(function readFiles(dir) {
		let files=fs.readdirSync(dir)

		if(files.length){
			files.forEach((v,k)=>{
				let filedir=path.join(dir,v),
					stats=fs.statSync(filedir)
					
				if(stats.isFile()){
					filesArr.unshift(filedir)
				}else if(stats.isDirectory()){
					readFiles(filedir)
				}
			})
		}
			
	})(dir)

	return filesArr

}



