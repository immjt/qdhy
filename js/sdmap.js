var popup1; var Bzj = true; //注记是否显示
var TileLayerManager = function () {
    var layerArr = [], events = [], viewGroup = 1;
    var _map = null;
    var bconfiged = false;
    function onMapZoom() {
        var lvl = _map.zoom;
        for (var i = 0; i < layerArr.length; i++) {
            if (!layerArr[i].open) continue;
            (layerArr[i].maxlevel >= lvl && layerArr[i].minlevel <= lvl) ? layerArr[i].layer.setVisibility(true) : layerArr[i].layer.setVisibility(false);
        }
    }
    return {
        setConfig: function (map, configs) {
            // if (bconfiged) return;
            _map = map;
            var bmaps = configs;
            var i = 0;
            //  bmaps[0].isBaseLayer = true;
            for (; i < bmaps.length; i++) {
                if (!bmaps[i].open)
                    bmaps[i].visibility = false;
                var layer = new OpenLayers.Layer.WMTS(bmaps[i]);
                layerArr.push({ layer: layer, layerid: bmaps[i].layer, group: bmaps[i].group, open: bmaps[i].open, minlevel: bmaps[i].minlevel || 0, maxlevel: bmaps[i].maxlevel || 20 });
                _map.addLayer(layer);
            }
            map.Lary = layerArr;
            _map.events.register("zoomend", this, onMapZoom);
            bconfiged = true;
        },
        switchMap: function (group, flag) { // group分组号,flag为是否显示注记
            var i;
            if (group == null) {
                for (i = 0; i < layerArr.length; i++) {
                    if (layerArr[i].group == viewGroup + "_n") {
                        layerArr[i].layer.setVisibility(!!flag);
                        layerArr[i].open = !!flag;
                    }
                }
            }
            else {
                for (i = 0; i < layerArr.length; i++) {
                    if ((flag && layerArr[i].group == group + "_n") || layerArr[i].group == group) {
                        layerArr[i].open = true;
                        (layerArr[i].minlevel <= _map.zoom && layerArr[i].maxlevel >= _map.zoom) && layerArr[i].layer.setVisibility(true);
                    }
                    else {
                        layerArr[i].open = false;
                        layerArr[i].layer.setVisibility(false);
                    }
                }
                viewGroup = group;
            }

            for (i = 0; i < events.length; i++) {
                events[i](viewGroup);
            }
        },
        setVisibility: function (group, flag) {
            for (i = 0; i < layerArr.length; i++) {
                if (layerArr[i].group == group) {
                    layerArr[i].layer.setVisibility(!!flag);
                    layerArr[i].open = !!flag;
                }
            }

        },
        addListener: function (handle) {
            if (typeof handle == "function")
                events.push(handle);
        },
        removeListener: function (handle) {
            if (typeof handle == "function") {
                var i = events.find(function (obj) {
                    return obj === this;
                });
                events.splice(i, 1);
            }
        },
        getLayer: function (obj) {
            var i;
            if (obj.group) {
                // return layerArr
                var tempLs = [];
                for (i = 0; i < layerArr.length; i++) {
                    if (layerArr[i].group == obj.group) {
                        tempLs.push(layerArr[i].layer);
                    }
                }
                return tempLs;
            }
            if (obj.layer) {
                for (i = 0; i < layerArr.length; i++) {
                    if (layerArr[i].layerid == obj.layer) {
                        return layerArr[i].layer;
                    }
                }
            }
        },
        getLayers: function () { return layerArr }
    };
};



