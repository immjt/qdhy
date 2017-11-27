/**
* 测量工具
**/
var MeasureTool = function () {
    var inited = false, mLayers = [],modifyTool=null,mLayer=null,
    toolui = [
    "<li class='toolbagClass' id='btnMeasureLine'><span class='btnToolbar-cont1'><span class='btnToolbar-img' style='background-position: 0 0;top:7px;width:20px;'></span>测距</span></li>",
    "<li class='toolbagClass' id='btnMeasurePolygon'><span class='btnToolbar-cont1'><span class='btnToolbar-img' style='background-position: -20px 0;top:4px;width:20px;'></span>测面</span></li>"
    ].join("");



    function lineMeasureCompleted(event) {
        var geometry = event.geometry;
        var len = geometry.components.length;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        var point = {
            x: geometry.components[len - 1].x,
            y: geometry.components[len - 1].y
        };
        var res = this.map.getResolution();
        var ppt = new OpenLayers.Feature.Vector(geometry.components[len - 1]);
        //ppt.style=styleMap.styles["default"];


        this.handler.layer.addFeatures([ppt]);
        var lonlat = new OpenLayers.LonLat(point.x + res * 2, point.y + res * 22);
        var out = "";
        var layer = null;
        var callfn = OpenLayers.Function.bind(function (layerid) {
            layer = this.map.getLayer(layerid);
            //先删除浮云
            for (var i = this.lengthPopup.length - 1; i >= 0; i--) {
                try {
                    popup = this.lengthPopup[i];
                    if (popup.id == layerid) {
                        this.map.removePopup(popup);
                    }
                } catch (error) { }
            }
            //删除点和线的要素
            if (layer) {
                layer.destroyFeatures();
            }
            this.handler.point = null;
            this.handler.line = null;
            //删除图层
            try {
                that.map.removeLayer(layer);
                mLayers.remove(tempLayer);
            } catch (error) { }
        }, this, this.handler.layer.id);
        if (units == "km") {
            units = "公里";
        } else {
            units = "米";
        }
        //此id用来处理删除测量结果时的bug，做到依次删除
        var tempId = this.handler.layer.id.replace(/\./g, "") + "measureLine";
        out = "<div>" +
                '<label unselectable="on" style="float:left; display: inline; cursor: inherit; background-color: rgb(255, 255, 255); border: 1px solid rgb(255, 1, 3); padding: 3px 5px; white-space: nowrap; font-style: normal; font-variant: normal; font-weight: normal; font-size: 12px; line-height: normal; font-family: arial, simsun; z-index: 85; color: rgb(51, 51, 51); -webkit-user-select: none;">'
                + '总长：<span>' + measure.toFixed(2) + "</span>" + units + "" + "</label>"
                + '<div style="float:left; margin: 0px; padding: 0px; width: 12px; height: 12px; overflow: hidden;"><img src="images/measure/close.png" id="' + tempId + '" class="celianClose"></div>'
                + "</div>";
        var popup = new OpenLayers.Popup.Anchored(this.handler.layer.id, lonlat, null, out, {
            size: new OpenLayers.Size(15, 10),
            offset: new OpenLayers.Pixel(0, 0)
        }, false, callfn);
        popup.calculateNewPx = function (px) {
            var newPx = px.offset(this.anchor.offset);
            newPx.y += this.anchor.size.h;
            newPx.x += this.anchor.size.w;
            return newPx;
        };
        popup.contentDiv.className = "olAnchoredPopupContent";
        popup.autoSize = true;
        popup.minSize = new OpenLayers.Size(300, 24);
        popup.opacity = "1";
        popup.backgroundColor = "#fff";
        popup.backgroundColor = null;
        this.map.addPopup(popup);

        // 初始化图层信息
 //       var tempLayer = this.handler.layer.clone();
 //       tempLayer.id = this.handler.layer.id;
//        mLayers.push(tempLayer);
        //    sdMap.map.addLayer(tempLayer);
        //modifyTool=
        var _lid = this.handler.layer.id;
        $("#" + tempId).unbind('click').click(function () { callfn(_lid); });
        $(".celianClose").css('cursor', 'pointer');
        if (!this.lengthPopup) {
            this.lengthPopup = [];
        }
        this.lengthPopup.push(popup);
        this.handler.measureDistance = null;

        this.map.getControl("measureLineControl").deactivate();
        this.oldmousepop = measure.toFixed(2) + units;
        $("div.olMap").css({ cursor: "default" });
    }
    function lineMeasurepartial(event) {
        var geometry = event.geometry;
        var len = geometry.components.length;
        var point = {
            x: geometry.components[len - 1].x,
            y: geometry.components[len - 1].y
        };
        var stat = this.getBestLength(geometry);
        var res = this.map.getResolution();


        var unit = event.units;
        var order = event.order;
        var measure = event.measure;
        var length;
        if (unit == "km") {
            unit = "公里";
        } else {
            unit = "米";
        }
        if (measure.toFixed(2) == "0.00") {
            length = "起点";
        } else {
            length = measure.toFixed(2) + unit;
        }

        var ppt = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(point.x, point.y));
        //                 ppt.style=OpenLayers.Util.extend({},styleMap.styles["default"]);
        // ppt.style.label=length;
        // ppt.style.labelOutlineColor="#7C7C7C";
        // ppt.style.backgroundGraphic="images/bg.png";
        // ppt.style.backgroundHeight=30;
        // ppt.style.backgroundWidth=100;
        this.handler.layer.addFeatures([ppt]);
        //  var lonlat = new OpenLayers.LonLat(point.x + res * 2, point.y + res * 22);
        var lonlat = new OpenLayers.LonLat(point.x, point.y);
        //lonlat.add(point.x, point.y);

        this.newmousepop = length;
        var popstr = '<label style="border:medium none;padding:0px;background-color:#fff;display:inline;font:12px arial,simsun;wite-space:nowrap;color:#333;white-space:nowrap;">'
                + "<span style=\"width:5px;height:17px;position:absolute;display:block;background-image:url('images/measure/dis_box_01.gif');background-attachment:scroll;background-repeat:no-repeat;background-position-x:left;background-position-y:top;background-color:transparent;\">"
                + "<span style=\"left:5px;color:#7a7a7a;line-height:17px;padding: 0px 4px 1px 0px;position:absolute;background:url('images/measure/dis_box_01.gif') no-repeat scroll right top transparent;\">" + length + "</span>" + "</span>"
                + "</label>";
        var str = "<span style=\"left:5px;color:#7a7a7a;line-height:17px;padding: 0px 4px 1px 0px;position:relative;background:url('images/measure/dis_box_01.gif') no-repeat scroll right top transparent;\">" + length + "</span>";
        var size = OpenLayers.Util.getRenderedDimensions(str, null, {});
        size.h = 17;
        size.w += 5;
        var popup = new OpenLayers.Popup.AnchoredPopup(this.handler.layer.id, lonlat, size, popstr, {
            size: size, //new OpenLayers.Size(15, 10s),
            offset: new OpenLayers.Pixel(-90, -20)
        }, false, null);
        // popup.calculateNewPx = function(px) {
        //     var newPx = px.offset(this.anchor.offset);
        //     newPx.y += this.anchor.size.h;
        //     newPx.x += this.anchor.size.w;
        //     return newPx;
        // };
        // popup.minSize = size;
        popup.opacity = "1";
        popup.backgroundColor = null;
        if (this.oldmousepop == this.newmousepop) {
            this.newmousepop = null;
            this.oldmousepop = null;
        } else {
            this.map.addPopup(popup);
        }
        if (!this.lengthPopup) {
            this.lengthPopup = [];
        }
        this.lengthPopup.push(popup);
    }
    function polygonMeasureCompleted(event) {
        var geometry = event.geometry;
        var len = geometry.components[0].components.length;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        var point = {
            x: geometry.components[0].components[len - 2].x,
            y: geometry.components[0].components[len - 2].y
        };
        var res = this.map.getResolution();
        var lonlat = new OpenLayers.LonLat(point.x + res * 2, point.y + res * 22);
        var out = "";
        if (units == "km") {
            units = "平方公里";
        } else {
            units = "平方米";
        }
        out = "总面积:" + measure.toFixed(2) + units;
        var callfn = OpenLayers.Function.bind(function (layerid) {
            var layer = this.map.getLayer(layerid);
            //先删除浮云
            for (var i = this.lengthPopup.length - 1; i >= 0; i--) {
                try {
                    popup = this.lengthPopup[i];
                    if (popup.id == layerid) {
                        this.map.removePopup(popup);
                    }
                } catch (error) { }
            }
            //删除点和线的要素
            if (layer) {
                layer.destroyFeatures();
            }
            this.handler.point = null;
            this.handler.line = null;
            this.handler.polygon = null;
            //删除图层
            try {
                that.map.removeLayer(layer);
                mLayers.remove(tempLayer);
            } catch (error) { }
        }, this, this.handler.layer.id);
        this.handler.removePoint();
        //此id用来处理删除测量结果时的bug，做到依次删除
        var tempId = this.handler.layer.id.replace(/\./g, "") + "measureArea";
        out = "<div>"
                + '<label class=" unselectable="on" style="float:left; display: inline; cursor: inherit; background-color: rgb(255, 255, 255); border: 1px solid rgb(255, 1, 3); padding: 3px 5px; white-space: nowrap; font-style: normal; font-variant: normal; font-weight: normal; font-size: 12px; line-height: normal; font-family: arial, simsun; z-index: 85; color: rgb(51, 51, 51); -webkit-user-select: none;">'
                + '总面积：<span>' + measure.toFixed(2) + "</span>" + units + "" + "</label>"
                + '<div style="float:left; margin: 0px; padding: 0px; width: 12px; height: 12px; overflow: hidden;"><img  src="images/measure/close.png" id="' + tempId + '" class="celianClose"></div>' + "</div>";
        //'</label>';
        var popup = new OpenLayers.Popup.Anchored(this.handler.layer.id, lonlat, null, out, {
            size: new OpenLayers.Size(15, 10),
            offset: new OpenLayers.Pixel(0, 0)
        }, false, callfn);
        popup.calculateNewPx = function (px) {
            var newPx = px.offset(this.anchor.offset);
            newPx.y += this.anchor.size.h;
            newPx.x += this.anchor.size.w;
            return newPx;
        };
        popup.contentDiv.className = "olAnchoredPopupContent";
        popup.autoSize = true;
        popup.minSize = new OpenLayers.Size(300, 24);
        popup.opacity = "1";
        popup.backgroundColor = "#fff";
        popup.backgroundColor = null;
        this.map.addPopup(popup);

        // 初始化图层信息
        var tempLayer = this.handler.layer.clone();
        tempLayer.id = this.handler.layer.id;
        mLayers.push(tempLayer);
        sdMap.map.addLayer(tempLayer);
        var _lid = this.handler.layer.id;
        $("#" + tempId).click(function () { callfn(_lid); });
        $(".celianClose").css('cursor', 'pointer');
        if (!this.lengthPopup) {
            this.lengthPopup = [];
        }
        this.lengthPopup.push(popup);
        this.handler.measureDistance = null;
        this.map.getControl("measurePolygonControl").deactivate();
        $("div.olMap").css({ cursor: "default" });
    }

    function init(tdiv) {
        if (inited) return;
        typeof tdiv == "object" ? $(tdiv).append(toolui) : $("#" + tdiv).append(toolui);
        //定义量测样式
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 5,
                //graphicName: "square",
                fillColor: "white",
                fillOpacity: 1,
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#FF0000"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 0.5,
                strokeColor: "red",
                strokeDashstyle: "solid"
            },
            "Polygon": {
                strokeWidth: 3,
                strokeOpacity: 0.5,
                strokeColor: "red",
                fillColor: "white",
                fillOpacity: 0.3
            }
        };
        var style = new OpenLayers.Style();
        style.addRules([new OpenLayers.Rule({ symbolizer: sketchSymbolizers })]);
        var styleMap = new OpenLayers.StyleMap({ "default": style });

        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

        mLayer = new OpenLayers.Layer.Vector("measureLayer", {});

        var lineControl = new OpenLayers.Control.Measure(
            OpenLayers.Handler.Path, {
                persist: true,
                geodesic: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
            );
        lineControl.events.on({
            measure: lineMeasureCompleted,
            measurepartial: lineMeasurepartial
        });
        lineControl.id = "measureLineControl";


        var polygonControl = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
            persist: true,
            geodesic: true,
            handlerOptions: {
                layerOptions: {
                    renderers: renderer,
                    styleMap: styleMap
                }
            }
        });
        polygonControl.events.on({
            measure: polygonMeasureCompleted

        });
        polygonControl.id = "measurePolygonControl";
        sdMap.map.addControl(lineControl);
        sdMap.map.addControl(polygonControl);

        mLayer = new OpenLayers.Layer.Vector("measureLayer", {
            styleMap:styleMap
        });

        $('#btnMeasureLine').click(function (e) {
            $('#toolbag_div').css("display", "none");
            sdMap.map.getControl("measurePolygonControl").deactivate();
            sdMap.map.getControl("measureLineControl").activate();
            $("div.olMap").css({ cursor: "url('images/Line.cur'),auto" });
        });
        $('#btnMeasurePolygon').click(function (e) {
            $('#toolbag_div').css("display", "none");
            sdMap.map.getControl("measureLineControl").deactivate();
            sdMap.map.getControl("measurePolygonControl").activate();
            $("div.olMap").css({ cursor: "url('images/Line.cur'),auto" });
        });
        inited = true;
    }
    return {
        init: init,
        clear: function () {
            if (mLayers.length > 0) {
                for (var i = mLayers.length; i--; i > 0) {
                    var layer = mLayers[i];
                    layer.removeAllFeatures();
                    sdMap.map.removeLayer(layer);
                }
            }

            mLayers = [];
        }
    };
} ();

