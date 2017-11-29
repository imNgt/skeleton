/* 
*total 所有数据数量
*current 当前页数
*middlePage 渲染的中间页数
*onChange 页码改变的回调
*/
; (function (Skeleton, $) {
	//实例化组件数	
	var index = 0;

	var Page = function (options) {

		var config = {
			elem: '',
			total: 360,
			current: 5,
			middlePage: 5,
			pageSize: 10,
			next: "下一页",
			prev: "上一页",
			first: "首页",
			last: "尾页",
			skip: true
		};

		index++;

		this.config = $.extend(config, options || {});

		this.elem = $(this.config.elem);

		this.renderPage();

		this.bindEvent();
	}

	var CLASS_ITEM = "page-item", CLASS_DOT = "page-dot", CLASS_ITEM_CURR = "page-item page-curr", CLASS_PREV = "page-prev",
		CLASS_NEXT = "page-next", CLASS_DISABLE = "page-disabled", CLASS_EDGE = "page-edge", CLASS_SKIP = "page-skip", CLASS_INPUT = "page-skip-input", CLASS_BUTTON = "page-skip-btn";

	Page.inherits(Skeleton);

	Page.prototype = {
		/* 计算页码，返回页码元素     */
		calculatePages: function () {
			var config = this.config,
				current = config.current,
				middlePage = config.middlePage,
				pageSize = config.pageSize,
				total = config.total,
				pages = Math.ceil(total / pageSize),
				viewPageStart = 0,
				viewPageEnd = 0,
				result = [],
				firstClass = CLASS_ITEM + ' ',
				lastClass = CLASS_ITEM + ' ';

			/*检测边界值  */
			if (current < middlePage) {
				viewPageStart = 1;
				viewPageEnd = middlePage;
			} else if (current >= pages - Math.ceil(middlePage / 2)) {
				viewPageStart = pages - middlePage;
				viewPageEnd = pages;
			} else {
				/* middlePage在中间 */
				viewPageStart = current - Math.floor(middlePage / 2);
				viewPageEnd = current + Math.floor(middlePage / 2);
				!(middlePage & 1) && viewPageEnd--;
			}
			/*limit viewPageEnd*/
			if (viewPageEnd > pages) {
				viewPageEnd = pages;
			} 
			/*show dot near start*/
			if (viewPageStart > 2) {
				firstClass += config.first ? CLASS_EDGE : '';
				result.push('<span class="' + firstClass + '"  key="1" >' + (config.first ? config.first : 1) + '</span>');
				result.push('<span class="' + CLASS_DOT + '">...</span>');
			}
			/*view of middle*/
			this.range(viewPageStart, viewPageEnd + 1).map(function (value, key) {
				result.push('<span   class="' + (value == current ? CLASS_ITEM_CURR : CLASS_ITEM) + (key == 0 ? ' ' + CLASS_EDGE : '') + '" key="' + value + '">' + value + '</span>');
			});

			/*show dot near end*/
			if (viewPageEnd != pages) {
				lastClass += config.last ? CLASS_EDGE : '';
				result.push('<span  class="' + CLASS_DOT + '">...</span>');
				result.push('<span class="' + lastClass + '"  key="' + pages + '">' + (config.last ? config.last : pages) + '</span>');
			}

			return result;
		},
		range: function (start, stop) {
			var start = start || 0, i, length = stop - start, range = Array(length);
			for (i = 0; i < length; i++ , start++) {
				range[i] = start;
			}
			return range;
		},
		bindEvent: function () {
			var that = this, config = this.config;

			that.elem.on("click", "." + CLASS_ITEM, function () {
				var target = this.getAttribute("key") * 1;
				that.jumpPage(target);
			})

			if (config.next) {
				that.elem.on("click", "." + CLASS_NEXT, function () {
					that.nextPage();
				})
			}

			if (config.prev) {
				that.elem.on("click", "." + CLASS_PREV, function () {
					that.prevPage();
				})
			}

			if(config.skip){
				that.elem.on("click","."+CLASS_BUTTON,function(){
					var target=that.elem.find(".page-skip-input").val()*1; 
					if(!target || target>that.getPages()){
						return;   
					}     
					that.jumpPage(target);           
				})
			} 
		},
		prevPage: function () {
			if (this.config.current <= 1) {
				return
			}
			this.config.current--;
			this.renderPage();
			this.handleChange();
		},
		nextPage: function () {
			var pages = this.getPages();
			if (this.config.current >= pages) {
				return
			}
			this.config.current++;
			this.renderPage();
			this.handleChange();
		},
		getPages: function () {
			return Math.ceil(this.config.total / this.config.pageSize);
		},
		jumpPage: function (target) {
			if (target == this.config.current) {
				return;
			}
			this.config.current = target;
			this.renderPage();
			this.handleChange();
		},
		renderPage: function () {
			var template = [],
				config = this.config,
				nextClass = CLASS_NEXT + ' ',
				prevClass = CLASS_PREV + ' ',
				current = config.current,
				pages = this.getPages();

			if (config.prev) {
				prevClass += current == 1 ? CLASS_DISABLE : '';
				template.push('<span  class="' + prevClass + '">' + config.prev + '</span>');
			}

			template = template.concat(this.calculatePages());

			if (config.next) {
				nextClass += current == pages ? CLASS_DISABLE : '';
				template.push('<span  class="' + nextClass + '">' + config.next + '</span>');
			}

			if (config.skip) {
				template.push(this.renderSkip());
			}

			this.elem.html(template.join(""));
		},
		renderSkip: function () {
			var temp = '',
				config = this.config;
			temp += '<span class="' + CLASS_SKIP + '">';
			temp += '<input type="number" min="1" class="' + CLASS_INPUT + '"/>';
			temp += '<button type="button" class="' + CLASS_BUTTON + '">跳转</button>';
			temp += '</span>';
			return [temp]
		},
		handleChange: function () {
			if (typeof this.config.onChange === "function") {
				this.config.onChange.call(this, {
					current: this.config.current,
					total: this.config.total,
					size: this.config.pageSize
				});
			}
		}
	}

	Skeleton.page = function (options) {
		return new Page(options)
	}

})(Skeleton, jQuery);





















