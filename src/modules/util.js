const isArray = Array.isArray || ((object) => { object instanceof Array })

const isArrayLike = function (collection) {
	const length = collection.length
	return typeof length == 'number' && length >= 0 && length <= (Math.pow(2, 53) - 1)
}

const isFunction = (value) => {
	typeof value == "function"
}

const isWindow = (obj) => {
	obj != null && obj == obj.window
}

const isDocument = (obj) => {
	obj != null && obj.nodeType == obj.DOCUMENT_NODE
}

const isObject = (obj) => {
	typeof obj == "object"
}

const isPlainObject = (obj) => {
	isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
}

const extend = (target, source, deep) => {
	for (var key in source) {
		if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
			console.log(key)
			if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
				target[key] = {}
			}
			if (isArray(source[key]) && !isArray(target[key])) {
				target[key] = []
			}
			extend(target[key], source[key], deep)

		} else if (source[key] !== undefined) {
			target[key] = source[key]
		}
	}
	return target

}

const hasClass = (element, cls) => {
	if (!(element && element.nodeType === 1)) return

	return element.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

const addClass = (element, cls) => {
	if (!(element && element.nodeType === 1)) return

	if (!hasClass(element, cls)) element.className += " " + cls;
	return element
}

const removeClass = (element, cls) => {
	if (!(element && element.nodeType === 1)) return

	if (hasClass(element, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		element.className = element.className.replace(reg, ' ');
	}
	return element
}

const toggleClass = (element, cls) => {
	if (!(element && element.nodeType === 1)) return

	if (hasClass(element, cls)) {
		removeClass(element, cls);
	} else {
		addClass(element, cls);
	}
	return element
}

const isElement = (obj) => {
	!!(obj && obj.nodeType === 1)
}

//阻止事件冒泡
const stopBubble = (e) => {
	if (e && e.stopPropagation) { //非IE 
		e.stopPropagation();
	} else { //IE 
		window.event.cancelBubble = true;
	}
}

const isMobile = (params) => {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return true;
	}
	return false;

}

export {
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
	isElement,
	isMobile,
	stopBubble
}