/**
* 底图切换
**/
var MapSwitch = function () {

    var inited = false, sdmap, toolui = [
    "<div id='vec_' title='地图' class='active'>",
    "    地 图",
    "</div>",
    "<div id='img_' title='影像'>",
    "    影 像",
    "    </div>",
    "    <div id='img_year_div'>",
    "        <ul id='img_year_number'>",
    "            <li  id='number_2014' class='number_year active'>2014</li>",
    "            <li  id='number_2013' class='number_year'>2013</li>",
    "            <li  id='number_2012' class='number_year'>2012</li>",
    "            <li  id='number_2008' class='number_year'>2008</li>",
    "            <li  id='number_2006' class='number_year'>2006</li>",
    "        </ul>",
    "<div class='switch_zj'><input id='zjshow' type='checkbox' checked='checked'/><label>注记</label></div>",

    "</div>"].join("");
    function init(tdiv, smap) {
        if (inited) return;
        sdmap = smap;
        typeof tdiv == "object" ? $(tdiv).append(toolui) : $("#" + tdiv).append(toolui);
        //切换地图
        $('#img_').click(function (e) {
            $(this).addClass("active");
            $("#vec_").removeClass("active");
            $("#img_year_div").show();
            $(".olControlScaleLineTop").css({ "border": "solid 2px white",
                "border-top": "none",
                "color": "white"
            });
            $(".olControlScaleLineBottom").css({ "border": "solid 2px white",
                "border-bottom": "none",
                "color": "white"
            });
            $(".number_year").removeClass("active");
            $("#number_2014").addClass("active");
            sdmap.tileLayerManager.switchMap(2, Bzj);
            // SwitchImage(imageYearFlags);
            // imgSourceQuery();
        });
        $('#vec_').click(function (e) {

            $("#img_year_div").hide();
            $(this).addClass("active");
            $("#img_").removeClass("active");
            $(".olControlScaleLineTop").css({ "border": "solid 2px black",
                "border-top": "none",
                "color": "black"
            });
            $(".olControlScaleLineBottom").css({ "border": "solid 2px black",
                "border-bottom": "none",
                "color": "black"
            });
            //$(".black_white").css("color","black");
            //$(".olControlScaleLine").css("color","black");
            sdmap.tileLayerManager.switchMap(1);
        });
        //切换影像
        $('#img_').mouseenter(function (e) {
            if ($(this).hasClass("active")) {
                $("#img_year_div").show();
            }

        });
        /*   $('#img_year_div').mouseleave(function (e) {
        $("#img_year_div").hide();
        });*/

        $('#img_year_div').mouseenter(function (e) {
            $("#img_").removeAttr("title");
            $("#img_").css("cursor", "default");
            $(this).css("display", "block");
        });
        $('#img_year_div').mouseleave(function (e) {
            $("#img_").attr("title", "影像");
            $("#img_").css("cursor", "pointer");
            $('#imageYear').css("display", "none");
            $("#img_year_div").hide();
        });
        $('#zjshow').click(function (e) {
            if ($(this)[0].checked) { sdmap.tileLayerManager.switchMap(null, true); Bzj = true; }
            //TileLayerManager.switchMap(0,true); }
            else { sdmap.tileLayerManager.switchMap(null, false); Bzj = false; }
            //TileLayerManager.switchMap(0,false);};
        })
        $('#img_year_number').on("click", "li", function (e) {
            e.stopImmediatePropagation();
            var radioVal = $(this)[0].innerHTML;
            $(".number_year").removeClass("active");
            if (radioVal == "2014") {
                $("#number_2014").addClass("active");
                sdmap.tileLayerManager.switchMap(2, Bzj);
                $("body [value = 2014]").prop("checked", true);

            }
            else if (radioVal == "2013") {
                $("#number_2013").addClass("active");
                sdmap.tileLayerManager.switchMap(3, Bzj);
            }
            else if (radioVal == "2012") {
                $("#number_2012").addClass("active");
                sdmap.tileLayerManager.switchMap(4, Bzj);
            }
            else if (radioVal == "2008") {
                $("#number_2008").addClass("active");
                sdmap.tileLayerManager.switchMap(5, Bzj);
            }
            else {
                $("#number_2006").addClass("active");
                sdmap.tileLayerManager.switchMap(6, Bzj);
            }

        });
        inited = true;
    }
    return {
        init: init
    };
} ();

