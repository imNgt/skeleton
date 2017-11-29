; (function (Skeleton, $) {

	var index = 0;//实例化组件数	

	var Timepicker = function (options) {
		var config = {
			elem: "",
			width: "200",
			height: "200",
			stroke: "#88b04b",
			strokeBg: "rgba(230, 230, 230,0.3)",
			onChange: function () {

			}
		};
		this.config = $.extend(config, options || {});
		this.index = ++index;
		this.elem = $(this.config.elem).eq(0);
		this.am = true;
		if (this.elem.length < 1) {
			return
		}

		this.init();
	}

	Timepicker.inherits(Skeleton);

	var CLASS_CIRCLE_BG = 'sk-circle-bg', CLASS_CIRCLE_INNER = 'sk-circle-inner', CLASS_DRAG_WRAP = 'sk-drag-wrap',
		CLASS_DRAG_POINT = 'sk-drag-point', CLASS_TIME = 'sk-time-text';

	var isMobile = false;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		isMobile = true
	}

	Timepicker.prototype = {
		init: function () {
			var config = this.config,
				stroke = config.stroke,
				strokeBg = config.strokeBg,
				cx = config.width / 2,
				cy = config.height / 2,
				r = (Math.min(config.width, config.height) - 10) / 2,
				dasharray = 2 * Math.PI * r;

			var temp = '<svg id="timepickerSvg' + this.index + '" width="' + config.width + '" height="' + config.height + '">';
			temp += '<circle class="' + CLASS_CIRCLE_BG + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="' + strokeBg + '" stroke-width="4" fill="transparent" />';
			temp += '<circle class="' + CLASS_CIRCLE_INNER + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="' + stroke + '" stroke-width="4" fill="transparent" stroke-dasharray="' + dasharray + '" stroke-dashoffset="0"></circle>'
			temp += '</svg>';
			temp += '<div class="' + CLASS_TIME + '"></div>';
			temp += '<div  class="' + CLASS_DRAG_WRAP + '"><span  class="' + CLASS_DRAG_POINT + '"></span></div>';

			this.elem.css({ 'width': config.width + 'px', 'height': config.height + 'px' }).append(temp);
			this.dragWrap = this.elem.find('.' + CLASS_DRAG_WRAP);

			var	p =7/12;   

			//initialise                 
			this.setTransition(1);
			this.draw(p.toFixed(2));
			this.time=this.translateTime(p);         
			this.elem.find('.'+CLASS_TIME).html(this.time);  

			this.bindEvent();
			
		},
		draw: function (percent) {  
			var innerCircle = this.elem.find('.' + CLASS_CIRCLE_INNER);
			if (percent < 0 || isNaN(percent)) { percent = 0 }
			if (percent > 1) { percent = 1 }

			var girth = innerCircle.attr('r') * Math.PI * 2;
			var offset = girth * (1 - percent);

			innerCircle.css('stroke-dasharray', girth);
			innerCircle.css('stroke-dashoffset', offset);
			//标识点        
			this.dragWrap.css('transform', 'rotate(' + percent * 360 + 'deg)');
		},
		bindEvent: function () {
			var that = this,
				dragWrap = this.dragWrap,
				dragTarget = dragWrap.find('.' + CLASS_DRAG_POINT);

			//personal computer 
			if (!isMobile) {
				dragTarget.on("mousedown", function () {
					dragWrap.on("mousemove.timepickerdrag", that.handleDragStart.bind(that))
				})
				$(document).on("mouseup", function () {
					dragWrap.off("mousemove.timepickerdrag");
					that.scrollEnd();
				})
				dragWrap.on("click", that.handleDragStart.bind(that))
			}

			//mobile 
			dragTarget.on("touchmove", that.handleDragStart.bind(that));
			dragTarget.on("touchend", that.scrollEnd);
			dragWrap.on("touchstart", that.handleDragStart.bind(that));

		},
		scrollStart: function () {
			$('body').addClass("sk-scrolling")
		},
		scrollEnd: function () {
			$('body').removeClass("sk-scrolling")
		},
		handleDragStart: function (e) {
			var that = this;
			var evt = e || window.event, move, radian, percent;
			var radius = that.dragWrap.outerHeight() / 2 || 110;
			var isClick = evt.type === "click" || evt.type === "touchstart";
			var scrollTop = document.documentElement.scrollTop || window.pageYOfset || document.body.scrollTop;
			var scrollLeft = document.documentElement.scrollLeft || window.pageXOfset || document.body.scrollLeft;
			var center = {
				x: that.elem.offset().left + that.elem.outerWidth() / 2 - scrollLeft,
				y: that.elem.offset().top + that.elem.outerHeight() / 2 - scrollTop
			};


			if (isMobile && evt.originalEvent.touches) {
				move = evt.originalEvent.touches.length > 0 ? evt.originalEvent.touches[0] : evt.originalEvent.touches
			} else {
				move = evt
			}

			if (!isClick && isMobile) {       
				that.scrollStart()
			}

			//相对于中心点的坐标,右手系，x轴位于12点方向
			var y = center.x - move.clientX,
				x = center.y - move.clientY,
				currentSquare = x * x + y * y,
				realSquare = radius * radius
			//点击环形区域才有效 
			if (isClick && (currentSquare < realSquare * 0.81) || (currentSquare > realSquare * 1.21)) {
				return
			}

			//顺时针方向为正
			if (x === 0) {
				radian = y < 0 ? Math.PI / 2 : -Math.PI / 2
			} else {
				radian = Math.atan(y / x)
				//不同象限处理
				if (x > 0 && y > 0) {
					radian = 2 * Math.PI - radian
				} else if (x > 0 && y <= 0) {
					radian = -radian
				} else if (x < 0) {
					radian = Math.PI - radian
				}
			}

			percent = radian / (2 * Math.PI)

			// console.log(x+"   "+y+" percent: "+percent)
			if (isClick) {
				that.setTransition(0.3)
			} else {
				that.removeTransition()
			}

			that.draw(percent)
			// //过了零点，改变am
			if (that.checkZeroDirection(percent, that.lastPercent) != 0) {
				that.am = !that.am
			}

			that.time=that.translateTime(percent);
			that.elem.find('.'+CLASS_TIME).html(that.time);    

			that.lastPercent = percent
		},
		checkZeroDirection: function (end, start) {
			var end = end || 0, start = start || 0;
			if (end >= 0 && end <= 0.2 && start < 1 && start >= 0.8) {
				return 1
			} else if (start > 0 && start <= 0.2 && end <= 1 && end > 0.8) {
				return -1
			} else {
				return 0
			}
		}
		,
		translateTime: function (percent) {
			var t = percent * 12,
				h = this.am ? Math.floor(t) : Math.floor(t) + 12,
				m = Math.floor(t % 1 * 60)

			m = m < 10 ? '0' + m : m
			h = h < 10 ? '0' + h : h
			return h + ":" + m
		},
		removeTransition: function () {
			var innerCircle = this.elem.find('.' + CLASS_CIRCLE_INNER);
			this.dragWrap.css('transition', 'none');
			innerCircle.css('transition', 'none');
		},
		setTransition: function (d) {
			var innerCircle = this.elem.find('.' + CLASS_CIRCLE_INNER);
			var duration = d || 1;                                        
			this.dragWrap.css('transition', duration + 's ease-in-out');
			innerCircle.css('transition', duration + 's ease-in-out');
		}
	}
	Skeleton.timepicker = function (options) {   
		return new Timepicker(options)
	}

})(Skeleton, jQuery);


