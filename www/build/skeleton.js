(function () {
'use strict';

const isArray = Array.isArray || ((object) => {  });

const isFunction = (value) => {
	type(value) == "function";
};

const isWindow = (obj) => {
	obj != null && obj == obj.window;
};

const isDocument = (obj) => {
	obj != null && obj.nodeType == obj.DOCUMENT_NODE;
};

const isObject = (obj) => {
	type(obj) == "object";
};

const isPlainObject = (obj) => {
	isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
};

const extend = (target, source, deep) => {
	for (var key in source) {
		if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {

			console.log(key);

			if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
				target[key] = {};
			}
			if (isArray(source[key]) && !isArray(target[key])) {
				target[key] = [];
			}
			extend(target[key], source[key], deep);

		} else if (source[key] !== undefined) {
			target[key] = source[key];
		}
	}
	return target

};

//阻止事件冒泡
const stopBubble = (e) => {
	if (e && e.stopPropagation) { //非IE 
		e.stopPropagation();
	} else { //IE 
		window.event.cancelBubble = true;
	}
};

const isMobile = (params) => {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return true;
	}
	return false;

};

var util = {
	isFunction,
	isWindow,
	isDocument,
	isObject,
	isPlainObject,
	extend,
	isMobile,
	stopBubble

}

class Skeleton {
	constructor() {
		this.config = {};
	}

	inArray(val, arr) {
		if (arr && arr.length > 0) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === val) {
					return true;
				}
			}
		}
		return false;
	}
	// 元素是否在数组对象中
	inSeries(val, arr, key) {
		if (arr && arr.length > 0) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i][key] === val) {
					return true
				}
			}
		}
		return false;
	}
	// 获取数组对象中的对象元素
	getItem(val, arr, key) {
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

let index = 0; //实例化组件数	
let ZIndex = 9999;

console.log(Skeleton,util);

class Modal extends Skeleton {
	constructor(options) {
		super();

		let config = {
			content: '',
			shade: .1,
			skin: 'modal',
			width: "400px",
			height: "",
			title: "提示",
			coexist: false,
			ZIndex: false,
			fixed: true,
			shadowClose: true,
			buttonClose: true,
			button: ["取消", "确定"],
			onButton1: (modal) => {
				this.close();
			},
			onButton2: (modal) => {
				this.close();
			},
			onLoad: (modal) => { }
		};
		this.config = util.extend(config, options || {});
		this.index = ++index;


		if (!this.config.coexist) {
			this.closeAll();
		}

		this.init();

	}

	init() {
		let config = this.config;

		this.create();
		this.setZIndex();
		this.position();
		this.bindEvent();

		if (config.shade) {
			this.shade.show();
		}

		this.open();
		if (typeof config.onLoad === "function") {
			config.onLoad.call(this, this.modal);
		}
	}
	create() {
		let config = this.config,
			i, button = config.button,
			temp = "";

		if (config.shade) {
			temp += '<div class="sk-modal-shade modal-shade-' + this.index + '" key="' + this.index + '"></div>';
		}

		temp += '<div class="sk-modal sk-modal-' + this.index + ' ' + config.skin;

		temp += '" style="';
		if (config.width) {
			temp += 'width:' + config.width;
		}
		if (config.height) {
			temp += ';height:' + config.height;
		}
		// temp += ';display:none; '
		temp += '" key="' + this.index + '">';

		temp += '<div class="modal-head">' + config.title;
		if (config.buttonClose) {
			temp += '<a href="javascript:" class="modal-close"></a>';
		}
		temp += '</div>';

		temp += '<div class="modal-body">' + config.content + '</div>';

		if (button && button.length > 0) {
			temp += '<div class="modal-footer">';
			for (i = 0; i < button.length; i++) {
				let key = i + 1;
				temp += '<button type="button" class="btn modal-btn modal-btn-"' + key + '" key="' + key + '">' + button[i] + '</button>';
			}
			temp += '</div>';
		}
		temp += '</div>';

		$('body').append($(temp));

		this.modal = $("body").find(".sk-modal-" + this.index);
		if (config.shade) {
			this.shade = $("body").find(".modal-shade-" + this.index);
		}

	}
	position() {
		let winWdith = $(window).width(),
			winHeight = $(window).height(),
			width = this.modal.outerWidth(),
			height = this.modal.outerHeight();

		let left = (winWdith - width) / 2,
			top = (winHeight - height) / 2;

		//绝对定位，加上滚动条卷去的高度	
		if (!this.config.fixed) {
			let scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
			let scrollLeft = document.documentElement.scrollLeft + document.body.scrollLeft;
			left += scrollLeft;
			top += scrollTop;
			this.modal.css({ position: "absolute" });
		}

		this.modal.css({ "left": left, "top": top });
	}
	setZIndex() {
		let config = this.config;
		if (config.shade) {
			this.shade.css({ "z-index": ZIndex + index });
		}
		this.modal.css({ "z-index": ++ZIndex + index });
	}
	open() {
		let that = this;
		that.modal.addClass("fadeInScale_SK").show();
		setTimeout(() => {
			that.modal.removeClass("fadeInScale_SK");
		}, 300);
	}
	close() {
		let that = this,
			config = this.config;

		that.modal.addClass("fadeOutScale_SK");
		if (config.shade) {
			that.shade.addClass("transparent");
		}

		setTimeout(() => {
			that.modal.remove();
			if (config.shade) {
				that.shade.remove();
			}
		}, 300);
		index--;
		ZIndex--;
	}
	closeAll() {
		$(".sk-modal-shade,.sk-modal").remove();
		index = 0;
		ZIndex = 9999;
	}
	bindEvent() {
		let that = this,
			config = this.config,
			button = this.config.button;
		that.modal.on("click", ".modal-head .modal-close", () => {
			that.close();
		});

		if (config.shadowClose) {
			$(".sk-modal-shade.modal-shade-" + that.index).on("click", () => {
				that.close();
			});
		}

		if (button && button.length > 0) {
			that.modal.find(".modal-btn").click(() => {
				let key = this.getAttribute("key");
				for (let i = 1; i <= button.length; i++) {
					if (key == i && typeof config["onButton" + i] === "function") {
						config["onButton" + i].call(that, that.modal);
					}
				}
			});
		}

		$(window).resize(() => {
			that.position();
		});

	}
}

window.Skeleton=Skeleton;


Skeleton.modal = function (options) {
	return new Modal(options)
};

}());
