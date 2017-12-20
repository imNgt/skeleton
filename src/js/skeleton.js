require('../scss/main.scss');

;
(function ($, window) {

    var Skeleton = function (options) {
        this.config = {

        }
    }
    //继承
    Function.prototype.inherits = function (parent) {
        var F = function () {};
        F.prototype = parent.prototype;
        var f = new F();

        for (var prop in this.prototype) f[prop] = this.prototype[prop];
        this.prototype = f;
        this.prototype.super = parent.prototype;
    };

    var isArray = Array.isArray || function (object) { return object instanceof Array }

    function isFunction(value) {
        return type(value) == "function"
    }

    function isWindow(obj) {
        return obj != null && obj == obj.window
    }

    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE
    }

    function isObject(obj) {
        return type(obj) == "object"
    }

    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }

    Skeleton.prototype = {
        inArray: function (val, arr) {
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
        inSeries: function (val, arr, key) {
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
        getItem: function (val, arr, key) {
            if (arr && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i][key] === val) {
                        return arr[i]
                    }
                }
            }
            return "";
        },
        //阻止事件冒泡
        stopBubble: function (e) {
            if (e && e.stopPropagation) { //非IE 
                e.stopPropagation();
            } else { //IE 
                window.event.cancelBubble = true;
            }
        },
        //extend
        extend: function _extend(target, source, deep) {
            for (var key in source) {
                if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
					
					console.log(key)

                    if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                        target[key] = {}
                    }
                    if (isArray(source[key]) && !isArray(target[key])) {
                        target[key] = []
                    }
                    _extend(target[key], source[key], deep)

                } else if (source[key] !== undefined) {
                    target[key] = source[key]
                }
			}
			return target

        }
    }


    /* 静态 */
    Skeleton.isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        Skeleton.isMobile = true
    }

    window.Skeleton = Skeleton;

})(jQuery, window);