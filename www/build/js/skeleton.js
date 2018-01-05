(function () {
'use strict';

const isArray = Array.isArray || ((object) => {  });

const isArrayLike = function (collection) {
	const length = collection.length;
	return typeof length == 'number' && length >= 0 && length <= (Math.pow(2, 53) - 1)
};

const isFunction = (value) => {
	typeof value == "function";
};

const isWindow = (obj) => {
	obj != null && obj == obj.window;
};

const isDocument = (obj) => {
	obj != null && obj.nodeType == obj.DOCUMENT_NODE;
};

const isObject = (obj) => {
	typeof obj == "object";
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

const hasClass = (element, cls) => {
	if (!(element && element.nodeType === 1)) return

	return element.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

const addClass = (element, cls) => {
	if (!(element && element.nodeType === 1)) return

	if (!hasClass(element, cls)) element.className += " " + cls;
	return element
};

const removeClass = (element, cls) => {
	if (!(element && element.nodeType === 1)) return

	if (hasClass(element, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		element.className = element.className.replace(reg, ' ');
	}
	return element
};

const toggleClass = (element, cls) => {
	if (!(element && element.nodeType === 1)) return

	if (hasClass(element, cls)) {
		removeClass(element, cls);
	} else {
		addClass(element, cls);
	}
	return element
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

var util$1 = {
	isArray,
	isArrayLike,
	isFunction,
	isWindow,
	isDocument,
	isObject,
	isPlainObject,
	extend,
	hasClass,
	addClass,
	removeClass,
	toggleClass,
	isMobile,
	stopBubble

}

const add = (element, type, handler, bubble) => {
	if (!(element && element.nodeType === 1) || typeof handler !== 'function') {
		return
	}
	if (window.addEventListener) {

		element.addEventListener(type, handler, bubble || false);
	}
	else if (window.attachEvent) {
		//IE
		element.attachEvent(`on${type}`, handler);
	}
};

const on = (element, type, handler, bubble) => {
	if (util$1.isArrayLike(element)) {
		element.forEach(v => {
			add(v, type, handler, bubble);
		});
	} else {
		add(element, type, handler, bubble);
	}
};

const remove = (element, type, handler) => {
	if (!(element && element.nodeType === 1) || typeof handler !== 'function') {
		return
	}
	if (window.removeEventListener) {

		element.removeEventListener(type, handler);
	}
	else if (window.detachEvent) {
		//IE
		element.detachEvent(`on${type}`, handler);
	}
};


var _event = {
	on,
	remove
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
			shadowClose: false,
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
		this.config = uextend(config, options || {});
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
			this.shade.style.display = "block";
		}

		this.open();
		if (typeof config.onLoad === "function") {
			config.onLoad.call(this, this.modal);
		}
	}
	create() {
		let config = this.config,
			button = config.button,
			bodyElem = document.querySelector('body'),
			i,
			innerTpl = '',
			shadeElem,
			modalElem = document.createElement("div");

		if (config.shade) {
			shadeElem = document.createElement("div");
			shadeElem.className = `sk-modal-shade modal-shade-${this.index}`;
			shadeElem.setAttribute("key", this.index);
		}

		modalElem = document.createElement("div");
		modalElem.className = `sk-modal sk-modal-${this.index} ${config.skin}`;
		modalElem.setAttribute("key", this.index);
		modalElem.style.visibility = "hidden";

		if (config.width) modalElem.style.width = config.width;
		if (config.height) modalElem.style.height = config.height;

		innerTpl += `<div class="modal-head">${config.title}`;
		if (config.buttonClose) innerTpl += `<a href="javascript:" class="modal-close"></a>`;

		innerTpl += `</div>`;
		innerTpl += `<div class="modal-body">${config.content}</div>`;
		if (button && button.length > 0) {
			innerTpl += `<div class="modal-footer">`;
			for (i = 0; i < button.length; i++) {
				let key = i + 1;
				innerTpl += `<button type="button" class="btn modal-btn modal-btn-${key}" key="${key}">${button[i]}</button>`;
			}
			innerTpl += `</div>`;
		}
		innerTpl += `</div>`;

		modalElem.innerHTML = innerTpl;
		if (config.shade) {
			bodyElem.appendChild(shadeElem);
			this.shade = shadeElem;
		}
		bodyElem.appendChild(modalElem);
		this.modal = modalElem;

	}
	position() {
		let winWdith = window.innerWidth,
			winHeight = window.innerHeight,
			width = this.modal.offsetWidth,
			height = this.modal.offsetHeight;

		let left = (winWdith - width) / 2,
			top = (winHeight - height) / 2;

		//绝对定位，加上滚动条卷去的高度	
		if (!this.config.fixed) {
			let scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
			let scrollLeft = document.documentElement.scrollLeft + document.body.scrollLeft;
			left += scrollLeft;
			top += scrollTop;
			this.modal.style.position = 'absolute';
		}
		this.modal.style.left = `${left}px`;
		this.modal.style.top = `${top}px`;
	}
	setZIndex() {
		let config = this.config;
		if (config.shade) {
			this.shade.style.zIndex = ZIndex + index;
		}
		this.modal.style.zIndex = ++ZIndex + index;
	}
	open() {
		let that = this;
		util.addClass(that.modal, 'fadeInScale_SK');
		that.modal.style.display = 'block';
		that.modal.style.visibility = '';
		setTimeout(() => {
			util.removeClass(that.modal, 'fadeInScale_SK');
		}, 300);
	}
	close() {
		let that = this,
			config = this.config;

		util.addClass(that.modal, 'fadeOutScale_SK');
		if (config.shade) {
			util.addClass(that.shade, 'transparent');
		}

		setTimeout(() => {
			that.modal.parentNode.removeChild(that.modal);
			if (config.shade) {
				that.shade.parentNode.removeChild(that.shade);
			}
		}, 300);
		index--;
		ZIndex--;
	}
	closeAll() {
		document.querySelectorAll(".sk-modal-shade,.sk-modal").forEach((v, k) => {
			v.parentNode.removeChild(v);
		});
		index = 0;
		ZIndex = 9999;
	}
	bindEvent() {
		let that = this,
			config = this.config,
			button = this.config.button;

		_event.on(that.modal.querySelector('.modal-head .modal-close'), 'click', () => {
			that.close();
		});


		if (config.shadowClose) {
			_event.on(that.shade, 'click', () => {
				that.close();
			});
		}

		if (button && button.length > 0) {
			_event.on(that.modal.querySelectorAll('.modal-btn'), 'click', (e) => {
				var evt = e || window.event;
				let key = evt.target.getAttribute("key");
				for (let i = 1; i <= button.length; i++) {
					if (key == i && typeof config["onButton" + i] === "function") {
						config["onButton" + i].call(that, that.modal);
					}
				}
			});
		}

		window.onresize = () => {
			that.position();
		};

	}
}

if (!window.Skeleton) window.Skeleton = Skeleton;

window.Skeleton.modal = function (options) {
	return new Modal(options)
};

}());
