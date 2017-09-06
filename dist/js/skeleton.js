/**
 * skeleton.js
 * build at: Wed Sep 06 2017 15:44:35 GMT+0800 (中国标准时间)
 */
if (typeof jQuery === 'undefined') {throw new Error('jQuery is required')};
;(function($,window){

	var Skeleton=function(options){
		this.config={

		}
		this.options=$.extend(this.config,options||{})
	}

	Function.prototype.inherits = function(parent){
        var F = function () {};
        F.prototype = parent.prototype;
        var f = new F();

        for (var prop in this.prototype) f[prop] = this.prototype[prop];
        this.prototype = f;
        this.prototype.super = parent.prototype;
    };

	Skeleton.prototype={

	} 

	window.Skeleton=Skeleton;
             
})(jQuery,window);
; (function (Skeleton, $) {

	var index=0;//实例化组件数	

	var Select = function (options) {
		var config = {
			elem: '',
			index: ''
		};
		this.config = $.extend(config, options || {});
		this.elem = $(this.config.elem).eq(0);
		this.index = ++index;
		this.init();    
	}

	Select.inherits(Skeleton);

	var CLASS_LIST="sk-select-list",CLASS_STATUS="select-status",CLASS_ACTIVE="opened",CLASS_TEXT="selected-text";
	
	
	Select.prototype = { 
		init: function () { 
			this.buildTemplate();
			this.bindEvent();
			this.setDefaultOpt();
		},
		
		getDefaultOpt:function(){
			var that = this,defaultOpt={};
			this.elem.find("option").each(function (k, opt) {
				if ($(opt).attr("selected") !== undefined) { 
					defaultOpt.value = opt.innerHTML;
					defaultOpt.index=that.selectedIndex = k;      
					return 
				} 
			});
			return defaultOpt;    
		},

		setDefaultOpt:function(){
			var selectedIndex=this.getDefaultOpt.index;
			if (selectedIndex !== undefined) {       
				selectList.find(".option").eq(selectedIndex).trigger("click");
			}
		},

		buildTemplate:function(){
			var that = this,defaultOpt=this.getDefaultOpt();
			var template = '<div class="'+ CLASS_LIST + '" index="' + that.index + '">', optionsHtml = '';
			that.elem.find("option").each(function (k, opt) {
				var text = $(opt).html() || '';
				optionsHtml += '<li class="option" >' + text + '</li>';
			});
			template += '<span class="'+CLASS_STATUS+'"><span class="'+CLASS_TEXT+'">' + defaultOpt.value + '</span><i class="icon"></i></span>';
			template += '<ul class="options">';
			template += optionsHtml + '</ul></div>';
			
			that.elem.hide().after(template); 
			
			that.setSelectList();     
		},

		setSelectList:function(){
			this.selectList=this.elem.siblings("."+CLASS_LIST);
		},

		bindEvent: function () {
			var that = this, elem = that.elem;

			var selectList = this.selectList;
			selectList.find("."+CLASS_STATUS).on("click", function (event) {
				var that = this, index = $("this").attr("index");
				//关闭其他下拉选择组件
				$("."+CLASS_LIST).each(function (k, v) {
					if (k != index) {
						$(v).removeClass(CLASS_ACTIVE)
					}
				});
				//点击其他区域关闭此组件
				(function documentHandler() {
					$(document).one('click', function (event) {
						var e = event || window.event;
						if ($(e.target).closest("."+CLASS_STATUS)[0] === that) {
							documentHandler(); 
							return;
						}
						selectList.removeClass(CLASS_ACTIVE);
					})
				})();

				selectList.toggleClass(CLASS_ACTIVE);
			});
			selectList.find(".option").on("click", function () {
				var optionIndex = $(this).index();
				elem.attr({
					"data-value": $(this).attr("data-value"),
					"data-text": $(this).text()
				});
				//设置表单selected项，并触发change事件   
				elem.find("option").eq(optionIndex).attr("selected", true).siblings("option").removeAttr("selected");
				elem.trigger("change");
				selectList.find(".option").removeClass("selected");
				selectList.removeClass(CLASS_ACTIVE).find("."+CLASS_TEXT).text($(this).text());
				$(this).addClass("selected");
			});
			
		}
	}

	Skeleton.select = function (options) {
		return new Select(options)
	}

})(Skeleton, jQuery)





















