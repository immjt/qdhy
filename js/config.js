var Service = function () {
    var proxy = "proxy/proxy.ashx?";
    var NCM = ["vec", "cva", "img", "cia", "sdcia"];
 
        var basemap = [
        { group: "vec", name: "天地图-矢量", url: "http://t0.tianditu.com/vec_c/wmts", layer: "vec", style: "default", matrixSet: "c", format: "tiles", open: true, minlevel: 3 },
        { group: "vec_n", name: "天地图-矢量注记", url: "http://t0.tianditu.com/cva_c/wmts", layer: "cva", style: "default", matrixSet: "c", format: "tiles", open: true, maxlevel: 10 },
      //  { group: "vec", name: "矢量地图", url: "http://221.214.94.38:81/tileservice/hyyyt2", layer: "sdvec", style: "default", matrixSet: "tianditu2013", format: "image/png", open: true, minlevel: 7 },
        { group: "img", name: "天地图-影像地图", url: "http://t5.tianditu.cn/img_c/wmts", layer: "img", style: "default", matrixSet: "c", format: "tiles", open: false, maxlevel: 19 },
        { group: "img", name: "山东影像", url: "http://www.sdmap.gov.cn/tileservice/SdRasterPubMap", layer: "sdimg2015", style: "default", matrixSet: "img2015", format: "image/png", open: false, minlevel: 7 },
        { group: "img_n", name: "天地图-影像注记", url: "http://t0.tianditu.com/cia_c/wmts", layer: "cia", style: "default", matrixSet: "c", format: "tiles", open: false, maxlevel: 6 },
        { group: "img_n", name: "山东影像注记", url: "http://www.sdmap.gov.cn/tileservice/SDRasterPubMapDJ", layer: "sdcia", style: "default", matrixSet: "sdcia", format: "image/png", open: false, minlevel: 7 }
        ];
    return {
        LS: proxy + "http://www.sdmap.gov.cn/QueryService.ashx?city="+encodeURIComponent("全国")+"&output=json&resultmode=255&uid=navinfo&st=LocalSearch&",
        LSID: proxy + "http://www.sdmap.gov.cn/QueryService.ashx?city="+encodeURIComponent("全国")+"&st=Obtain&output=json&resultmode=255&uid=navinfo&",
       // PATH:proxy+"http://www.sdmap.gov.cn/PathService.ashx?type=search&postStr=",
        PATH:proxy+"http://map.tianditu.com/query.shtml?type=search&postStr=",
        RGC2: proxy + "http://www.sdmap.gov.cn/GeoDecodeService.ashx?st=Rgc2&output=json&",  
        basemap: basemap,
        // UserPlot: proxy + "http://www.sdmap.gov.cn/UserPlotsHandler.ashx",
        CityBound: proxy + "http://www.sdmap.gov.cn/cityExtentSearch/cityExtentSearch.asmx/getBoundary?",
        CitySearch: proxy + "http://www.sdmap.gov.cn/cityExtentSearch/cityExtentSearch.asmx/getDistrict?",
        POITILE: proxy + "http://www.sdmap.gov.cn/tileservice/sdpoi?service=poi&request=getpoi&tileMatrixSet=sss&format=text/html",
        IMGMETA: proxy + "http://sdgt.sdmap.gov.cn/imgmeta2/imgmetaservice.asmx/QueryMeta?",
        NCM:NCM,
        comHandl:"http://www.ztldcn.com/yykj/f/company/phone/",
        //comHandl:"http://42.96.167.50:81/yykj/f/company/phone/",
        bd: "http://221.214.94.38:6080/arcgis/services/gt/gt_xz/MapServer/WMSServer",
       // ident:"http://221.214.94.38:6080/arcgis/rest/services/gt/gt_bj_sq/MapServer",
        upLoadHandl:"http://localhost:5158/uploadfile.ashx?dir=file",
        proxy:"proxy/proxy.ashx?",
        wmts_cfg :{ layer: "sdvec", style: "default", matrixSet: "tianditu2013", format: "image/png", open: true, minlevel:3,maxlevel:15 },
        qdhyTile:"http://221.214.94.38:6080/arcgis/services/qdhy/qdhy/MapServer/WMSServer",
        heatTile:"http://221.214.94.38:6080/arcgis/services/qdhy/heat/MapServer/WMSServer",
        ident:"http://221.214.94.38:6080/arcgis/rest/services/qdhy/qdhy/MapServer",
        dy: {
            110119 : "1",
            110118 : "2",
            110117 : "3",
            110116 : "4",
            110115 : "5",
            110114 : "6",
            110113 : "7",
            110112 : "8",
            110111 : "9",
            110109 : "10",
            110108 : "11",
            110106 : "12",
            110105 : "13"
        }
    };
} ();