
/*
*天气预报模型
*/
function WeatherWidget() {
    if (WeatherWidget.unique != null)
    // throw new Error("只允许创建一个WeatherWidget！");
        return WeatherWidget.unique;
    WeatherWidget.unique = this;

    var targetUrl = "proxy/proxy.ashx?http://flash.weather.com.cn/wmaps/xml/shandong.xml?64138/";
    var locationCity = { "济南": "116.982064247,36.682902373046", "德州": "116.32242,37.432249", "聊城": "116.027043,36.47981", "泰安": "117.142239,36.221535",
        "济宁": "116.62678,35.423526", "菏泽": "115.48461,35.244151", "淄博": "118.019627,36.834141", "莱芜": "117.648383,36.292486", "枣庄": "117.562787,34.802768",
        "临沂": "118.336634,35.075951", "滨州": "117.985961,37.402161", "日照": "119.504325,35.407683", "东营": "118.522883,37.433393", "潍坊": "119.146,36.716416",
        "青岛": "120.397349,36.165004", "烟台": "121.317919,37.517425", "威海": "122.071352,37.483144"
    };
    var sdmap = null, widgetLayer = null, inited = false;

    function dataQuery() {
        //先请求线数据
        $.ajax({
            type: "GET",
            url: targetUrl,
            datatype: "xml",
            success: function (result) {
                //widgetInit();

                analysisData(result);
            },
            error: function (a, b) {
                if (console.log) {
                    console.log("天气数据请求" + b);
                }
            }
        });
    };
    function analysisData(result) {
        if (result) {
            var resultDomEL = result;
            var records = resultDomEL.getElementsByTagName("city");
            if (records != null && records.length != 0) {
                for (var i = 0, n = records.length; i < n; i++) {
                    var tmpRow = records[i].attributes;
                    var tmpRowData = new Object();
                    for (var j = 0, m = tmpRow.length; j < m; j++) {
                        var tmpTagName = tmpRow[j].name;
                        tmpRowData[tmpTagName] = tmpRow[j].text ? tmpRow[j].text : tmpRow[j].textContent;
                    }
                    drawElem(tmpRowData);

                }
            }
        }

    };
    function drawElem(attr) {

        var lonlat = locationCity[attr.cityname];
        var lon = lonlat.split(",")[0];
        var lat = lonlat.split(",")[1];
        var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon, lat));
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.externalGraphic = "images/" + "Weather/b_" + attr.state1 + ".png";
        style.graphicWidth = 57;
        style.graphicHeight = 54;
        style.fillOpacity = 1;
        style.cursor = "pointer";
        feature.style = style;
        feature.attributes = attr;

        widgetLayer.addFeatures(feature);
    };
    function onSelect(e) {
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        var feature = e.feature;
        var hum = parseInt(feature.attributes.humidity.substr(0, feature.attributes.humidity.length - 1));
        var ndiv = Math.floor(hum / 20);
        var stri = "<div class='weather_bk'>";
        for (var j = 0; j < ndiv; j++) {
            stri += "<div class='weather_ubk'></div>";
        }
        var rese = (hum - ndiv * 20) / 2;
        if (rese > 0) {
            stri += "<div class='weather_ubk ' style='width:" + rese + "px;margin-right:0;'></div>";
        } else if (ndiv == 5) {
            stri = stri.substr(0, stri.length - 7) + " style='margin-right:0'></div>";
        }
        stri += "</div>";

        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken",
        		feature.geometry.getBounds().getCenterLonLat(),
                null,
            "<div style='padding:0 5px;'><div style = 'position:relative; margin-bottom:15px;color:#3b9cfe;'><b>天气状况</b> </div> <div style='margin:10px 5px;'><div style='float:left; '> <div style = 'text-align: center;'>"
                + feature.attributes.cityname + "</div><img src='images/Weather/a_" + feature.attributes.state1
                + ".gif'></img><div style = 'text-align: center;'>" + feature.attributes.stateDetailed
                + "</div></div><div style='padding-left:110px;line-height:1.5em;' >温度:&nbsp;"
                + feature.attributes.tem1 + "~" + feature.attributes.tem2 + "℃<br>风:&nbsp;"
                + feature.attributes.windState + "<br>湿度:&nbsp;" + stri + feature.attributes.humidity
                + "<br>实时温度:&nbsp;" + feature.attributes.temNow +
                "℃<br>更新时间:&nbsp;" + feature.attributes.time + "</div></div></div>",
			null, true, function () {

			    sdmap.removePopup(sdmap.widgetPop);
			    sdmap.unSelect();

			});
        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);
    };


    return {
        init: function (renderer, styleMap, smap) {

            widgetLayer = new OpenLayers.Layer.Vector('天气', {
                style: styleMap,
                renderers: renderer
            });
            sdmap = smap;
            sdmap.addLayer(widgetLayer, true);

            widgetLayer.events.on({
                "featureselected": onSelect
            });

            inited = true;
        },
        Show: function () {
            if (inited) {
                //                widgetLayer.setVisibility(true);
                //            else {
                dataQuery();
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);

        },
        Dispose: function () {
            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            inited = false;
            widgetLayer = null;

        },
        isInit: function () { return inited; }
    };
}

//-----以下-----add by ZCY 20150824170300
//重写Trim() 
String.prototype.trim = function () { return Trim(this); };
function LTrim(str) {
    var i;
    for (i = 0; i < str.length; i++) {
        if (str.charAt(i) != " " && str.charAt(i) != " ") break;
    }
    str = str.substring(i, str.length);
    return str;
}
function RTrim(str) {
    var i;
    for (i = str.length - 1; i >= 0; i--) {
        if (str.charAt(i) != " " && str.charAt(i) != " ") break;
    }
    str = str.substring(0, i + 1);
    return str;
}
function Trim(str) {
    return LTrim(RTrim(str));
}

/*
*海况
*/
function SeaStateWidget() {
    if (SeaStateWidget.unique != null)
    // throw new Error("只允许创建一个SeaStateWidget！");
        return SeaStateWidget.unique;
    SeaStateWidget.unique = this;

    var targetUrl = "proxy/proxy.ashx?http://www.sdmf.org.cn/";

    var locationCity = { "滨州": "118.03,38.35", "东营": "119.09,38.20",
        "青岛": "120.56,36.02", "日照": "119.63,35.26",
        "威海": "122.64,36.97", "潍坊": "119.22,37.30",
        "烟台": "120.61,37.91"
    };
    var sdmap = null, widgetLayer = null, inited = false;

    function dataQuery() {
        //先请求线数据
        $.ajax({
            type: "GET",
            url: targetUrl,
            datatype: "xml",
            success: function (result) {
                //widgetInit();
                result = $.trim(result.substring(result.indexOf("var cityTidalList"), result.indexOf("//   var cityWaveList")));
                result = $.trim(result.substring(result.indexOf("["), result.indexOf("]") + 1));
                result = eval(result);
                analysisData(result);
            },
            error: function (a, b) {
                var k = a;
                if (console.log) {
                    console.log("海况数据请求" + b);
                }
            }
        });
    };
    function analysisData(result) {
        if (result) {
            if (result != null && result.length != 0) {
                for (var i = 0, n = result.length; i < n; i++) {
                    drawElem(result[i]);
                }
            }
        }

    };
    function drawElem(attr) {

        var lonlat = locationCity[attr.CITY_NAME];
        var lon = lonlat.split(",")[0];
        var lat = lonlat.split(",")[1];
        var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon, lat));
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        //style.externalGraphic = "images/" + "mark2/b_" + attr.state1 + ".png";
        style.externalGraphic = "images/" + "mark2/point0.png";
        style.graphicWidth = 37;
        style.graphicHeight = 33;
        style.graphicYOffset = -33 / 2;
        style.fillOpacity = 1;
        style.cursor = "pointer";
        feature.style = style;
        feature.attributes = attr;
        widgetLayer.addFeatures(feature);
    };
    function onSelect(e) {
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        var feature = e.feature;
        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken",
        		feature.geometry.getBounds().getCenterLonLat(),
                null,
                "<div style='padding:0 5px;'><div style = 'position:relative; margin-bottom:15px;color:#3b9cfe;'><b>近海状况</b> </div> <div style='margin:10px 5px;'><div style='float:left; '> <div style = 'line-height: 18px;'>"
                + feature.attributes.CITY_NAME + "</div><div style = 'line-height: 18px;'>浪高:&nbsp;"
                + feature.attributes.WAVE_HEIGHT
                + "m</div><div style = 'line-height: 18px;'>表层水温:&nbsp;"
                + feature.attributes.WATER_TEMP
                + "℃</div><div style = 'line-height: 18px;'>发布日期:&nbsp;"
                + feature.attributes.PUBLISHDATE
                + "</div></div><div style='padding-left:130px;line-height:1.5em;' >第一次高潮时:&nbsp;"
                + feature.attributes.FIRST_HEIGHT_TIDAL + "<br>第一次低潮时:&nbsp;"
                + feature.attributes.FIRST_LOW_TIDAL + "<br>第二次高潮时:&nbsp;" + feature.attributes.SECOND_HEIGHT_TIDAL
                + "<br>第二次低潮时:&nbsp;" + feature.attributes.SECOND_LOW_TIDAL + "</div></div></div>",
			null, true, function () {

			    sdmap.removePopup(sdmap.widgetPop);
			    sdmap.unSelect();

			});
        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);
    };


    return {
        init: function (renderer, styleMap, smap) {

            widgetLayer = new OpenLayers.Layer.Vector('海况', {
                style: styleMap,
                renderers: renderer
            });
            sdmap = smap;
            sdmap.addLayer(widgetLayer, true);

            widgetLayer.events.on({
                "featureselected": onSelect
            });

            inited = true;
        },
        Show: function () {
            if (inited) {
                //                widgetLayer.setVisibility(true);
                //            else {
                dataQuery();
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);

        },
        Dispose: function () {
            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            inited = false;
            widgetLayer = null;

        },
        isInit: function () { return inited; }
    };
}

