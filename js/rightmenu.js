


var RightMenu=function() {
    var sdmap,inited=false, 
    menudiv = [
        "<div id = 'rightDiv'>",
        "	<ul>",
        "		<li id = 'right_from' style = 'margin-top:3px;'>以此为起点</li>",
        "	    <li id = 'right_to'  >以此为终点</li>",
        "	    <li id = 'right_around' style='height:23px;'><div class='splitline'>在此点附近找...</div></li>     ",
        "		<li id = 'right_zoomin' >放大</li>",
        "		<li id = 'right_zoomout' >缩小</li>",
        "	</ul>",
        "</div>"].join(""),rightPt;
    return {
        init: function (smap) {
            if (inited) return;
            sdmap = smap;
            $(".olMapViewport").mouseup(function (event) {
                if (event.which == 3) {
                    var x, y;
                    var pos = $(this).offset();
                    x = event.clientX - pos.left;
                    y = event.clientY - pos.top;
                    rightPt = sdmap.map.getLonLatFromPixel(new OpenLayers.Pixel(x, y));
                    $('#rightDiv').css({
                        display: "block",
                        left: x + 2,
                        top: y
                    });
                } 
            }).click(function() {
                $('#rightDiv').hide();
            }).after(menudiv);

            $('#rightDiv li').click(function () {
                $('#rightDiv').css("display", "none");
                switch(this.id) {
                    case "right_from":
                        switchSearch("s3");
                        PathSearch.setStart(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(rightPt.lon,rightPt.lat)), 2);
                        //sdmap.map.setCenter(rightPt);
                        break;
                    case "right_to":
                        switchSearch("s3");
                        PathSearch.setEnd(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(rightPt.lon, rightPt.lat)), 2);
                        //sdmap.map.setCenter(rightPt);
                        break;
                    case "right_around":
                        PoiInfoPop.show("around", rightPt);
                        //sdmap.map.setCenter(rightPt);
                        break;
                    case "right_zoomout":
                        sdmap.map.zoomOut();
                        break;
                    case "right_zoomin":
                        sdmap.map.zoomIn();
                        break;
                        default :
                            return;
                }
            });
            
            inited = true;
        }
    };
}();
