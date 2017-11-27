
var PoiInfoPop = function () {
    var sdmap, circle, center, fea, inited = false, popup,
    infoPopup = [
        '<div id="poi_pop_info" style = "min-height:90px;width:333px;font-size:12px;">', //width:333px;
        '<div id = "mark_title"><div id="markName" style="padding-left:10px;font-size:14px;color:#3b9cfe;font-weight:700;margin-top:-2px;"></div></div>',
        '<div id = "pointPopupContent" style = "margin-top:10px;display:block"><div id="right_pointNameInfo"></div>',
    '</div>',
    '</div>'].join(''),
    popinfoContent = [
    '<div id="tabs">',
    '<ul>',
    '<li id = "tabs-li1"><a href="#tabs1" class="selected"><img src="images/blank.gif"/>到这里去    </a></li>',
    '<li id = "tabs-li2"><a href="#tabs2" ><img src="images/blank.gif"/>从这里出发    </a></li>',
    '<li id = "tabs-li3"><a href="#tabs3" ><img src="images/blank.gif"/>周边搜索    </a></li>',
    '</ul>',
    '<div id="tabs1" class = "pointTabDiv">',
        '<span style="margin-right:4px;">起点</span><input type="text" id="pointFromText"><input type="button" id="pointFromButton" class="btnSmall" style="margin:-5px 0 0 10px" value="驾车">',
    '</div>',
    '<div id="tabs2">',
        '<span style="margin-right:4px;">终点</span><input type="text" id="pointToText"><input type ="button" id="pointToButton" class="btnSmall" style="margin:-5px 0 0 10px" value="驾车">',
    '</div>',
    '<div id="tabs3">',
    '<input type = "button" class = "pointPopupBtn" code="5080 5082:5085 5380 5501 5502 5400" value ="宾馆">',
    '<input type = "button" class = "pointPopupBtn" code="A180:A192 A195:A19C" value ="银行">',
    '<input type = "button" class = "pointPopupBtn" code="7200 7203:7206 7280 7281 7500" value ="医院">',
    '<input type = "text" id = "pointSearch" style = "width:80px">',
        '<select name="selectAge" id="selectRadius" style="height:23px;margin-left:2px;border: #b3b3b3 solid 1px;"><option value="500">500米</option><option value="800">800米</option><option value="1000">1000米</option><option value="2000">2000米</option><option value="5000">5000米</option></select><input type ="button" value = "搜索" id = "pointPopupSearchBtn" class = "btnSmall"  style="margin:-5px 0 0 4px" >',
    '</div>',
    '</div>'].join(""),

       targetFea;
    //类型 经纬度 数据
    function showPop(type, l, dat, func) {
        var ll = new OpenLayers.LonLat(l.lon || l.x, l.lat || l.y);
        var info;
        if (popup != null) {
            sdmap.map.removePopup(popup);
        }
        switch (type) {
            case "local":
                popup = new OpenLayers.Popup.FramedCloud("搜索",
              ll, null, infoPopup, null, true, onPopupClose);
                sdmap.map.addPopup(popup);
                info = []; //= ["<div id='right_pointNameInfo'>"];
                //  var h = 10;
                if (dat.address != "") {
                    info.push("<div id='address'>地址:" + dat.address + "</div>");
                    //  h = h + 25;
                }
                if (dat.telephone != "") {
                    info.push("<div id='phone'>电话:" + dat.telephone + "</div>");
                    //  h = h + 25;
                }
                // info.push("</div>");
                $("#right_pointNameInfo").append(info.join(""));
                $("#pointPopupContent").append(popinfoContent);

                $("#mark_title").append("<div id='poi_correct' title='纠错'></div>");
                $("#poi_pop_info").css({ "width": "333px" });
                $("#markName").text(dat.name);


                break;

            case "around":
                popup = new OpenLayers.Popup.FramedCloud("搜索", ll, null, infoPopup, null, true, onPopupClose);
                popup.autoSize = true;
                sdmap.map.addPopup(popup);
                $("#poi_pop_info").css({ "width": "333px", "height": "100px" });
                popup.updateSize();
                $("#pointPopupContent").append(popinfoContent);
                WholeSearch.request("rgc2", { point: ll.lon + "," + ll.lat, type: 1 }, rgc2Callback);
                $("#markName").text("未知地点");
                break;
            case "plotinfo":
                popup = new OpenLayers.Popup.FramedCloud("标注信息",
              ll, null, infoPopup, null, true, onPopupClose);

                sdmap.map.addPopup(popup);
                if (dat.type == "point") {
                    $("#pointPopupContent").append(popinfoContent);
                    $("#poi_pop_info").css({ "width": "333px" });
                }

                break;
            case "plotedit":
                //分点 线
                popup = new OpenLayers.Popup.FramedCloud("标注信息",
                  ll, null, infoPopup, null, true, onPopupClose);
                popup.autoSize = true;
                sdmap.map.addPopup(popup);
                $("#poi_pop_info").css({ "width": "313px" });
                break;
            case "resourcelist":
                popup = new OpenLayers.Popup.FramedCloud("搜索",
                    ll, null, infoPopup, null, true, onPopupClose);

                // var h = 50;
                info = "<div class='resource_detail'>";
                $.each(dat, function (field) {
                    if (field.toUpperCase() != "OBJECTID" && field.toUpperCase() != "NAME" && field.toUpperCase().indexOf("SHAPE") < 0) {
                        info += field + ":" + dat[field] + "<br/>";
                        // if (dat[field].length > 15)
                        //     h += 36;
                        // else
                        //     h += 18;
                    }
                });
                // if ((h - 50) / 18 >= 6)
                //     h += 18 * ((h - 50) / 18 / 6);
                info += "</div>";

                popup.autoSize = true;
                sdmap.map.addPopup(popup);
                // $("#poi_pop_info").css("height", h + "px");
                popup.updateSize();

                $("#right_pointNameInfo").append(info);
                $("#markName").text(dat.NAME || dat.名称);
                break;
            case "publicservice":
                popup = new OpenLayers.Popup.FramedCloud("搜索",
                    ll, null, infoPopup, null, true, onPopupClose);

                // var h = 50;
                info = "<div class='resource_detail'>";
                $.each(dat, function (field) {
                    if (field.toUpperCase() != "OBJECTID" && field.toUpperCase() != "NAME" && field.toUpperCase().indexOf("SHAPE") < 0) {
                        info += field + ":" + dat[field] + "<br/>";
                        // if (dat[field].length > 15)
                        //     h += (dat[field].length/18) * 20;
                        // else
                        //     h += 18;
                    }
                });
                // if ((h - 50) / 18 >= 6)
                //     h += 18 * ((h - 50) / 18 / 6);
                info += "</div>";

                popup.autoSize = true;
                sdmap.map.addPopup(popup);
                // $("#poi_pop_info").css("height", h + "px");
                popup.updateSize();

                $("#right_pointNameInfo").append(info);
                $("#markName").text(dat.NAME || dat.名称);
                break;

        }
        fea = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(ll.lon, ll.lat), dat);

        $("#tabs ul").idTabs();
        $("#tabs-li3 a").click();
        popup.updateSize();
        pubEventRegist();
    }

    function createCircle(point, radius) {
        if (circle) sdmap.graLayer.removeFeatures([circle]);
        if (center) sdmap.graLayer.removeFeatures([center]);

        circle = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon.createRegularPolygon(point, radius / (6371012 * 2 * Math.PI) * 360, 100, 0));
        var stl = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        stl.fillColor = "blue";
        stl.fillOpacity = 0.2;
        stl.labelAlign = "lb";
        stl.labelXOffset = 20,
        stl.strokeColor = "red";
        stl.strokeOpacity = 1;
        circle.style = stl;

        center = new OpenLayers.Feature.Vector(point);
        var newstyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        newstyle.externalGraphic = "images/leftDiv/png/0[2].png";
        newstyle.graphicWidth = 19;
        newstyle.graphicHeight = 29;
        newstyle.fillOpacity = 1;
        newstyle.cursor = "pointer";
        center.style = newstyle;
        sdmap.graLayer.addFeatures([circle, center]);

        sdmap.map.zoomToExtent(circle.geometry.getBounds());
    }

    function rgc2Callback(dat) {
        if (dat.status == "ok") {
            var result = dat.result;
            if (!!result) {
                var district = String(result.district_text).split(">").join("").replace("市辖区", "").replace("山东省", "");
                var roadname = "";
                if (!!result.road && result.road.name != "")
                    roadname = result.road.name;
                var addr = "";
                if (!!result.address)
                    addr = result.address;
                var title = "";
                if (!!result.point && result.point.name != "")
                    $("#markName").text(result.point.name + "附近");
                else
                    $("#markName").text(district + roadname);

                $("#right_pointNameInfo").html("<div id='address'>地址:" + district + roadname + addr + "</div>");
                popup.updateSize();
            }



        }

    }
    function listCallback(dat) {
        var offset = $("#tabs>ul:eq(0)").offset();
        $("#poiSearch_suglist").empty().append(dat).show().
        css({ left: (offset.left + 45) + "px", top: (offset.top + 65) + "px" }).children("div").click(itemClickHandle);
    }
    function pubEventRegist() {
        $("#pointFromText").keyup(function (e) {
            // var curKey = e.which;
            var val = $(this).val();
            if (val) {
                WholeSearch.request("list", { words: val }, listCallback);
            }

        });
        $("#pointToText").keyup(function (e) {
            //  var curKey = e.which;
            var val = $(this).val();
            if (val) {
                WholeSearch.request("list", { words: val }, listCallback);
            }
        });

        $('#pointFromButton').click(function () {
            //传递起点和终点给路径绘制
            fea.attributes = { name: $("#markName").text() };
            PathSearch.setStart(targetFea, 3);
            PathSearch.setEnd(fea, 3);

        });
        $('#pointToButton').click(function () {
            //传递起点和终点给路径绘制
            fea.attributes = { name: $("#markName").text() };
            PathSearch.setStart(fea, 3);
            PathSearch.setEnd(targetFea, 3);
        });
        $('#pointPopupSearchBtn').click(function () {
            $("#left_query_text").val(fea.attributes.name);
            
            var key = $("#pointSearch").val();
            if (!!key) {
                switchSearch("s2");
                var point = fea.geometry;
                var radius = parseInt($('#selectRadius').val());
                var area = "POINT(" + point.x + " " + point.y + ")";
                WholeSearch.request("buffer", { words: key, radius: radius, area: area, mode: 1 });
                createCircle(point, radius);
                PoiInfoPop.close();
            }
        });
        $("#tabs3 > .pointPopupBtn").click(function () {
            $("#left_query_text").val(fea.attributes.name);
            
            var code = $(this).attr("code");
            switchSearch("s2");
            var point = fea.geometry;
            var radius = parseInt($('#selectRadius').val());
            var area = "POINT(" + point.x + " " + point.y + ")";
            WholeSearch.request("buffer", { "class": code, radius: radius, area: area, mode: 1 });
            createCircle(point, radius);
            PoiInfoPop.close();
        });

        $("#poi_correct").click(function () {
            var attr = fea.attributes, url;
            if (!!attr.lsid) {//四维查询
                url = { FID: attr.id, LSID: attr.lsid };
                MapCorrect.openCorrect(url);
            } else {//POI识别
                url = { FID: attr.id, name: attr.name, tel: attr.telephone, addr: attr.address, catg: attr.catg,
                    x: fea.geometry.x, y: fea.geometry.y
                };
                MapCorrect.openCorrect(url);
            }
        });
    }
    function itemClickHandle() {
        var crd = $(this).attr("crd").split(",");
        targetFea = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(parseFloat(crd[0]), parseFloat(crd[1])));
        var name = crd[3];
        targetFea.attributes = { name: name };
        // 
        $("#tabs>div:visible :text").val(name);
        $("#poiSearch_suglist").hide();

    }
    function onPopupClose() {
        sdmap.unSelect();
        if (popup)
            sdmap.map.removePopup(popup);
    }

    return {
        init: function (smap) {
            if (inited) return;
            sdmap = smap;
            if ($("#poiSearch_suglist").length == 0) {
                $(document.body).append("<div id='poiSearch_suglist' style='position:absolute;display:none;'></div>");
                $("#poiSearch_suglist").delegate("a", "click", function () { $("#poiSearch_suglist").hide(); });
            }
            inited = true;
        },
        show: showPop,
        close: onPopupClose,
        clear: function () {
            sdmap.graLayer.removeAllFeatures();
        },
        resize: function () {
            popup.updateSize();
            popup.panIntoView();
        }
    };

} ();
