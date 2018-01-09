(function () {
'use strict';

const isArray = Array.isArray || ((object) => {  });

const isArrayLike = function (collection) {
	const length = collection.length;
	return typeof length == 'number' && length >= 0 && length <= (Math.pow(2, 53) - 1)
};

const isWindow = (obj) => {
	obj != null && obj == obj.window;
};

const isObject = (obj) => {
	
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

const isElement = (obj) => {
	!!(obj && obj.nodeType === 1);
};

//阻止事件冒泡

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
	if (isArrayLike(element)) {
		element.forEach(v => {
			add(v, type, handler, bubble);
		});
	} else {
		add(element, type, handler, bubble);
	}
};

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

	//获取匹配元素在当前视口的相对偏移,包括已滚动的距离
	offset(elem) {
		var doc, docElem, rect, win;

		if (!elem) {
			return
		}
		// ie处理
		if (!elem.getClientRects().length) {
			return { top: 0, left: 0 }
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		//pageYOffset返回文档在垂直方向已滚动的像素值
		//clientTop返回边框宽度
		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		}
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
		this.config = extend(config, options || {});
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
		addClass(that.modal, 'fadeInScale_SK');
		that.modal.style.display = 'block';
		that.modal.style.visibility = '';
		setTimeout(() => {
			removeClass(that.modal, 'fadeInScale_SK');
		}, 300);
	}
	close() {
		let that = this,
			config = this.config;

		addClass(that.modal, 'fadeOutScale_SK');
		if (config.shade) {
			addClass(that.shade, 'transparent');
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

		on(that.modal.querySelector('.modal-head .modal-close'), 'click', () => {
			that.close();
		});


		if (config.shadowClose) {
			on(that.shade, 'click', () => {
				that.close();
			});
		}

		if (button && button.length > 0) {
			on(that.modal.querySelectorAll('.modal-btn'), 'click', (e) => {
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

let index$1 = 0;//实例化组件数	
let CLASS_RIPPLE = "sk-ripple";
let CLASS_WRAP = "ripple-wrap";

class Ripple extends Skeleton {
	constructor(options) {
		super();
		/**
		 * elem渲染的元素的选择器
		 * trigger 触发事件数组
		 */   
		let config = {
			elem: "",
			trigger: ["click", "touchstart"] 
		};

		this.config = extend(config, options || {});
		this.index = ++index$1;
		this.init();
	}

	init() {
		if (isElement(this.config.elem)) {
			this.elem = this.config.elem;
		} else {
			this.elem = document.querySelectorAll(this.config.elem);
		}
		if (this.elem.length < 1) {
			return
		}
		this.bindEvent();
	}

	bindEvent() {
		let that = this;
		that.elem.forEach(v => {
			that.config.trigger.forEach(ev => {
				on(v, ev, (e) => {
					let evt = e || window.event;
					that.render(evt);
				});
			});

		});
	}

	render(e) {
		let that = this,
			target = e.target,
			coord = that.getCoordinate(e),
			diameter = Math.max(target.clientWidth, target.clientWidth),
			rippleElem = document.createElement('span');
		rippleElem.className = CLASS_RIPPLE;
		rippleElem.style.width = `${diameter}px`;
		rippleElem.style.height = `${diameter}px`;

		//相对taget坐标定位rippleElem的中心
		let x = coord.x - that.offset(target).left - diameter / 2,
			y = coord.y - that.offset(target).top - diameter / 2;

		rippleElem.style.top = `${y}px`;
		rippleElem.style.left = `${x}px`;

		addClass(target, CLASS_WRAP);
		target.appendChild(rippleElem);
		addClass(rippleElem, 'ripple-animate');
		setTimeout(() => {
			target.removeChild(rippleElem);
		}, 1500);

	}

	//返回相对可视区域的坐标,包含已滚动距离
	getCoordinate(e) {
		let docElem = document.documentElement,
			docBody = document.body,
			scrollTop = docElem.scrollTop || docBody.scrollTop,
			scrollLeft = docElem.scrollLeft || docBody.scrollLeft,
			clientTop = docElem.clientTop || docBody.clientTop,
			clientLeft = docElem.clientLeft || docBody.clientLeft;

		let pageX = e.pageX ? e.pageX : e.clientX + scrollLeft - clientLeft,
			pageY = e.pageY ? e.pageY : e.clientY + scrollTop - clientTop;

		return {
			x: pageX,
			y: pageY
		}
	}

}

if (!window.Skeleton) window.Skeleton = Skeleton;

window.Skeleton.ripple = function (options) {
	return new Ripple(options)
};

window.Skeleton.modal = function (options) {
	return new Modal(options)
};

}());
