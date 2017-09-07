/* 
*total 所有数据数量
*current 当前页数
*middlePage 渲染的中间页数
*onChange 页码改变的回调
	*/
; (function (Skeleton, $) {

	var index = 0;//实例化组件数	

	var Page = function (options) {
		var config = {
			elem: '', 
			total: 999,
			current: 10,
			middlePage: 5, 
			pageSize:10   
		};

		this.config = $.extend(config, options || {});


		$(this.config.elem).html(this.calculatePages().join(""));
	}

	Page.inherits(Skeleton);

	// 计算页码，返回页码元素    
	Page.prototype = {
		calculatePages: function () {
			var that=this;
			var config = that.config,
				current = config.current,
				middlePage = config.middlePage,
				pageSize = config.pageSize,
				total = config.total;    
			var paginalNumber = Math.ceil(total / pageSize);
			var fixPage = 0,									// 根据middlePage修正页码
				viewPageStart = 0,									// 中间页码开始
				viewPageEnd = 0,									// 中间页码结束
				ret = [];

			// 中间页码修正，middlePage为偶数，viewPageEnd需要减1
			fixPage = middlePage & 1 == 0 ? 1 : 0;

			// 检测前边界值 
			if (current <= middlePage) {
				viewPageStart = 1;
				viewPageEnd = middlePage + Math.floor(middlePage / 2);
			} else if (current >= paginalNumber - Math.floor(middlePage / 2) - 1) {	// -1 是为了最后一页显示6条分页数据 32..33 是不合理的 应该是 32 33
				// 检测后边界值
				viewPageStart = paginalNumber - middlePage;
				viewPageEnd = paginalNumber; 
			} else {
				// middlePage在中间
				viewPageStart = current - Math.floor(middlePage / 2);
				viewPageEnd = current + Math.floor(middlePage / 2) - fixPage;
			}
			/*limit viewPageEnd*/
			if (viewPageEnd > paginalNumber) {
				viewPageEnd = paginalNumber;
			}
			/*show dot near start*/
			if (viewPageStart > 2) {
				ret.push('<span key="page-first">1</span>');
				ret.push('<span key="page-first-dot" class="page-dot">...</span>');
			}
			/*view of middle*/
			that.range(viewPageStart, viewPageEnd + 1).map(function(index, key){
				var currClass=index == current ? "page-current" :"";   
				ret.push('<span key="page"  class="'+currClass +'">'+index+'</span>');
			});
                                      
 
			/*show dot near end*/   
			if (viewPageEnd != paginalNumber) {
				ret.push('<span key="page-last" class="page-dot">...</span>');
				ret.push('<span key="page-last-dot" >'+paginalNumber+'</span>');
			}
			return ret;     
		},
		range:function(start , stop , step) {
			var start=start||0,step=step||1;
			var length = Math.max(Math.ceil((stop - start) / step), 0); 
			var range = Array(length);     
			for(var idx = 0; idx < length; idx++, start += step) {
				range[idx] = start; 
			}       
			return range;
		}
	}


	Skeleton.page = function (options) {
		return new Page(options)
	}

})(Skeleton, jQuery)





