//-----以上-----add by ZCY 20150824170300
/*
*水质监测--仁达科技
*/
function SZJCWidget() {
    if (SZJCWidget.unique != null)
    // throw new Error("只允许创建一个SeaStateWidget！");
        return SZJCWidget.unique;
    SZJCWidget.unique = this;

    var targetUrl = "http://222.175.99.123:81/hyservice/szjcService.asmx/GetList";
    var lineUrl = "http://222.175.99.123:81/hyservice/szjcService.asmx/GetHis?";
    var sdmap = null, widgetLayer = null, inited = false;

    function dataQuery(type, data) {
        var QueryF = (type == "0") ? true : false;
        $.ajax({
            type: "GET",
            url: (QueryF) ? targetUrl : lineUrl,
            datatype: "text",
            data: data,
            success: function (result) {
                analysisData(result, type);
            },
            error: function (a, b) {
                var k = a;
                if (console.log) {
                    console.log("水质监测数据请求" + b);
                }
            }
        });
    };
    function analysisData(data, type) {
        var r = null;
        if (data.childNodes[0].textContent) {
            var nodeData = data.childNodes[0].textContent;
        }
        else {
            nodeData = data.text;
        }
        if (type == "0") {
            r = eval("(" + nodeData + ")").data;
            for (var i = 0, n = r.length; i < n; i++) {
                drawElem(r[i]);
            }
        }
        else {
            r = eval("(" + nodeData + ")");
            linechart(r);
        }
    };
    function drawElem(attr) {
        var lon = attr.X;
        var lat = attr.Y;
        var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon, lat));
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.externalGraphic = "images/" + "mark2/point4.png";
        style.graphicWidth = 37;
        style.graphicHeight = 33;
        style.graphicYOffset = -33 / 2;
        style.fillOpacity = 1;
        style.cursor = "pointer";
        feature.style = style;
        feature.attributes = attr;
        widgetLayer.addFeatures(feature);
    };
    function onSelect(e) {
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        var feature = e.feature;
        tabstr = "<div id = 'staticsTab1'><div class='stc_hispic'></div><div class='stc_title'>基本信息</div></div>" +
                 "<div id = 'staticsTab2'><div class='stc_xqpic'></div><div class='stc_title'>历史对比</div></div>" +
                 "<div id = 'staticsTab3'><div class='stc_xqpic'></div><div class='stc_title'>实时视频</div></div>";
        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(), null,
             "<div style='padding:0 5px;'><div style = 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'><b>"
             + feature.attributes.ADDR + "[" + feature.attributes.ID + "]" + "</b> </div><div class='maindiv'><div class='titlediv' >" +
             tabstr + "</div><div id = 'staticsDiv'></div></div></div>",
                null, true, function () {
                    sdmap.removePopup(sdmap.widgetPop);
                    sdmap.unSelect();
                });
        var content1 = "<div style='padding:0 5px;'><div style = 'font-size:14px; position:relative;color:#3b9cfe;'>" +
                    " <div style='line-height:42px;font-size: 12px;color: black;margin-top: 10px;'>" +
                    "<div class='div_left'>箱温度:<span class='span_road'>" + feature.attributes.WD_X + "</span></div>" +
                    "<div class='div_right'>箱湿度:<span class='span_road'>" + feature.attributes.SD_X + "</span></div>" +
                    "<hr style='width:100%; border-top: 0px #B8B6B6 solid'>" +
                    "<div class='div_left'>海温度:<span class='span_road'>" + feature.attributes.WD_H + "</span></div>" +
                    "<div class='div_right'>水流速:<span class='span_road'>" + feature.attributes.LS + "</span></div>" +
                    "<hr style='width:100%; border-top: 0px #B8B6B6 solid'>" +
                    "<div class='div_left'>溶氧:<span class='span_road'>" + feature.attributes.RY + "</span></div>" +
                     "<div class='div_right'>溶氧温度:<span class='span_road'>" + feature.attributes.RY_WD + "</span></div>" +
                    "<hr style='width:100%; border-top: 0px #B8B6B6 solid'>" +
                     "<div class='div_left'>PH:<span class='span_road'>" + feature.attributes.PH + "</span></div>" +
                     "<div class='div_right'>压力:<span class='span_road'>" + feature.attributes.YL + "</span></div>" +
                     "<hr style='width:100%; border-top: 0px #B8B6B6 solid'>" +
                     "<div class='div_left'>电压:<span class='span_road'>" + feature.attributes.DY + "</span></div>" +
                     "<div class='div_right'>盐度:<span class='span_road'>" + feature.attributes.YD + "</span></div>" +
                     "<hr style='width:100%; border-top: 0px #B8B6B6 solid'>" +
                     "<div class='div_left'>电导:<span class='span_road'>" + feature.attributes.DD + "</span></div>" +
                     "<div class='div_right'>时间:<span class='span_road'>" + feature.attributes.TIME + "</span></div>" +
                    "</div>";
        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);
        $('.titlediv>div').click(function (e) {
            var ths = $(this);
            if (this.id == "staticsTab1")
            { $("#staticsDiv").html(content1); }
            else if (this.id == "staticsTab2") {
                var Tobj = { id: "RD_MPYX_0_0", n: 7 };
                dataQuery("1", Tobj);
            }
            else {
                var url;
                if ((feature.attributes.SPCH != null) && (feature.attributes.SPCH != "")) {
                    url = "video/szjc/realVideo.html?ch=" + feature.attributes.SPCH;
                }
                else {
                    url = "video/iermu.html?title=" + "test" + "&" + "shareid=4425243d0e7e313d616bdd4bf3cc1f95&uk=878364372";
                }
                $("#staticsDiv").html("<iframe name='myiframe' width='100%' height='100%' marginwidth='0' marginheight='0' hspace='0' " +
                "vspace='0' frameborder='0' scrolling='no' src='" + url + "'></iframe>");
            }
            ths.children().addClass("active");
            ths.siblings().children().removeClass("active");
        });
        $("#staticsTab1").click();
    };
    function linechart(data) {

        $('#staticsDiv').highcharts({
            title: {
                text: '过去7小时内变化情况',
                x: -20
            },
            xAxis: {
                categories: data.cate
            },
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: data.series,
            credits: {
                enabled: false
            }
        });
    }

    return {
        init: function (renderer, styleMap, smap) {

            widgetLayer = new OpenLayers.Layer.Vector('海况', {
                style: styleMap,
                renderers: renderer
            });
            sdmap = smap;
            sdmap.addLayer(widgetLayer, true);

            widgetLayer.events.on({
                "featureselected": onSelect
            });

            inited = true;
        },
        Show: function () {
            if (inited) {
                dataQuery("0", null);
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);

        },
        Dispose: function () {
            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            inited = false;
            widgetLayer = null;

        },
        isInit: function () { return inited; }
    };
}
/*
*道路
*/

function RoadWiget() {
    if (RoadWiget.unique != null)
    //  throw new Error("只允许创建一个RoadWiget！");
        return RoadWiget.unique;
    RoadWiget.unique = this;
    var targetUrl = inProxy + "http://www.sdmap.gov.cn/ShareRoadService.ashx"; //    {request:"GSEVENT", type:"007002"}   {request:"GSEVENT", type:"007001"}   {request:"GSCRK"}";
    var sdmap = null, widgetLayer = null, inited = false, cacheData = null; // { road_kou: [], road_event: [], road_hu: [] };
    var visStat = { road_kou: true, road_event: true, road_hu: true };

    function dataQuery(t) {
        if (t != null) {
            if (visStat[t]) {
                widgetLayer.removeFeatures(cacheData[t]);
                visStat[t] = false;
            } else {
                widgetLayer.addFeatures(cacheData[t]);
                visStat[t] = true;
            }
            return;
        }
        cacheData = { road_kou: [], road_event: [], road_hu: [] };
        $.ajax({ type: "GET", url: targetUrl + "?request=GSCRK", datatype: "xml", success: function (result) {
            $.ajax({ type: "POST", url: targetUrl, datatype: "xml", data: { request: "GSEVENT", type: "007001" }, success: function (res) {
                analysisData(res);
            }, error: function (a, b) { if (console.log) { console.log("路况养护数据请求" + b); } }
            });

            $.ajax({ type: "POST", url: targetUrl, datatype: "xml", data: { request: "GSEVENT", type: "007002" }, success: function (res) {
                analysisData(res);
            }, error: function (a, b) { if (console.log) { console.log("交通事故数据请求" + b); } }
            });
            analysisData(result);
        }, error: function (a, b) { if (console.log) { console.log("出入口数据请求" + b); } }
        });
    };

    function analysisData(result) {
        if (result) {

            var resultDomEL = string2xml(result);
            var records = resultDomEL.getElementsByTagName("event");
            if (records != null && records.length != 0) {
                for (var i = 0, n = records.length; i < n; i++) {
                    var tmpRow = records[i].childNodes;
                    var tmpRowData = new Object();
                    for (var j = 0, m = tmpRow.length; j < m; j++) {
                        var tmpTagName = tmpRow[j].tagName;
                        tmpRowData[tmpTagName] = tmpRow[j].text ? tmpRow[j].text : tmpRow[j].textContent;
                    }
                    drawElem(tmpRowData);

                }
            }
        }

    };

    function drawElem(attr) {

        var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(attr.x, attr.y));
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.graphicWidth = 26;
        style.graphicHeight = 26;
        style.fillOpacity = 1;
        style.cursor = "pointer";

        feature.attributes = attr;

        if (attr.eventtype == null) {
            var xx;
            if (attr.enterstatus == "封闭" && attr.exitstatus == "封闭")
                xx = "33";
            else if (attr.enterstatus == "畅通" && attr.exitstatus == "封闭")
                xx = "02";
            else if (attr.enterstatus == "封闭" && attr.exitstatus == "畅通")
                xx = "11";
            else xx = "33";
            style.externalGraphic = "images/Road/crk" + xx + ".png";
            feature.style = style;
            cacheData["road_kou"].push(feature);
        }

        else if (attr.eventtype == "养护施工") {
            style.externalGraphic = "images/Road/roadStruct_pic.png";
            feature.style = style;
            cacheData["road_hu"].push(feature);
        } else {
            style.externalGraphic = "images/Road/accident_pic.png";
            feature.style = style;
            cacheData["road_event"].push(feature);
        }
        widgetLayer.addFeatures(feature);
    };
    function onSelect(e) {
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        var feature = e.feature;
        if (feature.attributes.eventtype != null) {
            var Ttile = feature.attributes.glmc + "   " + "方向:" + feature.attributes.roadfx;
            var len; var Tlogo;
            if (feature.attributes.eventms) {
                var Tl = (feature.attributes.eventms.length * 12 + 100); Tl = (Tl > 370) ? Tl : 370;
                len = Tl + "px";
            }
            else { len = "370px"; };
            if (feature.attributes.eventtype == "养护施工") { Tlogo = "div_shigong" }
            else { Tlogo = "div_shigu" }
            sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken",
                feature.geometry.getBounds().getCenterLonLat(),
                null,
                "<div style='padding:0 5px;'><div style = 'font-size:14px; position:relative;color:#3b9cfe;'><b style='margin-left: 20px'>" + Ttile +
                    "</b><div class='div_content_r'><div class=" + Tlogo + "></div>" +
                    "<div style = 'line-height:40px;font-size:12px;color:red;width:" + len + ";'>" + feature.attributes.eventms + "</div></div>" +
                    "</div> <div style='line-height:34px;' >" +
                    "<hr style='width:100%; border-top: 0px #B8B6B6 solid'>" +
                    "<div class='div_left'>道路调整措施:<span class='span_road'>" + feature.attributes.steptime + "</span></div>" +
                    "<hr style='width:100%; border-top: 0px #B8B6B6 solid'>" +
                    "<div class='div_left'>起始节点:<span class='span_road'>" + feature.attributes.startnode + "</span></div>" +
                    "<div class='div_right'>终止节点:<span class='span_road'>" + feature.attributes.endnode + "</span></div>" +
                    "<hr style='width:100%; border-top: 0px #B8B6B6 solid'>" +
                    "<div class='div_left'>开始桩号:<span class='span_road'>" + feature.attributes.startzh + "</span></div>" +
                     "<div class='div_right'>结束桩号:<span class='span_road'>" + feature.attributes.endzh + "</span></div>" +
                    "<hr style='width:100%; border-top: 0px #B8B6B6 solid'>" +
                    "<div class='div_left'>开始时间:<span class='span_road'>" + feature.attributes.starttime + "</span>" +
                    "<br>预计结束时间:<span class='span_road'>" + feature.attributes.endtime + "</span></div>" +
                    "<br></div></div>",
                null, true, function () {
                    if (sdmap.widgetPop != null) {
                        sdmap.removePopup(sdmap.widgetPop);
                        sdmap.unSelect();
                    }
                });
        } else {
            var c_r = (feature.attributes.enterstatus == "封闭") ? "span_active_road" : "span_normal_road";
            var c_c = (feature.attributes.exitstatus == "封闭") ? "span_active_road" : "span_normal_road";
            sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken",
                feature.geometry.getBounds().getCenterLonLat(),
                null,
                "<div style='padding:0 5px;min-width:130px;'><div style = 'position:relative;margin-bottom:10px;color:#3b9cfe;font-size:14px;margin-left:8px'><b>" + feature.attributes.tollbooth +
                    "</b></div> <div style='line-height:30px;margin-left:10px'>入口:<span class=" + c_r + ">" + feature.attributes.enterstatus + "</span>" +
                    "<br>出口:<span class=" + c_c + ">" + feature.attributes.exitstatus + "</span><br></div></div>", null, true, function () {
                        if (sdmap.widgetPop != null) {
                            sdmap.removePopup(sdmap.widgetPop);

                        }
                    });
        }
        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);
    };

    return {
        init: function (renderer, styleMap, smap) {

            widgetLayer = new OpenLayers.Layer.Vector('道路', {
                style: styleMap,
                renderers: renderer
            });
            sdmap = smap;
            //实例化矢量点击查询控件

            sdmap.addLayer(widgetLayer, true);

            widgetLayer.events.on({
                "featureselected": onSelect
            });
            inited = true;
        },
        Show: function (t) {
            if (inited) {
                dataQuery(t);
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);

        },
        Dispose: function () {
            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            inited = false;
            cacheData = { road_kou: [], road_event: [], road_hu: [] };
            widgetLayer = null;


        },
        isInit: function () { return inited; }
    };

}

