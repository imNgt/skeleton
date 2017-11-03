; (function (Skeleton, $) {

	var index = 0;//实例化组件数	

	var Transfer = function (options) {

		this.config = {
			elem: '',     //用于事件预绑定的容器
			template: "", //列表模板
			dataLeft: [], //全部数据
			dataRight: [],//待确认数据
			key: "id",    //数据项id
			keyAttr: "data-id",  //id的dom属性
			init: false    //是否根据数据进行初始化
		};

		this.config = $.extend(this.config, options || {});
		this.elem = $(this.config.elem);

		this.btnRight = null;
		this.btnLeft = null;
		this.partLeft = null;
		this.partRight = null;
		this.checkAllLeft = null;
		this.checkAllRight = null;

		this.create();
		// this.init();
		// this.bindEvent();
	};
	Transfer.inherits(Skeleton);

	var CLASS_TRANS_LEFT = "js-trans-left", CLASS_TRANS_RIGHT = "js-trans-right", CLASS_TRNAS_LIST = "trans-list",
		CLASS_CHECK = "js-trans-check", BUTTON_LEFT = "trans-btn-left", BUTTON_RIGHT = "trans-btn-right",
		BUTTON_ACTIVE = "trans-active", CLASS_LIST_RIGHT = "js-list-right", CLASS_LIST_LEFT = "js-list-left",
		CLASS_ITEM = "trans-list-item", CLASS_DISABLED = "disabled", CLASS_CHECK_ALL = "js-check-all",
		CLASS_TRANS_PART = "js-trans-part", CLASS_NUM_ALL = "js-num-all", CLASS_NUM_SELECTED = "js-num-selected";

	Transfer.prototype = {
		constructor: Transfer,
		init: function () {
			var config = this.config;

			this.btnRight = this.elem.find("." + BUTTON_RIGHT);
			this.btnLeft = this.elem.find("." + BUTTON_LEFT);
			this.partLeft = this.elem.find("." + CLASS_TRANS_LEFT);
			this.partRight = this.elem.find("." + CLASS_TRANS_RIGHT);
			this.checkAllLeft = this.partLeft.find("." + CLASS_CHECK_ALL);
			this.checkAllRight = this.partRight.find("." + CLASS_CHECK_ALL);

			if (config.dataRight.length === 0) {
				this.checkAllRight.closest("label").addClass("disabled");
			} else {
				this.checkAllRight.closest("label").removeClass("disabled");
			}

			if (config.init) {
				this.renderLeft();
			}
			this.renderRight();

			this.disableLeft(this.getValues(config.dataRight, config.key));

			this.updateSelectedNum();
			this.updateToBeElectedNum();

		},
		create: function () {
			var leftTpl = '<div class="trans-left js-trans-part js-trans-left">';
			leftTpl += '<div class="trans-title">待选<span class="trans-num js-num-all">0</span></div>';
			leftTpl += '<div class="trans-content">';
			leftTpl += '<div class="trans-head">';
			leftTpl += '<label class="trans-th-check checkbox-label"><input type= "checkbox" class="js-check-all" /><span class="indicator"></span>全选</label >';
			leftTpl += '<span class="trans-cell">商户号</span>';
			leftTpl += '</div>';
			leftTpl += '<ul class="trans-list js-list-left"></ul>';
			leftTpl += '</div>';
			leftTpl += '</div>';

			var middleTpl='<div class="trans-middle"><div class="btn btn-right" ><</div> <div class="btn btn-left">></div></div >';

			var rightTpl = '<div class="trans-right js-trans-part js-trans-right">';  
			rightTpl += '<div class="trans-title">已选<span class="trans-num js-num-selected">0</span></div>';
			rightTpl += '<div class="trans-content">'; 
			rightTpl += '<div class="trans-head">';
			rightTpl += '<label class="trans-th-check checkbox-label"><input type= "checkbox" class="js-check-all" /><span class="indicator"></span>全选</label >';
			rightTpl += '<span class="trans-cell">商户号</span>';
			rightTpl += '</div>';
			rightTpl += '<ul class="trans-list js-list-right"></ul>';
			rightTpl += '</div>';
			rightTpl += '</div>';

			var tpl = leftTpl +middleTpl +rightTpl;
			this.elem.append(tpl);
		},
		bindEvent: function () {
			var that = this, config = this.config;
			//基于搜索的实现方式修改为事件预绑定，每次应使用不同的容器,否则会多次绑定
			that.elem.on("change", "." + CLASS_TRANS_LEFT + " ." + CLASS_CHECK, function () {
				that.handleChange(BUTTON_LEFT, this);
			});
			that.elem.on("change", "." + CLASS_TRANS_PART + " ." + CLASS_CHECK_ALL, function () {
				that.handleCheckAll(this);
			});
			that.elem.on("change", "." + CLASS_TRANS_RIGHT + " ." + CLASS_CHECK, function () {
				that.handleChange(BUTTON_RIGHT, this);
			});
			that.elem.on("click", "." + BUTTON_LEFT, function () {
				that.transferLeft();
			});
			that.elem.on("click", "." + BUTTON_RIGHT, function () {
				that.transferRight();
			});
		},
		handleChange: function (btnClass, target) {
			var btn = this.elem.find("." + btnClass);
			var checkAllBtn = $(target).closest("." + CLASS_TRANS_PART).find("." + CLASS_CHECK_ALL);
			var transList = $(target).closest("." + CLASS_TRNAS_LIST);

			if (this.hasChecked($(target).closest("." + CLASS_TRNAS_LIST))) {
				btn.addClass(BUTTON_ACTIVE);
			} else {
				btn.removeClass(BUTTON_ACTIVE);
			}
			//关联全选状态
			if (this.hasCheckedAll(transList)) {
				checkAllBtn.attr("checked", true);
			} else {
				checkAllBtn.attr("checked", false);
			}

		},
		handleCheckAll: function (target) {
			var transPart = $(target).closest("." + CLASS_TRANS_PART);
			//非disabled状态的checkbox,取动态的input
			var dynamicChechInput = transPart.find("." + CLASS_CHECK).not("[disabled]");
			var btn = transPart.hasClass(CLASS_TRANS_LEFT) ? this.btnLeft : this.btnRight;

			if (dynamicChechInput.length) {
				if ($(target).attr("checked")) {
					btn.addClass(BUTTON_ACTIVE);
					dynamicChechInput.each(function () {
						if (!$(this).attr("disabled")) {
							$(this).attr("checked", true);
						}
					});
				} else {
					dynamicChechInput.each(function () {
						if (!$(this).attr("disabled")) {
							$(this).attr("checked", false);
						}
					});
					btn.removeClass(BUTTON_ACTIVE);
				}
			} else {
				$(target).attr("checked", false);
			}
		},
		//从右传递到左
		transferRight: function () {
			var that = this, config = this.config;
			var checkedArr = that.getCheckedKeys(CLASS_TRANS_RIGHT);
			if (checkedArr.length > 0) {
				$.map(checkedArr, function (v, k) {
					that.deleteItem(v, config.dataRight, config.key);
				});
				that.renderRight();
				that.updateLeft(checkedArr);
			}
		},
		//从左传递到右
		transferLeft: function () {
			var that = this, config = this.config;
			var checkedArr = that.getCheckedKeys(CLASS_TRANS_LEFT);
			var checkAllLeft = this.checkAllLeft;
			var checkAllRight = this.checkAllRight;
			if (checkedArr.length > 0) {
				$.map(checkedArr, function (v, k) {
					//若选项不在已选列表中，则添加
					if (!Promo.inSeries(v, config.dataRight, config.key)) {
						config.dataRight.push(Promo.getItem(v, config.dataLeft, config.key))
					}

				});

				//已选则去除选中状态
				that.partLeft.find("." + CLASS_CHECK).each(function () {
					if (Promo.inArray($(this).attr(config.keyAttr), checkedArr)) {
						$(this).attr("checked", false).closest("." + CLASS_ITEM).removeClass("disabled");
					}
				});
				//更新按钮状态
				if (this.hasChecked(this.partLeft.find("." + CLASS_TRNAS_LIST))) {
					this.btnLeft.addClass(BUTTON_ACTIVE);
				} else {
					this.btnLeft.removeClass(BUTTON_ACTIVE);
				}

				that.renderRight();
				that.disableLeft(checkedArr);
			}
			//全选处理
			if (config.dataRight.length === config.dataLeft.length) {
				checkAllLeft.attr("checked", false).closest("label").addClass("disabled");
				this.btnLeft.removeClass(BUTTON_ACTIVE);
			}
			if (config.dataRight.length !== 0) {
				checkAllRight.closest("label").removeClass("disabled");
			}
		},
		//不可选
		disableLeft: function (checkedArr) {
			var that = this, config = this.config;
			that.elem.find("." + CLASS_LIST_LEFT).find("." + CLASS_CHECK).each(function (k, v) {
				if (Promo.inArray($(this).attr(config.keyAttr), checkedArr)) {
					$(this).attr("disabled", true);
					$(this).closest("." + CLASS_ITEM).addClass(CLASS_DISABLED);
				}
			})
		},
		getPartInputs: function (targetClass) {
			return this.elem.find("." + targetClass).find("." + CLASS_CHECK);
		},
		updateLeft: function (checkedArr) {
			var that = this, config = this.config;
			var transPart = this.partLeft;
			var transList = transPart.find("." + CLASS_LIST_LEFT);
			var checkAllLeft = transPart.find("." + CLASS_CHECK_ALL);
			transList.find("." + CLASS_CHECK).each(function (k, v) {
				if (Promo.inArray($(this).attr(config.keyAttr), checkedArr)) {
					$(this).attr("disabled", false);
					$(this).closest("." + CLASS_ITEM).removeClass(CLASS_DISABLED);
				}
			});

			if (that.hasChecked(transList)) {
				that.btnLeft.addClass(BUTTON_ACTIVE);
			} else {
				that.btnLeft.removeClass(BUTTON_ACTIVE);
			}

			if (that.hasCheckedAll(transList)) {
				checkAllLeft.attr("checked", true);
				that.btnLeft.addClass(BUTTON_ACTIVE);
			} else {
				checkAllLeft.attr("checked", false);
			}

		},
		renderLeft: function () {
			var config = this.config;
			var checkAllRight = this.checkAllRight;
			var checkAllLeft = this.checkAllLeft;
			var transListLeft = this.elem.find("." + CLASS_LIST_LEFT);

			// transListLeft.html(_.template($(config.template).html())({
			// 	data: config.dataLeft
			// }));
		},
		renderRight: function () {
			var config = this.config;
			var checkAllRight = this.checkAllRight;
			var checkAllLeft = this.checkAllLeft;

			var transListRight = this.elem.find("." + CLASS_LIST_RIGHT);
			if (config.dataRight.length === 0 || this.hasChecked(transListRight)) {
				checkAllRight.attr("checked", false).closest("label").addClass("disabled");
				this.elem.find("." + BUTTON_RIGHT).removeClass(BUTTON_ACTIVE);
			}
			if (config.dataRight.length !== config.dataLeft.length) {
				checkAllLeft.closest("label").removeClass("disabled");
			}
			// transListRight.html(_.template($(config.template).html())({
			// 	data: config.dataRight
			// }));
			this.updateSelectedNum();
		},
		updateSelectedNum: function () {
			this.elem.find("." + CLASS_NUM_SELECTED).text(this.config.dataRight.length);
		},
		updateToBeElectedNum: function () {
			console.log(this.config.dataLeft.length)
			this.elem.find("." + CLASS_NUM_ALL).text(this.config.dataLeft.length);
		},
		getCheckedKeys: function (listClass) {
			var that = this, checkedArr = [], config = this.config;
			that.elem.find("." + listClass).find("." + CLASS_CHECK).each(function (k, v) {
				var id = $(this).attr(config.keyAttr);
				//选中且非disabled
				if ($(this).attr("checked") && !$(this).attr("disabled")) {
					checkedArr.push(id)
				}
			});
			return checkedArr;
		},
		hasChecked: function (targetList) {
			var result = false;
			targetList.find("." + CLASS_CHECK).each(function (k, v) {
				//选中且非disabled
				if ($(this).attr("checked") && !$(this).attr("disabled")) {
					result = true;
					return false;//退出循环
				}
			});
			return result;
		},
		update: function (options) {
			var options = options || {}, config = this.config;
			if (options.dataLeft) {
				config.dataLeft = options.dataLeft
			}
			if (options.dataRight) {
				config.dataRight = options.dataRight
			}
			this.init();
		},
		//全选范围排除disabled项
		hasCheckedAll: function (targetList) {
			var result = true;
			var inputs = targetList.find("." + CLASS_CHECK).not("[disabled]");
			if (inputs.length > 0) {
				inputs.each(function (k, v) {
					//未选中
					if (!$(this).attr("checked")) {
						result = false;
						return false;//退出循环
					}
				});
			} else {
				result = false;
			}
			return result;
		},
		deleteItem: function (val, arr, key) {
			if (arr && arr.length > 0) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i][key] === val) {
						arr.splice(i, 1)
					}
				}
			}
			return arr;
		},
		getValues: function (series, key) {
			var result = [];
			var len = series.length;
			if (len > 0) {
				for (var i = 0; i < len; i++) {
					result.push(series[i][key])
				}
			}
			return result;
		},
		getData: function () {
			return this.config.dataRight;
		}
	};

	Skeleton.transfer = function (options) {
		/* 依赖undersore模板 */
		if (typeof _.template !== "function") {
			throw (new Error("transfer require underscore template"))
		}
		return new Transfer(options)
	}

})(Skeleton, jQuery);


