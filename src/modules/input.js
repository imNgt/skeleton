import Modal from './modal'
import Ripple from './ripple'
import Skeleton from '../skeleton.js'

if (!window.Skeleton) window.Skeleton = Skeleton

window.Skeleton.ripple = function (options) {
	return new Ripple(options)
}

window.Skeleton.modal = function (options) {
	return new Modal(options)
}