/*
*环境
*/

function EnvironmentWidget() {
    if (EnvironmentWidget.unique != null)
    // throw new Error("只允许创建一个EnvironmentWidget！");
        return EnvironmentWidget.unique;
    EnvironmentWidget.unique = this;
    var targetUrl = "proxy/proxy.ashx?http://58.56.98.78:8801/AirDeploy.Web/Ajax/AirQuality/AirQuality.ashx?Method=GetStationMarkOnMap";
    var targetUrl2 = "proxy/proxy.ashx?http://58.56.98.78:8801/AirDeploy.Web/Ajax/AirQuality/AirQuality.ashx/AirQuality.ashx?Method=GetQualityItemsValues&StationID=";
    var intros = { "Ⅰ": { i: 1, intro: "空气质量令人满意，基本无空气污染", jianyi: "非常适宜户外活动" },
        "Ⅱ": { i: 2, intro: "空气质量可接受，但某些污染物可能对极少数异常，敏感人群健康有较弱影响", jianyi: "适宜户外活动或锻炼" },
        "Ⅲ": { i: 3, intro: "易感人群症状有轻度加剧，健康人群出现刺激症状", jianyi: "减少户外锻炼" },
        "Ⅳ": { i: 4, intro: "进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响", jianyi: "停止户外锻炼，减少户外活动" },
        "Ⅴ": { i: 5, intro: "心脏病和肺病患者症状显著加剧，运动耐受力减低，健康人群普遍出现症状", jianyi: "不适宜户外活动，户外活动时应佩戴口罩" },
        "Ⅵ": { i: 6, intro: "健康人运动耐受力减低，有显著强烈症状，提前出现某些疾病", jianyi: "取消不必要的户外活动" },
        "--": { i: 7, intro: "无数据", jianyi: "设备故障" }
    };
    var sdmap = null, widgetLayer = null, inited = false, legend = null, loaded = false, curtype = "";

    function dataQuery(type) {
        //  curtype = type;
        if (sdmap.widgetPop != null)
            sdmap.removePopup(sdmap.widgetPop);
        $.ajax({
            type: "GET",
            url: targetUrl,
            datatype: "json",
            success: function (result) {
                analysisData(result);
            },
            error: function (a, b) {
                if (console.log) {
                    console.log("AQI数据请求" + b);
                }
            }
        });

    }



    function analysisData(result) {
        if (!!result) {
            var records = eval("(" + result + ")");
            if (records.items.length > 0) {
                records = records.items;
                for (var i = 0; i < records.length; i++) {

                    drawElem(records[i]);
                }

            }
        }
    }



    function drawElem(attr) {
        var fea = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(parseFloat(attr.longitude), parseFloat(attr.latitude)));
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.externalGraphic = "images/environment/pm25_" + intros[attr.lev].i + ".png";
        style.graphicWidth = 25;
        style.graphicHeight = 25;
        style.fillOpacity = 1;
        style.cursor = "pointer";
        fea.style = style; ;
        fea.attributes = attr;

        widgetLayer.addFeatures(fea);
    }

    function onSelect(e) {
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        var feature = e.feature;
        var res = $.ajax({ async: false, url: targetUrl2 + feature.attributes.subid, dataType: "json" });
        var attr = eval("(" + res.responseText + ")");


        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(), null,
["<div style = 'width:340px;height:210px;font-size:12px;padding:0 5px;'><div style = 'position:absolute;top:0px;line-height:20px;color:#3b9cfe;'><b style='font-size:14px;'>", attr.CityName, " ", attr.DT,
    "</b></div><div style='padding-top:25px;'><div  style='float:left;line-height:1.5em;width:220px;display:inline-block;'><table><tr><td style=' font-weight: bold;color:#4d4d4d;'>空气质量指数AQI：</td><td>",
    attr.AQI, "</td></tr></table><table><tr><td style=' font-weight: bold;color:#4d4d4d;'>空气质量等级：</td><td>",
    attr.Quality, "(", attr.Level, ")</td></tr></table><table><tr><td style=' font-weight: bold;color:#4d4d4d;'>首要污染物：</td><td>",
    attr.POL, "</td></tr></table><table><tr><td style=' font-weight: bold;width:65px;color:#4d4d4d;'>健康指引：</td><td style='width:120px;'>",
    intros[attr.Level].intro, "</td></tr></table></div><div style = 'display:inline-block;clear:right;'><img width='91px'height='102px' src='images/environment/", intros[attr.Level].i,
    ".png'></img>", "<div style='width:120px;'>", intros[attr.Level].jianyi, "</div>", "</div><div style='float:left;clear:both'>",
    "<style>.paramindex{padding-left:25px;} .paramindex tr{font-size:14px;font-weight:bold;}.paramindex td{width:100px;}.paramindex span{color:#046abe;font-size:14px;padding-right:0px;}</style><table class='paramindex'>",
    , "<tbody><tr><td><span>PM2.5：</span>", Math.ceil(parseFloat(attr.PM25) * 1000),
    "</td><td><span>PM10：</span>", Math.ceil(parseFloat(attr.PM10) * 1000),
    "</td><td><span>SO2：</span>", Math.ceil(parseFloat(attr.SO2) * 1000),
    "</td></tr><tr><td><span>NO2：</span>", Math.ceil(parseFloat(attr.NO2) * 1000), ,
    "</td><td><span>CO：</span>", attr.CO,
    "</td><td><span>O3：</span>", Math.ceil(parseFloat(attr.O3) * 1000), "</td></tr></tbody>",
    "</table></div><div style='float:right;clear:both;padding-top:5px;'>单位:CO毫克/立方米，其它 微克/立方米</div></div></div>"].join(""),
			null, true, function () {
			    if (sdmap.widgetPop != null) {
			        sdmap.removePopup(sdmap.widgetPop);
			        sdmap.unSelect();
			    }
			});

        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);
    }

    return {
        init: function (renderer, styleMap, map) {

            widgetLayer = new OpenLayers.Layer.Vector('环境', {
                style: styleMap,
                renderers: renderer
            });
            sdmap = map;

            legend = $("<div></div>").attr("id", "lengend_envri").addClass("legenddiv").css("width", "300px")
                .append("<img src='Images/environment/aqi.png' width='300px' height='100px'/>");
            $("#" + sdmap.map.div.id).append(legend);
            //实例化矢量点击查询控件

            sdmap.addLayer(widgetLayer, true);
            widgetLayer.events.on({
                "featureselected": onSelect
            });

            inited = true;
        },
        Show: function () {
            if (inited) {
                if (!loaded)
                    dataQuery();
                widgetLayer.setVisibility(true);
                $("#lengend_envri").show();
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            $("#lengend_envri").hide();
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);

        },
        Dispose: function () {
            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            inited = false;
            widgetLayer = null;
            curtype = "";
            legend.remove();
            legend = null;
        },
        isInit: function () { return inited; }
    };

}

/*
*水质
*/
function WaterQuanlityWidget() {
    if (WaterQuanlityWidget.unique != null)
        return WaterQuanlityWidget.unique;
    WaterQuanlityWidget.unique = this;

    //http://sdmap.gov.cn:8081/testServ/waterservice.asmx  http://localhost/PubServices/WaterService.asmx
    var targetUrl = "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/testServ/waterservice.asmx/QueryTempa";
    var sdmap = null, widgetLayer = null, inited = false, legend = null, selectedPoistion = null;

    function queryData() {
        //先请求线数据
        $.ajax({
            type: "GET",
            url: targetUrl + "?parm=1",
            success: function (result) {
                $.ajax({ type: "GET", url: targetUrl + "?parm=2", success: analysisData, error: function (er, b) {
                    if (console.log) {
                        console.log("面数据请求" + b);
                    }
                }
                });
                //  waterQuanlityInit();
                // inited = true;
                analysisData(result);

            },
            error: function (a, b) {
                if (console.log) {
                    console.log("线数据请求" + b);
                }
            }
        });
    };
    function mousemovehandler(e) {
        selectedPoistion = e.xy;
    }
    function analysisData(result) {
        var dat = eval(result.documentElement.textContent || result.documentElement.text);
        var len = dat.length;
        for (var i = 0; i < len; i++) {
            var sects = dat[i].geom.split('@');
            var nc = sects.length;
            if (nc < 2) continue;
            var lines = [];
            for (var k = 1; k < nc; k++) {
                lines.push(getPoints(sects[k]));
            }
            dat[i].geom = null;
            drawElem(lines, dat[i]);
        }
    };
    function drawElem(lines, attr) {
        var len = lines.length;
        var geom, arr, i;
        if (len < 1) return;
        if (attr.gtype == '1')//xian
        {
            if (len == 1)
                geom = new OpenLayers.Geometry.LineString(lines[0]);
            else {
                arr = [];
                for (i = 0; i < len; i++) {
                    arr.push(new OpenLayers.Geometry.LineString(lines[i]));
                }
                geom = new OpenLayers.Geometry.MultiLineString(arr);
            }
        } else //if (attr.gtype == '2')
        { //mian

            if (len == 1)
                geom = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(lines[0])]);
            else {
                arr = [];
                for (i = 0; i < len; i++) {
                    arr.push(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(lines[i])]));
                }
                geom = new OpenLayers.Geometry.MultiPolygon(arr);
            }
        }

        var featrue = new OpenLayers.Feature.Vector(geom);
        //attr.color = "red";
        featrue.attributes = attr;


        var styleFeature2 = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        styleFeature2.fillColor = getTypeColor(attr.water);
        styleFeature2.fillOpacity = 0.5;
        styleFeature2.strokeWidth = 2;
        styleFeature2.strokeColor = getTypeColor(attr.water);
        styleFeature2.cursor = "pointer";

        featrue.style = styleFeature2;

        widgetLayer.addFeatures(featrue);

    };

    function getTypeColor(type) {
        var color;
        switch (type) {
            case "I":
            case "II":
            case "III":
                color = "green";
                break;
            case "IV":
                color = "yellow";
                break;
            case "V":
                color = "coral";
                break;
            case "劣V":
                color = "red";
                break;
            default:
                color = "black";
        }
        return color;
    };

    function getPoints(strCoord) {
        var len = strCoord.length;
        var arr = [];
        var lat, lng;
        for (var i = 0; i < len; i += 10) {
            lng = strCoord.substr(i, 5);
            lat = strCoord.substr(i + 5, 5);
            lng = parseInt(lng, 36) / 100000;
            lat = parseInt(lat, 36) / 100000;
            arr.push(new OpenLayers.Geometry.Point(lng, lat));
        }
        return arr;
    };



    function onSelect(feature) {

        var lnglat = sdmap.map.getLonLatFromViewPortPx(selectedPoistion);

        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }

        var attr = feature.attributes;
        var content = ["<div style='padding:0 5px;min-width:130px;'><div style = 'position:relative; margin-bottom:10px;color:#3b9cfe;'><b>主要河流水质状况</b></div> <div style = 'line-height:1.5em;'>创建日期："];
        content.push(attr.year + "-" + attr.month);
        content.push("<br>流域名称：");
        content.push(attr.basin);
        content.push("<br>河流名称：");
        content.push(attr.river);
        content.push("<br>断面名称：");
        content.push(attr.section);
        content.push("<br>控制水域：");
        content.push(attr.city);
        content.push("<br>水质类别：");
        content.push(attr.water);
        content.push("<br>常见鱼类：<img src='images/water/fish1.png' width='30px' height='30px'/></div></div>");

        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken",
        // feature.geometry.getBounds().getCenterLonLat(),
            lnglat,
            null, content.join(""),
            null, true, function () {
                sdmap.removePopup(sdmap.widgetPop);
                sdmap.unSelect();
            });
        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);

    };

    return {
        init: function (renderer, styleMap, map) {

            widgetLayer = new OpenLayers.Layer.Vector('水质', {
                style: styleMap,
                renderers: renderer
            });
            sdmap = map;

            legend = $("<div></div>").attr("id", "lengend_water").addClass("legenddiv").css("width", "239px")
                .append("<img src='Images/water/waterlegend.png' width='239px' height='50px'/>");
            $("#" + sdmap.map.div.id).append(legend);

            sdmap.addLayer(widgetLayer, true);
            widgetLayer.events.on({
                "featureselected": function (evt) {
                    onSelect(evt.feature);
                }
            });
            sdmap.map.events.register("mousemove", sdmap, mousemovehandler);
            inited = true;
        },
        Show: function () {
            if (inited) {
                queryData();
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);

        },
        Dispose: function () {
            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            inited = false;
            legend.remove();
            legend = null;

            widgetLayer = null;
            sdmap.map.events.unregister("mousemove", sdmap, mousemovehandler);
        },
        isInit: function () { return inited; }
    };
}

