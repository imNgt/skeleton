;
(function (Skeleton, $) {

	var index = 0; //实例化组件数	

	var Select = function (options) {
		var config = {
			elem: '', //select 元素
			index: '', //实例化组件序号
			onChange: function () { //回调函数

			}
		};
		this.config = $.extend(config, options || {});
		this.elem = $(this.config.elem).eq(0);
		this.index = index++;
		this.init();
	}

	var CLASS_LIST = "sk-select-list",
		CLASS_STATUS = "select-status",
		CLASS_ACTIVE = "opened",
		CLASS_TEXT = "selected-text",
		CLASS_FADEINUP = "fadeInUp_SK";

	Select.prototype = {
		constructor: Select,
		init: function () {
			this.buildTemplate();
			this.bindEvent();
			this.setDefaultOpt();
		},

		getDefaultOpt: function () {
			var that = this,
				defaultOpt = {};
			this.elem.find("option").each(function (k, opt) {
				if ($(opt).attr("selected") !== undefined) {
					defaultOpt.value = opt.innerHTML;
					defaultOpt.index = that.selectedIndex = k;
					return
				}
			});

			return defaultOpt;
		},

		setDefaultOpt: function () {
			var selectedIndex = this.getDefaultOpt().index;
			if (selectedIndex !== undefined) {
				this.setOption(this.selectList.find(".option").eq(selectedIndex));
			}
		},

		buildTemplate: function () {
			var that = this,
				defaultOpt = this.getDefaultOpt();
			var template = '<div class="' + CLASS_LIST + ' ' + CLASS_LIST + '-' + that.index + '" index="' + that.index +  '">',
				optionsHtml = '';
			that.elem.find("option").each(function (k, opt) {
				var text = $(opt).html() || '';
				optionsHtml += '<li class="option" >' + text + '</li>';
			});
			template += '<span class="' + CLASS_STATUS + '"><span class="' + CLASS_TEXT + '">' + defaultOpt.value + '</span><i class="icon"></i></span>';
			template += '<ul class="options" >';
			template += optionsHtml + '</ul></div>';

			that.elem.hide().after(template);

			that.setSelectList();
		},

		setSelectList: function () {
			this.selectList = this.elem.siblings("." + CLASS_LIST+"-"+this.index);
		},

		bindEvent: function () {
			var that = this,
				selectList = this.selectList;
			var docEventHandle = "click.select" + that.index;

			selectList.find("." + CLASS_STATUS).on("click", function (event) {
				var self = this,
					index = that.index;
				//阻止事件冒泡
				that.stopBubble(event);
				//关闭其他下拉选择组件   
				$("." + CLASS_LIST).each(function (k, v) {
					if (k != index) {
						$(v).removeClass(CLASS_ACTIVE);
						console.log($(v))
						that.fadeOutDown($(v).find(".options"), 300);
					}
				});

				if (selectList.hasClass(CLASS_ACTIVE)) {
					that.close()
				} else {
					that.open();
					//点击其他区域关闭此组件
					$(document).off(docEventHandle);
					;(function documentHandler() {
						$(document).one(docEventHandle, function (event) {
							console.log("doc")
							var e = event || window.event;
							if ($(e.target).closest("." + CLASS_STATUS)[0] === self) {
								documentHandler();
								return;
							}
							that.close()
						})
					})()
				}
			});

			selectList.find(".option").on("click", function () {
				that.setOption($(this));
			})
		},
		open:function () {
			var selectList = this.selectList,
				optionsElem = selectList.find(".options");

			selectList.addClass(CLASS_ACTIVE);
			this.fadeInUp(optionsElem);

		},
		close:function (time) {
			var selectList = this.selectList,
				time=time || 300,
				optionsElem = selectList.find(".options");

			selectList.removeClass(CLASS_ACTIVE);
			this.fadeOutDown(optionsElem, 300);
		},
		fadeInUp: function (elem) {
			if (!elem.length) {
				return
			}

			elem.show().css({
				"transform": "translateY(0)",
				"opacity": "1"
			});

		},
		fadeOutDown: function (elem, time) {
			if (!elem.length) {
				return
			}
			elem.css({
				"transform": "translateY(50%)",
				"opacity": "0"
			});
			setTimeout(function () {
				elem.hide()
			}, time)
		},
		setOption: function (target) {
			var that = this,
				config = this.config,
				elem = this.elem,
				selectList = this.selectList;
			var optionIndex = target.index(),
				optionsElem = selectList.find(".options"),
				optionItemElem = elem.find("option").eq(optionIndex);

			target.addClass("selected").siblings(".option").removeClass("selected");

			selectList.removeClass(CLASS_ACTIVE).find("." + CLASS_TEXT).text(target.text());
			that.fadeOutDown(optionsElem, 300);

			//设置select状态，并触发change事件   
			optionItemElem.attr("selected", true).siblings("option").removeAttr("selected");

			if (typeof config.onChange === "function") {
				config.onChange.call(that, optionItemElem)
			} else {
				elem.trigger("change")
			}
		}
	}

	Select.inherits(Skeleton);

	Skeleton.select = function (options) {
		return new Select(options)
	}

})(Skeleton, jQuery);