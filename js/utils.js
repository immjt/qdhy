/** @define {boolean} */var JSCOMPRESS_DEBUG = false;
function parseUrl(urlparm) {
    var args = new Object();
    var pairs = urlparm.split("&"); //www.cxybl.com break at ampersand 
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); // look for "name=value" 
        if (pos == -1) continue; // if not found, skip 
        var argname = pairs[i].substring(0, pos); // extract the name 
        var value = pairs[i].substring(pos + 1); // extract the value 
        value = decodeURIComponent(value); // decode it, if needed 
        args[argname.toLowerCase()] = value; // store as a property 
    }
    return args; // return the
}
function parseParam(obj) {
    var str = [];
    for (var k in obj) {
        str.push(k + "=" + obj[k]);
    }
    return str.join("&");
}
function isValid(val) {
    if (val != null && val != "")
        return true;
    return false;
}

String.prototype.ClipStr = function (l) {
    if (l == null) l = 14;
    l *= 2;
    var len = 0, i = 0;
    for (; i < this.length && len < l; i++)
        this.charAt(i).match(/[^\x00-\xff]/ig) ? len += 2 : len += 1;
    return i < this.length ? this.substr(0, i - 2) + "..." : this;
};
String.prototype.Trim = function () {
    return this.replace(/^\s+/g, "").replace(/\s+$/g, "");
};

//获取占位长度
String.prototype.Placelen=function(){
if(this.length==0)
    return 0;
var len=0;
for(var i=0;i<this.length;i++){
    if(this[i].match(/[\x00-\xff]/))
        len++;
    else
        len+=2;
}
return len;
}
String.prototype.BreakLine=function(n,ch){
    var v="";
    if(this.length<=n){
        return this;
    }
    else{
       v= this.substring(0,n)+ch;
       return v+this.substring(n).BreakLine(n,ch);
    }
}
// String.prototype.BreakLine=function(n,ch){
//     var rg=new RegExp("([\\W\\w]{"+n+"})","g");
//    return this.replace(rg,'$1'+ch);
// }



