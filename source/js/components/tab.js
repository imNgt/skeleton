; (function (Skeleton, $) {

	var index = 0;//实例化组件数	

	var Tab = function (options) {
		var config = {
			elem:"",
			content:"",
			onChange:function(){   

			}
		};
		this.config = $.extend(config, options || {});
		this.index = ++index;
		this.elem = $(this.config.elem).eq(0);
		if(this.elem.length<1){
			return 
		}

		this.init();
	}

	Tab.inherits(Skeleton);

	var CLASS_SLIDER="tab-slider",CLASS_ITEM="tab-item",CLASS_ACTIVE="active",CONTENT_ITEM="content-item";
 
	Tab.prototype = {
		init:function(){
			var config=this.config,
			sliderWidth=this.getActiveItem().innerWidth();

			if(config.content){ 
				this.content=$(config.content); 
			} 

			this.elem.append('<li class="'+CLASS_SLIDER+'" style="width:'+sliderWidth+'px;"></li>');   
			this.bindEvent();
			this.getActiveItem().trigger("click"); 
		},
		bindEvent:function(){ 
			var that=this,slider=this.elem.find("."+CLASS_SLIDER);       
			that.elem.find("."+CLASS_ITEM).click(function(){ 
				var itemIndex=$(this).index();
				slider.width($(this).innerWidth()).offset($(this).offset())  
				$(this).addClass(CLASS_ACTIVE).siblings("."+CLASS_ITEM).removeClass(CLASS_ACTIVE);      

				if(that.content.length>0){       
					that.content.find("."+CONTENT_ITEM).eq(itemIndex).addClass(CLASS_ACTIVE).siblings("."+CONTENT_ITEM).removeClass(CLASS_ACTIVE);
				}
			}) 
		},
		getActiveItem:function(){
			var that=this,
			items=that.elem.find("."+CLASS_ITEM),
			activeItem=items.eq(0);

			items.each(function(k,v){
				if($(this).hasClass(CLASS_ACTIVE)){
					activeItem=$(this);
				}
			});
			                                                                                                                     
			return activeItem; 
		} 
		 
	}

	Skeleton.tab = function (options) {
		return new Tab(options)
	}

})(Skeleton, jQuery)


