import util from './util.js'
      
const add = (element, type, handler, bubble) => {
	if (!(element && element.nodeType === 1) || typeof handler !== 'function') {
		return
	}
	if (window.addEventListener) {

		element.addEventListener(type, handler, bubble || false)
	}
	else if (window.attachEvent) {
		//IE
		element.attachEvent(`on${type}`, handler)
	}
}

const on = (element, type, handler, bubble) => {
	if (util.isArrayLike(element)) {
		element.forEach(v => {
			add(v, type, handler, bubble)
		})
	} else {
		add(element, type, handler, bubble)
	}
}

const remove = (element, type, handler) => {
	if (!(element && element.nodeType === 1) || typeof handler !== 'function') {
		return
	}
	if (window.removeEventListener) {

		element.removeEventListener(type, handler)
	}
	else if (window.detachEvent) {
		//IE
		element.detachEvent(`on${type}`, handler)
	}
}


export {
	on,
	remove
}