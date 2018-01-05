import { extend, addClass, removeClass } from './util.js'
import _event from './event.js'
import Skeleton from '../skeleton.js'


let index = 0 //实例化组件数	  
let ZIndex = 9999

class Modal extends Skeleton {
	constructor(options) {
		super()

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
				this.close()
			},
			onButton2: (modal) => {
				this.close()     
			},
			onLoad: (modal) => { }
		}
		this.config = extend(config, options || {})
		this.index = ++index


		if (!this.config.coexist) {
			this.closeAll()
		}

		this.init()

	}

	init() {
		let config = this.config

		this.create()
		this.setZIndex()
		this.position()
		this.bindEvent()

		if (config.shade) {
			this.shade.style.display = "block"
		}

		this.open()
		if (typeof config.onLoad === "function") {
			config.onLoad.call(this, this.modal)
		}
	}
	create() {
		let config = this.config,
			button = config.button,
			bodyElem = document.querySelector('body'),
			i,
			innerTpl = '',
			shadeElem,
			modalElem = document.createElement("div")

		if (config.shade) {
			shadeElem = document.createElement("div")
			shadeElem.className = `sk-modal-shade modal-shade-${this.index}`
			shadeElem.setAttribute("key", this.index)
		}

		modalElem = document.createElement("div")
		modalElem.className = `sk-modal sk-modal-${this.index} ${config.skin}`
		modalElem.setAttribute("key", this.index)
		modalElem.style.visibility = "hidden"

		if (config.width) modalElem.style.width = config.width
		if (config.height) modalElem.style.height = config.height

		innerTpl += `<div class="modal-head">${config.title}`
		if (config.buttonClose) innerTpl += `<a href="javascript:" class="modal-close"></a>`

		innerTpl += `</div>`
		innerTpl += `<div class="modal-body">${config.content}</div>`
		if (button && button.length > 0) {
			innerTpl += `<div class="modal-footer">`
			for (i = 0; i < button.length; i++) {
				let key = i + 1
				innerTpl += `<button type="button" class="btn modal-btn modal-btn-${key}" key="${key}">${button[i]}</button>`
			}
			innerTpl += `</div>`
		}
		innerTpl += `</div>`

		modalElem.innerHTML = innerTpl
		if (config.shade) {
			bodyElem.appendChild(shadeElem)
			this.shade = shadeElem
		}
		bodyElem.appendChild(modalElem)
		this.modal = modalElem

	}
	position() {
		let winWdith = window.innerWidth,
			winHeight = window.innerHeight,
			width = this.modal.offsetWidth,
			height = this.modal.offsetHeight

		let left = (winWdith - width) / 2,
			top = (winHeight - height) / 2

		//绝对定位，加上滚动条卷去的高度	
		if (!this.config.fixed) {
			let scrollTop = document.documentElement.scrollTop + document.body.scrollTop
			let scrollLeft = document.documentElement.scrollLeft + document.body.scrollLeft
			left += scrollLeft
			top += scrollTop
			this.modal.style.position = 'absolute'
		}
		this.modal.style.left = `${left}px`
		this.modal.style.top = `${top}px`
	}
	setZIndex() {
		let config = this.config
		if (config.shade) {
			this.shade.style.zIndex = ZIndex + index
		}
		this.modal.style.zIndex = ++ZIndex + index
	}
	open() {
		let that = this
		addClass(that.modal, 'fadeInScale_SK')
		that.modal.style.display = 'block'
		that.modal.style.visibility = ''
		setTimeout(() => {
			removeClass(that.modal, 'fadeInScale_SK')
		}, 300)
	}
	close() {
		let that = this,
			config = this.config

		addClass(that.modal, 'fadeOutScale_SK')
		if (config.shade) {
			addClass(that.shade, 'transparent')
		}

		setTimeout(() => {
			that.modal.parentNode.removeChild(that.modal)
			if (config.shade) {
				that.shade.parentNode.removeChild(that.shade)
			}
		}, 300)
		index--
		ZIndex--
	}
	closeAll() {
		document.querySelectorAll(".sk-modal-shade,.sk-modal").forEach((v, k) => {
			v.parentNode.removeChild(v)
		})
		index = 0
		ZIndex = 9999
	}
	bindEvent() {
		let that = this,
			config = this.config,
			button = this.config.button

		_event.on(that.modal.querySelector('.modal-head .modal-close'), 'click', () => {
			that.close()
		})


		if (config.shadowClose) {
			_event.on(that.shade, 'click', () => {
				that.close()
			})
		}

		if (button && button.length > 0) {
			_event.on(that.modal.querySelectorAll('.modal-btn'), 'click', (e) => {
				var evt = e || window.event
				let key = evt.target.getAttribute("key")
				for (let i = 1; i <= button.length; i++) {
					if (key == i && typeof config["onButton" + i] === "function") {
						config["onButton" + i].call(that, that.modal)
					}
				}
			})
		}

		window.onresize = () => {
			that.position()
		}

	}
}

if (!window.Skeleton) window.Skeleton = Skeleton

window.Skeleton.modal = function (options) {
	return new Modal(options)
}