var SDMap = function (mdiv, options) {

    var olmap = null, selectableLayer = null, graLayer, selectControl, popUp = null;
    var tileLayerManager = new TileLayerManager();
    if (!options) options = {};
    OpenLayers.Util.applyDefaults(options, { scaleLine: true,  zoombar: 0,
        keyboard: true, mousePosition: true, poiIdenty: false, authMark: true, layerSwitch: 1, layerSwitch2: false
    });

    function addControls() {
        $(olmap.div).append("<div id='refrenceDiv'></div>");
        if (options.layerSwitch2) olmap.addControl(new OpenLayers.Control.LayerSwitcher());

        if (options.scaleLine)
            olmap.addControl(new OpenLayers.Control.ScaleLine({
                maxWidth: 200,
                topOutUnits: "千米",
                topInUnits: "米",
                bottomOutUnits: "",
                bottomInUnits: ""
            }));

        if (options.zoombar == 1) olmap.addControl(new OpenLayers.Control.PanZoomBar());
        else if (options.zoombar == 2) olmap.addControl(new OpenLayers.Control.Zoom());

        if (options.keyboard) olmap.addControl(new OpenLayers.Control.KeyboardDefaults());
        selectControl = new OpenLayers.Control.SelectFeature([selectableLayer]);
        selectControl.handlers.feature.stopDown = false;
        selectControl.handlers.feature.stopUp = false;

        olmap.addControl(selectControl);
        selectControl.activate();

        //  DragMoveCtl(olmap);


        var navi = new OpenLayers.Control.Navigation({
            //设置拖动惯性
            dragPanOptions: {
                enableKinetic: true,
                documentDrag: false,
                kineticInterval: 10
            },
            zoomWheelEnabled: true,
            handleRightClicks: false
        });

        olmap.addControl(navi);

  // olmap.addControl(new OpenLayers.Control.LayerSwitcher());

        if (options.mousePosition) addMousePosition();
        if (options.authMark) addAuthMark();

        if (options.layerSwitch == 1) {
            $(olmap.div).
        append($("<style> #layerSwitch:hover{border: 1px solid #2D9FBB;}</style><div id='layerSwitch'style='position: absolute;top:3px;width: 50px;height: 50px;right:3px;z-index: 1001;border:1px solid #DEE1E2;font-size:12px;background:url(images/map/img1.png)'></div>"));

            $("#layerSwitch").click(function () {
                var th = $(this);
                if (th.css('background-image').match(/(img1.png)/)) {
                    tileLayerManager.switchMap(2, true);
                    th.css("background-image", "url(images/map/vec1.png)");
                    _scaleBarStat("white");
                } else {
                    tileLayerManager.switchMap(1);
                    th.css("background-image", "url(images/map/img1.png)");
                    _scaleBarStat("black");
                }
            });
        }
        else if (options.layerSwitch == 2) {
            $(olmap.div).append($("<div id='layerSwitch'style='position: absolute;bottom:10px;right: 20px;z-index: 1001;font-size:12px'><div class='operbtn mapswitchbtn'>矢量</div><div class='operbtn mapswitchbtn' style='background-color:#b2b2b2'>影像</div></div>"));
            $("#layerSwitch .mapswitchbtn").click(function () {
                var ths = $(this);
                if (ths.text() == "矢量") {
                    tileLayerManager.switchMap(1);
                    _scaleBarStat("black");
                } else {
                    tileLayerManager.switchMap(2, true);
                    _scaleBarStat("white");
                }

                ths.removeAttr("style").siblings().css("background-color", "#b2b2b2");
            });

        }

    }
    function _scaleBarStat(color) {
        $("#img_year_div").show();
        $(".olControlScaleLineTop").css({ "border": "solid 2px " + color,
            "border-top": "none",
            "color": color
        });
        $(".olControlScaleLineBottom").css({ "border": "solid 2px " + color,
            "border-bottom": "none",
            "color": color
        });
    }
    function addMousePosition() {
        $("#refrenceDiv").before("<div id = 'mousePositon'></div>");
        $(".olMapViewport").mousemove(function (e) {
            var pos = $(this).offset();
            var px = new OpenLayers.Pixel(e.clientX - pos.left, e.clientY - pos.top);
            var lonlat = olmap.getLonLatFromPixel(px);
            $("#mousePositon").text("经度:" + lonlat.lon.toFixed(3) + ", 纬度:" + lonlat.lat.toFixed(3));
        });
    }
    function addAuthMark() {
        $("#refrenceDiv").before("<div id ='bottomBar'></div><div id ='remark'>审图号:GS(2014)6032号(版权:国家测绘地理信息局)</div>");
    }
    OpenLayers.INCHES_PER_UNIT["千米"] = OpenLayers.INCHES_PER_UNIT["km"];
    OpenLayers.INCHES_PER_UNIT["米"] = OpenLayers.INCHES_PER_UNIT["m"];
    OpenLayers.INCHES_PER_UNIT["英里"] = OpenLayers.INCHES_PER_UNIT["mi"];
    OpenLayers.INCHES_PER_UNIT["英尺"] = OpenLayers.INCHES_PER_UNIT["ft"];

    (function (mapdiv) {
        //更改默认图片dpi，准确计算比例尺
        OpenLayers.DOTS_PER_INCH = 96;
        olmap = new OpenLayers.Map(mapdiv, {
            allOverlays: true,
            numZoomLevels: 20,
            displayProjection: "EPSG:4490",
            controls: [
            //   new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.ArgParser(),
                new OpenLayers.Control.Attribution()]
        });

        tileLayerManager.setConfig(olmap, Service.basemap);

        if (options.poiIdenty) {
            olmap.poiMrk = new OpenLayers.Ex.PoiMarker(olmap, tileLayerManager.getLayer({ layer: "sdvec" }), Service.POITILE);
        }
        var myStyles = new OpenLayers.StyleMap({
            fillOpacity: 1,
            pointRadius: 2
        });
        // 创建图层
        selectableLayer = new OpenLayers.Layer.Vector("SelectableLayer", {
            styleMap: myStyles,
            rendererOptions: { zIndexing: false }
        });
        olmap.addLayer(selectableLayer);

        graLayer = new OpenLayers.Layer.Vector("GraphicsLayer", {
            styleMap: myStyles,
            rendererOptions: { zIndexing: false }
        });
        olmap.addLayer(graLayer);
        addControls();
        olmap.setCenter(new OpenLayers.LonLat(116.399, 40.185), 9);
    })(mdiv);

    return {

        map: olmap,
        tileLayerManager: tileLayerManager,
        markLayer: selectableLayer,
        graLayer: graLayer,
        unSelect: function () {
            selectControl.unselectAll();
        }
         ,
        addLayer: function (lyr, selectable) {
            olmap.addLayer(lyr);
            if (selectable) {
                selectControl.setLayer(selectControl.layers.concat([lyr]));
            }
      
        },
        removeLayer: function (lyr, selectable) {
            olmap.removeLayer(lyr);
            if (selectable) {
                for (var i = 0; i < selectControl.layers.length; i++) {
                    if (selectControl.layers[i].id == lyr.id) {
                        var lyrs = selectControl.layers;
                        lyrs.splice(i, 1);
                        selectControl.setLayer(lyrs);
                        break;
                    }
                }
            }
           
        },
        getSelectCtrl:function () {
            return selectControl;
        },
        addPopup: function (pop) {
            if (pop) olmap.addPopup(pop);
        },
        removePopup: function (pop) {
            if (pop)
                olmap.removePopup(pop);
            else {
                var pps = olmap.popups;
                for (var pp in pps) {
                    olmap.removePopup(pps[pp]);
                }
            }
        }
    };
};
