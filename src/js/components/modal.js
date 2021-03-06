;
(function (Skeleton, $) {

    var index = 0 //实例化组件数	
    var ZIndex = 9999

    var Modal = function (options) {
        var config = {
            content: '',
            shade: .1,
            skin: 'modal',
            width: "400px",
            height: "",
            title: "提示",
            coexist: false,
            ZIndex: false,
            fixed: true,
            shadowClose: true,
            buttonClose: true,
            button: ["取消", "确定"],
            onButton1: function (modal) {
                this.close()
            },
            onButton2: function (modal) {
                this.close()
            },
            onLoad: function (modal) {
                console.log(this, modal)
            }

        }
        this.config = $.extend(config, options || {})
        this.index = ++index


        if (!this.config.coexist) {
            this.closeAll()
        }

        this.init()
    }

    Modal.inherits(Skeleton)

    Modal.prototype = {
        init: function () {
            var config = this.config

            this.create()
            this.setZIndex()
            this.position()
            this.bindEvent()

            if (config.shade) {
                this.shade.show()
			}
			
			this.open()
			if (typeof config.onLoad === "function") {
                config.onLoad.call(this, this.modal)
            }
        },
        create: function () {
            var config = this.config,
                i, button = config.button,
                temp = ""

            if (config.shade) {
                temp += '<div class="sk-modal-shade modal-shade-' + this.index + '" key="' + this.index + '"></div>'
            }

            temp += '<div class="sk-modal sk-modal-' + this.index + ' ' + config.skin

            temp += '" style="';
            if (config.width) {
                temp += 'width:' + config.width
            }
            if (config.height) {
                temp += ';height:' + config.height
            }
            // temp += ';display:none; '
            temp += '" key="' + this.index + '">'

            temp += '<div class="modal-head">' + config.title
            if (config.buttonClose) {
                temp += '<a href="javascript:" class="modal-close"></a>'
            }
            temp += '</div>'

            temp += '<div class="modal-body">' + config.content + '</div>'

            if (button && button.length > 0) {
                temp += '<div class="modal-footer">'
                for (i = 0; i < button.length; i++) {
                    var key = i + 1
                    temp += '<button type="button" class="btn modal-btn modal-btn-"' + key + '" key="' + key + '">' + button[i] + '</button>'
                }
                temp += '</div>'
            }
            temp += '</div>'

            $('body').append($(temp))

            this.modal = $("body").find(".sk-modal-" + this.index)
            if (config.shade) {
                this.shade = $("body").find(".modal-shade-" + this.index)
            }

        },
        position: function () {
            var winWdith = $(window).width(),
                winHeight = $(window).height(),
                width = this.modal.outerWidth(),
                height = this.modal.outerHeight()

            var left = (winWdith - width) / 2,
                top = (winHeight - height) / 2

            //绝对定位，加上滚动条卷去的高度	
            if (!this.config.fixed) {
                var scrollTop = document.documentElement.scrollTop + document.body.scrollTop
                var scrollLeft = document.documentElement.scrollLeft + document.body.scrollLeft
                left += scrollLeft
                top += scrollTop
                this.modal.css({ position: "absolute" })
            }
			
            this.modal.css({ "left": left, "top": top })
        },
        setZIndex: function () {
            var config = this.config
            if (config.shade) {
                this.shade.css({ "z-index": ZIndex + index })
            }
            this.modal.css({ "z-index": ++ZIndex + index })
		},
		open:function () {
			var that=this
			that.modal.addClass("fadeInScale_SK").show()
			setTimeout(() => {
				that.modal.removeClass("fadeInScale_SK")
			}, 300)
		},
        close: function () {
            var that = this,
                config = this.config

            that.modal.addClass("fadeOutScale_SK")
            if (config.shade) {
                that.shade.addClass("transparent")
            }

            setTimeout(function () {
                that.modal.remove()
                if (config.shade) {
                    that.shade.remove()
                }
            }, 300)
            index--
            ZIndex--
        },
        closeAll: function () {
            $(".sk-modal-shade,.sk-modal").remove()
            index = 0
            ZIndex = 9999
        },
        bindEvent: function () {
            var that = this,
                config = this.config,
                button = this.config.button
            that.modal.on("click", ".modal-head .modal-close", function () {
                that.close()
            })

            if (config.shadowClose) {
                $(".sk-modal-shade.modal-shade-" + that.index).on("click", function () {
                    that.close()
                })
            }

            if (button && button.length > 0) {
                that.modal.find(".modal-btn").click(function () {
                    var key = this.getAttribute("key")
                    for (var i = 1; i <= button.length; i++) {
                        if (key == i && typeof config["onButton" + i] === "function") {
                            config["onButton" + i].call(that, that.modal)
                        }
                    }
                })
            }

            $(window).resize(function () {
                that.position()
            })

        }
    }

    Skeleton.modal = function (options) {
        return new Modal(options)
    }

})(Skeleton, jQuery)