/*
*水情
*/
function WaterConditionWidget() {
    if (WaterConditionWidget.unique != null)
        return WaterConditionWidget.unique;
    WaterConditionWidget.unique = this;
    var targetUrl1 = "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/tdmap_newinfo.xml";
    var targetUrl2 = inProxy + "http://www.sdmap.gov.cn/widgets/Rain/rainmap.xml";
    var sdmap = null, widgetLayer = null, inited = false, curtype = "";
    var cacheData = { kp: [], hp: [], ka: [], ha: [] };
    function dataQuery(type) {
        curtype = type;
        if (cacheData["kp"].length > 0) {
            drawElem();
            return;
        }
        $.ajax({
            type: "GET",
            url: targetUrl1,
            dataType: "xml",
            success: function (result) {
                if (result == undefined) {
                    alert("获取失败！");
                } else {
                    parseData(result, 1);
                }
            },
            error: function (a, b, c) {
                console.log(a); ////test
            }
        });

        $.ajax({
            type: 'GET',
            url: targetUrl2,
            dataType: 'xml',
            success: parseData
        });

    }

    function parseData(d, t) {
        var i, id, ele, name, x, y, flag, arr, str, angle, reco;
        reco = d.getElementsByTagName("STTP");
        if (reco[0].getAttribute("VALUE") == "ZZ")
            d = 0;
        else
            d = 1;

        if (t != 1) {

            //水库0
            arr = reco[1 - d].getElementsByTagName('item');
            for (i = 0; i < arr.length; i++) {
                ele = arr[i];
                id = ele.getAttribute("id");
                name = ele.getAttribute("name");
                x = ele.getAttribute("x");
                y = ele.getAttribute("y");
                flag = ele.getAttribute("flag");
                cacheData["kp"].push({ id: id, name: name, x: x, y: y, flag: flag });
            }
            //河道1
            arr = reco[d].getElementsByTagName('item');
            for (i = 0; i < arr.length; i++) {
                ele = arr[i];
                id = ele.getAttribute("id");
                name = ele.getAttribute("name");
                x = ele.getAttribute("x");
                y = ele.getAttribute("y");
                angle = ele.getAttribute("angle");
                flag = ele.getAttribute("flag");
                cacheData["hp"].push({ id: id, name: name, x: x, y: y, angle: angle, flag: flag });
            }
            drawElem();
        } else {
            //reco = d.getElementsByTagName("STTP");
            //水库
            arr = reco[1 - d].getElementsByTagName("STCD");

            for (i = 0; i < arr.length; i++) {
                ele = arr[i];
                id = ele.getAttribute("VALUE");
                str = ele.childNodes[0].nodeValue.replace(/<[\w\s='"\d%-;:#,]*>/g, "@").replace(/(&nbsp;)/g, '').replace(/@{2,}/g, '@').replace(/(米@3@\/秒)/, '立方米/秒');
                cacheData["ka"][id] = str;
            }

            //河道
            arr = reco[d].getElementsByTagName("STCD");

            for (i = 0; i < arr.length; i++) {
                ele = arr[i];
                id = ele.getAttribute("VALUE");
                str = ele.childNodes[0].nodeValue.replace(/<[\w\s='"\d%-;:#,]*>/g, "@").replace(/(&nbsp;)/g, '').replace(/@{2,}/g, '@');
                cacheData["ha"][id] = str;
            }
        }
    }

    function drawElem() {
        var i, ele;
        widgetLayer.removeAllFeatures();
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        if (curtype == "river") {
            for (i = 0; i < cacheData["hp"].length; i++) {
                ele = cacheData["hp"][i];
                var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(ele.x, ele.y));
                var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);

                style.externalGraphic = "images/rain/zz.png";
                style.graphicWidth = 8;
                style.graphicHeight = 16;
                style.fillOpacity = 1;
                style.rotation = ele.angle;
                style.cursor = "pointer";
                feature.style = style;

                feature.attributes = { id: ele.id, name: ele.name };
                widgetLayer.addFeatures(feature);
            }
        } else {
            for (i = 0; i < cacheData["kp"].length; i++) {
                ele = cacheData["kp"][i];
                var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(ele.x, ele.y));
                var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);

                style.externalGraphic = "images/rain/rr.png";
                style.graphicWidth = 12;
                style.graphicHeight = 11;
                style.fillOpacity = 1;

                style.cursor = "pointer";
                feature.style = style;

                feature.attributes = { id: ele.id, name: ele.name };
                widgetLayer.addFeatures(feature);
            }
        }
    }

    function onSelect(feature) {
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        var atr;
        if (curtype == "river") {
            atr = cacheData["ha"][feature.attributes.id];

        } else {
            atr = cacheData["ka"][feature.attributes.id];
        }
        if (atr) {
            atr = atr.split("@");
            var tit = atr[1];
            var at;
            if (atr.length > 4) {
                at = "时间：" + atr[2] + "<br/>" + atr[3] + "<br/>";
                at = at + atr.splice(4, atr.length).join("").replace("米3", "立方米").replace("/秒", "/秒<br/>");

            }
            else { tit = "未知"; at = "无数据！"; };
        }
        else {
            tit = "未知"; at = "无数据！";
        }
        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(), null,
                "<div style='padding:0 5px;min-width:130px;'><div style = 'position:absolute;top:0px;color:#3b9cfe;'><b>" + tit + "</b></div><div style='line-height:1.5em;margin-top:25px;'>" + at + "</div></div>",
                null, true, function () {
                    sdmap.removePopup(sdmap.widgetPop);
                    // popup = null
                    sdmap.unSelect();
                });
        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);

    }

    return {
        init: function (renderer, styleMap, map) {

            widgetLayer = new OpenLayers.Layer.Vector('水情', {
                style: styleMap,
                renderers: renderer
            });
            sdmap = map;

            sdmap.addLayer(widgetLayer, true);

            widgetLayer.events.on({
                "featureselected": function (evt) {
                    onSelect(evt.feature);
                }
            });

            inited = true;
        },
        Show: function (t) {
            if (t == null) t = "river";
            else t = t.split("_")[1];
            if (inited) {
                if (t == curtype) return;
                dataQuery(t);
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);

        },
        Dispose: function () {

            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            cacheData = { kp: [], hp: [], ka: [], ha: [] };
            inited = false;
            curtype = "";
            widgetLayer = null;

        },
        isInit: function () { return inited; }
    };
}

/*
*视频
*/
function VideoWidget() {
    if (VideoWidget.unique != null)
        return VideoWidget.unique;
    VideoWidget.unique = this;

    var targetUrl = "video/videodata.txt", sdmap = null, widgetLayer = null, inited = false;
    var popupDIV = [
			'<div id = "PopDiv" style = "">',
                '<div id = "PopDiv_title" style="width:420px;height:22px;font-weight:bold;font-size: 14px;line-height: 22px;padding-left: 5px;color:#3b9cfe;">',
                '</div>',
                '<div id = "PopDiv_frame" style="width:430px;height:330px;">',
                    '<iframe id="popiframe" width="100%" height="100%" frameborder="0"></iframe>',
                '<div/>',
			'</div>'
		].join('');
    var location = [{ id: "wrs", name: "望人松", x: 117.106774, y: 36.246327 }, { id: "gongbei", name: "拱北石", x: 117.106063, y: 36.256359 }, { id: "wydz", name: "天街", x: 117.098694, y: 36.2558 }, { id: "nantian", name: "南天门", x: 117.098355, y: 36.255723}];

    function dataQuery() {
        //先请求线数据
        $.ajax({
            type: "GET",
            url: targetUrl,
            datatype: "text",
            success: function (result) {
                location = JSON.parse(result);
                for (var v = 0; v < location.length; v++) {
                    drawElem(location[v]);
                }
            },
            error: function (a, b) {
                if (console.log) {
                    console.log("视频数据请求" + b);
                }
            }
        });
    };

    function drawElem(attr) {
        var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(attr.x, attr.y));
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.externalGraphic = "images/video/video.png";
        style.graphicWidth = 24;
        style.graphicHeight = 24;
        style.fillOpacity = 1;
        style.cursor = "pointer";
        feature.style = style;
        feature.attributes = attr;

        widgetLayer.addFeatures(feature);
    };
    function onSelect(feature) {
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken",
        feature.geometry.getBounds().getCenterLonLat(),
        null, popupDIV, null, true, function () {
            if (sdmap.widgetPop != null) {
                sdmap.removePopup(sdmap.widgetPop);
                // popup = null
                sdmap.unSelect();
            }
        });
        feature.popup = sdmap.widgetPop;
        feature.popup.autoSize = true;
        sdmap.addPopup(sdmap.widgetPop);
        var url;
        if (feature.attributes.type == "1") {
            url = "video/iermu.html?title=" + encodeURI(feature.attributes.name) + "&" + feature.attributes.request;
            $("#PopDiv_frame").css("width", "470px");
            $("#PopDiv_frame").css("height", "333px");
            feature.popup.updateSize();
        } else {
            url = "video/anqiaoqiao.html?title=" + encodeURI(feature.attributes.name) + "&request=" + feature.attributes.request;
            $("#PopDiv_frame").css("width", "430px");
            $("#PopDiv_frame").css("height", "330px");
            feature.popup.updateSize();
        }
        $("#popiframe").attr("src", url);
        $("#PopDiv_title").empty();
        $("#PopDiv_title").html(feature.attributes.name);

    };


    return {
        init: function (renderer, styleMap, map) {

            widgetLayer = new OpenLayers.Layer.Vector('视频', {
                style: styleMap,
                renderers: renderer
            });
            sdmap = map;
            sdmap.addLayer(widgetLayer, true);
            widgetLayer.events.on({
                "featureselected": function (evt) {
                    onSelect(evt.feature);
                }
            });
            inited = true;
        },
        Show: function (t) {
            if (inited) {
                dataQuery(t);
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);

        },
        Dispose: function () {

            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            inited = false;
            widgetLayer = null;
        },
        isInit: function () { return inited; }
    };
}

/*
*人口
*/