/**
* 城市切换
**/
var RegionSwitch = function () {
    var inited = false, sdmap, dictLayer, timer, color,
    regionpan = "<div id='dictInfo'title='点击查看详情'><div id='dictInfoDiv'><div id='dictInfoTitle'>山东省</div><div id='dictInfoText'></div><div id='dictInfoClose'></div><a id='linkId'target='_blank'style='color:blue;margin-left: 250px;'>详情链接</a></div></div><div id='dictDiv'><div id='dict_list_title'><a class='sheng'>山东省</a><div id='dict_close'></div></div><div id='dict_item'><ul id='dict_ul'><li><a class='shi'>济南市</a><a class='xian'style='margin-left:20px;'>历下区</a><a class='xian'>市中区</a><a class='xian'>槐荫区</a><a class='xian'>天桥区</a><a class='xian'>历城区</a><a class='xian'>长清区</a><br/><a class='xian'style='margin-left:56px;'>平阴县</a><a class='xian'>济阳县</a><a class='xian'>商河县</a><a class='xian'>章丘县</a></li><li><a class='shi'>青岛市</a><a class='xian'style='margin-left:20px;'>市南区</a><a class='xian'>市北区</a><a class='xian'>黄岛区</a><a class='xian'>崂山区</a><a class='xian'>李沧区</a><a class='xian'>城阳区</a><br/><a class='xian'style='margin-left:56px;'>胶州市</a><a class='xian'>即墨市</a><a class='xian'>平度市</a><a class='xian'>莱西市</a></li><li><a class='shi'>淄博市</a><a class='xian'style='margin-left:20px;'>淄川区</a><a class='xian'>张店区</a><a class='xian'>博山区</a><a class='xian'>临淄区</a><a class='xian'>周村区</a><a class='xian'>恒台县</a><br/><a class='xian'style='margin-left:56px;'>高青县</a><a class='xian'>沂源县</a></li><li><a class='shi'>枣庄市</a><a class='xian'style='margin-left:20px;'>市中区</a><a class='xian'>薛城区</a><a class='xian'>峄城区</a><a class='xian'>台儿庄区</a><a class='xian'>山亭区</a><a class='xian'>滕州市</a></li><li><a class='shi'>东营市</a><a class='xian'style='margin-left:20px;'>东营区</a><a class='xian'>河口区</a><a class='xian'>垦利县</a><a class='xian'>利津县</a><a class='xian'>广饶县</a></li><li><a class='shi'>烟台市</a><a class='xian'style='margin-left:20px;'>芝罘区</a><a class='xian'>福山区</a><a class='xian'>牟平区</a><a class='xian'>莱山区</a><a class='xian'>长岛县</a><a class='xian'>龙口市</a><br/><a class='xian'style='margin-left:56px;'>莱阳市</a><a class='xian'>莱州市</a><a class='xian'>蓬莱市</a><a class='xian'>招远市</a><a class='xian'>栖霞市</a><a class='xian'>海阳市</a></li><li><a class='shi'>潍坊市</a><a class='xian'style='margin-left:20px;'>潍城区</a><a class='xian'>寒亭区</a><a class='xian'>坊子区</a><a class='xian'>奎文区</a><a class='xian'>临朐县</a><a class='xian'>昌乐县</a><br/><a class='xian'style='margin-left:56px;'>青州市</a><a class='xian'>诸城市</a><a class='xian'>寿光市</a><a class='xian'>安丘市</a><a class='xian'>高密市</a><a class='xian'>昌邑市</a></li><li><a class='shi'>济宁市</a><a class='xian'style='margin-left:20px;'>任城区</a><a class='xian'>微山县</a><a class='xian'>鱼台县</a><a class='xian'>金乡县</a><a class='xian'>嘉祥县</a><a class='xian'>汶上县</a><br/><a class='xian'style='margin-left:56px;'>泗水县</a><a class='xian'>梁山县</a><a class='xian'>曲阜市</a><a class='xian'>兖州区</a><a class='xian'>邹城市</a></li><li><a class='shi'>泰安市</a><a class='xian'style='margin-left:20px;'>泰山区</a><a class='xian'>岳岱区</a><a class='xian'>宁阳县</a><a class='xian'>东平县</a><a class='xian'>新泰市</a><a class='xian'>肥城市</a></li><li><a class='shi'>威海市</a><a class='xian'style='margin-left:20px;'>环翠区</a><a class='xian'>文登区</a><a class='xian'>荣成市</a><a class='xian'>乳山市</a></li><li><a class='shi'>日照市</a><a class='xian'style='margin-left:20px;'>东港区</a><a class='xian'>岚山区</a><a class='xian'>五莲县</a><a class='xian'>莒县</a></li><li><a class='shi'>莱芜市</a><a class='xian'style='margin-left:20px;'>莱芜区</a><a class='xian'>钢城区</a></li><li><a class='shi'>临沂市</a><a class='xian'style='margin-left:20px;'>兰山区</a><a class='xian'>罗庄区</a><a class='xian'>河东区</a><a class='xian'>沂南县</a><a class='xian'>郯城县</a><a class='xian'>沂水县</a><br/><a class='xian'style='margin-left:56px;'>兰陵县</a><a class='xian'>费县</a><a class='xian'>平邑县</a><a class='xian'>莒南县</a><a class='xian'>蒙阴县</a><a class='xian'>临沭县</a></li><li><a class='shi'>德州市</a><a class='xian'style='margin-left:20px;'>德城区</a><a class='xian'>陵城区</a><a class='xian'>宁津县</a><a class='xian'>庆云县</a><a class='xian'>临邑县</a><a class='xian'>齐河县</a><br/><a class='xian'style='margin-left:56px;'>平原县</a><a class='xian'>夏津县</a><a class='xian'>武城县</a><a class='xian'>乐陵市</a><a class='xian'>禹城市</a></li><li><a class='shi'>聊城市</a><a class='xian'style='margin-left:20px;'>冠县</a><a class='xian'>高唐县</a><a class='xian'>临清市</a><a class='xian'>东昌府区</a><a class='xian'>阳谷县</a><a class='xian'>莘县</a><br/><a class='xian'style='margin-left:56px;'>茌平县</a><a class='xian'>东阿县</a></li><li><a class='shi'>滨州市</a><a class='xian'style='margin-left:20px;'>惠民县</a><a class='xian'>阳信县</a><a class='xian'>无棣县</a><a class='xian'>沾化区</a><a class='xian'>博兴县</a><a class='xian'>邹平县</a><br/><a class='xian'style='margin-left:56px;'>滨城区</a></li><li><a class='shi'>菏泽市</a><a class='xian'style='margin-left:20px;'>牡丹区</a><a class='xian'>曹县</a><a class='xian'>单县</a><a class='xian'>成武县</a><a class='xian'>巨野县</a><a class='xian'>郓城县</a><br/><a class='xian'style='margin-left:56px;'>鄄城县</a><a class='xian'>定陶县</a><a class='xian'>东明县</a></li></ul></div></div>";

    function hideRegionDiv() {
        $('#dict_text').removeClass('active');
        $('#dictDiv').css("display", "none");
    }

    function hideRegionListDivListener(e) {
        e = e || window.event;
        var target = $(e.target);
        if (target.closest("#dict").length == 0) {
            hideRegionDiv();
            $(document).unbind("click", hideRegionListDivListener);
        }
    }

    function init(tdiv, smap) {
        if (inited) return;
        sdmap = smap,
        typeof tdiv == "object" ? $(tdiv).append(regionpan) : $("#" + tdiv).append(regionpan);

        sdmap.map.events.on({ "moveend": city_moveEndListener, "click": function () {
            hideRegionDiv();
        } 
        });

        //行政定位
        $('#dict_text').click(function () {
            if ($(this).hasClass('active')) {
                hideRegionDiv();
            } else {
                $('#dictDiv').css("display", "block");
                $(this).addClass('active');
                $(document).bind("click", hideRegionListDivListener);
            }
        });
        $('#dict_close').click(function (e) {
            hideRegionDiv();
        });
        $('#dictDiv').on('click', 'a', function () {
            sdmap.map.events.un({ "moveend": city_moveEndListener });
            //  dictFlag = true;
            $('#dictDiv').css("display", "none");
            $('#dictInfo').css("display", "block");
            $('#dictInfoDiv').css("display", "none");
            if ($(this).hasClass('shi')) {
                dictQuery2($(this).text(), "");
                $('#dict_text').text($(this).text());
                $('#dictInfo').css("margin-left", $('#dict_text').width() + 50 + "px");
            }
            else if ($(this).hasClass('xian')) {
                var shi = $(this).siblings(".shi").text();
                dictQuery2(shi, $(this).text());
                $('#dict_text').text(shi + ">" + $(this).text());
                $('#dictInfo').css("margin-left", $('#dict_text').width() + 50 + "px");
            }
            else {
                if (dictLayer != null) {
                    dictLayer.removeAllFeatures();
                }
                $('#dict_text').text("山东省");
                $('#dictInfo').css("margin-left", $('#dict_text').width() + 50 + "px");
                var lonLat = new OpenLayers.LonLat(119.00, 36.40);
                sdmap.map.setCenter(lonLat, 7);
            }
            $('#dict_text').removeClass('active');
        });
        $('#dictInfoClose').click(function (e) {
            $("#dictInfoDiv").animate({ height: 0 }, "slow", function () {
                $(this).css({ display: "none",
                    height: "auto"
                });
            });

        });
        $('#dictInfo').click(function (e) {
            if ($('#dictInfoDiv').css('display') == "block") {
                $('#dictInfoDiv').css("display", "none");
            }
            else {
                $('#dictInfoDiv').css("height", "auto");
                var completeHeight = $('#dictInfoDiv').height();
                $('#dictInfoDiv').css("display", "block");
                $('#dictInfoDiv').css("height", "0px");
                $("#dictInfoDiv").animate({ height: completeHeight }, "slow", function (e) {
                });
            }
        });
        inited = true;
    }

    function city_moveEndListener() {
        dictQuery();
    }

    //行政反定位
    function dictQuery() {
        $('#dictInfo').css("display", "none");
        var lonlat = sdmap.map.getCenter();
        var scale = sdmap.map.getScale();
        var url = Service.CitySearch + "lon=" + lonlat.lon + "&lat=" + lonlat.lat + "&scale=" + scale;
        $.ajax({
            dataType: "xml",
            url: url,
            success: function (da) {
                var dataText = da.getElementsByTagName("string");
                var str = dataText[0].firstChild.nodeValue;
                var strarr = str.split(',');
                if (strarr.length == 1)
                    $('#dict_text').text(str);
                else if (strarr.length == 2)
                    $('#dict_text').text(strarr[1]);
                else if (strarr.length == 3)
                    $('#dict_text').text(strarr[1] + ">" + strarr[2]);
                else
                    $('#dict_text').text(dataText[0].firstChild.nodeValue.replace(/,/g, ">"));
            }
        });
    }
    //行政定位
    function dictQuery2(cityName, countryName) {
        var ways = countryName ? 2 : 1;
        var provinceName = "山东省";
        var url = Service.CityBound + "cityName=" + encodeURIComponent(cityName) + "&ways=" + ways + "&countryName=" + encodeURIComponent(countryName) + "&provinceName=" + encodeURIComponent(provinceName);
        $.ajax({
            dataType: "xml",
            url: url,
            success: function (data) {
                var dataNode = data.getElementsByTagName("Shape");

                if (isIE = navigator.userAgent.indexOf("MSIE") != -1) {
                    var linkName = data.getElementsByTagName("LinkName")[0].text;
                    var text = data.getElementsByTagName("Description")[0].text;
                    var linkUrl = data.getElementsByTagName("LinkURL")[0].text;
                }
                else {

                    var linkName = $(data.getElementsByTagName("LinkName")).text();
                    var text = $(data.getElementsByTagName("Description")).text();
                    var linkUrl = $(data.getElementsByTagName("LinkURL")).text();
                }

                $('#dictInfoTitle').text(linkName);
                $('#dictInfoText').text(text);
                $('#linkId').attr("href", linkUrl);
                var dataobj = dataNode[0].childNodes[0].data;
                var json = "{rings:[";
                var wkt = dataobj.substring(dataobj.indexOf("(") + 1, dataobj.lastIndexOf(")"));
                lineJson = wkt.replace(/(\({2})/g, "(");
                lineJson = lineJson.replace(/(\){2})/g, ")");
                var lineJson = lineJson.replace(/\(/g, "[").replace(/\)/g, "]");
                var re = /([\d\.]+)\s([\d\.]+)/g;
                lineJson = lineJson.replace(re, "[$1,$2]");
                json += lineJson;
                json += "]}";
                var jsonObj = eval("(" + json + ")");
                polygon(jsonObj);
                sdmap.map.events.on({ "moveend": city_moveEndListener });
                //行政信息动画
                setTimeout(function () {
                    $('#dictInfo').click();
                }, 500);
                setTimeout(function () {
                    $('#dictInfoClose').click();
                }, 3000);
            }
        });
    }

    //行政区划绘制
    function polygon(jsonObj) {
        if (dictLayer != null) {
            dictLayer.removeAllFeatures();
        }
        else {
            var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
            style.fillOpacity = 0.2;
            style.strokeColor = "blue";
            style.fillColor = "blue";

            style.strokeWidth = 2;
            style.strokeDashstyle = "longdash";
            dictLayer = new OpenLayers.Layer.Vector("行政定位", {
                style: style
            });
            sdmap.addLayer(dictLayer);
        }

        var polygonFeature = [];
        for (var j = 0; j < jsonObj.rings.length; j++) {
            var pointList = [];
            for (var i = 0; i < jsonObj.rings[j].length; i++) {
                var newPoint = new OpenLayers.Geometry.Point(jsonObj.rings[j][i][0], jsonObj.rings[j][i][1]);
                pointList.push(newPoint);
            }
            var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
            var polyg = new OpenLayers.Geometry.Polygon([linearRing]);
            polygonFeature[j] = new OpenLayers.Feature.Vector(polyg);


        }
        dictLayer.addFeatures(polygonFeature);
        dictLayer.redraw();
        sdmap.map.zoomToExtent(dictLayer.getDataExtent());
        color = 1;
        timer = setInterval(ChangeColor, 600);

    }

    //行政区划闪烁
    function ChangeColor() {
        if (color == 1) {
            for (var i = 0; i < dictLayer.features.length; i++) {
                dictLayer.features[i].style.fillColor = "green";
                dictLayer.features[i].style.fillOpacity = 0.6;
                dictLayer.redraw(true);
            }
            color = color + 1; ;
        }
        else if (color == 2) {
            for (var i = 0; i < dictLayer.features.length; i++) {
                dictLayer.features[i].style.fillColor = "blue";
                dictLayer.features[i].style.fillOpacity = 0.6;
                dictLayer.redraw(true);
            }
            color = color + 1;
        }
        else if (color == 3) {
            for (var i = 0; i < dictLayer.features.length; i++) {
                dictLayer.features[i].style.fillColor = "green";
                dictLayer.features[i].style.fillOpacity = 0.6;
                dictLayer.redraw(true);
            }
            color = color + 1;
        }
        else if (color == 4) {
            for (var i = 0; i < dictLayer.features.length; i++) {
                dictLayer.features[i].style.fillOpacity = 0;
                dictLayer.redraw(true);
            }
            color = color + 1;
        }
        else {
            clearTimeout(timer);
        }
    }

    return {
        init: init,
        clear: function () {
            clearTimeout(timer);
            if (dictLayer != null) {
                dictLayer.destroyFeatures();
                sdmap.map.removeLayer(dictLayer);
                dictLayer = null;
            }
        }
    };
} ();

