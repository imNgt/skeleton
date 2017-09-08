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
			prev: "上一页"
		};


		this.config = $.extend(config, options || {});

		this.elem = $(this.config.elem);

		this.renderPage();

		this.bindEvent();
	}

	var CLASS_ITEM = "page-item", CLASS_DOT = "page-dot", CLASS_CURR = "page-item page-curr", CLASS_PREV = "page-prev", CLASS_NEXT = "page-next", CLASS_DISABLE = "page-disabled";

	Page.inherits(Skeleton);

	Page.prototype = {
		/* 计算页码，返回页码元素     */
		calculatePages: function () {
			var that = this;
			var config = that.config,
				current = config.current,
				middlePage = config.middlePage,
				pageSize = config.pageSize,
				total = config.total,
				pages = Math.ceil(total / pageSize),
				viewPageStart = 0,
				viewPageEnd = 0,
				resutl = [];

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
				resutl.push('<span class="' + CLASS_ITEM + '">1</span>');
				resutl.push('<span class="' + CLASS_DOT + '">...</span>');
			}
			/*view of middle*/
			that.range(viewPageStart, viewPageEnd + 1).map(function (index, key) {
				resutl.push('<span   class="' + (index == current ? CLASS_CURR : CLASS_ITEM) + '">' + index + '</span>');
			});

			/*show dot near end*/
			if (viewPageEnd != pages) {
				resutl.push('<span  class="' + CLASS_DOT + '">...</span>');
				resutl.push('<span  class="' + CLASS_ITEM + '">' + pages + '</span>');
			}

			return resutl;
		},
		range: function (start, stop) {
			var start = start || 0, i, length = stop - start, range = Array(length);
			for (i = 0; i < length; i++ , start++) {
				range[i] = start;
			}
			return range;
		},
		bindEvent: function () {
			var that = this;
			that.elem.on("click", "." + CLASS_ITEM, function () {
				var target = this.innerHTML * 1;
				that.jumpPage(target);
			})
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
			prev = this.config.prev,
			next = this.config.next,
			current = this.config.current,
			pages = this.config.pages;
   
			if (prev) {
				var prevClass = current == 1 ? CLASS_DISABLE : CLASS_PREV;
				template.push('<span  class="' + prevClass + '">' + prev + '</span>');
			}

			template = template.concat(this.calculatePages());

			if (next) {
				var nextClass = current == pages ? CLASS_DISABLE : CLASS_NEXT;
				template.push('<span  class="' + nextClass + '">' + next + '</span>');
			}
			
			this.elem.html(template.join(""));   
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

})(Skeleton, jQuery)





















