/*
 * @Author: inoongt@gmail.com
 * @Date: 2017-12-26 16:36:33 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-01-02 18:24:00
 */
;(function () {
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
	//实例化组件数
	var index = 0
	var Ring = function (options) {
		var config = {
			id: "", //渲染元素的id
			width: "", //canvas宽度
			height: "", //canvas高度
			data: [], //数据
			colors: ["#84B7DE", "#9CCB6F", "#FFC761", "#EA6C61"], //数据项对应颜色值
			label: { //说明标签
				show: true,
				color: "#999999", //文字颜色,默认跟随数据颜色
				font: "12px  PingFangSC-Regular",
				height: 36
			},
			radius: null, //外半径，不设则由宽高度设置合适值	
			innerRadius: null, //内半径,默认值为外半径减15
			innerBackground: "#ffffff", //内圆背景色
			R1: null, //标注线第一段折线起点
			R2: null //标注线第二段折线起点    
		}
		var colors = ["#35bfa3", "#91c7ae", "#7069ca", "#f4516b", "#ca8522", "#bda29a", "#c23531", "#60a0a8"]
		this.config = this.extend(config, options || {})
		this.config.colors = this.config.colors.concat(colors)
		this.index = ++index
		this.elem = document.getElementById(this.config.id)
		this.labelYArray = []
		if (!this.elem) {
			return
		}
		//test data    
		this.config.data = [
			{ value: Math.random().toFixed(4) * 10000, name: "课程" },
			{ value: Math.random().toFixed(4) * 10000, name: "课程" },
			{ value: Math.random().toFixed(4) * 10000, name: "课程" },
			{ value: Math.random().toFixed(4) * 10000, name: "课程" },
			{ value: Math.random().toFixed(4) * 10000, name: "课程" },
			{ value: Math.random().toFixed(4) * 10000, name: "课程" }
		]
		// this.config.data = [
		// 	{ value: 1, name: "课程" },
		// 	{ value: 10, name: "课程" },
		// 	{ value: 1, name: "课程" },
		// 	{ value: 1, name: "课程" },
		// 	{ value: 10, name: "课程" },
		// 	{ value: 20, name: "课程" },
		// ]
		this.init()
	}
	/* 原型方法 */
	Ring.prototype = {
		constructor: Ring,
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
				angleCoordinate = that.getAngleCoordinate(points),
				y2Array = _reprocessingEoordinates(config, xo, yo, radius, angleCoordinate)
				; (function _chart() {
					that.drawRing(ctx, xo, yo, radius, points[key], points[key + 1], colors[key], function () {
						//画线
						if (config.label.show) {
							that.renderLabel(ctx, xo, yo, radius, angleCoordinate[key], key, y2Array[key])
						}
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
				; (function _draw() {
					window.requestAnimationFrame(function () {
						var start = (angle - 10),
							stop = (angle + step)
						that.drawSector(ctx, x, y, r, Math.max(start, angle1), Math.min(stop, angle2), color, 1)
						that.drawSector(ctx, x, y, r - 20, 0, 360, config.innerBackground)
						angle += step
						if (angle < angle2) {
							_draw()
						} else {
							callback && callback()
						}
					})
				})()
		},
		drawSector: function (ctx, x, y, r, angle1, angle2, color) {
			ctx.save()
			ctx.beginPath()
			ctx.moveTo(x, y)
			ctx.arc(x, y, r, angle1 * Math.PI / 180, angle2 * Math.PI / 180, false)
			ctx.closePath()
			ctx.restore()
			ctx.fillStyle = color
			ctx.fill()
		},

        /** 渲染说明文字
         * ctx 绘图对象
         * xo、yo:原点
         * radius 半径
         * alpha 环形中点的角度
         * k 绘图序号
         */
		renderLabel: function (ctx, xo, yo, radius, angle, k, y2) {
			var config = this.config,
				colors = config.colors,
				R1 = config.R1, //第一段折线起点 
				R2 = config.R2, //第二段折线起点 
				cos = Math.cos(angle * Math.PI / 180),
				sin = Math.sin(angle * Math.PI / 180),
				secLine = cos > 0 ? 160 : -160, //第二段折线长度
				x1 = xo + R1 * cos, //第一段折线起点坐标
				y1 = yo + R1 * sin,
				x2 = xo + (cos > 0 ? 1 : -1) * Math.sqrt((R2 * R2 - (y2 - yo) * (y2 - yo))),
				y2 = y2 //第二段折线起点坐标 
			if (cos < 0) {
				x2 = Math.min(x2, xo + R2 * cos)
			} else {
				x2 = Math.max(x2, xo + R2 * cos)
			}
			this.drawLinePoint(ctx, x1, y1, colors[k])
			ctx.save()
			ctx.globalCompositeOperation = "destination-over" //显示在已画的图层之下
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
			ctx.font = config.label.font
			ctx.fillStyle = config.label.color || config.colors[k]
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
		getAngleCoordinate: function (points) {
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
	/* 继承 */
	Ring.inherits(Skeleton)
	/* 私有方法 */
	//二次处理lable的y坐标
	function _reprocessingEoordinates(config, xo, yo, radius, angleCoordinate) {
		var LH = config.label.height,
			R2 = config.R2,
			initialY = [],
			result = [],
			min = Math.ceil(LH / 2),
			max = config.height - Math.ceil(LH / 2),
			cos, sin, i, curr, next, prev, y2
		angleCoordinate.forEach(function (alpha, k) {
			cos = Math.cos(alpha * Math.PI / 180) > 0 ? 1 : -1
			sin = Math.sin(alpha * Math.PI / 180)
			y2 = yo + R2 * sin
			initialY[k] = {
				y: y2,
				cos: cos,
				sin: sin,
				revised: false
			}
		})
		initialY = _initializeEoordinates(initialY, config)
		//只有一个数据时的特殊处理
		if (initialY.length === 1) {
			initialY[0].y = config.height / 2 * 1 + LH / 3
		} else {
			for (i = 0; i < initialY.length; i++) {
				prev = initialY[i - 1 < 0 ? initialY.length - 1 : i - 1]
				curr = initialY[i]
				next = initialY[i < initialY.length - 1 ? i + 1 : 0]
				//curr-prev
				if (Math.abs(prev.y - curr.y) < LH && prev.cos == curr.cos) {
					console.log("in curr")
					curr.y = curr.cos > 0 ? prev.y + LH : prev.y - LH
					curr.revised = true
					//保证调整curr.y后next.y还排在之后
					if (curr.cos == next.cos && next.y * next.cos < curr.y * next.cos) {
						next.y = curr.y + LH * next.cos
					}
				}
				if (curr.y < min) {
					//保证调整curr.y后next.y还排在之后
					if (!prev.revised && next.y < min && next.cos == curr.cos) {
						next.y = next.y + (min - curr.y)
					}
					curr.y = min
					curr.revised = true
				}
				if (curr.y > max) {
					//保证调整curr.y后prev.y还排在之前,且不会破坏最小值处理
					if (!prev.revised && prev.y > max && prev.cos == curr.cos) {
						prev.y = Math.max(min, curr.cos > 0 ? prev.y - (curr.y - max) : prev.y + (curr.y - max))
					}
					curr.y = max
					curr.revised = true
				}
			}
		}
		result = initialY.map(function (v) {
			return v.y
		})
		return result
	}
	// 初步处理lable的y坐标
	function _initializeEoordinates(initialY, config) {
		var LH = config.label.height,
			initialYLeft = [],
			initialYRight = [],
			result = [],
			min = Math.ceil(LH / 2),
			max = config.height - Math.ceil(LH / 2)
		//分左右侧处理
		initialY.forEach(function (v) {
			if (v.cos < 0) {
				initialYLeft.push(v)
			} else {
				initialYRight.push(v)
			}
		})
		initialYLeft = _initializeLeft(initialYLeft, LH, min, max)
		initialYRight = _initializeRight(initialYRight, LH, min, max)
		result = initialYRight.concat(initialYLeft)
		return result
	}
	//左侧 
	function _initializeLeft(list, LH, min, max) {
		var i, j, temp, dest1, dest2
		for (i = 0; i < list.length - 1; i++) {
			//剩余空间不足,从min开始递增排i之后的项,再调整i之前的项
			if (list[i].y - LH / 2 < (list.length - 1 - i) * LH) {
				for (j = list.length - 1; j > i; j--) {
					if (j === list.length - 1) {
						list[j].y = min
					} else {
						list[j].y = list[j + 1].y + LH
					}
				}
				for (j = i; j >= 0; j--) {
					temp = list[j].y
					dest1 = Math.max((list.length - j) * LH, temp) //向下靠近
					dest2 = list[j + 1].y + LH //向上靠近
					list[j].y = Math.abs(dest2 - temp) > Math.abs(dest1 - temp) ? dest1 : dest2 //在最小改变的前提下赋值
				}
			}
			//已用空间已满,则从max开始递减LH
			if (list[i].y - LH / 2 < i * LH) {
				list[i].y = i === 0 ? max : Math.min(list[i - 1].y - LH, list[i].y)
			}
		}
		return list
	}
	//右侧
	function _initializeRight(list, LH, min, max) {
		var i, j, temp, dest1, dest2
		//空间全满，则从min开始递增LH
		if ((max - min) + LH < list.length * LH) {
			for (i = 0; i < list.length; i++) {
				list[i].y = i === 0 ? min : list[i - 1].y + LH
			}
			return list
		}
		//全空间足够,考虑剩余空间不足、已用空间已满两种情况
		for (var i = 0; i < list.length; i++) {
			//若剩余空间不足,先排i及i之后的项,再调整i之前的项
			if (max - Math.min(list[i].y, max) < (list.length - 1 - i) * LH) {
				for (j = list.length - 1; j >= i; j--) {
					list[j].y = Math.min(max - (list.length - 1 - j) * LH, list[j].y)
				}
				for (j = 0; j < i; j++) {
					//todo 
					// list[j].y = Math.abs(dest2 - temp) > Math.abs(dest1 - temp) ? dest1 : dest2 //在最小改变的前提下赋值
				}
			}
			//若已用空间已满,则从min开始递增LH
			if (list[i].y - LH / 2 < i * LH) {
				list[i].y = i === 0 ? min : list[i - 1].y + LH
			}
		}
		return list
	}
	//缓动函数
	function _easeIn(t, b, c, d) {
		return c * (t /= d) * t * t + b
	}
	//挂载
	Skeleton.ring = function (options) {
		return new Ring(options)
	}
})(Skeleton, jQuery)

