const isArray = Array.isArray || ((object) => { object instanceof Array })

const isFunction = (value) => {
	type(value) == "function"
}

const isWindow = (obj) => {
	obj != null && obj == obj.window
}

const isDocument = (obj) => {
	obj != null && obj.nodeType == obj.DOCUMENT_NODE
}

const isObject = (obj) => {
	type(obj) == "object"
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

export default{
	isFunction,
	isWindow,
	isDocument,
	isObject,
	isPlainObject,
	extend,
	isMobile,
	stopBubble

}