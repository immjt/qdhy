 

var Plotting = function () {
    //点线面 的弹出框比较类似 放到PoiInfoPop中，label的弹出框太简单，内部管理
    var plotCtl = [], curCtl = 0, plotLayer, inited = false, tempStyle/*保存前临时样式*/, curStyle/*动态变化，具有当前记忆功能*/,
   toolui, sdmap, curFea, textPop, title, //mark_tool_div_title
    markbar, popeditContent, icons, lineStylehtml, textStylehtml, polygonStylehtml, plotArr = [], listArr = [];
    function constructUi() {
        toolui = "<li class='toolbagClass' id='btnMarkDiv'><span class='btnToolbar-cont1'><span class='btnToolbar-img' style='background-position: -40px 0;top:4px;width:20px;'></span>标绘</span></li>";
        title = '<span style="position: absolute;right: 0;"><img id="mark_close" src="images/blank.gif" title="关闭"><img id="mark_List" src="images/blank.gif" title="标绘记录"><img id="mark_spin" src="images/blank.gif" title="标绘"></span>';
        markbar = [
            "<div id = 'mark_tool_div'title='地图标绘' onselectstart='return false' style='-moz-user-select:none;display:none'>",
            "	<div class='marktool'><ul>",
            "		<li class = 'markClas' style = 'background:url(images/ToolBar/tool_markpointer.png) no-repeat center'></li>",
            "		<li class = 'markClas' style = 'background:url(images/ToolBar/tool_markline.png) no-repeat center'></li>",
            "		<li class = 'markClas' style = 'background:url(images/ToolBar/tool_markpolygon.png) no-repeat center'></li>",
            "       <li class = 'markClas' style = 'background:url(images/ToolBar/tool_marktext.png) no-repeat center'></li>",
            "	</ul></div>",
            "	<div class='marklist' style='display:none;' >",
            '<div style="padding: 5px 5px 10px 5px;border-bottom: 1px dotted blue;margin-bottom: 8px;"><input style="width:100px;"  id="mark_qurytitle"> <input type="button" class="markBtn" style="width:45px" value="查询" id="mark_qurybtn"> <input type="button" style="width: 55px;color:gray" class="markBtn" value="下载shp" id="mark_download"></div>',
            "<div id='mark_result'style='display:none'><input id='mark_selectall' style='vertical-align:middle;margin: 0 4px;' type='checkbox'>查询结果 (共<span id='mark_count'>10</span>条)<input type='button' style='width: 65px;height:21px;margin-left:60px' class='markBtn' value='清除结果'id='mark_quryclear'/><ul id='mark_quryList' >",
            "</ul></div></div>",
            "</div>"].join("");
        lineStylehtml = ["<div class='stylediv line' style='position: relative;'>",
"       <div>线颜色:<span class='colorBtn'/></div>",
"       <div>线样式:<div  style='position:relative;width:60px;height:24px;display:inline-block;'>",
"           <div class='dropdown' val='solid'>",
"               <p ><img src='images/linestyle/solid.png'></p>",
"               <ul>",
"                   <li ><img val='solid' src='images/linestyle/solid.png'></li>",
"                   <li ><img val='dash' src='images/linestyle/dash.png'></li>",
"                   <li ><img val='dot' src='images/linestyle/dot.png'></li>",
"                   <li ><img val='dashdot' src='images/linestyle/dashdot.png'></li>",
"                   <li ><img val='longdashdot' src='images/linestyle/longdashdot.png'></li>",
"               </ul>",
"           </div>",
"       </div>",
"   </div>",
"   <div>线宽:<input class='spinner wh lwidth'  value='2' /></div><div>透明度:<input class='spinner trans ltrans' value='1' /></div>",
"</div>"].join("");
        textStylehtml = [" <div  class='stylediv text' style='position: relative;'>",
"       <div>文字位置:<select class='tpos'><option>middle</option><option>top</option><option>bottom</option></select></div>",
"       <div>文字颜色:<span class='colorBtn'/></div>",
"       <div>x轴偏移:<input class='spinner unlimit xoff'  value='0' /></div>",
"       <div>y轴偏移:<input class='spinner unlimit yoff'  value='0' /></div>",
"       <div>字体:<select style='max-width:100px' class='tfam'>",
"           <option>宋体</option>",
"           <option>微软雅黑</option>",
"           <option>楷体</option>",
"           <option>仿宋</option>",
"           <option>Algerian</option>",
"           <option>Arial</option>",
"           <option>Broadway</option>",
"           <option>ComicSansMS</option>",
"           <option>Courier</option>",
"           <option>Verdana</option>",
"           <option>TimesNewRoman</option>",
"       </select>",
"   </div>",
"   <div>大小:<select class='tsize'>",
"       <option>8</option>",
"       <option>10</option>",
"       <option>12</option>",
"       <option>14</option>",
"       <option>16</option>",
"       <option>18</option>",
"       <option>20</option>",
"   </select>",
"</div>",
"   <div><input class='tbord' type='checkbox'/>使用边框",
"       <span class='colorBtn'/></div>",
"       <div><input class='txie' type='checkbox'/>斜体</div>",
"       <div><input class='tchu' type='checkbox'/>加粗</div>",
"   </div>"].join("");
        polygonStylehtml = ["<div class='stylediv polygon' style='position: relative'>",
"           <div>线颜色:<span class='colorBtn'/></div>" +
    "<div>线样式:<div style='position:relative;width:60px;height:24px;display:inline-block;'>",
"           <div class='dropdown' val='solid'>",
"               <p><img src='images/linestyle/solid.png'></p>",
"               <ul>",
"                   <li ><img val='solid' src='images/linestyle/solid.png'></li>",
"                   <li ><img val='dash' src='images/linestyle/dash.png'></li>",
"                   <li ><img val='dot' src='images/linestyle/dot.png'></li>",
"                   <li ><img val='dashdot' src='images/linestyle/dashdot.png'></li>",
"                   <li ><img val='longdashdot' src='images/linestyle/longdashdot.png'></li>",
"               </ul>",
"           </div>",
"       </div>",
"   </div>",
"   <div>线宽:<input class='spinner wh lwidth'  value='2' /></div><div>透明度:<input class='spinner trans ltrans' value='1' /></div>",
"   <div>填充颜色:<span class='colorBtn'/></div><div>填充透明度:<input class='spinner trans ftrans'  value='1' /></div>",
"</div>"].join("");
        popeditContent = "<div><span>名称:</span><input type='text' style='width:245px' id='pointmark_name'></div>" +
    "<div style='margin-top:10px;'><span style='float:left;'>备注:</span><textarea id='pointmark_desc'></textarea></div>" +
    "<div id='style_panel'></div>" +
    "<div style='height:25px;margin-top:10px;margin-left:80px;width:280px;' id='popup1BtnDiv'><div id='pointmark_save'>保  存</div><div id='pointmark_delete' style='margin-left:10px;'>删  除</div></div>",
    icons = ['point0', 'point1', 'point2', 'point3', 'point4', 'point5', 'point6', 'point7', 'point8', 'point9', 'point10', 'point11', 'point12', 'point13', 'point14', 'point15', 'point16', 'point17', 'point18', 'point19', 'point20'];
    }
    function iconStylehtml() {
        var html = ["<div id='pointmark_imgdiv'><ul id='ulPoint'>"], i,
        iconpath = "images/mark2/";
        for (i = 0; i < icons.length; i++)
            html.push("<li><img src='" + iconpath + icons[i] + ".png' class='sp_12'></li>");
        html.push("</ul><div id='pointImgRtn' class='toolbtn' style='position:relative;margin:auto;display:block;'  >返回</div>");
        return html.join("");
    }

    function init(tdiv, map) {

        if (inited) return;
        constructUi();
        typeof tdiv == "object" ? $(tdiv).append(toolui) : $("#" + tdiv).append(toolui);
        sdmap = map;
        $(sdmap.map.div).after(markbar);

        $('#mark_tool_div').dialog({ autoOpen: false, resizable: false, position: [$(window).width()*0.5+85, 32], width: "auto", maxHeight: "300px", minHeight: "inherit", minWidth: "inherit" });
        $('#mark_tool_div').css("min-height", "inherit");
        $(".ui-dialog").css({ "z-index": "1000", width: 'auto', "font-size": "12px", "border": "1px solid #25abf3"});
        $(".ui-dialog-title").after(title);
        $(".ui-dialog .ui-dialog-titlebar ").css({ "color": "#4d4d4d", "font-weight": "700", "padding": "0 2px", "font-size": "14px",
            "background": "url(Openlayers/theme/default/img/cloud-popup-relative.png) no-repeat -2px -1px","border":"none"
        });
      
        $(".ui-dialog-titlebar-close ").hide();

        var styleMap = new OpenLayers.StyleMap({
            'default': {
                pointRadius: 24,
                fillOpacity: 1,
                graphicWidth: 24,
                graphicHeight: 24,
                graphicYOffset: -22,
                externalGraphic: "images/mark2/point7.png",
                graphicZIndex: 100,
                fillColor: "blue",
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "red",
                fontColor: "blue",
                cursor: "pointer"
            }
        });
        curStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        plotLayer = new OpenLayers.Layer.Vector('plotLayer', {
            style: styleMap
        });
        sdmap.addLayer(plotLayer, true);
        plotCtl = [new OpenLayers.Control.DrawFeature(plotLayer,
        OpenLayers.Handler.Point, {
            handlerOptions: {
                layerOptions: {
                    renderers: undefined,
                    styleMap: styleMap
                }
            },
            featureAdded: drawPointCompleted
        }),
    new OpenLayers.Control.DrawFeature(plotLayer,
        OpenLayers.Handler.Path, {
            handlerOptions: {
                layerOptions: {
                    renderers: undefined,
                    styleMap: styleMap
                }
            },
            featureAdded: drawLineCompleted
        }),
    new OpenLayers.Control.DrawFeature(plotLayer,
        OpenLayers.Handler.Polygon, {
            handlerOptions: {
                layerOptions: {
                    renderers: undefined,
                    styleMap: styleMap
                }
            },
            featureAdded: drawPolygonCompleted
        }),
    new OpenLayers.Control.DrawFeature(plotLayer,
        OpenLayers.Handler.Point, {
            handlerOptions: {
                layerOptions: {
                    renderers: undefined,
                    styleMap: styleMap
                }
            },
            featureAdded: drawTextCompleted
        })
    ];
        sdmap.map.addControls(plotCtl);
        plotLayer.events.on({
            "featureselected": onFeatureSelectedListener
        });

        //启动标绘
        $('#btnMarkDiv').click(function (e) {

            $('#toolbag_div').css("display", "none");
            $('#mark_tool_div').css("display", "block").find(".markClas:eq(0)").addClass('active');
            curCtl = 0;
            plotCtl[curCtl].activate();
            $('#mark_tool_div').dialog("open");
            
        });
        // 关闭标绘窗口
        $('#mark_close').on("click", function (e) {

            $('#mark_tool_div .active').removeClass("active");
            $("#mark_tool_div>.marktool").show();
            $("#mark_tool_div>.marklist").hide();

            $('#mark_tool_div').dialog("close");
            plotLayer.removeAllFeatures();
            plotCtl[curCtl].deactivate();
            if (markers) { markers.removeAllFeatures(); }
        });
        $("#mark_List").on("click", function () {
            plotCtl[curCtl].deactivate();
            $("#mark_tool_div>.marktool").hide();
            $("#mark_tool_div>.marklist").show();
            $("#mark_tool_div").css({ width: "260px", height: "280px" });
            plotLayer.removeAllFeatures();
            plotLayer.addFeatures(listArr);
        });
        $("#mark_spin").on("click", function () {
            plotCtl[curCtl].activate();
            $("#mark_tool_div").css({ width: "145px", height: "40px" });
            $("#mark_tool_div>.marktool").show();
            $("#mark_tool_div>.marklist").hide();
            plotLayer.removeAllFeatures();
            plotLayer.addFeatures(plotArr);
        });
        // 切换标绘按钮
        $('.markClas').on("click", function () {
            $('.markClas').siblings().removeClass("active");
            plotCtl[curCtl].deactivate();

            curCtl = $(this).index();
            $(this).addClass("active");
            plotCtl[curCtl].activate();
        });

        $("#mark_quryclear").click(function () {
            plotLayer.removeAllFeatures();
            listArr = [];
            $("#mark_download").css({ color: "gray" });
            $("#mark_result").hide();
        });
        $("#mark_qurybtn").click(function () {
            if(!g_userid||g_userid=="0"){
                alert("当前未登录，请登陆后再查询历史标绘信息！")
                return;
            }
            var tt = $("#mark_qurytitle").val();
            $("#mark_download").css({ color: "black" });
            $.ajax({
                url: Service.GETUserPlot,
                data: JSON.stringify({ USERID: g_userid, TITLE: tt }),
                type: "post",
                success: markListhandle,
                error: function () {
                },
                contentType: "application/json; charset=utf-8"
            });
            //            $.ajax({ url: tempUrl, type: "POST", data: { pageIndex: 1, pageSize: 10,
            //                USERID: g_userid, REQUEST: "Plots_Query", TITLE: tt
            //            }, success: function () {
            //                
            //            },error:function() {
            //                
            //            }});


        });
        $("#mark_download").click(function () {
            if ($("#mark_result").css("display") == "none") return;
            var ids = [];

            $("#mark_quryList li :checkbox:checked").each(function () {
                ids.push($(this).parent().attr("id"));
            });
            if (ids.length < 1) alert("当前未选中任何标绘！");

            $.ajax({
                url: Service.DOWNLOAD, type: "post", dataType: "text", data: { userid: g_userid, request: "download", id: ids.join("|") + "|" },
                success: function (d) {
                    if (window.saveFrame && d) {

                        window.saveFrame.location = d;
                        window.imgFrame.document.execCommand("SaveAs");              
                    }
                    return false;
                }, error: function (a, b, c) {
                    var ss = b;
                }
            });
        });

        $("#mark_result #mark_quryList").on("dblclick", "li", function () {
            var id = $(this).attr("id");
            for (var i = 0; i < listArr.length; i++) {
                if (listArr[i].attributes.id == id) {
                    sdmap.map.zoomToExtent(listArr[i].geometry.getBounds());
                    onFeatureSelectedListener({ feature: listArr[i] });
                    return;
                }
            }
        });
        $("#mark_selectall").change(function () {
            if (this.checked) {
                $("#mark_quryList li :checkbox").each(function () {
                    this.checked = true;
                });
            } else {
                $("#mark_quryList li :checkbox").each(function () {
                    this.checked = false;
                });
            }
        });


        //  $("#mark_tool_div")
        inited = true;
    }
    function runSave() {
        if (imgFrame.location != "about:blank") {
            window.imgFrame.document.execCommand("SaveAs");
        }
    }

    function geoCompose(plot) {
        var fea = null;
        var feaStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        var isWKT = plot.GEOMETRY.isWKT;
        var wkt = new OpenLayers.Format.WKT();
        if (plot.STYLE.type == "point") {
            if (isWKT) {
                fea = wkt.read(plot.GEOMETRY.WKT);
            } else {
                fea = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(plot.GEOMETRY.GEOMETRY[0].x, plot.GEOMETRY.GEOMETRY[0].y));
            }
            //   feaStyle.label = plot.TITLE;
            feaStyle.graphicWidth = plot.STYLE.width;
            feaStyle.graphicHeight = plot.STYLE.height;
            feaStyle.externalGraphic = plot.STYLE.image;
        }
        if (plot.STYLE.type == "polyline") {
            if (isWKT) {
                fea = wkt.read(plot.GEOMETRY.WKT);
            } else {
                var points = [];
                for (var i = 0; i < plot.GEOMETRY.GEOMETRY.length; i++) {
                    var point = new OpenLayers.Geometry.Point(plot.GEOMETRY.GEOMETRY[i].x, plot.GEOMETRY.GEOMETRY[i].y);
                    points.push(point);
                }
                fea = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(points));
            }
            //  feaStyle.label = plot.TITLE;
            feaStyle.strokeWidth = plot.STYLE.weight;
            feaStyle.strokeColor = plot.STYLE.color;
            feaStyle.strokeDashstyle = plot.STYLE.style ? plot.STYLE.style : plot.STYLE.dashstyle;
            feaStyle.strokeOpacity = plot.STYLE.alpha ? plot.STYLE.alpha : plot.STYLE.opacity;
        }
        if (plot.STYLE.type == "polygon") {
            if (isWKT) {
                fea = wkt.read(plot.GEOMETRY.WKT);
            } else {
                var points = [];
                for (var i = 0; i < plot.GEOMETRY.GEOMETRY.length; i++) {
                    var point = new OpenLayers.Geometry.Point(plot.GEOMETRY.GEOMETRY[i].x, plot.GEOMETRY.GEOMETRY[i].y);
                    points.push(point);
                }
                var LinearRing = new OpenLayers.Geometry.LinearRing(points);
                fea = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(LinearRing));
            }
            //    feaStyle.label = plot.TITLE;
            feaStyle.strokeWidth = plot.STYLE.weight;
            feaStyle.strokeColor = plot.STYLE.color;
            feaStyle.strokeDashstyle = plot.STYLE.style ? plot.STYLE.style : plot.STYLE.dashstyle;
            feaStyle.strokeOpacity = plot.STYLE.alpha ? plot.STYLE.alpha : plot.STYLE.opacity;

            feaStyle.fillColor = plot.STYLE.fillColor;
            feaStyle.fillOpacity = plot.STYLE.fillAlpha ? plot.STYLE.fillAlpha : plot.STYLE.fillOpacity;
        }
        if (plot.STYLE.type == "label") {
            if (isWKT) {
                fea = wkt.read(plot.GEOMETRY.WKT);
            } else {
                fea = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(plot.GEOMETRY.GEOMETRY[0].x, plot.GEOMETRY.GEOMETRY[0].y));
            }
            feaStyle.label = plot.TITLE;
            feaStyle.labelAlign = plot.STYLE.placement;
            feaStyle.fontColor = plot.STYLE.fontColor;
            feaStyle.labelXOffset = plot.STYLE.xoffset;
            feaStyle.labelYOffset = plot.STYLE.yoffset;
            feaStyle.fontFamily = plot.STYLE.fontFamily;

            feaStyle.fontSize = plot.STYLE.fontSize;
            if (plot.STYLE.border) {
                feaStyle.labelOutlineColor = plot.STYLE.borderColor;
            }
            if (plot.STYLE.italic) {
                feaStyle.fontStyle = "italic";
            }
            if (plot.STYLE.bold) {
                feaStyle.fontWeight = "bold";
            }
        }
        fea.style = feaStyle;
        fea.attributes = { id: plot.ID, remark: plot.MEMO,
            type: plot.STYLE.type == "polyline" ? "line" : (plot.STYLE.type == "label" ? "text" : plot.STYLE.type),
            name: plot.TITLE
        };
        return fea;
    }

    function markListhandle(data) {
        plotLayer.removeAllFeatures();
        var content = [];
        listArr = [];

        if (data.d) {
            if (data.d.length > 0) {

                var ext = new OpenLayers.Bounds(); ;
                for (var i = 0; i < data.d.length; i++) {
                    var plot = data.d[i];
                    content.push('<li id="' + plot.ID + '"><input type="checkbox"><img src="images/mark2/plot_' + plot.STYLE.type + '.png"> ' + plot.TITLE + '</li>');
                    var feature = geoCompose(plot);
                    ext.extend(feature.geometry.getBounds());
                    listArr.push(feature);
                }
                plotLayer.addFeatures(listArr);
                sdmap.map.zoomToExtent(ext);
            }
        }
        $("#mark_result").show();
        $("#mark_result #mark_count").text(listArr.length);
        $("#mark_quryList").empty().append(content.join(""));
    }
    function getCoords(geom) {
        var coods = [], geocomp, i;
        if (geom.CLASS_NAME.match(/(LineString)$/)) {
            geocomp = curFea.geometry.components;
            for (i = 0; i < geocomp.length; i++) {
                coods.push([geocomp[i].x, geocomp[i].y]);
            }

        } else if (geom.CLASS_NAME.match(/(Polygon)$/)) {
            geocomp = curFea.geometry.components[0].components;
            for (i = 0; i < geocomp.length; i++) {
                coods.push([geocomp[i].x, geocomp[i].y]);
            }
        } else {
            coods.push([geom.x, geom.y]);
        }
        return coods.join(",");
    }

    function getAlign(val, t) {
        if (t != null) {

            if (val == "middle") return "cm";
            if (val == "bottom") return "cb";
            if (val == "top") return "ct";
            return "cm";
        } else {
            if (!val) return "middle";
            var c = val.substr(val.length - 1, 1);
            if (c == "b") return "bottom";
            if (c == "m") return "middle";
            if (c == "t") return "top";
            return "middle";
        }
    }

    function 
    saveMark() {
        if (!g_userid||g_userid=="0"){ 
        alert("亲，用户登陆后才能够保存哦！请登陆后再试试！");
            return
        };
        var para, i;
        //{ id, userid,geometry,memo,title,style}
        var style = curFea.style;
        var attri = curFea.attributes;
        switch (attri.type) {
            case "point":
                {
                    //{type : "point",width : 16,height : 16,image : "Images/PlotImages/plotIcons/plotIcon7.png"}
                    if (attri.id)
                        para = {
                            ID: attri.id,
                            TITLE: attri.name,
                            OP: "UpdateUserPlot",
                            STYLE: JSON.stringify({ type: "point", width: style.graphicWidth, height: style.graphicHeight, image: style.externalGraphic }),
                            GEOMETRY: curFea.geometry.x + "," + curFea.geometry.y,
                            MEMO: attri.remark,
                            USERID: g_userid
                        };
                    else
                        para = {
                            TITLE: curFea.attributes.name,
                            OP: "AddUserPlot",
                            STYLE: JSON.stringify({ type: "point", width: style.graphicWidth, height: style.graphicHeight, image: style.externalGraphic }),
                            GEOMETRY: curFea.geometry.x + "," + curFea.geometry.y,
                            MEMO: attri.remark,
                            USERID: g_userid
                        };
                }
                break;
            case "line":
                {
                    if (attri.id)
                        para = {
                            ID: attri.id,
                            TITLE: attri.name,
                            OP: "UpdateUserPlot",
                            STYLE: JSON.stringify({
                                type: "polyline",
                                alpha: style.strokeOpacity,
                                color: style.strokeColor,
                                weight: style.strokeWidth,
                                style: style.strokeDashstyle
                            }),
                            GEOMETRY: getCoords(curFea.geometry),
                            MEMO: attri.remark,
                            USERID: g_userid
                        };
                    else
                        para = {
                            TITLE: attri.name,
                            OP: "AddUserPlot",
                            STYLE: JSON.stringify({
                                type: "polyline",
                                alpha: style.strokeOpacity,
                                color: style.strokeColor,
                                weight: style.strokeWidth,
                                style: style.strokeDashstyle
                            }),
                            GEOMETRY: getCoords(curFea.geometry),
                            MEMO: attri.remark,
                            USERID: g_userid
                        };


                    //                    var len = curFea.geometry.getGeodesicLength(sdmap.map.getProjectionObject()), unit = "米";
                    //                    if (len > 1000) {
                    //                        len = (len / 1000.0).toFixed(3);
                    //                        unit = "千米";
                    //                    }

                    //                    curFea.attributes = { remark: dat.remark, name: dat.name, type: "line",
                    //                        len: "总长:" + len + " " + unit
                    //                    };
                    //                    var linegeo = [];
                    //                    var geocomp = curFea.geometry.components;
                    //                    for (i = 0; i < geocomp.length; i++) {
                    //                        linegeo.push(geocomp[i].x + "," + geocomp[i].y);
                    //                    }
                    //                    para = {
                    //                        TITLE: dat.name,
                    //                        REQUEST: "Plots_Add",
                    //                        STYLE: null,
                    //                        GEOMETRY: linegeo.join(""),
                    //                        MEMO: dat.remark,
                    //                        USERID: "PT201307206072"
                    //                    };
                }
                break;
            case "polygon":
                {
                    if (attri.id)
                        para = {
                            ID: attri.id,
                            TITLE: attri.name,
                            OP: "UpdateUserPlot",
                            STYLE: JSON.stringify({
                                type: "polygon",
                                alpha: style.strokeOpacity,
                                color: style.strokeColor,
                                weight: style.strokeWidth,
                                style: style.strokeDashstyle,
                                fillColor: style.fillColor,
                                fillAlpha: style.fillOpacity
                            }),
                            GEOMETRY: getCoords(curFea.geometry),
                            MEMO: attri.remark,
                            USERID: g_userid
                        };
                    else
                        para = {
                            TITLE: attri.name,
                            OP: "AddUserPlot",
                            STYLE: JSON.stringify({
                                type: "polygon",
                                alpha: style.strokeOpacity,
                                color: style.strokeColor,
                                weight: style.strokeWidth,
                                style: style.strokeDashstyle,
                                fillColor: style.fillColor,
                                fillAlpha: style.fillOpacity
                            }),
                            GEOMETRY: getCoords(curFea.geometry),
                            MEMO: attri.remark,
                            USERID: g_userid
                        };
                }
                break;
            case "text":
                {
                    if (attri.id)
                        para = {
                            ID: attri.id,
                            TITLE: attri.name,
                            OP: "UpdateUserPlot",
                            STYLE: JSON.stringify({
                                type: "label",
                                fontFamily: style.fontFamily,
                                fontSize: style.fontSize,

                                fontColor: style.fontColor,
                                xoffset: style.labelXOffset,
                                yoffset: style.labelYOffset,
                                bold: style.fontWeight,
                                italic: style.fontStyle,
                                color: style.strokeColor,
                                borderColor: style.labelOutlineColor,
                                placement: getAlign(style.labelAlign),
                                border: true
                            }),
                            GEOMETRY: getCoords(curFea.geometry),
                            MEMO: attri.remark,
                            USERID: g_userid
                        };
                    else
                        para = {
                            TITLE: attri.name,
                            OP: "AddUserPlot",
                            STYLE: JSON.stringify({
                                type: "label",
                                fontFamily: style.fontFamily,
                                fontSize: style.fontSize,

                                fontColor: style.fontColor,
                                xoffset: style.labelXOffset,
                                yoffset: style.labelYOffset,
                                bold: style.fontWeight,
                                italic: style.fontStyle,
                                color: style.strokeColor,
                                borderColor: style.labelOutlineColor,
                                placement: getAlign(style.labelAlign),
                                border: true
                            }),
                            GEOMETRY: getCoords(curFea.geometry),
                            MEMO: attri.remark,
                            USERID: g_userid
                        };
                }
                break;
        }

        //alert(para);
        // return;
        $.ajax({
            type: "POST",
            url: Service.UserPlot,
            data: para,
            success: function (result, status) {
                if (result == "" || result == null) {
                    alert("保存失败！请重新保存");
                } else {
                    if (!curFea.attributes.id)
                        curFea.attributes.id = result;
                    alert("保存成功");
                    //更
                }
            },
            error: function (message, err, excep) {
                alert(err);
            }
        });


    }

    function delMark() {
        if(!confirm("删除后不可恢复，确定要删除吗？"))return;

        if (!!curFea.attributes.id) {
            $.ajax({
                type: "POST",
                url: Service.UserPlot,
                data: { OP: "DeleteUserPlot", ID: curFea.attributes.id },
                success: function (result, status) {
                    if (result == "" || result == null) {
                        alert("删除失败！");
                    } else {
                        alert("删除成功");
                    }
                },
                error: function (message, err, excep) {
                    alert(err);
                }
            });
        }

        plotLayer.removeFeatures([curFea]);
        if ($("#mark_List").css("display") != "none") {
            listArr = plotLayer.features;
            $("#mark_quryList li[id='" + curFea.attributes.id + "']").remove();
        } else
            plotArr = plotLayer.features; //懒得查找
        PoiInfoPop.close();
    }
    function onFeatureSelectedListener(e) {
        curFea = e.feature;
        curStyle = OpenLayers.Util.extend({}, curFea.style);

        var attr = curFea.attributes;
        var otherinfo = "";
        if (attr.type == "line") {
            var len = curFea.geometry.components.length - 1;
            PoiInfoPop.show("plotinfo", curFea.geometry.components[len], { type: "line" });
            $("#markName").text("线标绘");
            otherinfo = curFea.geometry.getGeodesicLength(sdmap.map.getProjectionObject());
            if (otherinfo > 1000) {
                otherinfo = "长度：" + (otherinfo / 1000.0).toFixed(3) + "公里";
            } else
                otherinfo = "长度：" + otherinfo.toFixed(3) + "米";

        } else if (attr.type == "polygon") {
            PoiInfoPop.show("plotinfo", curFea.geometry.getCentroid(), { type: "polygon" });
            $("#markName").text("面标绘");
            otherinfo = curFea.geometry.getGeodesicArea(sdmap.map.getProjectionObject());
            if (otherinfo > 100000) {
                otherinfo = "面积：" + (otherinfo / 1000000.0).toFixed(3) + "平方公里";
            } else
                otherinfo = "面积：" + otherinfo.toFixed(3) + "平方米";
        }
        else if (attr.type == "text") {
            PoiInfoPop.show("plotinfo", curFea.geometry, { type: "text" });
            $("#markName").text("文字标绘");
        } else {
            PoiInfoPop.show("plotinfo", curFea.geometry, { type: "point" });
            $("#markName").text("点标绘");
        }

        $("#mark_title").append("<input type='button' id='popEditBtn' class='popEditBtn' title='修改' style='margin-right:20px'><input type='button'class='popEditBtn' id='popDelBtn'  title='删除'>");
        $("#right_pointNameInfo").html("<div>名称：" + curFea.attributes.name + "</div><div style='max-width:260px'>备注：" + (curFea.attributes.remark || "无") + "</div><div>" + otherinfo + "</div>");
        PoiInfoPop.resize();
        editEvent();
    }

    function editEvent() {
        $("#popEditBtn").click(function () {
            var type = curFea.attributes.type;
            if (type == "line") {
                var len = curFea.geometry.components.length;
                PoiInfoPop.show("plotedit", curFea.geometry.components[len - 1], "line");
                lineEditPop();
            } else if (type == "polygon") {
                PoiInfoPop.show("plotedit", curFea.geometry.getCentroid(), "polygon");
                polygonEditPop();
            }
            else if (type == "text") {
                PoiInfoPop.show("plotedit", curFea.geometry, "text");
                textEditPop();
            } else {
                PoiInfoPop.show("plotedit", curFea.geometry, "point");
                pointEditPop();
            }
        });

        $("#popDelBtn").click(function () {
            PoiInfoPop.close();
            delMark();
        });
    }
    // 绘制点要素完成事件
    function drawPointCompleted(fea) {
        $("#mark_tool_div .active").removeClass("active");
        var pt = fea.geometry;
        curStyle.externalGraphic = "images/mark2/point7.png";
        curStyle.graphicWidth = 24;
        curStyle.graphicHeight = 24;
        curStyle.graphicYOffset = -22;
        curStyle.fillOpacity = 1;
        curStyle.cursor = "pointer";
        //curStyle.label = "";
        fea.style = OpenLayers.Util.extend({}, curStyle);
        fea.style.label = "";
        fea.attributes.type = "point";
        curFea = fea;
        plotArr.push(curFea);
        plotLayer.drawFeature(curFea);
        plotCtl[curCtl].deactivate();

        PoiInfoPop.show("plotedit", pt);
        pointEditPop();

    }
    //事件和显示内容
    function pointEditPop() {
        $("#poi_pop_info").css("height", "180px");
        $("#pointPopupContent").append(popeditContent);
        $("#pointmark_name").val(curFea.attributes.name || "").after("<div id='changeImg' style='cursor:pointer;position: absolute;top: 35px;right: 5px;text-decoration: underline;'><img id='pointImg' style='width:20px;'src='" + curStyle.externalGraphic + "'/><br/>更换</div>");
        $("#pointmark_desc").text(curFea.attributes.remark || "");
        $("#pointPopupContent").after(iconStylehtml());
        $("#markName").text("点标绘");
        PoiInfoPop.resize();

        $("#changeImg").click(function () {
            $("#pointPopupContent").hide();
            $("#pointmark_imgdiv").show();
        });
        $("#pointmark_imgdiv .sp_12").click(function () {
            var img = $(this).attr("src");
            $("#pointImg").attr("src", img);
            curFea.style.externalGraphic = img;
            plotLayer.drawFeature(curFea);
            $("#pointImgRtn").click();
        });
        $("#pointImgRtn").click(function () {
            $("#pointPopupContent").show();
            $("#pointmark_imgdiv").hide();
        });

        $("#pointmark_save").click(function () {
            curFea.attributes.name = $("#pointmark_name").val();
            curFea.attributes.remark = $("#pointmark_desc").val();
            onFeatureSelectedListener({ feature: curFea });
            saveMark();
        });
        $("#pointmark_delete").click(function () {
            PoiInfoPop.close();
            delMark();
        });
    }


    function drawLineCompleted(fea) {
        $("#mark_tool_div .active").removeClass("active");
        curStyle.strokeWidth = 2;
        curStyle.strokeOpacity = 1;
        curStyle.strokeColor = "#0000ff";
        curStyle.label = "";
        curStyle.cursor = "pointer";
        fea.style = OpenLayers.Util.extend({}, curStyle);
        fea.style.label = "";

        fea.attributes.type = "line";
        curFea = fea;
        plotArr.push(curFea);
        plotLayer.drawFeature(curFea);
        plotCtl[curCtl].deactivate();

        var len = fea.geometry.components.length;
        PoiInfoPop.show("plotedit", curFea.geometry.components[len - 1]);
        lineEditPop();
    }

    function lineEditPop() {
        $("#poi_pop_info").css("height", "240px");
        $("#pointPopupContent").append(popeditContent);
        $("#pointmark_name").val(curFea.attributes.name || "");
        $("#pointmark_desc").text(curFea.attributes.remark || "");
        $("#markName").text("线标绘");

        $("#style_panel").append(lineStylehtml);
        styleEvent();
        //样式 
        $("#style_panel .ltrans").val(curFea.style.strokeOpacity);


// $.jPicker.List[0].color.active
$.jPicker.List[0].color.active.val("hex",curFea.style.strokeColor.replace("#",""),this);
       // $("#style_panel .lcolor").val(curFea.style.strokeColor);
        $("#style_panel .lwidth").val(curFea.style.strokeWidth);
        $("#style_panel .dropdown").attr("val", curFea.style.strokeDashstyle); //dot | dash | dashdot | longdash | longdashdot
        $("#style_panel .dropdown p img").
            attr("src", $("#style_panel .dropdown img[val='" + curFea.style.strokeDashstyle + "']").attr("src"));


        PoiInfoPop.resize();

        $("#pointmark_save").click(function () {
            curFea.attributes.name = $("#pointmark_name").val();
            curFea.attributes.remark = $("#pointmark_desc").val();

            //yangs
            curFea.style.strokeOpacity = $("#style_panel .ltrans").val();

            curFea.style.strokeColor="#"+$.jPicker.List[0].color.active.val("hex");
           // curFea.style.strokeColor = $("#style_panel .lcolor").val();
            curFea.style.strokeWidth = $("#style_panel .lwidth").val();
            curFea.style.strokeDashstyle = $("#style_panel .dropdown").attr("val"); //dot | dash | dashdot | longdash | longdashdot

            plotLayer.drawFeature(curFea);
            onFeatureSelectedListener({ feature: curFea });
            saveMark();
        });
        $("#pointmark_delete").click(function () {
            PoiInfoPop.close();
            delMark();
        });
    }
    function drawPolygonCompleted(fea) {
        curStyle.pointRadius = 24;
        curStyle.fillColor = "#0000ff";
        curStyle.fillOpacity = 0.5;
        curStyle.strokeWidth = 2;
        curStyle.strokeOpacity = 1;
        curStyle.strokeColor = "#0000ff";
        curStyle.cursor = "pointer";

        fea.style = OpenLayers.Util.extend({}, curStyle);
        fea.style.label = "";

        fea.attributes.type = "polygon";
        curFea = fea;
        plotArr.push(curFea);
        plotLayer.drawFeature(curFea);
        PoiInfoPop.show("plotedit", curFea.geometry.getCentroid());
        plotCtl[curCtl].deactivate();

        polygonEditPop();
    }
    function polygonEditPop() {
        $("#poi_pop_info").css("height", "270px");
        $("#pointPopupContent").append(popeditContent);
        $("#pointmark_name").val(curFea.attributes.name || "");
        $("#pointmark_desc").text(curFea.attributes.remark || "");
        $("#markName").text("面标绘");

        $("#style_panel").append(polygonStylehtml);
        styleEvent();

        $("#style_panel .ltrans").val(curFea.style.strokeOpacity);
        $.jPicker.List[0].color.active.val("hex",curFea.style.strokeColor.replace("#",""));
       // $("#style_panel .lcolor").val(curFea.style.strokeColor);
        $("#style_panel .lwidth").val(curFea.style.strokeWidth);
        $("#style_panel .dropdown").attr("val", curFea.style.strokeDashstyle);
        $("#style_panel .dropdown p img").
            attr("src", $("#style_panel .dropdown img[val='" + curFea.style.strokeDashstyle + "']").attr("src"));
        
        $.jPicker.List[1].color.active.val("hex",curFea.style.fillColor.replace("#",""));
       // $("#style_panel .fcolor").val(curFea.style.fillColor); ;
        $("#style_panel .ftrans").val(curFea.style.fillOpacity);

        PoiInfoPop.resize();

        $("#pointmark_save").click(function () {
            curFea.attributes.name = $("#pointmark_name").val();
            curFea.attributes.remark = $("#pointmark_desc").val();

            curFea.style.strokeOpacity = $("#style_panel .ltrans").val();
             curFea.style.strokeColor="#"+$.jPicker.List[0].color.active.val("hex");
           // curFea.style.strokeColor = $("#style_panel .lcolor").val();
            curFea.style.strokeWidth = $("#style_panel .lwidth").val();
            curFea.style.strokeDashstyle = "#"+$("#style_panel .dropdown").attr("val"); 
             curFea.style.fillColor="#"+$.jPicker.List[1].color.active.val("hex");
           // curFea.style.fillColor = $("#style_panel .fcolor").val(); 
            curFea.style.fillOpacity = $("#style_panel .ftrans").val();

            plotLayer.drawFeature(curFea);
            onFeatureSelectedListener({ feature: curFea });

            saveMark();
        });
        $("#pointmark_delete").click(function () {
            PoiInfoPop.close();
            delMark();
        });
    }
    function drawTextCompleted(fea) {
        $("#mark_tool_div .active").removeClass("active");

        curStyle.pointRadius = 8;
        curStyle.fillOpacity = 0;
        curStyle.strokeOpacity = 0;
        curStyle.fontColor = "#0000ff";
        curStyle.fontSize = "12px";
        curStyle.cursor = "pointer";
        curStyle.labelOutlineColor = "#ffffff";
        //curStyle.label = fea.attributes.remark;
        curStyle.labelSelect = true;
        curStyle.fontWeight = "bold";
        fea.style = OpenLayers.Util.extend({}, curStyle);
        fea.style.label = "";
        fea.attributes.type = "text";
        curFea = fea;
        plotArr.push(curFea);
        plotLayer.drawFeature(curFea);
        PoiInfoPop.show("plotedit", curFea.geometry);
        plotCtl[curCtl].deactivate();

        textEditPop();
    }
    function textEditPop() {
        $("#poi_pop_info").css("height", "290px");
        $("#pointPopupContent").append(popeditContent);
        $("#pointmark_name").val(curFea.attributes.name || "");
        $("#pointmark_desc").text(curFea.attributes.remark || "");
        $("#markName").text("文字标绘");


        $("#style_panel").append(textStylehtml);
        styleEvent();

        $("#style_panel .tpos").val(getAlign(curFea.style.labelAlign));
        $("#style_panel .xoff").val(curFea.style.labelXOffset || 0);
        $("#style_panel .yoff").val(curFea.style.labelYOffset || 0);
        if (curFea.style.labelOutlineColor) {

           // fillColor
        $.jPicker.List[1].color.active.val("hex",curFea.style.labelOutlineColor.replace("#",""));
           // $("#style_panel .lcolor").val(curFea.style.labelOutlineColor).show();
            $("#style_panel .tbord")[0].checked = true;
        } else {
            $("#style_panel .tbord")[0].checked = false;
            $("#style_panel .lcolor").hide();
        }


        $("#style_panel .txie")[0].checked = curFea.style.fontStyle == "italic" ? true : false;
        $("#style_panel .tchu")[0].checked = curFea.style.fontWeight == "bold" ? true : false;
       $.jPicker.List[0].color.active.val("hex", curFea.style.fontColor.replace("#",""));
        $("#style_panel .tcolor").val(curFea.style.fontColor);
        $("#style_panel .tsize").val(parseInt(curFea.style.fontSize));
        $("#style_panel .tfam").val(curFea.style.fontFamily || "宋体");

        PoiInfoPop.resize();

        $("#pointmark_save").click(function () {
            curFea.attributes.name = $("#pointmark_name").val();
            curFea.attributes.remark = $("#pointmark_desc").val();

            //样式
            curFea.style.label = curFea.attributes.name;
            curFea.style.labelAlign = getAlign($("#style_panel .tpos").val(), "r");
            curFea.style.labelXOffset = $("#style_panel .xoff").val();
            curFea.style.labelYOffset = $("#style_panel .yoff").val();
            if ($("#style_panel .tbord")[0].checked){

                //curFea.style.labelOutlineColor = $("#style_panel .lcolor").val();
                curFea.style.labelOutlineColor= "#"+ $.jPicker.List[1].color.active.val("hex");
            }
            curFea.style.fontStyle = $("#style_panel .txie")[0].checked ? "italic" : "nomal";
            curFea.style.fontWeight = $("#style_panel .tchu")[0].checked ? "bold" : "nomal";
            
            curFea.style.fontColor= "#"+ $.jPicker.List[0].color.active.val("hex");
            //curFea.style.fontColor = $("#style_panel .tcolor").val();
            curFea.style.fontSize = $("#style_panel .tsize").val() + "px";
            curFea.style.fontFamily = $("#style_panel .tfam").val();
            plotLayer.drawFeature(curFea);

            onFeatureSelectedListener({ feature: curFea });
            saveMark();
        });
        $("#pointmark_delete").click(function () {
            PoiInfoPop.close();
            delMark();
        });
    }

    function styleEvent() {
        //        $(".color").colorPicker({
        //            renderCallback: function (elm, toggled) {
        //                $(".cp-color-picker").css({ 'z-index': 1000, 'background-color': '#DFDFDF' });
        //            }
        //        }).click(function () {
        //            alert("aaaaa");
        //        });
        //        $('.color').colorpicker({ color: '#8db3e2' })
        //            .on('change.color', function(evt, color) {
        //                $(this).css('background-color', color);
        //            });


if($.jPicker.List.length>0){
   for(var i=$.jPicker.List.length-1;i>-1;i--)
    $.jPicker.List[i].destroy();
}
$(".colorBtn").jPicker(
        {
          window:
          {
            expandable: true,
            position:{
               x: 'screenCenter', 
                y: 'center' 
            }
          }
        },function(c,ctx){},
        function(c,ctx){},
        function(c,ctx){});

        $("#poi_pop_info").parent().after($(".dropdown").remove());
        $(".spinner.wh").spinner({
            step: 1,
            min: 0,
            max: 10,
            numberFormat: "n"
        });
        $(".spinner.trans").spinner({
            step: 0.05,
            min: 0,
            max: 1,
            numberFormat: "n"
        });
        $(".spinner.unlimit").spinner({
            step: 1,
            numberFormat: "n"
        });

        $(".dropdown p").click(function () {
            var ul = $(this).siblings("ul");
            if (ul.css("display") == "none") {
                ul.slideDown("fast");
            } else {
                ul.slideUp("fast");
            }
        });
        $(".dropdown").mouseleave(function () {
            $(this).children("ul").hide();
        });
        $(".dropdown ul li img").click(function () {
            var ths = $(this);
            var url = ths.attr("src");
            var ctl = ths.parents(".dropdown");
            ctl.attr("val", ths.attr("val"));
            ctl.find("p img").attr("src", url);
            ctl.children("ul").hide();

        });
    }
    function clear() {
        plotLayer.removeAllFeatures();
        plotArr = [], listArr = [];
        PoiInfoPop.close();
    }
    return {
        init: init,
        clear:clear
    };
} ();