var Clean = function () {
    var sdmap, inited = false;
    function clear() {
        $('#tab_search').click();
        $('#returnBtn').click();

        MeasureTool.clear();
        RegionSwitch.clear();

        $('#searchExtent').hide();
        if (PathSearch) {
            PathSearch.clearResult();
        }
        PoiInfoPop.clear();
        Plotting.clear();
        WidgetManger.reset();
    }

    return {
        init: function (smap) {
            if (inited) return;
            sdmap = smap;
            $('#btnClear').click(function (e) {
                $('.olPopup').css("display", "none");
                // queryRectText = null; //终止范围查询
                clear();
            });

            inited = true;
        }
    };
} ();

/**
* 地图全屏
**/
var FullScreen = function () {
    var inited = false;

    function init() {
        if (inited) return;
        //全屏
        $('#btnExtent').click(function (e) {

            if (!$("#left_hidden").hasClass("show")) {
                $('#left_hidden').click();
            }
            //  var topd,cont;
            var height = $(window).height();

            if ($(this).hasClass('extent')) {

                $(this).removeClass('extent');
                $("#topDiv").show();
                //   topd=parent.document.getElementById("topDiv");
                //   if(topd)topd.style.display = "block";
                //   cont=parent.document.getElementById("content");
                //   if(cont){
                //     cont.style.top="100px";
                //     cont.style.height=(height-100)+"px";
                //     cont.setAttribute("data-calc-height","100%-100")
                // }

                $('#left_center').css({ height: (height - 97) + "px", top: "97px" })
              .attr("data-calc-height", "100%-97");
                $(this).html("<span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -128px 0;'></span>全屏</span>");

                $(this).css("width", "54px");
                $('#left_hidden').click();
            }
            else {
                //topd=parent.document.getElementById("topDiv");
                $("#topDiv").hide();
                // $('#left_center').css({ height: height + "px",top:"0"});
                //   if(topd)topd.style.display = "none";

                //  cont=parent.document.getElementById("content");
                //  if(cont){
                //     cont.style.top="0";
                //     cont.style.height=(height+100)+"px";
                //     cont.setAttribute("data-calc-height","100%-0")

                $('#left_center').css({ height: "100%", top: "0" })
                  .attr("data-calc-height", "100%-0"); ;
                $(this).addClass('extent');
                $(this).css("width", "90px"); //76
                // }
                // $(this).text("退出全屏");
                $(this).html("<span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -128px 0;'></span>退出全屏</span>");
            }
            setInterval(function () { $(window).resize(); }, 500);
            sdMap.map.updateSize();
        });
        inited = true;
    }
    return {
        init: init
    };
} ();

