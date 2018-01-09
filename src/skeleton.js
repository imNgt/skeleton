export default class Skeleton {
	constructor() {
		this.config = {}
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
		var doc, docElem, rect, win

		if (!elem) {
			return
		}
		// ie处理
		if (!elem.getClientRects().length) {
			return { top: 0, left: 0 }
		}

		rect = elem.getBoundingClientRect()

		doc = elem.ownerDocument
		docElem = doc.documentElement
		win = doc.defaultView

		//pageYOffset返回文档在垂直方向已滚动的像素值
		//clientTop返回边框宽度
		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		}
	}
}
