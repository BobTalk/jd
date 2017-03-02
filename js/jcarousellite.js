(function ($) {
    $.fn.jCarouselLite = function (data) {
        data = $.extend({
            btnPrev: null,
            btnNext: null,
            btnGo: null,
            mouseWheel: false,
            auto: null,
            speed: 200,
            easing: null,
            vertical: false,
            circular: true,
            visible: 3,
            start: 0,
            scroll: 1,
            beforeStart: null,
            afterEnd: null
        }, data || {});
        return this.each(function () {
            var b = false,
                animCss = data.vertical ? "top" : "left",
                sizeCss = data.vertical ? "height" : "width";

            var c = $(this),
                ul = $("ul", c),
                tLi = $("li", ul),
                tl = tLi.size(),
                v = data.visible;
            if (data.circular) {
                ul.prepend(tLi.slice(tl - v - 1 + 1).clone()).append(tLi.slice(0, v).clone());
                data.start += v;
            }

            var f = $("li", ul),
                itemLength = f.size(),
                curr = data.start;
            c.css("visibility", "visible");
            f.css({
                /*overflow: "hidden",*/
                float: data.vertical ? "none" : "left"
            });
            ul.css({
                margin: "0",
                padding: "0",
                position: "relative",
                "list-style-type": "none",
                "z-index": "1"
            });
            c.css({
                overflow: "hidden",
                position: "relative",
                "z-index": "2",
                left: "0px"
            });

            var g = data.vertical ? height(f) : width(f);
            var h = g * itemLength;
            var j = g * v;
            f.css({
                width: f.width(),
                height: f.height()
            });
            ul.css(sizeCss, h + "px").css(animCss, -(curr * g));
            c.css(sizeCss, j + "px");
            if (data.btnPrev) {
                $(data.btnPrev).click(function () {
                    return go(curr - data.scroll)
                });
            }
            if (data.btnNext) {
                $(data.btnNext).click(function () {
                    return go(curr + data.scroll)
                });
            }
            if (data.btnGo) {
                $.each(data.btnGo, function (i, a) {
                    $(a).click(function () {
                        return go(data.circular ? data.visible + i : i)
                    })
                });
            }
            if (data.mouseWheel && c.mousewheel) {
                c.mousewheel(function (e, d) {
                    return d > 0 ? go(curr - data.scroll) : go(curr + data.scroll)
                });
            }
            if (data.auto) {
                setInterval(function () {
                    go(curr + data.scroll)
                }, data.auto + data.speed);
            }
            function vis() {
                return f.slice(curr).slice(0, v)
            }

            function go(a) {
                if (!b) {
                    if (data.beforeStart) {
                        data.beforeStart.call(this, vis());
                    }
                    if (data.circular) {
                        if (a <= data.start - v - 1) {
                            ul.css(
                                animCss, -((itemLength - (v * 2)) * g) + "px"
                            );
                            curr = a == data.start - v - 1 ? itemLength - (v * 2) - 1 : itemLength - (v * 2) - data.scroll
                        } else if (a >= itemLength - v + 1) {
                            ul.css(animCss, -((v) * g) + "px");
                            curr = a == itemLength - v + 1 ? v + 1 : v + data.scroll
                        } else curr = a
                    } else {
                        if (a < 0 || a > itemLength - v)return; else curr = a
                    }
                    b = true;
                    ul.animate(
                        animCss == "left" ? {left: -(curr * g)} : {top: -(curr * g)}, data.speed, data.easing, function () {
                            if (data.afterEnd)data.afterEnd.call(this, vis());
                            b = false
                        });
                    if (!data.circular) {
                        $(data.btnPrev + "," + data.btnNext).removeClass("disabled");
                        $((curr - data.scroll < 0 && data.btnPrev) || (curr + data.scroll > itemLength - v && data.btnNext) || []).addClass("disabled")
                    }
                }
                return false
            }
        })
    };
    function css(a, b) {
        return parseInt($.css(a[0], b)) || 0
    };
    function width(a) {
        if (a.length != 0) {
            return a[0].offsetWidth + css(a, 'marginLeft') + css(a, 'marginRight')
        }
    };
    function height(a) {
        return a[0].offsetHeight + css(a, 'marginTop') + css(a, 'marginBottom')
    }
})(jQuery);