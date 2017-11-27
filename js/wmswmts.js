var wmswmts = function () {//依赖hashtable.js
    var inited = false,Fbind = false;
    var map = null;
    var hashLayers = null;
    var para = { layer: "sdvec", style: "default", matrixSet: "tianditu2013", format: "image/png", open: true };
    function changeStatus(p, status) {
        p.open = status;
    }
    function setCurLayer() {
        var curZ = wmswmts.map.getZoom();
        for (var i in wmswmts.hashLayers.hash) {
            var p=wmswmts.hashLayers.get(i);
                var curL = p.l_cur;
                if (curZ > p.max || curZ < p.min)//wms
                {
                    if (curL != p.l_wms) {
                        p.l_cur=p.l_wms;

                        if (p.open == true) {
                            wmswmts.map.removeLayer(curL);
                            wmswmts.map.addLayer(p.l_wms);
                        }
                    }
                }
                else {
                    if (curL != p.l_wmts) {
                        p.l_cur=p.l_wmts;
                        if (p.open == true) {
                            wmswmts.map.removeLayer(curL);
                            wmswmts.map.addLayer(p.l_wmts);
                        }
                    }
                }
        }

    }

    function NewObj(id,url,layer) {//layer:[0]
       // var para = Service.wmts_cfg;
      //  var min=(para.minlevel!=null)?para.minlevel:0;
       // var max=(para.maxlevel!=null)?para.maxlevel:15;
        var min = para.minlevel || 0; var max = para.maxlevel || 20;
        var curZoom = wmswmts.map.getZoom();
        var Tparams = {
            LAYERS: (layer!=null)?layer:[0],
            TRANSPARENT: true,
            STYLES: "",
            FORMAT: "image/png",
            SRS: wmswmts.map.getProjection()
        };
        var ToP={ isBaseLayer: false, opacity: 0.7, singleTile: true };
        var lay_wms = new OpenLayers.Layer.WMS("wmsWmts",url, Tparams,ToP);
        //wmts
        para.url = url.replace(/WMSServer/,"WMTS").replace(/arcgis/,"arcgis/rest");
        para.minlevel = min;
        para.maxlevel = max;
        var layer_wmts = new OpenLayers.Layer.WMTS(para);
        var l_cur;
        if (curZoom > max || curZoom < min)//wms
        {
            l_cur=lay_wms;
        }
        else {
            l_cur=layer_wmts;
        }
        var p = {
            l_wms:lay_wms,
            l_wmts:layer_wmts,
            l_cur:l_cur,
            min:min,
            max:max,
            open:true
        };
        wmswmts.map.addLayer(l_cur);
        wmswmts.hashLayers.put(id, p);
    }
    function _removeLayer(id) {
     if(wmswmts.hashLayers.contains(id))
     {
         var p = wmswmts.hashLayers.get(id);
         if(p.open){wmswmts.map.removeLayer(p.l_cur);
            changeStatus(p,false);}
     }
    }

    return {
        init: function (map) {
            if (inited) return;
            wmswmts.map = map;
            wmswmts.hashLayers = new HashTable();
            inited = true;
        },
        addLayer:function (p) {//http://localhost:6080/arcgis/services/yy_tile/MapServer/WMSServer
            //参数包括： 唯一id url layer(显示的图层)
            //绑定
            if(!Fbind)//未监听地图缩放事件
            {
                wmswmts.map.events.register("zoomend", null, function () {  setCurLayer(); });
                Fbind = true;
            }
            //初始化两个图层
            if (wmswmts.hashLayers.contains(p.id))//已添加控制可见性
            {
                var Tp = wmswmts.hashLayers.get(p.id);
                wmswmts.map.addLayer(Tp.l_cur);
                changeStatus(Tp, true);
                return;
            }
            else {//new obj
                NewObj(p.id,p.url,p.layer);
            }

        },
        removeLayer:function (id) {
            _removeLayer(id);
        }
    }
} ();