/**
* 地图打印
*/
var PrintMapTool = function () {
    var toolui = "<li class='toolbagClass' id='btnPrintDiv'><span class='btnToolbar-cont1'><span class='btnToolbar-img' style='background-position: -60px 0;top:3px;width:20px;'></span>打印</span></li>";
    var map = null, inited = false;

    function init(tdiv, smap) {
        if (inited) return;
        typeof tdiv == "object" ? $(tdiv).append(toolui) : $("#" + tdiv).append(toolui);
        map = smap.map;
        //启动标绘
        $('#btnPrintDiv').click(function (e) {
            $('#toolbag_div').css("display", "none");
            createPrintMap('mapDiv');
        });

        inited = true;
    }

    function createPrintMap(id) {
        //设置页面的title和header头部内容显示  
        var titleName = "地图打印",
        headerName = "请输入标题信息，点击输入",
        //设置地图打印按钮背景图片 
        printImgSrc = "images/ToolBar/print.png",
        //设置地图容器的宽度 
        containerWidth = map.getSize().w,
        //设置地图容器的高度 
        containerHeight = map.getSize().h;

        var _window = window.open(""),
        inHtml = document.getElementById(id).innerHTML,
        head = "<!DOCTYPE html><html><head><META HTTP-EQUIV='pragma' CONTENT='no-cache'><META HTTP-EQUIV='Cache-Control' CONTENT='no-cache, must-revalidate'><META HTTP-EQUIV='expires' CONTENT='Wed, 26 Feb 1997 08:21:57 GMT'><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' /><meta name='apple-mobile-web-app-capable' content='yes' /><title>" + titleName + "</title>",
        height = parseInt(containerHeight) - 10,
        content = "<link rel='stylesheet' type='text/css' href='css/mainUI.css' /><link href='css/tools.css' rel='stylesheet' type='text/css' /><link rel='stylesheet' type='text/css' href='css/popup.css' /><link href='css/widget.css' rel='stylesheet' type='text/css' /><link rel='stylesheet' type='text/css' href='third/jstree/themes/default/style.css' /><link href='Openlayers/theme/default/style.css' rel='stylesheet' type='text/css' /> ",
        g = "";
        content += '<style type="text/css">';
        content += ".olImageLoadError{background-color: pink; opacity: 0!important; filter: alpha(opacity=0)!important;}";
        content = content + ".print-container {margin: auto;width:" + containerWidth + "px;height:" + containerHeight + "px;top: 50px;position: relative;}";
        content += ".geoD {width: 100%;height: 24px;line-height: 24px;border-bottom: 3px solid #B2B2B2;font-size: 14px;margin-bottom: 6px;font-weight:bold;}";
        content += ".geoTitle {width: 300px;height: 20px;line-height: 20px;font-size: 14px;border:none;}";
        content = content + "#" + id + " {position: relative;height:" + height + "px;margin-bottom: 15px;clear: both;}";
        content += '#geoft {content: ".";height: 77px;display: block;overflow: hidden;clear: both;}';
        content += ".printMap {margin-bottom: 20px;float: right;}";
        printImgSrc != void 0 && printImgSrc != "" ? (content = content + ".printMap span {background-position: 0px 0px;cursor: pointer;margin-right: 0px;margin-top: 5px;display: inline-block;width: 69px;height: 29px;background-image: url(" + printImgSrc + ");}", g = "<span id='printMap' onclick = 'printDiv()'></span>") : g = "<input id='printMap' type='button' value='\u6253\u5370' onclick = 'printDiv()'></input>";
        content += "</style>";
        foot = "</head><body><div class='print-container'><div class='geoD'>标题：<input class='geoTitle' value='" + headerName + "''></input></div><div id='" + id + "' >" + inHtml + "</div><div id='geoft'><div class='printMap'>";
        foot += g;
        foot += "</div></div></div></body></html>";
        _window.document.write(head + content + "<script type = 'text/javascript'>\nfunction printDiv(){var divObj = document.getElementById('printMap');divObj.style.display = 'none';window.print();divObj.style.display = 'block';}<\/script>" + foot);
        _window.document.close();
    }

    return {
        init: init
    };
} ();

