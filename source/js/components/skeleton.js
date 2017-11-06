if (typeof jQuery === 'undefined') {throw new Error('jQuery is required')};
;(function($,window){

	var Skeleton=function(options){
		this.config={

		}
		this.options=$.extend(this.config,options||{})
	}
	//继承
	Function.prototype.inherits = function(parent){
        var F = function () {};
        F.prototype = parent.prototype;
        var f = new F();

        for (var prop in this.prototype) f[prop] = this.prototype[prop];
        this.prototype = f;
        this.prototype.super = parent.prototype;
    };

	Skeleton.prototype={
		inArray : function (val, arr) {
			if (arr && arr.length > 0) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] === val) {
						return true
					}
				}
			}
			return false;
		},
		// 元素是否在数组对象中
		inSeries : function (val, arr, key) {
			if (arr && arr.length > 0) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i][key] === val) {
						return true
					}
				}
			}
			return false;
		},
		// 获取数组对象中的对象元素
		getItem : function (val, arr, key) {
			if (arr && arr.length > 0) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i][key] === val) {
						return arr[i]
					}
				}
			}
			return "";
		}
	} 

	Skeleton.isMobile = false;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		Skeleton.isMobile = true
	}

	window.Skeleton=Skeleton;
             
})(jQuery,window);