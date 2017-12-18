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
            data: [], //数据
            labelHeight: 35, //说明标签的高度
            radius: null,
            innerRadius: null,
            innerBackground: "#ffffff",
            R1: null, //第一段折线起点
            R2: null, //第二段折线起点
            colors: ["#84B7DE", "#9CCB6F", "#FFC761", "#EA6C61"]
        }

        this.config = this.extend(config, options || {})
        this.index = ++index
        this.elem = document.getElementById(this.config.id)
        this.labelYArray = []

        if (!this.elem) {
            return
        }

        // //test data  
        this.config.data = [
            { value: 50, name: "课程" },
            { value: 2, name: "课程" },
            { value: 2, name: "课程" },
            { value: 1, name: "课程" },
        ]

        this.init()
    }


    Ring.prototype = {

        init: function () {
            var that = this,
                i = 0,
                config = that.config,
                colors = config.colors,
                data = config.data,
                ratio = window.devicePixelRatio,
                width = config.width || that.elem.offsetWidth,
                height = config.height || that.elem.offsetHeight,
                xo = width / 2, //坐标原点
                yo = height / 2,
                points = that.getPoints() //画图边界点

            var canvas = document.createElement("canvas")

            that.elem.appendChild(canvas)

            //设置宽高、内外半径 
            config.width = width
            config.height = height

            if (!config.radius) {
                config.radius = Math.min(width, height) / 2 - 50
            }

            if (!config.innerRadius) {
                config.innerRadius = config.radius - 15
            }

            //设置颜色
            if (colors.length < data.length) {
                for (i = colors.length; i < data.length; i++) {
                    colors[i] = this.randomColor16()
                }
            }

            //设置R1、R2
            if (!config.R1) {
                config.R1 = config.radius + 10
            }
            if (!config.R2) {
                config.R2 = config.R1 + 10
            }

            //开始绘制
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d')
                that.drawChart(ctx, xo, yo, config.radius, points)

                //消除锯齿感 
                if (ratio) {
                    canvas.style.width = width + "px"
                    canvas.style.height = height + "px"
                    canvas.height = height * ratio
                    canvas.width = width * ratio
                    ctx.scale(ratio, ratio)
                } else {
                    canvas.width = width
                    canvas.height = height
                }
            }



        },

        drawChart: function (ctx, xo, yo, radius, points) {
            var that = this,
                config = that.config,
                colors = config.colors,
                key = 0,
                midPoints = that.getMiddlePoints(points)

            this.reviseLableY(xo, yo, radius, midPoints)

            ;
            (function _chart() {
                that.drawRing(ctx, xo, yo, radius, points[key], points[key + 1], colors[key], function () {
                    //画线
                    that.renderLabel(ctx, xo, yo, radius, midPoints[key], key)

                    key++

                    if (key < config.data.length) {
                        _chart()
                    }
                })
            })()
        },

        drawRing: function (ctx, x, y, r, angle1, angle2, color, callback) {

            var that = this,
                config = this.config,
                step = 7,
                angle = angle1

            ;
            (function _draw() {
                window.requestAnimationFrame(function () {
                    var start = (angle - 10),
                        stop = (angle + step)

                    that.sector(ctx, x, y, r, Math.max(start, angle1), Math.min(stop, angle2), color, 1)

                    that.sector(ctx, x, y, r - 20, 0, 360, config.innerBackground)
                    angle += step
                    if (angle < angle2) {
                        _draw()
                    } else {
                        callback && callback()
                    }
                })
            })()

        },

        sector: function (ctx, x, y, r, angle1, angle2, color) {

            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.arc(x, y, r, angle1 * Math.PI / 180, angle2 * Math.PI / 180, false)
            ctx.closePath()
            ctx.restore()

            ctx.fillStyle = color
            ctx.fill()
        },

        reviseLableY: function (xo, yo, radius, points) {

            var config = this.config,
                LH = config.labelHeight,
                R2 = config.R2,
                initY = [],
                min = Math.ceil(LH / 2),
				max = config.height - Math.ceil(LH / 2),
                cos, sin, i, curr, next, prev, y2,last

            points.forEach(function (alpha, k) {
                cos = Math.cos(alpha * Math.PI / 180)> 0 ? 1 : -1
                sin = Math.sin(alpha * Math.PI / 180)

				y2 = yo + R2 * sin
				if(last && Math.abs(y2-last.y)<LH && last.cos==cos) { 
					y2=last.y+LH	 
				} 
                initY[k] = {
                    y: y2,
                    cos: cos,
                    sin: sin,
                    revised: false
				}
				last=initY[k]
            })

            console.log(JSON.stringify(initY));
            (function () {
                //只有一个数据时的特殊处理
                if (initY.length === 1) {
                    initY[0].y = config.height / 2 * 1 + LH / 3
                } else {
                    for (i = 0; i < initY.length; i++) {
                        prev = initY[i - 1 < 0 ? initY.length - 1 : i - 1]
                        curr = initY[i]
                        next = initY[i < initY.length - 1 ? i + 1 : 0]

						//curr-prev
                        if (Math.abs(prev.y - curr.y) < LH && prev.cos == curr.cos) {
                            curr.y = curr.cos > 0 ? prev.y + LH : prev.y - LH
                            curr.revised = true
                            //保证调整curr.y后next.y还排在之后
                            if (curr.cos == next.cos && next.y * next.cos < curr.y * next.cos) {
                                next.y = curr.y + LH * next.cos
							}
							console.log(33333333333333)   
							console.log(JSON.stringify(prev),JSON.stringify(curr),JSON.stringify(next))   
                        }


                        if (curr.y < min) {
                            if (!prev.revised) {
                                prev.y = prev.y + (min - curr.y)
                                // prev.revised=true
                            }
                            curr.y = min
                            curr.revised = true
                        }
                        if (curr.y > max) {
                            if (!prev.revised) {
                                prev.y = curr.cos > 0 ? prev.y - (curr.y - max) : prev.y + (curr.y - max)
                                // prev.revised=true
                            }
                            curr.y = max
                            curr.revised = true
                        }

                    }
                }

            })()

            this.labelYArray = initY.map(function (v) {
                return v.y
            })
            console.log(this.labelYArray)


        },

        /** 渲染说明文字
         * ctx 绘图对象
         * xo、yo:原点
         * radius 半径
         * alpha 环形中点的角度
         * k 绘图序号
         */
        renderLabel: function (ctx, xo, yo, radius, alpha, k) {
            var config = this.config,
                colors = config.colors,
                R1 = config.R1, //第一段折线起点 
                R2 = config.R2, //第二段折线起点 
                cos = Math.cos(alpha * Math.PI / 180),
                sin = Math.sin(alpha * Math.PI / 180),
                x1 = xo + R1 * cos, //第一段折线起点坐标
                y1 = yo + R1 * sin,
                y2 = this.labelYArray[k], //第二段折线起点坐标
                x2 = xo + (cos > 0 ? 1 : -1) * Math.sqrt((R2 * R2 - (y2 - yo) * (y2 - yo))),
                secLine = cos > 0 ? 160 : -160 //第二段折线长度

            this.drawLinePoint(ctx, x1, y1, colors[k])

            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.moveTo(x2, y2)
            ctx.lineTo(xo + secLine, y2)
            ctx.closePath()
            ctx.strokeStyle = colors[k]
            ctx.stroke()

            this.renderLabelText(ctx, xo + secLine, y2, cos, k)
        },

        //绘制文字
        renderLabelText: function (ctx, x, y, cos, k) {
            var config = this.config,
                data = config.data

            ctx.font = "12px  PingFangSC-Regular"
            ctx.fillStyle = "#999"
            ctx.textAlign = cos > 0 ? "right" : "left"
            ctx.fillText(data[k].value, x, y - 5)
            ctx.fillText(data[k].name, x, y + 15)
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
            //只有一个数据时的特殊处理
            if (points.length === 2) {
                result.push(0)
            } else {
                for (var i = 0; i < points.length - 1; i++) {
                    result.push((points[i] + points[i + 1]) / 2)
                }
            }

            return result
        },

        //随机十六进制颜色
        randomColor16: function () {
            var result = "#" + Math.floor(Math.random() * 0xffffff).toString(16)
            return result.length == 7 ? result : this.randomColor16()
        }

    }

    Ring.inherits(Skeleton)

    Skeleton.ring = function (options) {
        return new Ring(options)
    }

})(Skeleton, jQuery)