var Clone = function (obj) {
    var o;
    switch (typeof obj) {
        case 'undefined': break;
        case 'string': o = obj + ''; break;
        case 'number': o = obj - 0; break;
        case 'boolean': o = obj; break;
        case 'object':
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(Clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        o[k] = Clone(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj; break;
    }
    return o;
};
function setCookie(name, value) {
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}

//删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 10000);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + escape(cval) + ";expires=" + exp.toGMTString() + ";path=/";
}

function string2xml(str) {
    var _xmlDoc = null;
    if (window.ActiveXObject) {
        _xmlDoc = new ActiveXObject('Microsoft.XMLDOM'); //IE浏览器 
        //        if (_xmlDoc==null)
        //            _xmlDoc = new ActiveXObject("MSXML2.DOMDocument.3.0");
        _xmlDoc.loadXML(str);
    }
    else if (window.XMLHttpRequest) {
        var oParser = new DOMParser();
        _xmlDoc = oParser.parseFromString(str, "text/xml");
    }
    return _xmlDoc;
}

if (!Date.now) {
    Date.now = function () {
        return new Date().valueOf();
    }
}


var PageCtl = function () {
    var pageNum = 0;
    var pageDiv;
    var pageFunc;
    var pageIdx = 0, pageCap = 10;
    // 总页数，当前第ipage页
    function pageDisp(npage, ipage) {
        var i;
        var str = [];
        if(npage==0){
            $("#" + pageDiv + " .page").html("");
            return;
        }
        if (ipage < npage && ipage > 1) //中间页
        {
            str.push("<li class='pageon pageprev'>上一页</li>");

            str.push("<li class='pageon'>" + (ipage - 1) + "</li>");
            str.push("<li class='pagenow'>" + ipage + "</li>");
            str.push("<li class='pageon'>" + (ipage + 1) + "</li>");
            if (ipage == 3) {
                str.splice(1, 0, "<li class='pageon'>1</li>");
            } else if (ipage > 3) {
                str.splice(1, 0, "<li class='pageon'>1</li><li class='pagepot'>...</li>");
            }
            if (ipage == npage - 2) {
                str.push("<li class='pageon'>" + npage + "</li>");
            } else if (ipage < npage - 2) {
                str.push("<li class='pagepot'>...</li><li class='pageon'>" + npage + "</li>");
            }

            str.push("<li class='pageon pagenext'>下一页</li>");
        }
        else if (ipage == 1) {//第一页

            str.push("<li class='pageoff'>上一页</li>");
            str.push("<li class='pagenow'>1</li>");
            if (npage < 5) {
                for (i = 1; i < npage; i++)
                    str.push("<li class='pageon'>" + (i + 1) + "</li>");
            } else {
                str.push("<li class='pageon'>2</li><li class='pageon'>3</li><li class='pagepot'>...</li><li class='pageon'>" + npage + "</li>");
            }
            if (npage == 1)
                str.push("<li class='pageoff'>下一页</li>");
            else
                str.push("<li class='pageon pagenext'>下一页</li>");
        } else {//最后页

            str.push("<li class='pageon pagenext'>上一页</li>");
            if (npage < 5) {
                for (i = 0; i < npage - 1; i++)
                    str.push("<li class='pageon'>" + (i + 1) + "</li>");
            } else {
                str.push("<li class='pageon'>1</li><li class='pagepot'>...</li>");
                str.push("<li class='pageon'>" + (npage - 2) + "</li><li class='pageon'>" + (npage - 1) + "</li>");
            }
            str.push("<li class='pagenow'>" + npage + "</li>");
            str.push("<li class='pageoff'>下一页</li>");
        }
        $("#" + pageDiv + " .page").html(str.join(""));
    }

    return { init: function (div, fn, cap) {
        if(!PageCtl._cache){
            PageCtl._cache={};
        }
        if(!!PageCtl._cache[div])return ;
        PageCtl._cache[div]=true;
        pageDiv = div;
        if (cap) pageCap = cap;
        if (typeof fn == "function")
            pageFunc = fn;
        else {
            if (console.log) console.log("初始化失败！");
            return;
        }
        $("#" + pageDiv).delegate(".pageon", "click", function (evt) {
            var newpage = $(this).text();            
            var oldp = $("#" + pageDiv + " li.pagenow");
            var oldPage;
            if (oldp.length < 1) {
                oldPage = 1;
            } else {
                oldPage = parseInt(oldp.text());
            }

            if (!isNaN(newpage)) {
                newpage = parseInt(newpage);

            } else if (newpage == "上一页") {
                newpage = oldPage - 1;
            } else {
                newpage = oldPage + 1;
            }
            pageDisp(pageNum, newpage);
            //pageList(newpage, oldPage);
            pageFunc(newpage, pageCap); //,oldPage
        });
    },
        doPage: function (ipage, nCount) {
            nCount
            if (!nCount )nCount=0;
            pageNum = Math.ceil(nCount / pageCap);
            pageDisp(pageNum, ipage);
            pageFunc(ipage, pageCap);
        },
        startEnd: function (newpage, nCount) {
            var end, start = (newpage - 1) * pageCap;
            if (start + pageCap >= nCount)
                end = nCount;
            else
                end = start + pageCap;
            return [start, end];

        }
    };

};


var Browser = function () {
    var agent = navigator.userAgent.toLowerCase(),
    opera = window.opera,
    browser = {
        //检测当前浏览器是否为IE  
        ie: /(msie\s|trident.*rv:)([\w.]+)/.test(agent),
        opera: (!!opera && opera.version),
        webkit: (agent.indexOf(' applewebkit/') > -1),
        mac: (agent.indexOf('macintosh') > -1),
        //检测当前浏览器是否处于“怪异模式”下  
        quirks: (document.compatMode == 'BackCompat')
    };
    //检测当前浏览器内核是否是gecko内核  
    browser.gecko = (navigator.product == 'Gecko' && !browser.webkit && !browser.opera && !browser.ie);
    var version = 0;
    // Internet Explorer 6.0+  
    if (browser.ie) {
        var v1 = agent.match(/(?:msie\s([\w.]+))/);
        var v2 = agent.match(/(?:trident.*rv:([\w.]+))/);
        if (v1 && v2 && v1[1] && v2[1]) {
            version = Math.max(v1[1] * 1, v2[1] * 1);
        } else if (v1 && v1[1]) {
            version = v1[1] * 1;
        } else if (v2 && v2[1]) {
            version = v2[1] * 1;
        } else {
            version = 0;
        }
        //检测浏览器模式是否为 IE11 兼容模式  
        browser.ie11Compat = document.documentMode == 11;
        //检测浏览器模式是否为 IE9 兼容模式  
        browser.ie9Compat = document.documentMode == 9;
        //检测浏览器模式是否为 IE10 兼容模式  
        browser.ie10Compat = document.documentMode == 10;
        //检测浏览器是否是IE8浏览器  
        browser.ie8 = !!document.documentMode;
        //检测浏览器模式是否为 IE8 兼容模式  
        browser.ie8Compat = document.documentMode == 8;
        //检测浏览器模式是否为 IE7 兼容模式  
        browser.ie7Compat = ((version == 7 && !document.documentMode) || document.documentMode == 7);
        //检测浏览器模式是否为 IE6 模式 或者怪异模式  
        browser.ie6Compat = (version < 7 || browser.quirks);
        browser.ie9above = version > 8;
        browser.ie9below = version < 9;
    }
    // Gecko.  
    if (browser.gecko) {
        var geckoRelease = agent.match(/rv:([\d\.]+)/);
        if (geckoRelease) {
            geckoRelease = geckoRelease[1].split('.');
            version = geckoRelease[0] * 10000 + (geckoRelease[1] || 0) * 100 + (geckoRelease[2] || 0) * 1;
        }
    }
    //检测当前浏览器是否为Chrome, 如果是，则返回Chrome的大版本号  
    if (/chrome\/(\d+\.\d)/i.test(agent)) {
        browser.chrome = +RegExp['\x241'];
    }
    //检测当前浏览器是否为Safari, 如果是，则返回Safari的大版本号  
    if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)) {
        browser.safari = +(RegExp['\x241'] || RegExp['\x242']);
    }
    // Opera 9.50+  
    if (browser.opera)
        version = parseFloat(opera.version());
    // WebKit 522+ (Safari 3+)  
    if (browser.webkit)
        version = parseFloat(agent.match(/ applewebkit\/(\d+)/)[1]);
    //检测当前浏览器版本号  
    browser.version = version;
    return browser;
} ();

