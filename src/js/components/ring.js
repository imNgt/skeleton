;
(function () {
    var lastTime = 0
    var vendors = ['webkit', 'moz']
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
            window[vendors[x] + 'CancelRequestAnimationFrame']
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime()
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime))

            var id = window.setTimeout(function () {
                callback(currTime + timeToCall)
            }, timeToCall)

            lastTime = currTime + timeToCall

            return id
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id)
        }
    }
}());
(function (Skeleton, $) {

    var index = 0 //实例化组件数	

    var Ring = function (options) {
        var config = {
            id: "",
            width: "",
            height: ""
        }

        this.config = this.extend(config, options || {})
        this.index = ++index
        this.elem = document.getElementById(this.config.id)

        if (!this.elem) {
            return
        }

        this.init()
    }

    Ring.prototype = {
        init: function () {
            var config = this.config,
                width = config.width || this.elem.offsetWidth,
                height = config.height || this.elem.offsetHeight,
                radius = Math.min(width, height) / 2

			var canvas = document.createElement("canvas")
			
			

            this.elem.appendChild(canvas)

           
            if (canvas.getContext) {
				var ctx = canvas.getContext('2d')
				
				//消除锯齿感 
				if (window.devicePixelRatio) {
					canvas.style.width = width + "px"
					canvas.style.height = height + "px"
					canvas.height = height * window.devicePixelRatio
					canvas.width = width * window.devicePixelRatio
					ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
				}else{
					canvas.width = width
					canvas.height = height
				}

                ctx.fillStyle = 'red'

				this.sector(ctx, 100, 100, radius, 0, 320)  

            }

        },
        sector: function (ctx, x, y, r, angle1, angle2) {

			var angle = angle1
			
			;(function _draw(){
				requestAnimationFrame(function () {
					ctx.save()
					ctx.beginPath()
					ctx.moveTo(x, y)
					ctx.arc(x, y, r, (angle-0.5) * Math.PI / 180, (angle+=5) * Math.PI / 180, false)
					ctx.closePath()
					ctx.restore()
					ctx.fill()

					if (angle < angle2) {
						_draw()
					} 
				})
			})()
  
        }

    }

    Ring.inherits(Skeleton)

    Skeleton.ring = function (options) {
        return new Ring(options)
    }

})(Skeleton, jQuery)