function PopulationWidget() {
    if (PopulationWidget.unique != null)
        return PopulationWidget.unique;
    PopulationWidget.unique = this;


    var targetUrl = "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/Statistics/StatisticsService.asmx";
    var sdmap = null, widgetLayer = null, inited = false, editCtl = null, data12 = [], data13 = [],
     data2 = [], curLevel, lengend = null, curtype = "", curFeature = null;
    function dataQuery(t) {
        if (t == curtype)
            return;
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        curtype = t;
        if (curtype == "rkzs") {
            lengend.css({ width: '166px', height: '82px', display: "block", background: "url('images/statics/rk_legend1.png')" });
            //    widgetControl.hover = false;
            if (data12.length > 0) {
                mapZoomed();
                return;
            }
            $.ajax({
                type: "GET",
                url: targetUrl + "/GetRKZS?year=2013",
                datatype: "xml",
                success: function (result) {
                    analysisData(result);
                },
                error: function (a, b) {
                    if (console.log) {
                        console.log("人口统计数据请求" + b);
                    }
                }
            });
        } else {

            lengend.css({ width: '381px', height: '148px', display: "block", background: "url('images/statics/rk_legend.png')" });
            //   widgetControl.hover = true;
            if (data2.length > 0) {

                drawElem();
                return;
            }
            $.ajax({
                type: "GET",
                url: targetUrl + "/GetRKMD?year=2013&level=3",
                datatype: "xml",
                success: function (result) {
                    analysisData(result);
                },
                error: function (a, b) {
                    if (console.log) {
                        console.log("人口统计数据请求" + b);
                    }
                }
            });
        }
    };

    function mapZoomed(evt) {
        console.log(" PopulationWidget  zoomed");
        if (sdmap.map.getScale() > 557114) {
            if (curLevel == 3)
                drawElem(2);

        } else {
            if (curLevel == 2)
                drawElem(3);

        }
    };
    function analysisData(result) {
        if (result) {
            var i;
            var dat = result.documentElement.textContent || result.documentElement.text;
            dat = eval("(" + dat + ")");
            var resArr = dat.Result;
            var len = dat.Count;
            if (curtype == "rkzs") {
                for (i = 0; i < len; i++) {
                    if (resArr[i].level == "2") {
                        data12.push(resArr[i]);
                    } else {
                        data13.push(resArr[i]);
                    }
                }
                if (sdmap.map.getScale() > 557114) {

                    drawElem(2);
                } else {
                    drawElem(3);
                }
            } else {//密度
                var wkt_c = new OpenLayers.Format.WKT();
                for (i = 0; i < len; i++) {
                    //{pac,ssqx,year,area,rkmd,name,x,y,level,geometry}
                    data2.push({ rkmd: resArr[i].rkmd, geom: wkt_c.read(resArr[i].geometry) });
                }
                drawElem();
            }
        }

    };
    function drawElem(t) {
        widgetLayer.removeAllFeatures();
        if (curtype == "rkzs") {
            curLevel = t;
            var feature, style;
            var item;
            var i, n, rr;
            if (curLevel == 2) {
                for (i = 0, n = data12.length; i < n; i++) {
                    item = data12[i];
                    feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(item.x, item.y));

                    style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                    style.externalGraphic = "images/statics/point.png";
                    rr = parseInt(Math.sqrt(item.rkzs * 2));
                    style.graphicWidth = rr;
                    style.graphicHeight = rr;
                    style.fillOpacity = 1;
                    style.cursor = "pointer";
                    feature.style = style;
                    feature.attributes = item;
                    widgetLayer.addFeatures(feature);
                }
            } else {
                for (i = 0, n = data13.length; i < n; i++) {
                    item = data13[i];
                    feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(item.x, item.y));
                    style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                    style.externalGraphic = "images/statics/point.png";
                    rr = parseInt(Math.sqrt(item.rkzs * 20));
                    style.graphicWidth = rr;
                    style.graphicHeight = rr;
                    style.fillOpacity = 1;
                    style.cursor = "pointer";
                    feature.style = style;
                    feature.attributes = item;
                    widgetLayer.addFeatures(feature);
                }
            }
        } else {

            for (i = 0, n = data2.length; i < n; i++) {
                item = data2[i];
                feature = item.geom;
                style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                var color;
                if (item.rkmd > 3000)
                    color = "#6b0000";
                else if (item.rkmd > 800) {
                    color = "#ad5313";
                }
                else if (item.rkmd > 500) {
                    color = "#f2a72e";
                }
                else if (item.rkmd > 300) {
                    color = "#fad155";
                }
                else {
                    color = "#ffff80";
                }
                style.strokeColor = "#ffffff";
                style.strokeOpacity = 0.75;
                style.fillColor = color;
                style.strokeWidth = 1;
                style.fillOpacity = 0.75;
                style.cursor = "pointer";

                feature.style = style;
                feature.attributes = { rkmd: item.rkmd };
                widgetLayer.addFeatures(feature);
            }
        }
    };
    function resetHighLight() {
        curFeature.style.fillOpacity = 0.75;
        widgetLayer.drawFeature(curFeature);
        sdmap.removePopup(sdmap.widgetPop);
        curFeature = null;
        sdmap.unSelect();
    }
    function onSelect(feature) {
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        if (curtype == "rkmd") {
            if (curFeature) {
                curFeature.style.fillOpacity = 0.75;
                widgetLayer.drawFeature(curFeature);
            }
            curFeature = feature;
            sdmap.widgetPop = new OpenLayers.Popup("文本标注",
										feature.geometry.getBounds().getCenterLonLat(),
											new OpenLayers.Size(80, 18),
										"<div style = 'position:relative; cursor:pointer;'><b>" + feature.attributes.rkmd + "</div>",
										true, resetHighLight);

            curFeature.style.fillOpacity = 0.5;
            widgetLayer.drawFeature(curFeature);
            feature.popup = sdmap.widgetPop;
            sdmap.addPopup(sdmap.widgetPop);
            return;
        }

        var qxstr = "";
        if (curLevel == 2)
            qxstr = "<div id = 'staticsTab2'><div class='stc_xqpic'></div><div class='stc_title'>县区比例图</div></div>";


        //PopulationTab2  staticsTab2

        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(), null,
             "<div style='padding:0 5px;'><div style = 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'><b>"
             + feature.attributes.name + "人口数据</b> </div><div class='maindiv'><div class='titlediv' ><div id = 'staticsTab1'><div class='stc_hispic active'></div><div class='stc_title active'>历年对比图</div></div>" +
                    qxstr + "</div><div id = 'staticsDiv'></div></div></div>",
                null, true, function () {
                    sdmap.removePopup(sdmap.widgetPop);
                    sdmap.unSelect();
                });

        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);

        var retVal = $.ajax({ url: targetUrl + "/GetHistoryRKZS?pac=" + feature.attributes.pac + "&year=2013", dataType: 'xml', async: false });
        retVal = retVal.responseText;
        retVal = retVal.substring(76, retVal.length - 9);
        var dat = eval("(" + retVal + ")");

        var hist = [parseFloat(dat.Result[0].rkzs), parseFloat(dat.Result[1].rkzs), parseFloat(dat.Result[2].rkzs)];

        var min = 0;   //柱状图Y轴最小值

        if (hist[0] < hist[1]) min = hist[0];
        else if (hist[1] < hist[2]) min = hist[1];
        else min = hist[2];

        var sects = [];
        if (dat.items.length > 0) {
            for (var i = 0, n = dat.items.length; i < n; i++)
                sects.push({ name: dat.items[i].name, y: parseFloat(dat.items[i].rkzs) });
        }


        function histgramChart() {
            $('#staticsDiv').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: [
		               dat.Result[0].year,
		                dat.Result[1].year,
		               dat.Result[2].year
		            ]
                },
                yAxis: {
                    min: min - 3,
                    title: {
                        text: '万人'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		                '<td style="padding:0"><b>{point.y:.1f}万</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                series: [{
                    name: '人口数',
                    data: hist,
                    size: '30%',
                    dataLabels: {
                        formatter: function () {
                            return this.point.name;
                        },
                        color: 'yellow',
                        distance: -15
                    }
                }]
            });
        }

        function pieChart() {

            $('#staticsDiv').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                legend: {
                    align: 'center'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.y}</b>'
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: '百分比',
                    data: sects,
                    size: '100%',
                    dataLabels: {
                        formatter: function () {
                            return this.point.name;
                        },
                        color: 'white',
                        distance: -25
                    }
                }]
            });
        }
        $('.titlediv>div').click(function (e) {
            var ths = $(this);
            if (this.id == "staticsTab1")
                histgramChart(); //bed1ee
            else pieChart();

            ths.children().addClass("active");
            ths.siblings().children().removeClass("active");

        });
        histgramChart();
    };

    return {
        init: function (renderer, styleMap, map) {

            widgetLayer = new OpenLayers.Layer.Vector('人口', {
                style: styleMap,
                renderers: renderer
                //                ,
                //                isBaseLayer: true,
                //                visibility: true
            });
            sdmap = map;
            sdmap.addLayer(widgetLayer, true);
            widgetLayer.events.on({
                "featureselected": function (evt) {
                    onSelect(evt.feature);
                }
            });
            editCtl = new OpenLayers.Control.EditingToolbar(widgetLayer);
            sdmap.map.addControl(editCtl);
            $(".olControlEditingToolbar").hide();
            lengend = $("<div style='z-index:980;border:1px solid #696969;position:absolute;right:50px;bottom:50px;'></div>");
            $(sdmap.map.div).after(lengend);
            inited = true;
        },
        Show: function (t) {
            if (t == null) t = "rkzs";
            else t = t.split('_')[1];
            if (inited) {
                dataQuery(t);
                sdmap.map.events.register("zoomend", sdmap.map, mapZoomed);
                // $(map).mouseover(mapHover);
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            lengend.hide();

        },
        Dispose: function () {


            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            sdmap.map.events.unregister("zoomend", sdmap.map, mapZoomed);
            inited = false;

            widgetLayer = null;
            lengend.remove();
            lengend = null;
            curtype = "";
            data12 = [];
            data13 = [];
            data2 = [];

        },
        isInit: function () { return inited; }
    };
}
/*
*经济
*/

