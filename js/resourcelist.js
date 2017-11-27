var ResourceList = function () {
    var inited = false;
    var map = null;
    var tTLayer = null;
    var hashLayers = null;
    var selNodeIds = null;   //所有选中节点ID
    var queryNode = null;  // 当前查询节点
var curNode;
    var bClickQuery = false;
var res_tabPanel;
    function _addLayer(node) {
        if (ResourceList.selNodeIds == null)
            ResourceList.selNodeIds = [];
        ResourceList.selNodeIds.push(node.id);

        if (ResourceList.hashLayers.contains(node.id)) {
            var layer = ResourceList.hashLayers.get(node.id);
            ResourceList.map.addLayer(layer);
            // 添加事件
            return;
        }

        var ori_node = node.original;
        if(!ori_node.serviceurl){
            curNode=node;
            var turl=   Service.TabUrl[ori_node.text];
            if(!turl)return;

            if(!res_tabPanel){
            var strhtm='<div style="z-index: 100;background-color: #fff;left:5%;top: 5%;width: 90%;height: 90%;position: absolute;border-radius:5px;border: 1px solid gray;"><iframe style="padding: 0;border: 0;width: 100%;height: 100%"  name="res_frSheet" id="res_frSheet"></iframe>'
            +'<img src="images/close.gif" style="position: absolute; top: 8px; right: 7px;"></div>';
            res_tabPanel=$(strhtm);
            $("body").append(res_tabPanel);

            $("img",res_tabPanel).click(function(){
                res_tabPanel.hide();
                   var inst = $("#pub_tc_tree").jstree(true);
                 
                 
                    inst.deselect_node(curNode);
                
                 curNode=null;
            });
            }
            window.open(turl,"res_frSheet");
        res_tabPanel.show();



            return;
        }
        switch (ori_node.servicetype.toUpperCase()) {
            case "WMS":
                var params = {
                    // REQUEST: "GetMap",
                    // VERSION: "1.3.0",
                    // SERVICE: "WMS",
                    LAYERS: ori_node.layers,
                    TRANSPARENT: true,
                    STYLES: "",
                    FORMAT: "image/png",
                    SRS: ResourceList.map.getProjection()
                    // WIDTH: 256,
                    // HEIGHT: 256
                };
                var wms_layer = new OpenLayers.Layer.WMS("themLayer_" + node.id, ori_node.serviceurl,
                    params,
                    { isBaseLayer: false, opacity: 0.7, singleTile: true });
                
                ResourceList.map.addLayer(wms_layer);

                 

                ResourceList.hashLayers.put(node.id, wms_layer);
                break;
        }
    }

    function _removeLayer(node) {

        //if(res_tabPanel)res_tabPanel.hide();

        if (ResourceList.selNodeIds != null) {
            ResourceList.selNodeIds.arryRemove(node.id);
        }

        if (ResourceList.hashLayers.contains(node.id)) {
            var layer = ResourceList.hashLayers.get(node.id);
            ResourceList.map.removeLayer(layer);
            // 移除事件                               
        }

        if (ResourceList.selNodeIds != null && ResourceList.selNodeIds.length == 0)
            PoiInfoPop.close();
    }

    function _sortLayer() {
       
        // 移除地图点击事件
        if (ResourceList.queryNode != null ) {
            if(ResourceList.queryNode.original.servicetype)
           { if(ResourceList.queryNode.original.servicetype.toUpperCase() == "WMS")
               _removeMapClickEvent();
           }  
          


      
        }
        // 重新定义点击事件
        if (ResourceList.selNodeIds != null) {
            var length = ResourceList.selNodeIds.length;
            if (length > 0) {
                _addMapClickEvent(ResourceList.selNodeIds[length - 1]);
            }
        }
    }

    function _addMapClickEvent(nodeid) {
        ResourceList.queryNode = $('#pub_tc_tree').jstree(true).get_node(nodeid);
       // ResourceList.map.events.on({ "click": _mapClickListener });//changed by yj 2016.4.6
if(document.attachEvent)
  ResourceList.map.viewPortDiv.attachEvent("onclick",_mapClickListener,false);
    else
       ResourceList.map.viewPortDiv.addEventListener("click",_mapClickListener,false);
    }

    function _removeMapClickEvent() {
        ResourceList.queryNode = null;
       // ResourceList.map.events.un({ "click": _mapClickListener });  //changed by yj 2016.4.6
       if(document.detachEvent)
        ResourceList.map.viewPortDiv.detachEvent("onclick",_mapClickListener);
        else
        ResourceList.map.viewPortDiv.removeEventListener("click",_mapClickListener);
    }

    function _mapClickListener(event) {
        if (!bClickQuery) return;
        if (!ResourceList.queryNode.original.servicetype||
            ResourceList.queryNode.original.servicetype.toUpperCase() != "WMS")
            return;

        var extent = ResourceList.map.getExtent();
        var extentStr = extent.left + "," + extent.bottom + "," + extent.right + "," + extent.top;
        //modified by yj 5.11
        var px = event.xy;
        if (!px) {
            var off = $(ResourceList.map.div).offset();
            px = { x: event.clientX - off.left, y: event.clientY - off.top };
        }
        var geo = ResourceList.map.getLonLatFromPixel(px);
        var geoStr = "{\"x\":" + geo.lon + ",\"y\":" + geo.lat + "}";

        var size = ResourceList.map.size;
        var displayStr = size.w + "," + size.h + ",96";

        var tolerance = 15;
        switch (ResourceList.queryNode.original.geometrytype.toUpperCase()) {
            case "POINT":
                tolerance = 15;
                break;
            case "POLYLINE":
                tolerance = 5;
                break;
            case "POLYGON":
                tolerance = 0;
                break;
            default:
                tolerance=5;
        }

        var param = {
            imageDisplay: displayStr,
            sr: ResourceList.map.getProjection().split(':')[1],
            mapExtent: extentStr,
            geometry: geoStr,
            layers: "all:" + ResourceList.queryNode.original.querylayers.join(','),
            geometryType: "esriGeometryPoint",
            returnGeometry: false,
            tolerance: tolerance,
            f: "json"
        };

        var url = ResourceList.queryNode.original.queryurl + "/identify";
        jQuery.support.cors = true;
        $.ajax({
            data: param,
            method: "POST",
            url: url,
            success: function (da) {
                var n = JSON.parse(da);
                if (n.results != null && n.results.length > 0) {
                    PoiInfoPop.show("resourcelist", geo, n.results[0].attributes, null);
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                
            }
        });
    }

    return {
        init: function (map) {
            if (inited) return;
            this.map = map;
            this.hashLayers = new HashTable();
            var resTree = $('#pub_tc_tree').jstree({
                "plugins": ["dnd", "search", "state", "types", "checkbox"],
                "dnd": { "is_draggable": false },
                "core": {
                    "data": {
                        "url": "hslc.txt?" + new Date().getTime(),
                        "dataType": "json" // needed only if you do not supply JSON headers
                    },
                    "check_callback": true,
                    "strings": { "Loading ...": "目录加载中..." },
                    "themes": { "name": false, "dots": false, "icons": false },
                    "multiple": true,
                    "icon_style": "normal"

                },
                "types": {
                    "default": { "valid_children": ["default", "file"] },
                    "file": { "valid_children": [], "icon": "jstree-file" }
                },
                "checkbox": {
                    "visible": true,
                    "three_state": false,
                    "whole_node": true,
                    "keep_selected_style": false
                }
            });

                var params = {
                    // REQUEST: "GetMap",
                    // VERSION: "1.3.0",
                    // SERVICE: "WMS",
                    LAYERS: "0",
                    TRANSPARENT: true,
                    STYLES: "",
                    FORMAT: "image/png",
                    SRS: ResourceList.map.getProjection()
                };
                var bd_layer = new OpenLayers.Layer.WMS("bdlayer", Service.bd,
                    params,
                    { isBaseLayer: false, opacity: 0.7, singleTile: true });
                
                ResourceList.map.addLayer(bd_layer);

            resTree.on("activate_node.jstree", function (e, data) {
                var node = data.node;
                var inst = $("#pub_tc_tree").jstree(true);
                if (!node || node.children.length > 0) {
                    inst.toggle_node(node);
                    inst.deselect_node(node);
                    ResourceList.reloadLegend(node.children);
                    return false;
                }
                ResourceList.isOpen(inst, node) && ResourceList.addLegend(node);
                // ResourceList.renderByChildrenNode();
                var selState = node.state['selected'];
                if (selState) {  // 选中
                    _addLayer(node);
                } else {  // 取消选中
                    _removeLayer(node);
                }
                _sortLayer();
            });
            // resTree.on("changed.jstree", function(e, data) {
            //     var node = data.node;
            //     if (!node || node.children.length > 0) {
            //         return false;
            //     }
            //     ResourceList.isOpen(data.instance, node) && ResourceList.addLegend(node);
            //     ResourceList.renderByChildrenNode();
            // });
            resTree.on("ready.jstree", function (e, data) {
                var ref = $('#pub_tc_tree').jstree(true);
                ref.deselect_node(ref.get_selected());
                ref.close_all();
            });
            // resTree.on("after_open.jstree", function(ev, data) {
            //     var inst = $("#pub_tc_tree").jstree(true);
            //     var d = inst.get_selected();
            //     $A.forEach(d, function(e) {
            //         if (ResourceList.isOpen(inst, e)) {
            //             inst.deselect_node(e);
            //             inst.select_node(e);
            //         }
            //     });
            // });

            $("#tab_resource_identi").click(function () {

                if ($(":checkbox", this)[0].checked)
                    bClickQuery = true;
                else
                    bClickQuery = false;
            });
            inited = true;
        },
        renderByChildrenNode: function (f) {
            var k = $("#pub_tc_tree").jstree(true);
            var g = $("#pub_tc_tree").find("*");
            g.removeClass("jstree-selected-inthat-parent-div").removeClass("jstree-selected-inthat-parent-span");
            var c = k.get_selected();
            for (var e = 0, h = c.length; e < h; e++) {
                var b = k.get_node(c[e]);
                ResourceList._renderRowWByChildren(b.id);
                var j = k.get_parent(b);
                ResourceList._renderRowWByChildren(j);
                var a = k.get_node(b.parent);
                var d = a.parent;
                ResourceList._renderRowWByChildren(d);
            }
        },
        _renderRowWByChildren: function (d, c) {
            if ("#" !== d) {
                var b = $("#pub_tc_tree").find("#" + d + " .jstree-wholerow:first");
                var a = $("#pub_tc_tree").find("#" + d).find("a:first span");
                b.addClass("jstree-selected-inthat-parent-div");
                a.addClass("jstree-selected-inthat-parent-span")
            }
        },
        addLegend: function (node) {
            if (node) {
                var legend = "#" + node.id + ">.jstree-legend";
                if ($(legend).children().length > 0) {
                    $(legend).empty();
                }
               


if (!node.state.selected) {

    return;}

// modified by YJ  2016.3.24

if(!node.original.serviceurl)return;
var jurl=node.original.queryurl||node.original.serviceurl.
replace(/arcgis\/services/,"arcgis/rest/services/").replace(/WMSServer/,"");
jurl+="/legend?f=pjson";
var jslegend;
$.ajax({url:jurl,cache:true,dataType:"json",success:function (res) {
     
   jslegend=res;


var div = document.createElement("DIV");


if(jslegend){
  var rlyrId=  node.original.querylayers||[jslegend.layers.length-1-node.original.layers[0]];

for(var o=0;o<jslegend.layers.length;o++){
if(jslegend.layers[o].layerId==rlyrId[0])
{
var lgd=jslegend.layers[o];
var lgdstr=[];
for(var k=0;k<lgd.legend.length;k++){
lgdstr.push("<div><img src='data:"+lgd.legend[k].contentType+";base64,"+lgd.legend[k].imageData+"'><span>"+lgd.legend[k].label+"</span></div>")
}
$(div).append(lgdstr.join(""))
// img.alt = "\u56fe\u4f8b";
// img.border = 0;
// div.appendChild(img);
div.className = "jstree-legend";
document.getElementById(node.id).appendChild(div);

break;
}
}   
}


}});

 


            }
        },
        removeLegend: function (node) {
            if (node) {
                var legend = "#" + node.id + ">.jstree-legend";
                if ($(legend).children().length > 0 || !node.state.selected) {
                    $(legend).empty()
                }
            }
        },
        reloadLegend: function (node) {
            var a = $("#pub_tc_tree").jstree(true);
            var b;
            if (!node) {
                b = a.get_selected()
            } else {
                b = node
            }
            $A.forEach(b, function (d) {
                ResourceList.addLegend(a.get_node(d))
            })
        },
        isOpen: function (b, d) {
            var a = b.get_parent(d);
            if (a == "#") {
                return true
            }
            var c = b.get_node(a);
            if (!c.state.opened) {
                return false
            }
            return this.isOpen(b, a)
        },
        getTreeStatusInfo: function () {
            var a = $("#pub_tc_tree").jstree(true);
            var b = $("#pub_tc_tree").jstree(true).get_selected();
            var c = [];
            if (window.sort_nodes) {
                $A.forEach(sort_nodes, function (e) {
                    var d = [e].concat(a.get_node(e).children);
                    c.push(d.join("-"))
                })
            }
            return (b.join(",") + "|" + c.join(","))
        },
        cancelSelectNode: function () {
            var ref = $('#pub_tc_tree').jstree(true);
            var ids = ref.get_selected();
            for (var i = ids.length - 1; i >= 0; i--) {
                ResourceList.removeLegend(ref.get_node(ids[i]));
                if (ResourceList.hashLayers.contains(ids[i])) {
                    var layer = ResourceList.hashLayers.get(ids[i]);
                    ResourceList.map.removeLayer(layer);
                    // 移除事件                               
                }
            }
            ref.deselect_node(ref.get_selected());

            ResourceList.selNodeIds = null;
            _sortLayer();
        }
    };

} ();