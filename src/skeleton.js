export default  class Skeleton {
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
}
