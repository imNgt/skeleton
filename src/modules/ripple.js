import { extend, isElement, addClass } from './util.js'
import { on as addEvent } from './event.js'
import Skeleton from '../skeleton.js'

let index = 0//实例化组件数	
let CLASS_RIPPLE = "sk-ripple", CLASS_WRAP = "ripple-wrap"

export default class Ripple extends Skeleton {
	constructor(options) {
		super()
		/**
		 * elem渲染的元素的选择器
		 * trigger 触发事件数组
		 */   
		let config = {
			elem: "",
			trigger: ["click", "touchstart"] 
		}

		this.config = extend(config, options || {})
		this.index = ++index
		this.init()
	}

	init() {
		if (isElement(this.config.elem)) {
			this.elem = this.config.elem
		} else {
			this.elem = document.querySelectorAll(this.config.elem)
		}
		if (this.elem.length < 1) {
			return
		}
		this.bindEvent()
	}

	bindEvent() {
		let that = this
		that.elem.forEach(v => {
			that.config.trigger.forEach(ev => {
				addEvent(v, ev, (e) => {
					let evt = e || window.event
					that.render(evt)
				})
			})

		})
	}

	render(e) {
		let that = this,
			target = e.target,
			coord = that.getCoordinate(e),
			diameter = Math.max(target.clientWidth, target.clientWidth),
			rippleElem = document.createElement('span')
		rippleElem.className = CLASS_RIPPLE
		rippleElem.style.width = `${diameter}px`
		rippleElem.style.height = `${diameter}px`

		//相对taget坐标定位rippleElem的中心
		let x = coord.x - that.offset(target).left - diameter / 2,
			y = coord.y - that.offset(target).top - diameter / 2

		rippleElem.style.top = `${y}px`
		rippleElem.style.left = `${x}px`

		addClass(target, CLASS_WRAP)
		target.appendChild(rippleElem)
		addClass(rippleElem, 'ripple-animate')
		setTimeout(() => {
			target.removeChild(rippleElem)
		}, 1500)

	}

	//返回相对可视区域的坐标,包含已滚动距离
	getCoordinate(e) {
		let docElem = document.documentElement,
			docBody = document.body,
			scrollTop = docElem.scrollTop || docBody.scrollTop,
			scrollLeft = docElem.scrollLeft || docBody.scrollLeft,
			clientTop = docElem.clientTop || docBody.clientTop,
			clientLeft = docElem.clientLeft || docBody.clientLeft

		let pageX = e.pageX ? e.pageX : e.clientX + scrollLeft - clientLeft,
			pageY = e.pageY ? e.pageY : e.clientY + scrollTop - clientTop

		return {
			x: pageX,
			y: pageY
		}
	}

}