/**
* 审图号
*/
var CopyRightTool = function () {
    return {
        init: function (sdmap) {
            sdmap.map.events.on({ "zoomend": function (event) {
                var level = event.object.getZoom();
                if (level < 7)
                    $("#" + sdmap.map.div.id + "_remark").text("审图号:GS(2014)6032号(版权:国家测绘地理信息局)");
                else if (level < 14)
                    $("#" + sdmap.map.div.id + "_remark").text("审图号:GS(2014)6032号(版权:国家测绘地理信息局) 鲁SG(2015)088号(版权:山东省国土资源厅)");
                else
                    $("#" + sdmap.map.div.id + "_remark").text("审图号:鲁SG(2015)088号(版权:山东省国土资源厅)");
            }
            });
        }
    };
} ();



var MapToolUI = function () {
    var toolbar = [
    "    <ul style='margin:3px 0'>",
    "        <li id='btnExtent' class='btnToolbar' style='margin-right: 20px;'><span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -128px 0;'></span>全屏</span></li>",
    "        <li id='btntool' class='btnToolbar'><span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -142px 0;'></span>工具</span>",
    "           <div id='toolbag_div' style='width: 60px; border: 1px solid #25abf3; background: #f4f9fd;display: none; color: #777777;margin-top:24px;'>",
    "               <ul></ul>",
    "        </li>",
    "        <li id='btnClear' class='btnToolbar'><span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -158px 0;'></span>清除</span></li>",
    "        <li id='btnExtentMap' class='btnToolbar'><span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -111px 0;'></span>全图</span></li>",
    "        <li id='btnImgCompare' class='btnToolbar'><span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -96px 0;'></span>对比</span></li>",
    "        <li id='dict'><div id='dict_text'>山东省</div></li>",
    "        <li id='vec_img'></li>",
    "    </ul>"].join("");
    var inited = false;
    return {
        init: function (sdmap) {
            if (inited) return;
            var tooldiv = $("#toolDiv");
            tooldiv.append(toolbar);
            var ele = tooldiv.find("#btntool ul");
            MeasureTool.init(ele);
            FullScreen.init();
            Clean.init(sdmap);
            //Plotting.init(ele, sdmap);
            PrintMapTool.init(ele, sdmap);
            RegionSwitch.init(tooldiv.find("#dict"), sdmap);
            MapSwitch.init(tooldiv.find("#vec_img"), sdmap);
            CopyRightTool.init(sdmap);

            tooldiv.find('#btntool').mouseenter(function () {
                $('#toolbag_div').css("display", "block");
            });
            tooldiv.find('#btntool').mouseleave(function () {
                $('#toolbag_div').css("display", "none");
            });
            //全图
            $('#btnExtentMap').click(function () {
                var lonLat = new OpenLayers.LonLat(119.00, 36.40);
                sdmap.map.setCenter(lonLat, 7);
            });
            //对比
            $('#btnImgCompare').click(function () {
                ContrastHandler();
            });
            $("#btnJiucuo").click(function () {

                var parm = MapCorrect.userCookie();
                window.open(Service.CorrectDir + "index.html" + parm);

            });


            inited = true;
        }
    };
} ();


