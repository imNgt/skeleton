;(function (Skeleton, $) {
    Skeleton.Select = function (options) {
        var config = {
            elem: '',
            index: ''
        };
        this.config = $.extend(config, options || {});
        this.elem = $(this.config.elem).eq(0); 
        this.index = this.options.index;
    }

    Skeleton.Select.prototype = {
        init: function () {
            var that = this,
                elem = that.elem,
                index = that.index;
            var defaultOpt = elem.attr("placehoder") || elem.find("option").eq(0).html();
            var template = '<div class="select-list"' + 'index="' + index + '">', optionsHtml = '';
            elem.find("option").each(function (k, opt) {
                var text = $(opt).html() || '';
                optionsHtml += '<span class="option" >' + text + '</span>';
                if ($(opt).attr("selected") !== undefined) {
                    defaultOpt = text;
                    that.selectedIndex = k;
                }
            });
            template += '<span class="select-trigger"><span class="selected-text">' + defaultOpt + '</span><i class="icon"></i></span>';
            template += '<div class="options">';
            template += optionsHtml + '</div></div>';
            elem.hide().after(template);
        },
        bindEvent: function () {
            var that = this, elem = that.elem;

            var selectList = elem.siblings(".select-list");
            selectList.find(".select-trigger").on("click", function (event) {
                var that = this, index = $("this").attr("index");
                //关闭其他下拉选择组件
                $(".select-list").each(function (k, v) {
                    if (k != index) {
                        $(v).removeClass("opened")
                    }
                });
                //点击其他区域关闭此组件
                (function documentHandler() {
                    $(document).one('click', function (event) {
                        var e = event || window.event;
                        if ($(e.target).closest(".select-trigger")[0] === that) {
                            documentHandler();
                            return;
                        }
                        selectList.removeClass("opened");
                    })
                })();

                selectList.toggleClass("opened");
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
                selectList.removeClass("opened").find(".selected-text").text($(this).text());
                $(this).addClass("selected");
            });
            if (that.selectedIndex !== undefined) {
                selectList.find(".option").eq(that.selectedIndex).trigger("click");
            }
        }
    }

})(Skeleton, jQuery)





















