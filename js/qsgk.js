qsgk = function() {
    function b() {
        E = {
            check: {
                enable: !0
            },
            view: {
                showIcon: !1
            },
            data: {
                key: {
                    name: "name",
                    children: "child"
                }
            },
            callback: {
                onClick: n,
                onCheck: g
            }
        };
        var b = qsgk._map.map;
        b.events.register("zoomend", null,
        function() {
            12 < b.getZoom() ? document.attachEvent ? qsgk._map.map.viewPortDiv.attachEvent("onclick", y, !1) : qsgk._map.map.viewPortDiv.addEventListener("click", y, !1) : document.detachEvent ? qsgk._map.map.viewPortDiv.detachEvent("onclick", y) : qsgk._map.map.viewPortDiv.removeEventListener("click", y)
        });
        var d = {
            TRANSPARENT: !0,
            STYLES: "",
            FORMAT: "image/png",
            SRS: qsgk._map.map.getProjection()
        };
        k = new OpenLayers.Layer.WMS("testWms", Service.qdhyTile, d, {
            isBaseLayer: !1,
            opacity: 1,
            singleTile: !0
        });
        z = data.getLay();
        $(".d_item input").attr("readonly", "readonly");
        $(".d_item input").click(function() {
            a($(this))
        });
        $("#con_tree").mouseleave(function() {
            $("#con_tree").css({
                display: "none"
            })
        });
        $("#btn_Query").click(function() {
            u = [];
            var a = p();
            h(a);
            u.push(a)
        });
        $("#ul_list").on("click", "li",
        function(a) {
            $("#ul_list li").css("background-color", "#fff");
            $(this).css("background-color", "#eee");
            a = $(this).attr("x");
            var b = $(this).attr("y");
            a = new OpenLayers.LonLat(a, b);
            qsgk._map.map.setCenter(a, 9);
            x(a)
        });
        $("#btn_return").click(function() {
            $("#btn_Query").click()
        });
        z.events.on({
            featureselected: c
        });
        $(".tab li").click(function()
        {
            $('.tab li').removeClass('active');
            $(this).addClass('active');
            $('.tabCon div').hide();
            var index = $(".tab li").index(this);
            var element=$(".tabCon div").eq(index);
            element.show();
        });
        $(".close_x").click(function(){
            $('.gropbox').hide(500);
        });
        $(".float_menu").click(function(){
            var n=$('.gropbox');
            if(n.is(':hidden')){n.show(500);}
            else{n.hide(500)};
        });
        
    }
    function c(a) {
        l(a.feature.attributes.bm, !1)
    }
    function e() {
        h({});
    }
    function f(a) {
        a ? ($("#qsgk_tree").hide(), $("#D_list").show(), $("#btn_return").show()) : ($("#qsgk_tree").show(), $("#D_list").hide(), $("#btn_return").hide())
    }
    function h(a) {
        z.removeAllFeatures();
        data.getLay1().removeAllFeatures();
        qsgk._map.removePopup(qsgk._map.widgetPop);
        qsgk._map.map.setCenter(new OpenLayers.LonLat(116.399, 40.185), 9);
        data.addTileLayer();
        f(!1);
        JsonpRequest(Service.comHandl + "SuperQuery_S", v(a),
        function(a) {
            a = a.retult;
            var Tdata=[];
            if (null != a) {
                var Tstart=(a[0].code=="1100")?1:0;
                var Tend=(a[0].code=="1100")?a.length:1;
                for (var b = Tstart; b < Tend; b++) 
               {var T={
                   name:a[b].name + "(" + a[b].total.count + ")",
                   code:a[b].code
               };d(a[b].code, a[b].total.count);Tdata.push(T);}
                A = $.fn.zTree.init($("#qsgk_tree"), E, Tdata);
                creatTable(a);
            }
        })
    }
    function creatTable(d)
    {
        var con="<table class='table table-hover'><thead><tr><th>名称</th>"+
        "<th>企业数量</th>"+"<th>占地面积</th>"+"<th>水面面积</th>"+"<th>产量</th>"+
        "<th>接待量</th>"+"<th>营业额</th>"+
        "</tr></thead><tbody>";
        for(var i=0;i<d.length;i++)
        {
            if(i==0)//heji
            {
                $('#gk').html("名称："+d[i].name+"<br/>"+
                "企业数量："+d[i].total.count+"<br/>"+
                "占地面积："+d[i].total.floor+"<br/>"+
                "水面面积："+d[i].total.aqu+"<br/>"+
                "产量："+d[i].total.val+"<br/>"+
                "接待量："+d[i].total.recep+"<br/>"+
                "营业额："+d[i].total.pro+"<br/>"
            );
            }
            else
            {
                con=con+"<tr><td>"+d[i].name+"</td>"+
                "<td>"+d[i].total.count+"</td>"+
                "<td>"+d[i].total.floor+"</td>"+
                "<td>"+d[i].total.aqu+"</td>"+
                "<td>"+d[i].total.val+"</td>"+
                "<td>"+d[i].total.recep+"</td>"+
                "<td>"+d[i].total.pro+"</td>"+
                "</tr>";
            }
        }
        con=con+"</tbody></table>";
        $('#xq').html(con);
    }
    function d(a, b) {
        var c = data.getHash().get(a);
        if (c) {
            var c = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(c.x, c.y)),
            d = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]);
            d.externalGraphic = "images/yuye/Point.png";
            rr = 45 + parseInt(b / 15);
            d.graphicWidth = rr;
            d.graphicHeight = rr;
            d.fillOpacity = 1;
            d.cursor = "pointer";
            d.label = "\u6570\u91cf:" + b;
            d.stroke = !1;
            d.labelSelect = !0;
            d.labelOutlineWidth = 0;
            d.fontColor = "#5F6161";
            d.fontWeight="bold";
            c.style = d;
            c.attributes = {
                bm: a
            };
            z.addFeatures(c)
        }
    }
    function a(a) {
        var b = a.position().top,
        c = a.position().left,
        d = a.attr("d");
        $("#con_tree").css({
            display: "block"
        });
        $("#con_tree").css("left", c);
        $("#con_tree").css("top", b + 20);
        b = {
            view: {
                showLine: !1,
                showIcon: !1
            },
            check: {
                enable: !0,
                chkStyle: "11" == d || "12" == d ? "checkbox": "radio"
            },
            data: {
                key: {
                    name: "name"
                }
            },
            callback: {
                onClick: function(b, c, e) {
                    "11" != d && "12" != d && (a.val(e.name), a.attr("c", e.c))
                },
                onCheck: function(b, c, e) {
                    if ("11" == d || "12" == d) if ("1100" == e.c || "1200" == e.c) a.val(e.name),
                    a.attr("c", e.c),
                    $("#con_tree").css({
                        display: "none"
                    });
                    else {
                        c = b = "";
                        nodes = w.getCheckedNodes(!0);
                        for (e = 0; e < nodes.length; e++) b += nodes[e].name + " ",
                        c += nodes[e].c + ",";
                        c = "," == c.substring(c.length - 1) ? c.substring(0, c.length - 1) : c;
                        a.val(b);
                        a.attr("c", c)
                    } else a.val(e.name),
                    a.attr("c", e.c)
                }
            }
        };
        c = data.getCondition().get(d);
        w = $.fn.zTree.init($("#con_tree"), b, c)
    }
    var removeInit=false;
    function g(a, b, c) {
        
        if(!removeInit){data.removeTileLayer();z.removeAllFeatures();removeInit=true;}
        if (c.checked) {
            a = c.code;
            b = {
                opa: .1,
                only: !1
            };
            c = data.getLay1();
            var d = data.getHash();
            if (d.contains(a)) {
                var e = OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style["default"]);
                e.strokeColor = "blue";
                e.strokeWidth = 2;
                e.strokeDashstyle = "longdash";
                e.fillOpacity = null != b ? b.opa: .2;
                e.fillColor = null != b ? b.filC: "red";
                c.style = e;
                if (d = d.get(a)) {
                    for (var d = d.geo.rings,
                    e = [], f = 0; f < d.length; f++) {
                        for (var g = [], h = 0; h < d[f].length; h++) {
                            var l = new OpenLayers.Geometry.Point(d[f][h][0], d[f][h][1]);
                            g.push(l)
                        }
                        g = new OpenLayers.Geometry.LinearRing(g);
                        g = new OpenLayers.Geometry.Polygon([g]);
                        e[f] = new OpenLayers.Feature.Vector(g, {
                            bm: a
                        })
                    }
                    b.only && c.removeAllFeatures();
                    c.addFeatures(e);
                    qsgk._map.map.zoomToExtent(c.getDataExtent())
                }
            }
        }
         else a = data.getLay1().getFeaturesByAttribute("bm", c.code),
        data.getLay1().removeFeatures(a);
        a = A.getCheckedNodes(!0);
        if (0 < a.length) {
            b = [];
            for (c = 0; c < a.length; c++) b.push(Service.dy[a[c].code]);
            qsgk._map.addLayer(k);
            k.mergeNewParams({
                LAYERS: b.join(",")
            })
        } else {qsgk._map.removeLayer(k);removeInit=false;$("#btn_Query").click();}
    }
    function n(a, b, c) {
        l(c.code, !0)
    }
    function l(a, b) {
        for (var c = {
            type: "11",
            code: a
        },
        d = u[0].concat(), e = 0; e < d.length; e++) if ("11" == d[e].type) {
            d.splice(e, 1);
            break;
        }
        d.push(c);
        JsonpRequest(Service.comHandl + "SuperQuery_S", v(d),
        function(a) {
            a = a.retult;
            if (null != a) {
                creatTable(a);
            };
            b && q(d);
        });
        $('.gropbox').show(500);
      /*  JsonpRequest(Service.comHandl + "SuperQuery_S", v(d),
        function(c) {
            var e = data.getHash().get(a),
            e = new OpenLayers.LonLat(e.x, e.y);
            c = c.retult[0];
            PoiInfoPop.show("resourcelist", e, {
                "\u540d\u79f0": c.name,
                "\u4f01\u4e1a\u6570\u91cf": c.total.count,
                "\u5360\u5730\u9762\u79ef": c.total.floor,
                "\u6c34\u9762\u9762\u79ef": c.total.aqu,
                "\u4ea7\u91cf": c.total.val,
                "\u63a5\u5f85\u91cf": c.total.recep,
                "\u8425\u4e1a\u989d": c.total.pro
            },
            null);
            b && q(d)
        })*/
    }
    function q(a) {
        JsonpRequest(Service.comHandl + "SuperQuery", v(a),
        function(a) {
            f(!0);
            a = a.result[0];
            a = "undefined" == typeof a.detaillist ? null: a.detaillist;
            null != a && m(a)
        })
    }
    function m(a) {
        var b = a.length;
        r(a, 1, 10);
        b = {
            containerClass: "pagination",
            currentPage: 1,
            numberOfPages: 6,
            totalPages: Math.ceil(b / 10),
            onPageClicked: function(b, c, d, e) {
                r(a, e, 10)
            }
        };
        $("#pag").bootstrapPaginator(b)
    }
    function r(a, b, c) {
        var d = [],
        e = b * c,
        e = e > a.length ? a.length: e;
        for (b = (b - 1) * c; b < e; b++) d.push(common.format('\x3cli class\x3d"li_resultlist" x\x3d{0} y\x3d{1}\x3e\x3cdiv class\x3d"img-info"\x3e\x3c/div\x3e\x3cdiv class\x3d"basic-info"\x3e\x3ch5\x3e{2}\x3c/h5\x3e\x3c/div\x3e\x3c/li\x3e', a[b].longitude, a[b].latitude, a[b].name));
        $("#ul_list").empty();
        $("#ul_list").html(d.join(""))
    }
    function p() {
        var a = [];
        $(".d_item input").each(function(b, c) {
            var d = $(c).attr("c");
            if (void 0 != d) {
                var e = $(c).attr("d");
                a.push({
                    type: e,
                    code: d
                })
            }
        });
        return a
    }
    function v(a) {
        for (var b = {},
        c = 0; c < a.length; c++) b["param" + a[c].type] = a[c].code;
        return b
    }
    function x(a) {
        var b = qsgk._map.map,
        c = b.getExtent(),
        c = c.left + "," + c.bottom + "," + c.right + "," + c.top,
        d = '{"x":' + a.lon + ',"y":' + a.lat + "}",
        e = b.size,
        b = {
            imageDisplay: e.w + "," + e.h + ",96",
            sr: b.getProjection().split(":")[1],
            mapExtent: c,
            geometry: d,
            layers: "all:0,1,2,3,4,5,6,7,8,9,10,11,12",
            geometryType: "esriGeometryPoint",
            returnGeometry: !0,
            tolerance: 4,
            f: "json"
        },
        c = Service.ident + "/identify";
        jQuery.support.cors = !0;
        $.ajax({
            data: b,
            method: "POST",
            url: c,
            success: function(b) {
                b = JSON.parse(b);
                if (null != b.results && 0 < b.results.length) {
                    PoiInfoPop.show("resourcelist", a, b.results[0].attributes, null);
                    var c = b.results[0].geometry;
                    if (null != c) {
                        b = OpenLayers.Util.extend({},
                        OpenLayers.Feature.Vector.style["default"]);
                        b.strokeColor = "red";
                        b.strokeWidth = 2;
                        b.strokeDashstyle = "longdash";
                        b.fillOpacity = .2;
                        b.fillColor = "yellow";
                        z.style = b;
                        for (var c = c.rings,
                        d = [], e = 0; e < c.length; e++) {
                            for (var f = [], g = 0; g < c[e].length; g++) {
                                var h = new OpenLayers.Geometry.Point(c[e][g][0], c[e][g][1]);
                                f.push(h)
                            }
                            f = new OpenLayers.Geometry.LinearRing(f);
                            f = new OpenLayers.Geometry.Polygon([f]);
                            f = new OpenLayers.Feature.Vector(f);
                            f.style = b;
                            d[e] = f
                        }
                        z.removeAllFeatures();
                        z.addFeatures(d);
                        qsgk._map.map.setCenter(z.getDataExtent().getCenterLonLat(), 16)
                    }
                }
            },
            error: function(a, b, c) {}
        })
    }
    function y(a) {
        var b = qsgk._map.map,
        c = a.xy;
        c || (c = $(b.div).offset(), c = {
            x: a.clientX - c.left,
            y: a.clientY - c.top
        });
        a = b.getLonLatFromPixel(c);
        x(a)
    }
    var t = !1,
    A, w, E, u = [[]],
    z = null,
    k;
    return {
        init: function(a) {
            this._map = a;
            t || (b(), e(), t = !0)
        },
        clear: function() {
            data.getLay().removeAllFeatures();
            data.getLay1().removeAllFeatures()
        }
    }
} ();
common = {
    getQueryString: function(b) {
        b = new RegExp("(^|\x26)" + b + "\x3d([^\x26]*)(\x26|$)", "i");
        b = window.location.search.substr(1).match(b);
        return null != b ? unescape(b[2]) : null
    },
    format: function(b) {
        if (0 < arguments.length) {
            var c = arguments[0];
            if (1 < arguments.length) if (2 == arguments.length && "object" == typeof arguments[1]) for (var e in arguments[1]) var f = new RegExp("({" + e + "})", "g"),
            c = c.replace(f, arguments[1][e]);
            else for (e = 1; e < arguments.length; e++) {
                if (void 0 == arguments[e]) return b;
                f = new RegExp("({[" + (e - 1) + "]})", "g");
                c = c.replace(f, arguments[e])
            }
            return c
        }
        return b
    }
};