function EconomicWidget() {
    if (EconomicWidget.unique != null)
        return EconomicWidget.unique;
    EconomicWidget.unique = this;

    var targetUrl = "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/Statistics/StatisticsService.asmx";
    var sdmap = null;
    var widgetLayer = null;
    var inited = false;
    var widgetControl = null;

    var lengend;
    var dataCache = { gdp: [], czsr: [], bqx: [] };
    var curLevel;
    var curtype = "";

    function dataQuery(t) {
        if (t == curtype)
            return;
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }
        curtype = t;
        if (dataCache[curtype].length > 0) {
            mapZoomed();
            return;
        }

        var url;
        if (curtype == "gdp") {


            url = "/GetGDP?year=2013";
        }
        else if (curtype == "czsr") {

            url = "/GetCZSR?year=2013";
        } else {

            url = "/GetBQX?year=2013";
        }

        $.ajax({
            type: "GET",
            url: targetUrl + url,
            datatype: "xml",
            success: function (result) {
                analysisData(result);
            },
            error: function (a, b) {
                if (console.log) {
                    console.log(curtype + "数据请求" + b);
                }
            }
        });
    };

    function mapZoomed(evt) {
        console.log("EconomicWidget zoomed");
        if (sdmap.map.getScale() > 557114) {
            if (curLevel == 3 || !evt)
                drawElem(2);

        } else {
            if (curLevel == 2 || !evt)
                drawElem(3);

        }
    };
    function analysisData(result) {
        if (result) {
            var i;
            var dat = result.documentElement.textContent || result.documentElement.text;
            dat = eval("(" + dat + ")");
            var resArr = dat.Result;
            var len = dat.Count;
            var items2 = [], items3 = [];
            if (curtype != "bqx") {
                for (i = 0; i < len; i++) {
                    if (resArr[i].level == "2") {
                        items2.push(resArr[i]);
                    } else {
                        items3.push(resArr[i]);
                    }
                }
                dataCache[curtype] = [items2, items3];
                if (sdmap.map.getScale() > 557114) {

                    drawElem(2);
                } else {
                    drawElem(3);
                }
            } else {//百强县
                dataCache[curtype] = resArr;
                drawElem();
            }
        }

    };
    function drawElem(lvl) {
        widgetLayer.removeAllFeatures();


        curLevel = lvl;
        var feature, style;
        var item;
        var i, n, tArr, fArr = [];
        if (curtype == "gdp") {
            lengend.css({ width: '185px', height: '85px', display: "block", background: "url('images/statics/jj_legend1.png')" });
            tArr = dataCache[curtype][curLevel - 2];
            for (i = 0, n = tArr.length; i < n; i++) {
                item = tArr[i];
                feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(item.x, item.y));
                style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                style.fillOpacity = 1;
                style.cursor = "pointer";

                style.externalGraphic = "images/statics/bar.png";
                style.graphicWidth = 20; //parseInt(item.rkzs / 13); //100  /10
                if (curLevel == 2) {
                    style.graphicHeight = parseInt(item.sczz / 100);
                } else {
                    style.graphicHeight = parseInt(item.sczz / 10);
                }
                feature.style = style;
                feature.attributes = item;
                fArr.push(feature);
            }
        }
        else if (curtype == "czsr") {
            lengend.css({ width: '167px', height: '83px', display: "block", background: "url('images/statics/jj_legend2.png')" });
            var rr;
            tArr = dataCache[curtype][curLevel - 2];
            for (i = 0, n = tArr.length; i < n; i++) {
                item = tArr[i];
                feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(item.x, item.y));
                style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                style.fillOpacity = 1;
                style.cursor = "pointer";
                style.externalGraphic = "images/statics/boll.png";



                if (curLevel == 2) {
                    rr = parseInt(Math.sqrt(item.dfsr * 8));
                    style.graphicWidth = style.graphicHeight = rr; //parseInt(item.dfsr / 10);
                } else {
                    rr = parseInt(Math.sqrt(item.dfsr * 40));
                    style.graphicWidth = style.graphicHeight = rr; // Math.sqrt(parseFloat(item.dfsr)) * 7;
                }
                feature.style = style;
                feature.attributes = item;
                fArr.push(feature);
            }
        }
        else {
            lengend.css({ width: '145px', height: '85px', display: "block", background: "url('images/statics/jj_legend3.png')" });
            //{"pac":"370983","ssqx":"370900","year":"2013","order":"48","name":"肥城市","x":"116.7472192330","y":"36.0858493549","level":"3","sczz":"674.46","dfsr":"31.93"}
            tArr = dataCache[curtype];
            var lbArr = [], lfeat;
            for (i = 0, n = tArr.length; i < n; i++) {
                item = tArr[i];
                feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(item.x, item.y));
                style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                style.fillOpacity = 1;
                style.cursor = "pointer";
                style.externalGraphic = "images/statics/boll.png";
                style.graphicWidth = style.graphicHeight = 40;
                style.label = item.name + "第" + item.order + "位";
                style.labelYOffset = -25;
                style.fontColor = "blue";
                style.fontWeight = "bold";
                feature.style = style;


                feature.attributes = item;
                fArr.push(feature);

            }
        }
        widgetLayer.addFeatures(fArr);

    };
    function closepopup() {
        sdmap.removePopup(sdmap.widgetPop);
        sdmap.unSelect();
    }
    function onSelect(feature) {
        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
        }

        if (curtype == "bqx") {
            // "sczz":"674.46","dfsr":"31.93
            sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(), null,
                "<div style ='position:relative;margin:0 5px;cursor:pointer;color:#3B9CFE;font-size:14px;'><b>" + feature.attributes.name + "</b>" + "</div ><br/><div style='margin:0 6px;'>国民生产总值(GDP):" + feature.attributes.sczz + "亿元<br/>财政收入：" + feature.attributes.dfsr + "亿元</div>",
                null, true, closepopup);
            feature.popup = sdmap.widgetPop;
            sdmap.addPopup(sdmap.widgetPop);

            return;
        }
        var qxstr = "", title, sUrl, key;
        if (curtype == "gdp") {
            sUrl = "/GetHistoryGDP";
            title = "国民生产总值(GDP)";
            key = "sczz";
        }
        else {
            sUrl = "/GetHistoryCZSR";
            title = "财政收入";
            key = "dfsr";
        }
        if (curLevel == 2)
            qxstr = "<div id = 'staticsTab2'><div class='stc_xqpic'></div><div class='stc_title'>县区比例图</div></div>";
        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", feature.geometry.getBounds().getCenterLonLat(), null,
             "<div style='padding:0 5px;'><div style = 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'><b>"
             + feature.attributes.name + title + "</b> </div><div class='maindiv'><div class='titlediv' ><div id = 'staticsTab1'><div class='stc_hispic active'></div><div class='stc_title active'>历年对比图</div></div>" +
                    qxstr + "</div><div id = 'staticsDiv'></div></div></div>",
                null, true, closepopup);

        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);

        var retVal = $.ajax({ url: targetUrl + sUrl + "?pac=" + feature.attributes.pac + "&year=2013", dataType: 'xml', async: false });
        retVal = retVal.responseText;
        retVal = retVal.substring(76, retVal.length - 9);
        var dat = eval("(" + retVal + ")");

        var min = 0;   //柱状图Y轴最小值
        var hist = [], years = [], count, i, v;
        for (i = 0, count = dat.Count; i < count; i++) {
            v = parseFloat(dat.Result[i][key]);
            if (v == 0) continue;
            hist.push(v);
            years.push(dat.Result[i].year);
            if (min > hist[i])
                min = hist[i];
        }
        var sects = [];
        if (dat.items.length > 0) {
            for (i = 0, count = dat.items.length; i < count; i++)
                sects.push({ name: dat.items[i].name, y: parseFloat(dat.items[i][key]) });
        }

        function histgramChart() {
            $('#staticsDiv').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: years
                },
                yAxis: {
                    min: min,
                    title: {
                        text: '亿元'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		                '<td style="padding:0"><b>{point.y:.1f}亿元</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                series: [{
                    name: title,
                    data: hist,
                    size: '30%',
                    dataLabels: {
                        formatter: function () {
                            return this.point.name;
                        },
                        color: 'yellow',
                        distance: -15
                    }
                }]
            });
        }

        function pieChart() {

            $('#staticsDiv').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                legend: {
                    align: 'center'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.y}</b>'
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: '百分比',
                    data: sects,
                    size: '100%',
                    dataLabels: {
                        formatter: function () {
                            return this.point.name;
                        },
                        color: 'white',
                        distance: -25
                    }
                }]
            });
        }

        $('.titlediv>div').click(function (e) {
            var ths = $(this);
            if (this.id == "staticsTab1")
                histgramChart(); //bed1ee
            else pieChart();

            ths.children().addClass("active");
            ths.siblings().children().removeClass("active");

        });

        histgramChart();
    };

    return {
        init: function (renderer, styleMap, map) {

            widgetLayer = new OpenLayers.Layer.Vector('经济', {
                style: new OpenLayers.StyleMap({
                    'default': {
                        strokeColor: "red",
                        strokeOpacity: 0.8,
                        strokeWidth: 2,
                        fillColor: "red",
                        fillOpacity: 0.8,
                        pointRadius: 4,
                        pointerEvents: "visiblePainted",
                        label: "${label}",
                        fontColor: "blue",
                        fontSize: "12px",
                        fontFamily: "SimHei",
                        fontWeight: "bold",
                        //                        labelAlign: "${align}",
                        //                        labelXOffset: "${xOff}",
                        //                        labelYOffset: "${yOff}",
                        labelOutlineColor: "white",
                        labelOutlineWidth: 1
                    }
                }),
                renderers: renderer
                //                ,
                //                isBaseLayer: true,
                //                visibility: true
            });
            sdmap = map;
            // sdmap.addControl(new OpenLayers.Handler.Hover());

            sdmap.addLayer(widgetLayer, true);
            widgetLayer.events.on({
                "featureselected": function (evt) {
                    onSelect(evt.feature);
                }
            });


            lengend = $("<div style='z-index:980;border:1px solid #696969;position:absolute;right:50px;bottom:50px;'></div>");
            $(sdmap.map.div).after(lengend);
            inited = true;
        },
        Show: function (t) {
            if (t == null) t = "gdp";
            else t = t.split('_')[1];
            if (inited) {
                dataQuery(t);
                sdmap.map.events.register("zoomend", sdmap.map, mapZoomed);

            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            lengend.hide();
        },
        Dispose: function () {

            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            sdmap.map.events.unregister("zoomend", sdmap.map, mapZoomed);
            widgetLayer = null;
            inited = false;

            lengend.remove();
            dataCache = { gdp: [], czsr: [], bqx: [] };

            curtype = "";
        },
        isInit: function () { return inited; }
    };
}

