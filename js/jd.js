;(function () {
    layout();
    window.onscroll = layout;
    /*图片延迟加载*/
    function layed() {
        var imgs = document.getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++) {
            var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var boxHeight = imgs[i].parentNode.offsetHeight,
                boxTop = offset(imgs[i].parentNode).top;
            if (clientHeight + scrollTop > boxHeight + boxTop) {
                imgs[i].src = imgs[i].getAttribute('real');
            }
        }
    }

    // 获取盒子的宽 高
    function offset(curEle) {
        var left = 0, top = 0;
        var par = curEle.offsetParent;
        left += curEle.offsetLeft;
        top += curEle.offsetTop;
        while (par) {
            left += par.offsetLeft;
            top += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: left, top: top}
    }

    $("#banner_hidden").bind('click', function () {
        $(".header").hide();
    });
    // 地理位置
    (function () {
        $(".fn  a").click(function () {
            $(".start-city").val($(this).html());
            $(".squares-game-layer").hide();

        });
        for (var i = 0; i < $(".city-list li").length; i++) {
            $(".city-list li").click(function () {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
                $(this).removeClass("hoverColor");
                $("#city").empty().html($(this).html());
            });
            $(".city-list li").mouseenter(function () {
                if ($("#city").html() != $(this).html()) {
                    $(this).addClass("hoverColor");
                } else {
                    $(this).addClass("active");
                }
            })
            $(".city-list li").mouseleave(function () {
                if ($("#city").html() != $(this).html()) {
                    $(this).removeClass("hoverColor");
                }
            })
        }
    })();
    // 轮播图 层叠
    (function () {
        var timer = null;
        var index = 0;
        var callbackData = null;
        var getData = (function () {
            $.ajax({
                url: '../data.txt',
                type: 'get',
                dataType: 'json',
                async: false,
                success: function (data) {
                    /*callbackData = JSON.parse(data);*/
                    callbackData = data;
                    var str = "";
                    var str1 = "";
                    for (var i = 0; i < callbackData.length; i++) {
                        str += "<li><img class='j-lbIcon'  src='' real='" + callbackData[i]['src'] + "'></li>";
                        str1 += i == 0 ? "<li class='active'></li>" : "<li></li>";
                    }
                    $("#slider-indicator-img").append(str);
                    $("#slider-indicator-btn").append(str1);
                }
            });
        })();
        var bindData = (function () {
            var $imgs = $(".j-lbIcon");
            $imgs.each(function (index, item) {
                var $tempImg = $("<img/>");
                $tempImg.prop('src', $(item).attr('real'));
                $tempImg.on('load', function () {
                    $(item).prop('src', $(this).prop('src'));
                    if (index == 0) {
                        $(item).css('zIndex', 1).stop().animate({opacity: 1}, 500);
                    }
                });
            });
        })();
        timer = setInterval(autoPlay, 2000);
        function autoPlay() {
            index++;
            if (index == callbackData.length) {
                index = 0;
            }
            setImgShow();
        }

        function setImgShow() {
            for (var i = 0; i < $("#slider-indicator-img  img").length; i++) {
                if (i == index) {
                    $(".j-lbIcon")[i].style.zIndex = 1;
                    animate($(".j-lbIcon")[i], {opacity: 1}, 500, null, null, null, null)
                    // $(".j-lbIcon")[i].style.opacity = 1;
                } else {
                    $(".j-lbIcon")[i].style.zIndex = 0;
                    animate($(".j-lbIcon")[i], {opacity: 0}, 500, null, null, null, null)
                    // $(".j-lbIcon")[i].style.opacity = 0;
                }
            }
            for (var i = 0; i < $("#slider-indicator-img  img").length; i++) {

                var lis = document.getElementById("slider-indicator-btn").getElementsByTagName("li");
                lis[i].className = i == index ? "active" : "";
                /* if (i == index) {
                 lis[i].className = 'active';
                 }else {
                 lis[i].className = '';
                 }*/
            }
        }

        $("#right-bt").on("click", function () {
            autoPlay();
        });
        $("#left-bt").on("click", function () {
            index--;
            if (index == -1) {
                index = callbackData.length - 1;
            }
            setImgShow();
        });
        $(".fs_col2 ").on("mouseover", function () {
            clearInterval(timer);
        });
        $(".fs_col2 ").on("mouseout", function () {
            timer = setInterval(autoPlay, 2000);
        });
        (function () {
            var lis = document.getElementById("slider-indicator-btn").getElementsByTagName("li");
            for (var i = 0; i < lis.length; i++) {
                lis[i].index = i;
                lis[i].onmouseover = function () {
                    index = this.index;
                    setImgShow(); // 只要更换index的值就会把对应index的图片更换
                }
            }
        })();
    })();
    function animate(ele, target, duration, step, mis, callback) {
        // target :终点 step :步长 mis 间隔多久执行一遍定时器
        // duration 设置样式属性
        var time = 0,
            begin = {},
            change = {};
        duration = duration || 1000;
        mis = mis || 10;
        for (var key in target) {
            begin[key] = utils.getCss(ele, key);
            change[key] = target[key] - begin[key];
        }
        /*负责动画*/
        window.clearInterval(ele.timer);
        ele.timer = window.setInterval(function () {
            time += step || 10;
            if (time >= duration) {
                window.clearInterval(ele.timer);
                for (var key in target) {
                    utils.setCss(ele, key, target[key]);
                }
                if (typeof  callback == 'function') {
                    callback.call(ele);
                }
                return;
            }
            for (var key in change) {
                var val = begin[key] + time / duration * change[key];
                utils.setCss(ele, key, val);
            }
        }, mis);
    };
    /*左右角快速定位*/
    (function () {
        var $item = $(".J_lift_item");
        var $context = $(".J_lift_contxt");
        init();
        function init() {
            this.n = 0;
            this.offsetTopVal = [];
            this.scrolltype = true;
            /*添加样式*/
            this.review = function () {
                $('#popup li a').eq(this.n)
                    .addClass('cur').parent()
                    .siblings().children()
                    .removeClass('cur');
            };
            /*动态获取盒子的高度并添加到盒子 本身上*/
            for (var i = 0; i < $item.length; i++) {
                var top = $item.eq(i).offset().top - 60;
                this.offsetTopVal.push(
                    top
                    //$item.eq(i).offset().top
                );
            }
            bindEvent();
        }

        function bindEvent() {
            var self = this;
            /*当前窗口滚出去多高 给左侧导航添加对应的样式*/
            $(window).bind('load scroll', function () {
                var scrollTopVal = $(this).scrollTop();
                if (scrollTopVal > 465) {
                    //判断滚动条滚动距离大于或小于header高度时，让导航效果对应在第一个上
                    if (scrollTopVal < self.offsetTopVal) {
                        self.n = 0;
                    } else {
                        for (var j = 0; j < self.offsetTopVal.length; j++) {
                            if (scrollTopVal > (self.offsetTopVal[j] + 465) && scrollTopVal < self.offsetTopVal[j + 1]) {
                                self.n = j + 1;
                                break;
                            }//这里的300是常量
                        }
                    }
                    $('#popup').removeClass('cur').addClass('cur');
                } else {
                    //$('#popup').removeClass('pop').addClass('pop1');
                    $('#popup li a').parent('li:first-child').children().addClass('cur').parent().siblings().children().removeClass('cur');
                }
                for(var i =0; i <self.offsetTopVal.length;i++){
                    for(var j =i ; j<self.offsetTopVal.length; j++){
                        $('#popup li a').parent('li:first-child').children().addClass('cur').parent().siblings().children().removeClass('cur');
                    }
                }
            });
            //  点击返回首页Top按钮实现页面不刷新返回顶部
            $('.top').click(function () {
                $('html, body').animate({scrollTop: 0 + 'px'}, 500);
                $('#popup li a').parent('li:first-child').children().addClass('cur').parent().siblings().children().removeClass('cur');
            });
            /* delegate() 方法为指定的元素（属于被选元素的子元素）添加一个或多个事件处理程序，并规定当这些事件发生时运行的函数*/
            $('#popup li').delegate('a', 'click', function (e) {//   点击导航定位页面内容
                self.n = $(this).index('#popup li a');
                self.scrolltype = false;
                self.review();
                var t = self.offsetTopVal[self.n];
                $('html,body').animate({scrollTop: t}, 500, function () {
                    //   滚动条滚动 页面不同内容的offsetTop值实现按钮对应效果
                    self.scrolltype = true;
                    $(self.n).addClass('cur').parent().siblings().children().removeClass('cur');
                });
            });
        };
    })();
    /*页面搜索框根据滚动的高度判断显示*/
    function layout() {
        if ($(window).scrollTop() > $(window).height()) {
            $("#j_search").css({"top": "0"});
        } else {
            $("#j_search").css({"top": "-50px"});
        }
        if ($(window).scrollTop() > ($(window).height()) * 2) {
            $(".J_f").css({"opacity": "1"});
        } else {
            $(".J_f").css({"opacity": "0"});
        }
        layed();
        console.log();
    };
    /*倒计时*/
    (function () {
        function record() {
            var timer1 = null;
            //获取当前的时间
            var curDate = new Date();
            //目标时间，先转化成时间格式的对象才能使用getTime()方法
            var targetDate = new Date('2017/02/11 18:00:00');
            //当前时间距离1970的ms数
            var curDate1970 = curDate.getTime();
            //目标距离1970的ms
            var targetDate1970 = targetDate.getTime();
            //时间差
            var time = targetDate1970 - curDate1970;
            /*判断如果目标时间小于当前时间 则隐藏倒计时*/
            if (time < 0) {
                $(".box_hd_col2").hide();
            }
            //换算单位把time换算成h/m/s
            //先换算成小时
            var h = Math.floor(time / (1000 * 60 * 60)); // 向下取整
            // 换算分钟  => 需要把h小时所占用的ms数减去，然后再换算分钟
            var m = Math.floor((time - h * 60 * 60 * 1000) / (1000 * 60));

            // 换算s  => 把小时和分钟所占用的ms数都减去，然后再换算成s

            var s = Math.floor((time - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000);
            if (h + m + s <= 0) {
                window.clearInterval(timer1);
                return;
            }
            $(".cd_hour .cd_item_txt").html(addZero(h));
            $(".cd_minute .cd_item_txt").html(addZero(m))
            $(".cd_second .cd_item_txt").html(addZero(s));
        }

        //给不足10的数前面添加一个0
        function addZero(n) {
            return n < 10 ? ('0' + n) : n;
        }

        timer1 = window.setInterval(record, 1000);
    })();
    /*轮播图 左右*/
    $(function () {
        function moreCard() {
            $(".jCarouselLiteList").jCarouselLite({
                visible: 5,
                btnNext: ".list_right_btn",
                btnPrev: ".list_left_btn",
                scroll: 5,
                speed: 1000
            });
        };
        function moreCard1() {
            $(".j-pt_ft").jCarouselLite({
                visible: 6,
                btnNext: ".pt_logo_left",
                btnPrev: ".pt_logo_right",
                scroll: 6,
                speed: 1000
            });
        };
        function moreCard2() {
            $(".j-pt_ft1").jCarouselLite({
                visible: 6,
                btnNext: ".pt_logo_left1",
                btnPrev: ".pt_logo_right1",
                scroll: 6,
                speed: 1000
            });
        };
        moreCard();
        moreCard1();
        moreCard2();
    });
    /*选项卡设置样式*/
    (function () {
        var allA = document.querySelectorAll(".j_tab_head  a");
        //var Div = document.getElementsByClassName("j_tab_active")[0];
        var Div = $(".j_tab_active")[0];
        //var contentDiv = document.getElementsByClassName("top_tab_context");
        var contentDiv = $(".top_tab_context");

        for (var i = 0; i < allA.length; i++) {
            allA[i].index = i;
            allA[i].onmousemove = function () {
                Div.style.left = this.index * 79 + "px";
                for (var j = 0; j < allA.length; j++) {
                    contentDiv[j].className = "top_tab_context"
                }
                contentDiv[this.index].className = "top_tab_context active";
            }
        }
        var $mod = $(".mod_tab_head ul li");
        var $newActive = $(".mod_tab_head  .new_active");
        var $newContent = $(".news_content");
        //var $newContent = document.getElementsByClassName("news_content");
        for (var i = 0; i < $mod.length; i++) {
            $mod[i].index = i;
            $($mod).mousemove(function () {
                $($newActive).css({
                    left: this.index * 55 + "px"
                })
                for (var j = 0; j < $mod.length; j++) {
                    $newContent[j].className = "news_content"
                }
                $newContent[this.index].className = "news_content show";
            })
        }
        var $service = $(".service_pop .squares-tab a");
        var $squares = $(".squares-main");
        for (var i = 0; i < $service.length; i++) {
            $service[i].index = i;
            $($service).mouseenter(function () {
                for (var j = 0; j < $service.length; j++) {
                    $service[j].className = "";
                    $squares[j].className = "squares-main"
                }
                this.className = "cur";
                $squares[this.index].className = "squares-main bk"
            })
        }

        var $tab = $(".j-tab li");
        var $fn = $(".fn");
        for (var i = 0; i < $tab.length; i++) {
            $tab[i].index = i;
            $($tab).click(function () {
                for (var j = 0; j < $tab.length; j++) {
                    $tab[j].className = "";
                    $fn[j].className = "fn"
                }
                this.className = "cur";
                $fn[this.index].className = "fn bk"
            })
        }
    })();
    /*game*/
    (function () {
        var $game = $(".select .start-city");
        var $gameLayer = $(".squares-game-layer");
        var $select = $(".select");
        $game.click(function () {
            $gameLayer.css({
                display: 'block'
            })
        })
        $select.mouseleave(function (e) {
            $gameLayer.css({
                display: 'none'
            })
        });
    })();
    (function () {
        var $frame = $(".service_frame span");
        var $service = $(".service");
        var $con = $(".service_pop");
        var $error = $(".service_pop_item .error");
        for (var i = 0; i < $frame.length; i++) {
            $frame[i].index = i;
            var isOk = 1;
            $frame.mouseenter(function () {
                if (isOk) {
                    for (var j = 0; j < $frame.length; j++) {
                        $service.css({
                            top: "85px",
                            height: "210px"
                        })
                        $con.css({
                            opacity: 0,
                            bottom: "-220px",
                            transition: "all .3s ease-in  0s"
                        })
                    }
                    $service.eq(this.index).css({
                        top: "85px",
                        height: "60px"
                    })
                    $con.eq(this.index).css({
                        opacity: 1,
                        bottom: "0px",
                        transition: "all .3s ease-in  0s"
                    })
                    isOk = 0;
                } else {
                    for (var j = 0; j < $frame.length; j++) {
                        $service.css({
                            top: "85px",
                            height: "210px",
                            transition: "all 0s ease-in  0s"
                        })
                        $con.css({
                            opacity: 0,
                            bottom: "-220px",
                            transition: "all 0s ease-in  0s"
                        })
                    }
                    $service.eq(this.index).css({
                        top: "85px",
                        height: "60px",
                        transition: "all 0s ease-in  0s"
                    })
                    $con.eq(this.index).css({
                        opacity: 1,
                        bottom: "0px",
                        transition: "all 0s ease-in  0s"
                    })
                }

            });
            $error.click(function () {
                $service.css({
                    top: "120px",
                    height: "210px"
                })
                $con.css({
                    opacity: 0,
                    bottom: "-220px"
                })
            });
        }
    })();
})();