var DynamicLoading = DynamicLoading || ({
    css: function (path, win) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        if (!win) win = window;
        var head = win.document.getElementsByTagName('head')[0];
        var link = win.document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function (path, win) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        if (!win) win = window;
        var head = win.document.getElementsByTagName('head')[0];
        var script = win.document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
});

$.support.cors = true;

function JsonpRequest(url,dat,func,err){

if(typeof err!="function"){
    err=function(){
        if(console.log)
            console.log(arguments[1]);
    }
    }
$.ajax({url:url,data:dat,dataType:"jsonp",
    contentType: "application/json; charset=utf-8",
    success:func,error:err});
}
function JsonpRequestSync(url,dat,func,err){
 err=function(){if(console.log)console.log(arguments[1]);};
$.ajax({url:url,data:dat,dataType:"jsonp",async:false,
    contentType: "application/json; charset=utf-8",
    success:func,error:err});
}

function PostReqest(url,dat,func,err){

if(typeof err!="function")
    err=function(){if(console.log)console.log(arguments[1]);};
//$.ajax({url:"proxy/proxy.ashx?"+url,data:dat,dataType:"json",type:"POST",
 $.ajax({url:url,data:dat,dataType:"json",type:"POST",
    // contentType: "application/json; charset=utf-8",
    success:func,error:err});
}
//支持简单多边形
//{"w":"171 612,173 217,190 172,770 155,755 342,725 423,686 445,624 468,534 496,399 535,347 580,270 597,231 635","o":[11700,3665]}
function encodePolygon(poly) {
    if (poly.components.length < 1) return -1;
    var vts = poly.components[0].getVertices();
    //不能超过490个点，否则存不下
    if (vts.length > 490) return -1;
    var pt = vts[0];
    var ox = Math.floor(pt.x * 1e2) * 1e3,
  oy = Math.floor(pt.y * 1e2) * 1e3;
    var res = [];
    for (var i = 0; i < vts.length; i++) {
        pt = vts[i];
        res.push([Math.round(pt.x * 1e5) - ox,
    Math.round(pt.y * 1e5) - oy].join(' '));
    }
    return JSON.stringify({ w: res.join(","), o: [ox / 1e3, oy / 1e3] });
}

function decodePolygon(obj) {
    var pts = [];
    var ox = obj.o[0] * 1e3, oy = obj.o[1] * 1e3;
    var cords = obj.w.split(',');
    for (var i = 0; i < cords.length; i++) {

        var c = cords[i].split(' ');
        var x = (parseInt(c[0]) + ox) / 1e5;
        var y = (parseInt(c[1]) + oy) / 1e5;
        pts.push(new Ol2.Geometry.Point(x, y));
    }
    var ring = new Ol2.Geometry.LinearRing(pts);
    var geo = new Ol2.Geometry.Polygon([ring]);
    return geo;
}




