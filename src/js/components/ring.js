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
            height: "",
            labelHeight: 35,
            data: [],
            colors: ["#84B7DE", "#9CCB6F", "#FFC761", "#EA6C61"]
        }

        this.config = this.extend(config, options || {})
        this.index = ++index
        this.elem = document.getElementById(this.config.id)

        if (!this.elem) {
            return
        }

        //test
        this.config.data = [
            { value: 30, name: "data1" },
            { value: 3, name: "data2" },
            { value: 3, name: "data3" },
            { value: 36, name: "data4" },
        ]

        this.init()
    }

    var labelH = []

    Ring.prototype = {

        init: function () {
            var that = this,
                config = that.config,
                width = config.width || that.elem.offsetWidth,
                height = config.height || that.elem.offsetHeight,
                xo = width / 2, //坐标原点
                yo = height / 2,
                radius = Math.min(width, height) / 2 - 50, //半径
                points = that.getPoints() //画图边界点

            var canvas = document.createElement("canvas")

            that.elem.appendChild(canvas)

            this.config.width = width
            this.config.height = height

            if (canvas.getContext) {
                var ctx = canvas.getContext('2d')

                //消除锯齿感 
                if (window.devicePixelRatio) {
                    canvas.style.width = width + "px"
                    canvas.style.height = height + "px"
                    canvas.height = height * window.devicePixelRatio
                    canvas.width = width * window.devicePixelRatio
                    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
                } else {
                    canvas.width = width
                    canvas.height = height
                }

                that.drawChart(ctx, xo, yo, radius, points)

            }

        },

        drawChart: function (ctx, xo, yo, radius, points) {
            var that = this,
                config = that.config,
                colors = config.colors,
                key = 0,
                midPoints = that.getMiddlePoints(points)


            this.allogLableY(xo, yo, radius, midPoints)

            ;
            (function _chart() {
                ctx.fillStyle = colors[key]
                that.drawRing(ctx, xo, yo, radius, points[key], points[key + 1], function () {
                    //画线
                    that.renderLabel(ctx, xo, yo, radius, midPoints[key], key)

                    key++

                    if (key < config.data.length) {
                        _chart()
                    }
                })
            })()
        },

        allogLableY: function (xo, yo, radius, points) {
            var that = this,
                config = this.config,
                colors = config.colors

            var R1 = radius + 10, //第一段折线起点
                R2 = R1 + 20, //第二段折线起点 
                initYs = [],
                cos, sin, i, j, temp, y2

            points.forEach(function (alpha) {

                cos = Math.cos(alpha * Math.PI / 180)
                sin = Math.sin(alpha * Math.PI / 180)

                y2 = yo + R2 * sin
                initYs.push({
                    y: y2,
                    cos: cos > 0 ? 1 : 0
                })

            })
            console.log("Y2000: ", initYs)

            for (i = 0; i < initYs.length; i++) {
                temp = initYs[i].y
                for (j = 0; j < initYs.length; j++) {
                    if ((Math.abs(temp - initYs[j].y) < config.labelHeight) && j != i && initYs[i].cos != initYs[j].cos) {
                        console.log(initYs[i], initYs[j].y, i)
                        initYs[i].y = temp > initYs[j].y ? (temp + config.labelHeight) : (temp - config.labelHeight)
                        // console.log("set "+ initYs[i].y +"  I: "+i)
                    }
                }
                // initYs.forEach(function (v, j) {
                // 	// console.log(Math.abs(temp - v.y), config.labelHeight) 
                //     if ((Math.abs(temp - v.y) < config.labelHeight) && k != i && initYs[i].cos != v.cos) {
                // 		console.log(initYs[i],v.y,i)
                // 		initYs[i].y =temp > v.y ? (temp + config.labelHeight) : (temp - config.labelHeight)
                //         // console.log("set "+ initYs[i].y +"  I: "+i)
                //     }
                // })
            }

            console.log("Y2: ", initYs)
        },

        /** 渲染说明文字
         * ctx 绘图对象
         * xo、yo:原点
         * radius 半径
         * alpha 环形中点的角度
         * k 绘图序号
         */
        renderLabel: function (ctx, xo, yo, radius, alpha, k) {
            var R1 = radius + 10, //第一段折线起点
                R2 = R1 + 20, //第二段折线起点
                config = this.config,
                colors = config.colors,
                cos = Math.cos(alpha * Math.PI / 180),
                sin = Math.sin(alpha * Math.PI / 180),
                x1 = xo + R1 * cos, //第一段折线起点坐标
                y1 = yo + R1 * sin,
                x2 = xo + R2 * cos, //第二段折线起点坐标
                y2 = yo + R2 * sin,
                secLine = cos > 0 ? 100 : -100 //第二段折线长度


            this.drawLinePoint(ctx, x1, y1, colors[k])

            // if (k > 0) {
            //     labelH.forEach(function (v) {     
            // 		if(Math.abs(y2-v)<config.labelHeight){
            // 			console.log(y2,labelH)
            // 			y2=Math.min(y2>v?(y2+config.labelHeight):(y2-config.labelHeight),config.height-17)

            // 		}
            // 	})
            // }


            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.moveTo(x2, y2)
            ctx.lineTo(x2 + secLine, y2)
            ctx.closePath()
            ctx.strokeStyle = colors[k]
            ctx.stroke()

            //存储label的y坐标
            labelH.push(y2)


            this.renderLabelText(ctx, x2, y2, secLine, cos, k)

        },

        renderLabelText: function (ctx, x, y, secLine, cos, k) {
            var config = this.config,
                data = config.data

            //文字
            ctx.font = "12px  PingFangSC-Regular"
            ctx.fillStyle = "#999"
            ctx.textAlign = cos > 0 ? "right" : "left"
            ctx.fillText(data[k].value, x + secLine, y - 5)
            ctx.fillText(data[k].name, x + secLine, y + 15)
            ctx.restore()
        },

        drawLinePoint: function (ctx, x, y, color) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.arc(x, y, 2, 0, 360 * Math.PI / 180, false)
            ctx.closePath()
            ctx.fillStyle = color
            ctx.fill()
            ctx.restore()
        },

        drawRing: function (ctx, x, y, r, angle1, angle2, callback) {

            var that = this,
                step = 7,
                angle = angle1
            console.time('draw');
            (function _draw() {
                window.requestAnimationFrame(function () {
                    var start = (angle - 10),
                        stop = (angle + step)

                    that.sector(ctx, x, y, r, Math.max(start, angle1), Math.min(stop, angle2), 1)
                    ctx.save()
                    ctx.fillStyle = "#ffffff"
                    that.sector(ctx, x, y, r - 20, 0, 360)
                    ctx.restore()
                    angle += step
                    if (angle < angle2) {
                        _draw()
                    } else {
                        console.timeEnd('draw')
                        callback && callback()
                    }
                })
            })()

        },

        sector: function (ctx, x, y, r, angle1, angle2, dev) {
            if (dev) {
                // console.log(angle1, angle2)
            }
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.arc(x, y, r, angle1 * Math.PI / 180, angle2 * Math.PI / 180, false)
            ctx.closePath()
            ctx.restore()
            ctx.fill()
        },

        getPoints: function () {
            var data = this.config.data,
                result = [],
                step = 0,
                sum = 0

            if (data.length > 0) {
                data.forEach(function (v) {
                    sum += (v.value || 0) * 1
                })

                //起点为-90deg,所有点都减90deg
                result.push(-90)

                data.forEach(function (v) {
                    result.push((step += (v.value || 0)) * 360 / sum - 90)
                })

            }

            return result
        },

        getMiddlePoints: function (points) {
            var result = []

            for (var i = 0; i < points.length - 1; i++) {
                result.push((points[i] + points[i + 1]) / 2)
            }
            return result
        }

    }

    Ring.inherits(Skeleton)

    Skeleton.ring = function (options) {
        return new Ring(options)
    }

})(Skeleton, jQuery)