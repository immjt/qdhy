var categry = function () {
       var inited = false;
       var map = null;
function initTree()
{
   var setting = 
   {  

    check: {
        enable: false
    },
    data: {
        key: {
            name: "name"
        }, simpleData: {
            idKey: "id",
            pIdKey: "pid",
            enable: true
        }
    },
    callback:{
        onClick:zTreeOnClick
    }
};  
var zNodes;
        $.ajax({
            type: "GET",
            url: Service.comHandl+"op=xzqh&type=cj",
            datatype: "text/html",
            dataType: "JSONP",
            jsonp: "callback",
            success: function (result) {
   zNodes=result;
   zTree = $.fn.zTree.init($("#pub_tc_tree"), setting,zNodes); 
            },
            error: function (a, b) {
                    console.log("目录树请求错误");
            }
        });

}
function zTreeOnClick(event, treeId, treeNode) {
    var x=treeNode.Lon;var y=treeNode.Lat;
    categry.map.setCenter(new OpenLayers.LonLat(x, y), 15);
    var Tlonlat=new OpenLayers.LonLat(x, y);
    if (treeNode.level == 0)//乡镇
    {
        //显示行政区划范围
        //点击显示统计信息
    categry.map.setCenter(Tlonlat, 14);
    }
    else
    {
        //显示行政区划范围
        //显示楼栋信息
        categry.map.setCenter(Tlonlat, 19);
        var qh=treeNode.id;
        showFw.showFwbyCode(qh);
        getGeoByC(Tlonlat);
    }
};
function getGeoByC(lonlat)
{
        var map=categry.map;
        var extent = map.getExtent();
        var extentStr = extent.left + "," + extent.bottom + "," + extent.right + "," + extent.top;
        var geoStr = "{\"x\":" + lonlat.lon + ",\"y\":" + lonlat.lat + "}";
        var size = map.size;
        var displayStr = size.w + "," + size.h + ",96";
        var tolerance = 15;
        var param = {
            imageDisplay: displayStr,
            sr: map.getProjection().split(':')[1],
            mapExtent: extentStr,
            geometry: geoStr,
            layers: "all:0",
            geometryType: "esriGeometryPoint",
            returnGeometry: true,
            tolerance: tolerance,
            f: "json"
        };
        var url = Service.ident + "/identify";
        jQuery.support.cors = true;
        $.ajax({
            data: param,
            method: "POST",
            url: url,
            success: function (da) {
                var n = JSON.parse(da);
                if (n.results != null && n.results.length > 0) {
                   var a=1;
                   polygon(n.results[0].geometry);
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
               
            }
        });
}
var dictLayer=null;
function polygon(jsonObj) {
         if (dictLayer != null) {
             dictLayer.removeAllFeatures();
        }
         else {
            var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
             style.fillOpacity = 0;
             style.strokeColor = "blue";
             style.fillColor = "blue";
             style.strokeWidth = 2;
             style.strokeDashstyle = "longdash";
            dictLayer = new OpenLayers.Layer.Vector("区划", {
                 style: style
             });
             categry.map.addLayer(dictLayer);
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
        // showFw.Tlayer().redraw();
       //  sdmap.map.zoomToExtent(dictLayer.getDataExtent());
        // color = 1;
        // timer = setInterval(ChangeColor, 600);

     }
		function filter(treeId, parentNode, childNodes) {
			if (!childNodes) return null;
			for (var i=0, l=childNodes.length; i<l; i++) {
				childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
			}
			return childNodes;
      }
    return {
        init: function (map) {
            if (inited) return;
            this.map = map;
            initTree();
            $("#img_").click();
                var params = {
                    LAYERS: "0",
                    TRANSPARENT: true,
                    STYLES: "",
                    FORMAT: "image/png",
                    SRS: map.getProjection()
                };
                var bd_layer = new OpenLayers.Layer.WMS("bdlayer", Service.bd,
                    params,
                    { isBaseLayer: false, opacity: 0.7, singleTile: true });
                map.addLayer(bd_layer);
            inited = true;
        },
        clear:function()
        {
            dictLayer.removeAllFeatures();
        }
          

       }
} ();