function ScenicWidget() {
    if (ScenicWidget.unique != null)
        return ScenicWidget.unique;

    ScenicWidget.unique = this;

    var targetUrl = "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/sdmapServices/ScenicWebService.asmx";
    var picurl = "http://www.sdmap.gov.cn:8081/pics"; //margin-top: -5px;
    var template = "<div id='ssss_conn'><div id='s_title' style='width: 460px;height: 25px;'><span id='s_title_cont' style='color: #ff9800;font-size: 14px;font-weight: bold;padding-left:10px;'></span><div style='position:absolute;right:20px;top:0'><input type='button' style='color:blue;' value='景区简介' /><input type='button' value='景区详情' /><input type='button' value='交通指南' /><input type='button' value='服务指南' /></div><img id='close_popup' src='images/close.gif' style='position:absolute;top:2px;right:0'/></div><div id='s_content' style='width: 460px;padding-top: 5px; height:245px;background-color: white'><div id='s_jianjie' style='display: block'><div style='float: left;width: 210px'><div id='s_reppic'><img src='' width='208' height='208' /></div><div class='scrolllist' id='s_gallery'><a class='abtn aleft' href='#left' title='左移'></a><div class='imglist_w'><ul class='imglist'></ul></div><a class='abtn aright' href='#right' title='右移'></a></div></div><div class='jianjie' style='float: left;margin-left: 10px;width: 230px;overflow:hidden;white-space: nowrap'>推荐度：<span id='s_jian_tj'></span><br />景点级别：<span id='s_jian_jb'></span><br />景区类型:<span id='s_jian_lx'></span><br />门票信息：<span id='s_jian_mp'></span><br /> 联系方式：<span id='s_jian_lianx'></span><br />景区网址：<span><a id='s_jian_url' href='' target='_blank'>点击查看详情</a></span><br />详细地址：<span id='s_jian_addr'></span><br />最佳浏览季节：<span id='s_jian_bst'></span></div></div><div id='s_xiangqing' style='display: none'><div id='s_video' style='width: 256px;height: 244px;float: left;'><object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0' width='256' height='244'><param name='movie' value='third/vcastr22.swf'></param><param name='quality' value='high'></param><param name='allowFullScreen' value='false'></param><embed src='third/vcastr22.swf' allowfullscreen='true' flashvars='vcastr_file=' quality='high' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' width='256' height='244' /></object></div><div id='s_xq_cont' style='width:188px;float: left ;height: 230px;margin-left: 10px;padding: 0;line-height: 16px;'></div></div><div id='s_jiaotong' style='display: none;'><div style='height: 47px;'><div style='float: left;width:82px;font-size: 13px;font-weight: bold; '>交通咨询：</div><div id='s_jt_zx' style='float: left;overflow-y: auto;padding: 4px 0; width: 370px'></div></div><div style='height: 47px;'><div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>旅游专线：</div><div id='s_jt_ly' style='float: left;overflow-y: auto;padding: 4px 0; width: 370px;height: 47px'></div></div><div style='height: 47px;'><div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>自驾指南：</div><div id='s_jt_zj' style='float: left;overflow-y: auto;padding: 4px 0;width: 370px;height: 47px'></div></div><div style='height: 27px;'><div style='float: left;width:92px;font-size: 13px;font-weight: bold;'>停车场信息：</div><div id='s_jt_tc' style='float: left;overflow-y: auto;padding: 4px 0;width: 358px;height: 47px'></div></div><div style='height: 27px;'><div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>加油站：</div><div id='s_jt_jy' style='float:left;overflow-y: auto;width: 350px'></div></div></div><div id='s_fuwu' style='display:none;line-height: 20px'><div style='height: 36px;'><div style='float: left;width:102px;font-size: 13px;font-weight: bold;'>景区旅游项目：</div><div id='s_fw_xm' style='float: left;overflow-y: auto; width: 345px;height: 36px'></div></div><div style='height: 36px;'><div style='float: left;width:102px;font-size: 13px;font-weight: bold;'>讲解员价格：</div><div id='s_fw_jj' style='float: left;overflow-y: auto;width: 350px;height:36px'></div></div><div style='height: 47px;'><div style='float: left;width:102px;font-size: 13px;font-weight: bold;'>配套服务设施：</div><div id='s_fw_pt' style='float: left;overflow-y: auto;width: 345px;height: 47px'></div></div><div style='height: 47px;'><div style='float: left;width:102px;font-size: 13px;font-weight: bold;'>常设旅游活动：</div><div id='s_fw_hd' style='float: left;overflow-y:uto;width: 350px;height: 47px;'></div></div><div style='height: 27px;'><div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>适合人群：</div><div id='s_fw_rq' style='float: left;overflow-y: auto;width: 350px;height: 27px;'></div></div><div style='height: 27px;'><div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>可看度：</div><div id='s_fw_kk' style='float: left;overflow-y: auto;width: 350px;height: 27px;'></div></div><div style='height: 27px;'><div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>刺激度：</div><div id='s_fw_cj' style='float: left;overflow-y: auto;width: 350px;height: 27px;'></div></div></div></div></div>";
    //     var template = [
    // "<div id='ssss_conn'>",
    //     "<div id='s_title' style='width: 460px;height: 25px;'>",
    //         "<span id='s_title_cont' style='color: #ff9800;font-size: 14px;font-weight: bold;padding-left:10px;'></span>",
    //         "<div style='position:absolute;right:20px;top:0'>",
    //             "<input type='button' style='color:blue;' value='景区简介' />",
    //             "<input type='button' value='景区详情' />",
    //             "<input type='button' value='交通指南' />",
    //             "<input type='button' value='服务指南' />",
    //         "</div>",
    //         "<img id='close_popup' src='images/close.gif' style='position:absolute;top:2px;right:0'/>",
    //     "</div>",
    //     "<div id='s_content' style='width: 460px;padding-top: 5px; height:245px;background-color: white'>",
    //         "<div id='s_jianjie' style='display: block'>",
    //             "<div style='float: left;width: 210px'>",
    //                 "<div id='s_reppic'>",
    //                     "<img src='' width='208' height='208' />",
    //                 "</div>",
    //                 "<div class='scrolllist' id='s_gallery'>",
    //                     "<a class='abtn aleft' href='#left' title='左移'></a>",
    //                     "<div class='imglist_w'><ul class='imglist'></ul></div>",
    //                     "<a class='abtn aright' href='#right' title='右移'></a>",
    //                 "</div>",
    //             "</div>",
    //             "<div class='jianjie' style='float: left;margin-left: 10px;width: 230px;overflow:hidden;white-space: nowrap'>",
    //                 "推荐度：<span id='s_jian_tj'></span><br />",
    //                 "景点级别：<span id='s_jian_jb'></span><br />",
    //                 "景区类型:<span id='s_jian_lx'></span><br />",
    //                 "门票信息：<span id='s_jian_mp'></span><br />",
    //                 "联系方式：<span id='s_jian_lianx'></span><br />",
    //                 "景区网址<span><a id='s_jian_url' href='' target='_blank'>点击查看详情</a></span><br />",
    //                 "详细地址：<span id='s_jian_addr'></span><br />",
    //                 "最佳浏览季节：<span id='s_jian_bst'></span>",
    //             "</div>",
    //         "</div>",
    //         "<div id='s_xiangqing' style='display: none'>",
    //             "<div id='s_video' style='width: 256px;height: 244px;float: left;'>",
    //                 "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' ",
    //                     "codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0' width='256' height='244'>",
    //                     "<param name='movie' value='third/vcastr22.swf'></param>",
    //                     "<param name='quality' value='high'></param>",
    //                     "<param name='allowFullScreen' value='false'></param>",
    //                     "<embed src='third/vcastr22.swf' allowfullscreen='true' flashvars='vcastr_file=' ",
    //                     "quality='high' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' width='256' height='244' />",
    //                 "</object>",
    //             "</div>",
    //             "<div id='s_xq_cont' style='width:188px;float: left ;height: 230px;margin-left: 10px;padding: 0;line-height: 16px;'></div>",
    //         "</div>",
    //         "<div id='s_jiaotong' style='display: none;'>",
    //             "<div style='height: 47px;'>",
    //                 "<div style='float: left;width:82px;font-size: 13px;font-weight: bold; '>交通咨询：</div>",
    //                 "<div id='s_jt_zx' style='float: left;overflow-y: auto;padding: 4px 0; width: 370px'></div>",
    //             "</div>",
    //             "<div style='height: 47px;'>",
    //                 "<div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>旅游专线：</div>",
    //                 "<div id='s_jt_ly' style='float: left;overflow-y: auto;padding: 4px 0; width: 370px;height: 47px'></div>",
    //             "</div>",
    //             "<div style='height: 47px;'>",
    //                 "<div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>自驾指南：</div>",
    //                 "<div id='s_jt_zj' style='float: left;overflow-y: auto;padding: 4px 0;width: 370px;height: 47px'></div>",
    //             "</div>",
    //             "<div style='height: 27px;'>",
    //                 "<div style='float: left;width:92px;font-size: 13px;font-weight: bold;'>停车场信息：</div>",
    //                 "<div id='s_jt_tc' style='float: left;overflow-y: auto;padding: 4px 0;width: 358px;height: 47px'></div>",
    //             "</div>",
    //             "<div style='height: 27px;'>",
    //                 "<div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>加油站：</div>",
    //                 "<div id='s_jt_jy' style='float:left;overflow-y: auto;width: 350px'></div>",
    //             "</div>",
    //         "</div>",
    //         "<div id='s_fuwu' style='display:none;line-height: 20px'>",
    //             "<div style='height: 36px;'>",
    //                 "<div style='float: left;width:102px;font-size: 13px;font-weight: bold;'>景区旅游项目：</div>",
    //                 "<div id='s_fw_xm' style='float: left;overflow-y: auto; width: 345px;height: 36px'></div>",
    //             "</div>",
    //             "<div style='height: 36px;'>",
    //                 "<div style='float: left;width:102px;font-size: 13px;font-weight: bold;'>讲解员价格：</div>",
    //                 "<div id='s_fw_jj' style='float: left;overflow-y: auto;width: 350px;height:36px'></div>",
    //             "</div>",
    //             "<div style='height: 47px;'>",
    //                 "<div style='float: left;width:102px;font-size: 13px;font-weight: bold;'>配套服务设施：</div>",
    //                 "<div id='s_fw_pt' style='float: left;overflow-y: auto;width: 345px;height: 47px'></div>",
    //             "</div>",
    //             "<div style='height: 47px;'>",
    //                 "<div style='float: left;width:102px;font-size: 13px;font-weight: bold;'>常设旅游活动：</div>",
    //                 "<div id='s_fw_hd' style='float: left;overflow-y:uto;width: 350px;height: 47px;'></div>",
    //             "</div>",
    //             "<div style='height: 27px;'>",
    //                 "<div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>适合人群：</div>",
    //                 "<div id='s_fw_rq' style='float: left;overflow-y: auto;width: 350px;height: 27px;'></div>",
    //             "</div>",
    //             "<div style='height: 27px;'>",
    //                 "<div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>可看度：</div>",
    //                 "<div id='s_fw_kk' style='float: left;overflow-y: auto;width: 350px;height: 27px;'></div>",
    //             "</div>",
    //             "<div style='height: 27px;'>",
    //                 "<div style='float: left;width:82px;font-size: 13px;font-weight: bold;'>刺激度：</div>",
    //                 "<div id='s_fw_cj' style='float: left;overflow-y: auto;width: 350px;height: 27px;'></div>",
    //             "</div>",
    //         "</div>",
    //     "</div>",

    //     "<ul>",
    //     "<li id = 'tabs-li1'><a href='#tabs1' class='selected'><img src='images/blank.gif'/>到这里去    </a></li>",
    //     "<li id = 'tabs-li2'><a href='#tabs2' ><img src='images/blank.gif'/>从这里出发    </a></li>",
    //     "<li id = 'tabs-li3'><a href='#tabs3' ><img src='images/blank.gif'/>周边搜索    </a></li>",
    //     "</ul>",
    // "</div>"].join("");

    var sdmap = null, curLvl, widgetLayer = null, inited = false, dataCache = [];

    function dataQuery() {

        if (dataCache.length > 0) {
            drawElem();
            return;
        }
        $.ajax({
            type: "GET",
            url: targetUrl + "/GetHotScenics?scale=2000",
            datatype: "xml",
            success: function (result) {
                analysisData(result);
            },
            error: function (a, b) {
                if (console.log) {
                    console.log("旅游数据请求" + b);
                }
            }
        });
    };

    function analysisData(result) {
        if (result) {
            //{"id":"ff8080813237d10e013241f431af057f","name":"惠民武圣园","x":117.49242595,"y":37.49600531,"scale":100000},{"id":"6924","name":"鄄城孙膑旅游城 亿城寺景区","x":115.71413225,"y":35.63884033,"scale":414059}
            var i, n;
            var dat = result.documentElement.textContent || result.documentElement.text;
            dat = eval(dat);
            var v1 = [], v2 = [], v3 = [];
            for (i = 0, n = dat.length; i < n; i++) {
                if (dat[i].scale == "100000") {
                    v1.push(dat[i]);
                } else if (dat[i].scale == "414059") {
                    v2.push(dat[i]);
                } else {//9999999
                    v3.push(dat[i]);
                }
            }
            dataCache = [v1, v2, v3];
            drawElem();
        }
    };
    function drawElem() {

        var i, n, vArr = [], fArr = [];
        if (sdmap.map.getScale() <= 100000) {
            vArr = dataCache[0].concat(dataCache[1]).concat(dataCache[2]);
            curLvl = 3;
        } else if (sdmap.map.getScale() <= 414059) {
            vArr = dataCache[1].concat(dataCache[2]);
            curLvl = 2;
        } else if (sdmap.map.getScale() <= 9999999) {
            vArr = dataCache[2];
            curLvl = 1;
        }
        for (i = 0, n = vArr.length; i < n; i++) {
            var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(vArr[i].x, vArr[i].y));
            var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
            style.externalGraphic = picurl + "/thumbnail/" + vArr[i].id + ".jpg";
            style.graphicWidth = 80;
            style.graphicHeight = 53;
            style.fillOpacity = 1;
            style.cursor = "pointer";
            feature.style = style;
            feature.attributes = vArr[i];
            fArr.push(feature);
        }
        widgetLayer.removeAllFeatures();
        widgetLayer.addFeatures(fArr);
    };
    function onSelect(feature) {

        if (sdmap.widgetPop != null) {
            sdmap.removePopup(sdmap.widgetPop);
            popEle = $("#ssss_conn");
        } else {

        }

        if (typeof template == "string")
            template = $(template);

        var popEle = template;
        var result = $.ajax({
            //  type: "GET",
            url: targetUrl + "/GetScenicInfo?scenicId=" + feature.attributes.id,
            datatype: "xml",
            async: false
        });
        //$.ajax({ url: targetUrl + sUrl + "?pac=" + feature.attributes.pac + "&year=2013", dataType: 'xml', async: false });
        result = result.responseText;
        result = result.substring(76, result.length - 9);
        var dat = eval("(" + result + ")");


        var i, elms = [], temp, f = false, fidx;
        popEle.find("#s_title_cont").text(dat.nameCn); //tile
        var pics = dat.pictures;



        for (i = 0; i < pics.length; i++) {
            if (pics[i].phoFormat == "图片") {
                elms.push("<li><img width='32'height='32'src='" + picurl + pics[i].phoPath + "'/></li>");
                if (!f) {
                    popEle.find("#s_reppic img").attr("src", picurl + pics[i].phoPath); //img
                    f = true;
                }
            } else if (pics[i].phoFormat == "视频") {
                fidx = i;
            }
        }
        popEle.find("#s_gallery .imglist").empty().append(elms.join("")); //<li> imgs
        var a = dat.scenicLevel.length - 1;
        for (i = 0, elms = []; i < a; i++) {
            elms.push("<img src='images/scenic/bookmark.png'/>");
        }
        popEle.find("#s_jian_tj").empty().append(elms.join("")); //imgs
        popEle.find("#s_jian_jb").attr("title", dat.scenicLevel).text(dat.scenicLevel); //AAAAA级
        popEle.find("#s_jian_lx").attr("title", dat.scenicTypes).text(dat.scenicTypes);
        popEle.find("#s_jian_mp").text(dat.scenicPrices[0].priceType + dat.scenicPrices[0].price);
        temp = dat.contacts;
        for (i = 0, elms = []; i < temp.length; i++) {
            elms.push(temp[i].BusType + temp[i].contactType + ":" + temp[i].contact);
        }
        temp = elms.join(",");
        popEle.find("#s_jian_lianx").attr("title", temp).text(temp);
        if (dat.comWebsite != '')
            popEle.find("#s_jian_url").attr("href", dat.comWebsite);
        popEle.find("#s_jian_addr").text(dat.address);
        temp = dat.bestSeasons;
        // popEle.find("#s_jian_bst").text(temp.startMonth + temp.startTenDays + "至" + temp.endMonth + temp.endTenDays);
        popEle.find("#s_jian_bst").text("");

        // if(pics[pics.length-1].phoFormat=='视频')
        if (fidx != null)
            popEle.find("#s_video embed").attr("flashvars", "vcastr_file=" + picurl + pics[fidx].phoPath + "&IsAutoPlay=0");
        popEle.find("#s_xq_cont").text(dat.attdesM);

        popEle.find("#s_jt_zx").text(dat.trafficInf);
        popEle.find("#s_jt_ly").text(dat.busInf);
        popEle.find("#s_jt_zj").text(dat.selfDrInf);
        popEle.find("#s_jt_tc").text(dat.suppSerFac);
        if (dat.ifGasstation == "1")
            popEle.find("#s_jt_jy").text(dat.gasStationName + "距离" + dat.nameCn + "约" + dat.disGasStation + "公里");

        //fuw
        //  if()
        popEle.find("#s_fw_xm").text("无信息");
        popEle.find("#s_fw_jj").text(dat.exposterPrice);
        popEle.find("#s_fw_pt").text(dat.suppSerFac);

        popEle.find("#s_fw_hd").text("无信息");
        popEle.find("#s_fw_rq").text(dat.adaptGroups);
        popEle.find("#s_fw_kk").text(dat.viewdegree);
        popEle.find("#s_fw_cj").text(dat.incitement);


        //  }
        // selectedFeature = feature;
        var sz = new OpenLayers.Size(486, 285);
        sdmap.widgetPop = new OpenLayers.Popup.FramedCloud("chicken",
        		feature.geometry.getBounds().getCenterLonLat(),
                sz, popEle.html(),
			null, false);
        feature.popup = sdmap.widgetPop;
        sdmap.addPopup(sdmap.widgetPop);

        $("#close_popup").click(function () {
            sdmap.removePopup(sdmap.widgetPop);

            sdmap.unSelect();

        });

        $("#s_gallery").xslider({
            unitdisplayed: 4,
            movelength: 1,
            unitlen: 33
            //                ,
            //                autoscroll: 3000
        });

        $("#s_title :button").click(function (e) {

            var _this = $(this);
            // _this.css("display", "block").siblings().css("display", "none");
            var idx = _this.index();
            _this.css("color", "blue").siblings().css("color", "black");
            $("#s_content>div:eq(" + idx + ")").css("display", "block").siblings().css("display", "none");
        });
        $("#s_gallery .imglist_w li").click(function () {
            var _this = $(this);
            _this.css("border", "solid 2px blueviolet").siblings().css("border", "solid 1px #ddd");
            var src = _this.children().attr("src");
            $("#s_reppic img").attr("src", src);
        });

    };

    function mapZoomed() {

        console.log("ScenicWidget zoomed");
        var tag = false;
        if (sdmap.map.getScale() < 100000) {
            if (curLvl != 3)
                tag = true;

        } else if (sdmap.map.getScale() < 414059) {
            if (curLvl != 2)
                tag = true;

        } else if (sdmap.map.getScale() <= 9999999) {
            if (curLvl != 1)
                tag = true;
        }
        if (tag)
            drawElem();
    };
    return {
        init: function (renderer, styleMap, map) {

            widgetLayer = new OpenLayers.Layer.Vector("景点", {
                style: styleMap,
                renderers: renderer
            });
            sdmap = map;
            sdmap.addLayer(widgetLayer, true);
            widgetLayer.events.on({
                "featureselected": function (evt) {
                    onSelect(evt.feature);
                }
            });
            inited = true;
        },
        Show: function () {
            if (inited) {
                //                widgetLayer.setVisibility(true);
                //            else {
                dataQuery();
                sdmap.map.events.register("zoomend", sdmap.map, mapZoomed);
            }
        },
        Hide: function () {
            widgetLayer.setVisibility(false);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);

        },
        Dispose: function () {

            sdmap.removeLayer(widgetLayer, true);
            if (sdmap.widgetPop != null)
                sdmap.removePopup(sdmap.widgetPop);
            inited = false;
            sdmap.map.events.unregister("zoomend", sdmap.map, mapZoomed);
            widgetLayer = null;
            dataCache = [];
        },
        isInit: function () { return inited; }
    };
}

