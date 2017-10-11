if (typeof jQuery === 'undefined') {throw new Error('jQuery is required')};
;(function($,window){

	var Skeleton=function(options){
		this.config={

		}
		this.options=$.extend(this.config,options||{})
	}

	Function.prototype.inherits = function(parent){
        var F = function () {};
        F.prototype = parent.prototype;
        var f = new F();

        for (var prop in this.prototype) f[prop] = this.prototype[prop];
        this.prototype = f;
        this.prototype.super = parent.prototype;
    };

	Skeleton.prototype={

	} 

	Skeleton.isMobile = false;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		Skeleton.isMobile = true
	}

	window.Skeleton=Skeleton;
             
})(jQuery,window);