var WidgetManger = function () {
    var widgets //矢量标记图层样式
    , styleMap, //实例化矢量标记图层
   renderer, sdmap, inited = false, widgetstr;
    var Tdic = new Array(); Tdic["rain"] = "r_river"; Tdic["population"] = "popu_rkzs";
    Tdic["economy"] = "eco_gdp";
    function wgConfig() {
        widgets = { weather: new WeatherWidget(), seastate: new SeaStateWidget(), enviroment: new EnvironmentWidget()
    //         ,szjc: new SZJCWidget()
        };
        styleMap = new OpenLayers.StyleMap({
            fillOpacity: 1,
            pointRadius: 3
        });
        renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    }
    function init(smap) {
        if (inited) return;
        sdmap = smap;
        // widgetstr = ["<div id='Rw_top_back'><div id='Rw_top_img'></div><span id='Top_label'/></div>",
        // "<ul id='Rwidget_ul'>",
        //     "    <li id='weather' class='rightBtn'><div></div>天气</li>",
        //     "    <li id='road' class='rightBtn'><div></div>路况",
        //     "    </li>",
        //     "    <li id='enviroment' class='rightBtn'><div></div>环境</li>",
        //     "    <li id='water' class='rightBtn'><div></div>水质</li>",
        //     "    <li id='rain' class='rightBtn'><div></div>水情",
        //     "        <ul class = 'rightBtnUl' style=' width: 65px;top:150px;'>",
        //     "            <li id='r_river' class = 'rightBtnList selitem'>河道站</li>",
        //     "            <li id='r_resp' class = 'rightBtnList'>水库站</li>",
        //     "        </ul>",
        //     "    </li>",
        //     "    <li id = 'scenic' class = 'rightBtn'><div></div>景点</li>",
        //     "    <li id='video' class='rightBtn'><div></div>视频</li>",
        //     "    <li id='population' class='rightBtn' ><div></div>人口",
        //     "        <ul class = 'rightBtnUl' style=' width: 86px;top:249px;'>",
        //     "            <li id='popu_rkzs' class = 'rightBtnList selitem'>人口数量</li>",
        //     "            <li id='popu_rkmd' class = 'rightBtnList'>人口密度</li>",
        //     "        </ul>",
        //     "    </li>",
        //     "    <li id = 'economy' class = 'rightBtn' ><div></div>经济",
        //     "        <ul class = 'rightBtnUl' style=' width: 100px;top:282px;'>",
        //     "            <li id = 'eco_gdp' class = 'rightBtnList selitem'>GDP</li>",
        //     "            <li id = 'eco_czsr' class = 'rightBtnList'>财政收入</li>",
        //     "            <li id = 'eco_bqx' class = 'rightBtnList'>全国百强县</li>",
        //     "        </ul>",
        //     "    </li>",
        //     "</ul>"].join("");
        widgetstr = ["<ul id='Rwidget_ul' class='submenu'>",
            "    <li id='weather' class='rightBtn'><div></div>天气</li>",
            "    <li id='seastate' class='rightBtn'><div></div>海况</li>",
            "    <li id='taifeng' class='rightBtn'><div></div>台风</li>",
   //         "    <li id='szjc' class='rightBtn'><div></div>水质</li>",
            "    <li id='enviroment' class='rightBtn'><div></div>空气</li>",
            "</ul>"].join("");
        //$("#rightWidgetDiv").append(widgetstr);
        $("#d_gzfw").length > 0 && $("#d_gzfw").append(widgetstr);
        $('.rightBtn').click(function () {
            var _this = $(this);
            var T_img = _this.children("div");
            if (_this.hasClass("active")) {
                T_img.removeClass("active");
                _this.removeClass("active");
                _this.children("ul").css({ "display": "none" });
                if (_this.attr("id") == "taifeng") {
                    TaiFeng.close();
                }
                else {
                    //关闭图层
                    closeWidget(_this.attr("id"));
                }
            }
            else {
                T_img.addClass("active");
                _this.addClass("active");
                _this.children("ul").css({ "display": "block" });
                if (_this.attr("id") == "taifeng") {
                    TaiFeng.open();
                }
                else {
                    //打开图层
                    openWidget(_this.attr("id"));
                }
            }
        });
        // $("#Rw_top_back").click(function (e) {
        //     var Cur = $('#Rw_top_img');
        //     var Target = $('#Rwidget_ul');
        //     var _this = $(this);
        //     var L = $('#Top_label');
        //     if (Cur.hasClass("hide")) {
        //         _this.removeClass("hide");
        //         Target.show(500);
        //         Cur.removeClass("hide");
        //         L.html("");
        //     }
        //     else {
        //         Target.hide(500, doAfHide);

        //     }
        // });
        // function doAfHide() {
        //     var Cur = $('#Rw_top_img');
        //     var L = $('#Top_label');
        //     $("#Rw_top_back").addClass("hide");
        //     Cur.addClass("hide");
        //     L.html("共享信息");
        // }
        $(".rightBtnList").click(function (e) {
            var _this = $(this);
            var id, pid;
            id = _this.parents(".rightBtn").attr("id");
            if (e.target.tagName == "LI") {
                pid = _this.attr("id");
                //判断是否包含checkbox
                if (_this.children(":checkbox").length > 0) {
                    if (_this.children(":checkbox")[0].checked) {
                        _this.children(":checkbox")[0].checked = false;
                    } else {
                        _this.children(":checkbox")[0].checked = true;
                    }
                    openWidget(id, pid);
                } else {//LI
                    _this.addClass("selitem").siblings().removeClass("selitem");
                    openWidget(id, pid);
                }
            } else if (e.target.tagName == "INPUT") {
                pid = _this.attr("id");
                openWidget(id, pid);
            }
            Tdic[id] = pid;
            e.stopImmediatePropagation();
        });

        //子菜单
        $('.rightBtn').mouseenter(function (e) {
            var _this = $(this);
            if (_this.hasClass("active")) {
                _this.children("ul").css("display", "block");
            }
            else {

            }
        });
        $('.rightBtn').mouseleave(function (e) {
            var _this = $(this);
            _this.children("ul").css("display", "none");
        });
        wgConfig();
        inited = true;
    }
    function openWidget(id, sub) {
        if (!widgets[id]) return;
        !widgets[id].isInit() && widgets[id].init(renderer, styleMap, sdmap);
        if (!sub) { widgets[id].Show(Tdic[id]); }
        else { widgets[id].Show(sub); };
    }
    function closeWidget(id) {
        if (!widgets[id]) return;
        widgets[id].Dispose();
    }

    function resetAll() {
        for (var id in widgets) {
            if (widgets[id] && widgets[id].isInit())
                widgets[id].Dispose();
        }
        $('.rightBtn.active').each(function (idx, e) {
            $(e).removeClass("active").children().removeClass("active");
        });
    }
    return {
        init: init,
        reset: resetAll
    };
} ();
 