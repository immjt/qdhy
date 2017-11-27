///<jscompress sourcefile="base.js" />
$(function(){SetCalcValue()});$(window).resize(function(){SetCalcValue()});function SetCalcValue(){$("[data-calc-height]").each(function(){var b=$(this);var a=b.parent();var c=b.attr("data-calc-height");b.height(GetCalcValue(c,a.height()))});$("[data-calc-width]").each(function(){var b=$(this);var a=b.parent();var c=b.attr("data-calc-width");b.width(GetCalcValue(c,a.width()))});$("[data-calc-left]").each(function(){var b=$(this);var a=b.parent();var c=b.attr("data-calc-left");b.css("left",GetCalcValue(c,a.width())+"px")})}function GetCalcValue(c,b){var a=c.split("-");return b*(parseInt(a[0].replace("%"))*0.01)-parseFloat(a[1])};;
///<jscompress sourcefile="portal.js" />
var baseURL = "";
var isTopPage = false;
var isNewTopPage = false;
var fileServerPath = "http://124.128.48.212:8081/FileServer/"; //文件服务器地址
//var portalServerPath = "http://www.sdmap.gov.cn/SDMapService/";  // 后台服务地址
var portalServerPath = "http://localhost:7298/";  // 后台服务地址
var teleServerPath = "http://172.20.5.111:80/SendTel/SendTel.aspx"; //手机验证码发送服务地址
//var wztjServerPath = "http://124.128.48.212:8081/WebStatistical/Statistical.js";  // 网站访问统计地址
var wztjServerPath = "http://localhost:3495/Statistical.js";  // 网站访问统计地址

var post = function (url, data, success) {
    data = data || {};
    url = portalServerPath + url;
    data.UserID = getCookie("USERID");
    data.SessionID = getCookie("JSESSIONID");

    $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: "post",
        success: function (data) {
            if (success && $.isFunction(success)) {
                success(data);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        contentType: "application/json; charset=utf-8"
    });
}

var postSync = function (url, data, success) {
    data = data || {};
    url = portalServerPath + url;
    data.UserID = getCookie("USERID");
    data.SessionID = getCookie("JSESSIONID");

    $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: "post",
        async: false, 
        success: function (data) {
            if (success && $.isFunction(success)) {
                success(data);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        contentType: "application/json; charset=utf-8"
    });
}

var get = function (url, data, success) {
    data = data || {};
    url = portalServerPath + url;
    data.UserID = currentUser.userID;
    data.SessionID = currentUser.sessionID;

    $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: "get",
        success: function (data) {
            success(data);
        },
        contentType: "application/json; charset=utf-8"
    });
}

var getSync = function (url, data, success) {
    data = data || {};
    url = portalServerPath + url;
    data.UserID = currentUser.userID;
    data.SessionID = currentUser.sessionID;

    $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: "get",
        async: false, 
        success: function (data) {
            success(data);
        },
        contentType: "application/json; charset=utf-8"
    });
}

var getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var currentUser = {
    userID: "",
    sessionID: "",
    userName:""
};


$(function () {
    currentUser.userID = getCookie("USERID");
    currentUser.sessionID = getCookie("JSESSIONID");
    currentUser.userName = getCookie("USERNAME");

});

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

/*------------------------------验证用户登陆权限------------------*/
//authCode:权限代码; success：返回结果回调方法
function checkAuthority(authCode, success) {
    var sessionModel = {};
    sessionModel.UserID = getCookie("USERID");
    sessionModel.SessionID = getCookie("JSESSIONID");
    sessionModel.AuthCode = authCode;
    post("CheckSession.svc/CheckAuthority", { value: JSON.stringify(sessionModel) }, function (data) {
        switch (data.State) {
            //未登录             
            case 0:
                delCookie("USERID");
                delCookie("JSESSIONID");
                delCookie("USERNAME");
                $("#login").html("登录");
                $("#login").attr("href", baseURL + "/LoginRegister/login.html");
                $("#reg").html("注册");
                $("#reg").attr("href", baseURL + "/LoginRegister/register.html");
                break;
            //已登录但无权限        
            case 1:
                if (isTopPage) {
                    var showuser = getSubString(getCookie("USERNAME"), 5);
                    $("#login").html(showuser);
                    $("#login").attr("href", baseURL + "/myspace.html");
                    $("#reg").html("退出");
                    $("#reg").attr("href", "javaScript:userout()"); //用户退出
                    if (data.IsAdmin) {
                        $("#portalManager").show();
                        $("#moreInfo").css('height', '52')
                        $("#manageInfo").show();
                        $("#manageUrl").attr("href", baseURL + data.ManageUrl);
                        //$("#portalManager").attr("href", baseURL + data.ManageUrl);
                    }
                } else if (isNewTopPage) {
                    var showuser = getSubString(getCookie("USERNAME"), 5);
                    $("#login").html(showuser);
                    $("#login").attr("href", baseURL + "/myspace.html");
                    $("#reg").html("退出");
                    $("#reg").attr("href", "javaScript:userout()"); //用户退出
                    if (data.IsAdmin) {
                        $("#portalManager").show();
                        $("#moreImg").show();
                        //$("#moreInfo").css('height', '52')
                        $("#manageInfo").show();
                        $("#manageUrl").attr("href", baseURL + data.ManageUrl);
                    }
                }
                break;
            //已登录且有权限         
            case 2:
                if (isTopPage) {
                    var showuser = getSubString(getCookie("USERNAME"), 5);
                    $("#login").html(showuser);
                    $("#login").attr("href", baseURL + "/myspace.html");
                    $("#reg").html("退出");
                    $("#reg").attr("href", "javaScript:userout()"); //用户退出
                    if (data.IsAdmin) {
                        $("#portalManager").show();
                        //$("#moreInfo").css('height', '26')
                        $("#manageInfo").show();
                        $("#manageUrl").attr("href", baseURL + data.ManageUrl);
                        //$("#portalManager").attr("href", baseURL + data.ManageUrl);
                    }
                } else if (isNewTopPage) {
                    var showuser = getSubString(getCookie("USERNAME"), 5);
                    $("#login").html(showuser);
                    $("#login").attr("href", baseURL + "/myspace.html");
                    $("#reg").html("退出");
                    $("#reg").attr("href", "javaScript:userout()"); //用户退出
                    if (data.IsAdmin) {
                        $("#portalManager").show();
                        $("#moreImg").show();
                        //$("#moreInfo").css('height', '26')
                        $("#manageInfo").show();
                        $("#manageUrl").attr("href", baseURL + data.ManageUrl);
                    }
                }
                break;
            default:

                break;
        }
        //返回结果回调方法
        if (success && $.isFunction(success)) {
            success(data.State);
        }
    });
}

function getSubString(data, subLenght) {
    if (data != null && data.length > subLenght) {
        return data.substring(0, subLenght) + "...";
    } else {
        return data;
    }
}

/*--------------------------用户退出-------------------*/
function userout() {
    delCookie("USERID");
    delCookie("JSESSIONID");
    delCookie("USERNAME");
    $("#login").html("登录");
    $("#login").attr("href", baseURL + "/LoginRegister/login.html");
    $("#reg").html("注册");
    $("#reg").attr("href", baseURL + "/LoginRegister/register.html"); //用户注册
    window.location.reload();
}


if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', { '': value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({ '': j }, '')
                    : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

function arrayIndex(data, value) {
    for (var i = 0, j; j = data[i]; i++) {
        if (j == value) { return i; }
    }
    return -1;
}
/** 格式化输入字符串**/
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (s, i) {
        return args[i];
    });
}
;
///<jscompress sourcefile="utils.js" />
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




;
///<jscompress sourcefile="config.js" />
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
        comHandl:"http://www.ztldcn.com:81/yykj/f/company/phone/",
        bd: "http://221.214.94.38:6080/arcgis/services/gt/gt_xz/MapServer/WMSServer",
       // ident:"http://221.214.94.38:6080/arcgis/rest/services/gt/gt_bj_sq/MapServer",
        upLoadHandl:"http://localhost:5158/uploadfile.ashx?dir=file",
        proxy:"proxy/proxy.ashx?",
        wmts_cfg :{ layer: "sdvec", style: "default", matrixSet: "tianditu2013", format: "image/png", open: true, minlevel:3,maxlevel:15 },
        qdhyTile:"http://221.214.94.38:6080/arcgis/services/qdhy/qdhy/MapServer/WMSServer",
        ident:"http://221.214.94.38:6080/arcgis/rest/services/qdhy/qdhy/MapServer"
    };
} ();;
///<jscompress sourcefile="sdmap.js" />
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
    OpenLayers.Util.applyDefaults(options, { scaleLine: true, zoombar: 1, 
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
;
///<jscompress sourcefile="plot.js" />
 

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
;
///<jscompress sourcefile="rightmenu.js" />



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
;
///<jscompress sourcefile="popup.js" />

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
;
///<jscompress sourcefile="tools.js" />
/**
* 测量工具
**/
var MeasureTool = function () {
    var inited = false, mLayers = [],
    toolui = [
    "<li class='toolbagClass' id='btnMeasureLine'><span class='btnToolbar-cont1'><span class='btnToolbar-img' style='background-position: 0 0;top:7px;width:20px;'></span>测距</span></li>",
    "<li class='toolbagClass' id='btnMeasurePolygon'><span class='btnToolbar-cont1'><span class='btnToolbar-img' style='background-position: -20px 0;top:4px;width:20px;'></span>测面</span></li>"
    ].join("");
    
    function init(tdiv) {
        if (inited) return;
        typeof tdiv == "object" ? $(tdiv).append(toolui) : $("#" + tdiv).append(toolui);        
        //定义量测样式
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 5,
                //graphicName: "square",
                fillColor: "white",
                fillOpacity: 1,
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#FF0000"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 0.5,
                strokeColor: "red",
                strokeDashstyle: "solid"
            },
            "Polygon": {
                strokeWidth: 3,
                strokeOpacity: 0.5,
                strokeColor: "red",
                fillColor: "white",
                fillOpacity: 0.3
            }
        };
        var style = new OpenLayers.Style();
        style.addRules([new OpenLayers.Rule({ symbolizer: sketchSymbolizers })]);
        var styleMap = new OpenLayers.StyleMap({ "default": style });

        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

        var lineControl = new OpenLayers.Control.Measure(
            OpenLayers.Handler.Path, {
                persist: true,
                geodesic:true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
            );
        lineControl.events.on({
            measure:function(event){
                var geometry = event.geometry;
                var len = geometry.components.length;
                var units = event.units;
                var order = event.order;
                var measure = event.measure;
                var point = {
                    x: geometry.components[len-1].x,
                    y: geometry.components[len-1].y
                };
                var res = this.map.getResolution();
                this.handler.layer.addFeatures([ new OpenLayers.Feature.Vector(geometry.components[len-1]) ]);
                var lonlat = new OpenLayers.LonLat(point.x + res * 2, point.y + res * 22);
                var out = "";
                var layer = null;
                var callfn = OpenLayers.Function.bind(function(layerid) {
                    layer = this.map.getLayer(layerid);
                    //先删除浮云
                    for (var i = this.lengthPopup.length - 1; i >= 0; i--) {
                        try {
                            popup = this.lengthPopup[i];
                            if (popup.id == layerid) {
                                this.map.removePopup(popup);
                            }
                        } catch (error) {}
                    }
                    //删除点和线的要素
                    if (layer) {
                        layer.destroyFeatures();
                    }
                    this.handler.point = null;
                    this.handler.line = null;
                    //删除图层
                    try {
                        that.map.removeLayer(layer);
                        mLayers.remove(tempLayer);
                    } catch (error) {}
                }, this, this.handler.layer.id);
                if (units == "km") {
                    units = "公里";
                } else {
                    units = "米";
                }
                //此id用来处理删除测量结果时的bug，做到依次删除
                var tempId = this.handler.layer.id.replace(/\./g, "") + "measureLine";
                out = "<div>" + 
                '<label unselectable="on" style="float:left; display: inline; cursor: inherit; background-color: rgb(255, 255, 255); border: 1px solid rgb(255, 1, 3); padding: 3px 5px; white-space: nowrap; font-style: normal; font-variant: normal; font-weight: normal; font-size: 12px; line-height: normal; font-family: arial, simsun; z-index: 85; color: rgb(51, 51, 51); -webkit-user-select: none;">' 
                + '总长：<span>' + measure.toFixed(2) + "</span>" + units + "" + "</label>" 
                + '<div style="float:left; margin: 0px; padding: 0px; width: 12px; height: 12px; overflow: hidden;"><img src="images/measure/close.png" id="' + tempId + '" class="celianClose"></div>' 
                + "</div>";
                var popup = new OpenLayers.Popup.Anchored(this.handler.layer.id, lonlat, null, out, {
                    size: new OpenLayers.Size(15, 10),
                    offset: new OpenLayers.Pixel(0, 0)
                }, false, callfn);
                popup.calculateNewPx = function(px) {
                    var newPx = px.offset(this.anchor.offset);
                    newPx.y += this.anchor.size.h;
                    newPx.x += this.anchor.size.w;
                    return newPx;
                };
                popup.contentDiv.className = "olAnchoredPopupContent";
                popup.autoSize = true;
                popup.minSize = new OpenLayers.Size(300, 24);
                popup.opacity = "1";
                popup.backgroundColor = "#fff";
                popup.backgroundColor = null;
                this.map.addPopup(popup);

                // 初始化图层信息
                var tempLayer = this.handler.layer.clone();
                tempLayer.id = this.handler.layer.id;
                mLayers.push(tempLayer);
                sdMap.map.addLayer(tempLayer);   
                var _lid = this.handler.layer.id;
                $("#" + tempId).unbind('click').click(function(){callfn(_lid);});
                $(".celianClose").css('cursor','pointer');
                if (!this.lengthPopup) {
                    this.lengthPopup = [];
                }
                this.lengthPopup.push(popup);
                this.handler.measureDistance = null;

                this.map.getControl("measureLineControl").deactivate();
                this.oldmousepop = measure.toFixed(2) + units;
                $("div.olMap").css({ cursor: "default" });
            },
            measurepartial: function(event) {
                var geometry = event.geometry;
                var len = geometry.components.length;
                var point = {
                    x: geometry.components[len - 1].x,
                    y: geometry.components[len - 1].y
                };
                var stat = this.getBestLength(geometry);
                var res = this.map.getResolution();
                this.handler.layer.addFeatures([ new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(point.x, point.y)) ]);
                var lonlat = new OpenLayers.LonLat(point.x + res * 2, point.y + res * 22);
                lonlat.add(point.x, point.y);
                var unit = event.units;
                var order = event.order;
                var measure = event.measure;
                var length;
                if (unit == "km") {
                    unit = "公里";
                } else {
                    unit = "米";
                }
                if (measure.toFixed(2) == "0.00") {
                    length = "起点";
                } else {
                    length = measure.toFixed(2) + unit;
                }
                this.newmousepop = length;
                var popstr = '<label style="border:medium none;padding:0px;background-color:#fff;display:inline;font:12px arial,simsun;wite-space:nowrap;color:#333;white-space:nowrap;">' 
                + "<span style=\"width:5px;height:17px;position:absolute;display:block;background-image:url('images/measure/dis_box_01.gif');background-attachment:scroll;background-repeat:no-repeat;background-position-x:left;background-position-y:top;background-color:transparent;\">" 
                + "<span style=\"left:5px;color:#7a7a7a;line-height:17px;padding: 0px 4px 1px 0px;position:absolute;background:url('images/measure/dis_box_01.gif') no-repeat scroll right top transparent;\">" + length + "</span>" + "</span>" 
                + "</label>";
                var str = "<span style=\"left:5px;color:#7a7a7a;line-height:17px;padding: 0px 4px 1px 0px;position:relative;background:url('images/measure/dis_box_01.gif') no-repeat scroll right top transparent;\">" + length + "</span>";
                var size = OpenLayers.Util.getRenderedDimensions(str, null, {});
                size.h = 17;
                size.w += 5;
                var popup = new OpenLayers.Popup.AnchoredPopup(this.handler.layer.id, lonlat, size, popstr, {
                    size: new OpenLayers.Size(15, 10),
                    offset: new OpenLayers.Pixel(0, 0)
                }, false, null);
                popup.calculateNewPx = function(px) {
                    var newPx = px.offset(this.anchor.offset);
                    newPx.y += this.anchor.size.h;
                    newPx.x += this.anchor.size.w;
                    return newPx;
                };
                popup.minSize = size;
                popup.opacity = "1";
                popup.backgroundColor = null;
                if (this.oldmousepop == this.newmousepop) {
                    this.newmousepop = null;
                    this.oldmousepop = null;
                } else {
                    this.map.addPopup(popup);
                }
                if (!this.lengthPopup) {
                    this.lengthPopup = [];
                }
                this.lengthPopup.push(popup);
            }
        });
lineControl.id = "measureLineControl";
var polygonControl = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
    persist: true,
    geodesic:true,
    handlerOptions: {
        layerOptions: {
            renderers: renderer,
            styleMap: styleMap
        }
    }
});
polygonControl.events.on({
    measure: function(event) {
        var geometry = event.geometry;
        var len = geometry.components[0].components.length;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        var point = {
            x: geometry.components[0].components[len - 2].x,
            y: geometry.components[0].components[len - 2].y
        };
        var res = this.map.getResolution();
        var lonlat = new OpenLayers.LonLat(point.x + res * 2, point.y + res * 22);
        var out = "";
        if (units == "km") {
            units = "平方公里";
        } else {
            units = "平方米";
        }
        out = "总面积:" + measure.toFixed(2) + units;
        var callfn = OpenLayers.Function.bind(function(layerid) {
            var layer = this.map.getLayer(layerid);
                    //先删除浮云
                    for (var i = this.lengthPopup.length - 1; i >= 0; i--) {
                        try {
                            popup = this.lengthPopup[i];
                            if (popup.id == layerid) {
                                this.map.removePopup(popup);
                            }
                        } catch (error) {}
                    }
                    //删除点和线的要素
                    if (layer) {
                        layer.destroyFeatures();
                    }
                    this.handler.point = null;
                    this.handler.line = null;
                    this.handler.polygon = null;
                    //删除图层
                    try {
                        that.map.removeLayer(layer);
                        mLayers.remove(tempLayer);
                    } catch (error) {}
                }, this, this.handler.layer.id);
        this.handler.removePoint();
                //此id用来处理删除测量结果时的bug，做到依次删除
                var tempId = this.handler.layer.id.replace(/\./g, "") + "measureArea";
                out = "<div>" 
                + '<label class=" unselectable="on" style="float:left; display: inline; cursor: inherit; background-color: rgb(255, 255, 255); border: 1px solid rgb(255, 1, 3); padding: 3px 5px; white-space: nowrap; font-style: normal; font-variant: normal; font-weight: normal; font-size: 12px; line-height: normal; font-family: arial, simsun; z-index: 85; color: rgb(51, 51, 51); -webkit-user-select: none;">' 
                + '总面积：<span>' + measure.toFixed(2) + "</span>" + units + "" + "</label>" 
                + '<div style="float:left; margin: 0px; padding: 0px; width: 12px; height: 12px; overflow: hidden;"><img  src="images/measure/close.png" id="' + tempId + '" class="celianClose"></div>' + "</div>";
                //'</label>';
                var popup = new OpenLayers.Popup.Anchored(this.handler.layer.id, lonlat, null, out, {
                    size: new OpenLayers.Size(15, 10),
                    offset: new OpenLayers.Pixel(0, 0)
                }, false, callfn);
                popup.calculateNewPx = function(px) {
                    var newPx = px.offset(this.anchor.offset);
                    newPx.y += this.anchor.size.h;
                    newPx.x += this.anchor.size.w;
                    return newPx;
                };
                popup.contentDiv.className = "olAnchoredPopupContent";
                popup.autoSize = true;
                popup.minSize = new OpenLayers.Size(300, 24);
                popup.opacity = "1";
                popup.backgroundColor = "#fff";
                popup.backgroundColor = null;
                this.map.addPopup(popup);

                // 初始化图层信息
                var tempLayer = this.handler.layer.clone();
                tempLayer.id = this.handler.layer.id;
                mLayers.push(tempLayer);
                sdMap.map.addLayer(tempLayer);  
                var _lid = this.handler.layer.id;
                $("#" + tempId).click(function(){callfn(_lid);});
                $(".celianClose").css('cursor','pointer');
                if (!this.lengthPopup) {
                    this.lengthPopup = [];
                }
                this.lengthPopup.push(popup);
                this.handler.measureDistance = null;
                this.map.getControl("measurePolygonControl").deactivate();
                $("div.olMap").css({ cursor: "default" });
            },
            measurepartial: function(event) {}
        });
polygonControl.id = "measurePolygonControl";
sdMap.map.addControl(lineControl);   
sdMap.map.addControl(polygonControl);        

$('#btnMeasureLine').click(function (e) {
    $('#toolbag_div').css("display", "none");
    sdMap.map.getControl("measurePolygonControl").deactivate();
    sdMap.map.getControl("measureLineControl").activate();
    $("div.olMap").css({ cursor: "url('images/Line.cur'),auto" });
});
$('#btnMeasurePolygon').click(function (e) {
    $('#toolbag_div').css("display", "none");
    sdMap.map.getControl("measureLineControl").deactivate();
    sdMap.map.getControl("measurePolygonControl").activate();
    $("div.olMap").css({ cursor: "url('images/Line.cur'),auto" });
});
inited = true;
}
return {
    init: init,
    clear: function () {
        if(mLayers.length > 0){
            for (var i = mLayers.length; i--; i > 0) {
                var layer = mLayers[i];
                layer.removeAllFeatures();
                sdMap.map.removeLayer(layer);
            }  
        }

        mLayers = [];
    }
};
} ();

// /**
// * 底图切换
// **/
// var MapSwitch = function () {

//     var inited = false,sdmap, toolui = [
//     "<div id='vec_' title='地图' class='active'>",
//     "    地 图",
//     "</div>",
//     "<div id='img_' title='影像'>",
//     "    影 像",
//     "    </div>",
//     "    <div id='img_year_div'>",
//     "        <ul id='img_year_number'>",
//     "            <li  id='number_2014' class='number_year active'>2014</li>",
//     "            <li  id='number_2013' class='number_year'>2013</li>",
//     "            <li  id='number_2012' class='number_year'>2012</li>",
//     "            <li  id='number_2008' class='number_year'>2008</li>",
//     "            <li  id='number_2006' class='number_year'>2006</li>",
//     "        </ul>",
//     "<div class='switch_zj'><input id='zjshow' type='checkbox' checked='checked'/><label>注记</label></div>",

//     "</div>"].join("");
//     function init(tdiv,smap) {
//         if (inited) return;
//         sdmap=smap;
//         typeof tdiv == "object" ? $(tdiv).append(toolui) : $("#" + tdiv).append(toolui);
//         //切换地图
//         $('#img_').click(function (e) {
//             $(this).addClass("active");
//             $("#vec_").removeClass("active");
//             $("#img_year_div").show();
//             $(".olControlScaleLineTop").css({ "border": "solid 2px white",
//                 "border-top": "none",
//                 "color": "white"
//             });
//             $(".olControlScaleLineBottom").css({ "border": "solid 2px white",
//                 "border-bottom": "none",
//                 "color": "white"
//             });
//             $(".number_year").removeClass("active");
//             $("#number_2014").addClass("active");
//             sdmap.tileLayerManager.switchMap(2, Bzj);
//             // SwitchImage(imageYearFlags);
//             // imgSourceQuery();
//         });
//         $('#vec_').click(function (e) {

//             $("#img_year_div").hide();
//             $(this).addClass("active");
//             $("#img_").removeClass("active");
//             $(".olControlScaleLineTop").css({ "border": "solid 2px black",
//                 "border-top": "none",
//                 "color": "black"
//             });
//             $(".olControlScaleLineBottom").css({ "border": "solid 2px black",
//                 "border-bottom": "none",
//                 "color": "black"
//             });
//             //$(".black_white").css("color","black");
//             //$(".olControlScaleLine").css("color","black");
//             sdmap.tileLayerManager.switchMap(1);
//         });
//         //切换影像
//         $('#img_').mouseenter(function (e) {
//             if ($(this).hasClass("active")) {
//                 $("#img_year_div").show();
//             }

//         });
//         /*   $('#img_year_div').mouseleave(function (e) {
//         $("#img_year_div").hide();
//     });*/

// $('#img_year_div').mouseenter(function (e) {
//     $("#img_").removeAttr("title");
//     $("#img_").css("cursor", "default");
//     $(this).css("display", "block");
// });
// $('#img_year_div').mouseleave(function (e) {
//     $("#img_").attr("title", "影像");
//     $("#img_").css("cursor", "pointer");
//     $('#imageYear').css("display", "none");
//     $("#img_year_div").hide();
// });
// $('#zjshow').click(function (e) {
//     if ($(this)[0].checked) { sdmap.tileLayerManager.switchMap(null,true); Bzj = true; }
//             //TileLayerManager.switchMap(0,true); }
//             else { sdmap.tileLayerManager.switchMap(null,false); Bzj = false; }
//             //TileLayerManager.switchMap(0,false);};
//         })
// $('#img_year_number').on("click", "li", function (e) {
//     e.stopImmediatePropagation();
//     var radioVal = $(this)[0].innerHTML;
//     $(".number_year").removeClass("active");
//     if (radioVal == "2014") {
//         $("#number_2014").addClass("active");
//         sdmap.tileLayerManager.switchMap(2, Bzj);
//         $("body [value = 2014]").prop("checked", true);

//     }
//     else if (radioVal == "2013") {
//         $("#number_2013").addClass("active");
//         sdmap.tileLayerManager.switchMap(3, Bzj);
//     }
//     else if (radioVal == "2012") {
//         $("#number_2012").addClass("active");
//         sdmap.tileLayerManager.switchMap(4, Bzj);
//     }
//     else if (radioVal == "2008") {
//         $("#number_2008").addClass("active");
//         sdmap.tileLayerManager.switchMap(5, Bzj);
//     }
//     else {
//         $("#number_2006").addClass("active");
//         sdmap.tileLayerManager.switchMap(6, Bzj);
//     }

// });
// inited = true;
// }
// return {
//     init: init
// };
// } ();

// /**
// * 城市切换
// **/
// var RegionSwitch = function () {
//     var inited = false, sdmap, dictLayer, timer, color,
//     regionpan = "<div id='dictInfo'title='点击查看详情'><div id='dictInfoDiv'><div id='dictInfoTitle'>山东省</div><div id='dictInfoText'></div><div id='dictInfoClose'></div><a id='linkId'target='_blank'style='color:blue;margin-left: 250px;'>详情链接</a></div></div><div id='dictDiv'><div id='dict_list_title'><a class='sheng'>山东省</a><div id='dict_close'></div></div><div id='dict_item'><ul id='dict_ul'><li><a class='shi'>济南市</a><a class='xian'style='margin-left:20px;'>历下区</a><a class='xian'>市中区</a><a class='xian'>槐荫区</a><a class='xian'>天桥区</a><a class='xian'>历城区</a><a class='xian'>长清区</a><br/><a class='xian'style='margin-left:56px;'>平阴县</a><a class='xian'>济阳县</a><a class='xian'>商河县</a><a class='xian'>章丘县</a></li><li><a class='shi'>青岛市</a><a class='xian'style='margin-left:20px;'>市南区</a><a class='xian'>市北区</a><a class='xian'>黄岛区</a><a class='xian'>崂山区</a><a class='xian'>李沧区</a><a class='xian'>城阳区</a><br/><a class='xian'style='margin-left:56px;'>胶州市</a><a class='xian'>即墨市</a><a class='xian'>平度市</a><a class='xian'>莱西市</a></li><li><a class='shi'>淄博市</a><a class='xian'style='margin-left:20px;'>淄川区</a><a class='xian'>张店区</a><a class='xian'>博山区</a><a class='xian'>临淄区</a><a class='xian'>周村区</a><a class='xian'>恒台县</a><br/><a class='xian'style='margin-left:56px;'>高青县</a><a class='xian'>沂源县</a></li><li><a class='shi'>枣庄市</a><a class='xian'style='margin-left:20px;'>市中区</a><a class='xian'>薛城区</a><a class='xian'>峄城区</a><a class='xian'>台儿庄区</a><a class='xian'>山亭区</a><a class='xian'>滕州市</a></li><li><a class='shi'>东营市</a><a class='xian'style='margin-left:20px;'>东营区</a><a class='xian'>河口区</a><a class='xian'>垦利县</a><a class='xian'>利津县</a><a class='xian'>广饶县</a></li><li><a class='shi'>烟台市</a><a class='xian'style='margin-left:20px;'>芝罘区</a><a class='xian'>福山区</a><a class='xian'>牟平区</a><a class='xian'>莱山区</a><a class='xian'>长岛县</a><a class='xian'>龙口市</a><br/><a class='xian'style='margin-left:56px;'>莱阳市</a><a class='xian'>莱州市</a><a class='xian'>蓬莱市</a><a class='xian'>招远市</a><a class='xian'>栖霞市</a><a class='xian'>海阳市</a></li><li><a class='shi'>潍坊市</a><a class='xian'style='margin-left:20px;'>潍城区</a><a class='xian'>寒亭区</a><a class='xian'>坊子区</a><a class='xian'>奎文区</a><a class='xian'>临朐县</a><a class='xian'>昌乐县</a><br/><a class='xian'style='margin-left:56px;'>青州市</a><a class='xian'>诸城市</a><a class='xian'>寿光市</a><a class='xian'>安丘市</a><a class='xian'>高密市</a><a class='xian'>昌邑市</a></li><li><a class='shi'>济宁市</a><a class='xian'style='margin-left:20px;'>任城区</a><a class='xian'>微山县</a><a class='xian'>鱼台县</a><a class='xian'>金乡县</a><a class='xian'>嘉祥县</a><a class='xian'>汶上县</a><br/><a class='xian'style='margin-left:56px;'>泗水县</a><a class='xian'>梁山县</a><a class='xian'>曲阜市</a><a class='xian'>兖州区</a><a class='xian'>邹城市</a></li><li><a class='shi'>泰安市</a><a class='xian'style='margin-left:20px;'>泰山区</a><a class='xian'>岳岱区</a><a class='xian'>宁阳县</a><a class='xian'>东平县</a><a class='xian'>新泰市</a><a class='xian'>肥城市</a></li><li><a class='shi'>威海市</a><a class='xian'style='margin-left:20px;'>环翠区</a><a class='xian'>文登区</a><a class='xian'>荣成市</a><a class='xian'>乳山市</a></li><li><a class='shi'>日照市</a><a class='xian'style='margin-left:20px;'>东港区</a><a class='xian'>岚山区</a><a class='xian'>五莲县</a><a class='xian'>莒县</a></li><li><a class='shi'>莱芜市</a><a class='xian'style='margin-left:20px;'>莱芜区</a><a class='xian'>钢城区</a></li><li><a class='shi'>临沂市</a><a class='xian'style='margin-left:20px;'>兰山区</a><a class='xian'>罗庄区</a><a class='xian'>河东区</a><a class='xian'>沂南县</a><a class='xian'>郯城县</a><a class='xian'>沂水县</a><br/><a class='xian'style='margin-left:56px;'>兰陵县</a><a class='xian'>费县</a><a class='xian'>平邑县</a><a class='xian'>莒南县</a><a class='xian'>蒙阴县</a><a class='xian'>临沭县</a></li><li><a class='shi'>德州市</a><a class='xian'style='margin-left:20px;'>德城区</a><a class='xian'>陵城区</a><a class='xian'>宁津县</a><a class='xian'>庆云县</a><a class='xian'>临邑县</a><a class='xian'>齐河县</a><br/><a class='xian'style='margin-left:56px;'>平原县</a><a class='xian'>夏津县</a><a class='xian'>武城县</a><a class='xian'>乐陵市</a><a class='xian'>禹城市</a></li><li><a class='shi'>聊城市</a><a class='xian'style='margin-left:20px;'>冠县</a><a class='xian'>高唐县</a><a class='xian'>临清市</a><a class='xian'>东昌府区</a><a class='xian'>阳谷县</a><a class='xian'>莘县</a><br/><a class='xian'style='margin-left:56px;'>茌平县</a><a class='xian'>东阿县</a></li><li><a class='shi'>滨州市</a><a class='xian'style='margin-left:20px;'>惠民县</a><a class='xian'>阳信县</a><a class='xian'>无棣县</a><a class='xian'>沾化区</a><a class='xian'>博兴县</a><a class='xian'>邹平县</a><br/><a class='xian'style='margin-left:56px;'>滨城区</a></li><li><a class='shi'>菏泽市</a><a class='xian'style='margin-left:20px;'>牡丹区</a><a class='xian'>曹县</a><a class='xian'>单县</a><a class='xian'>成武县</a><a class='xian'>巨野县</a><a class='xian'>郓城县</a><br/><a class='xian'style='margin-left:56px;'>鄄城县</a><a class='xian'>定陶县</a><a class='xian'>东明县</a></li></ul></div></div>";
    
//     function hideRegionDiv(){
//         $('#dict_text').removeClass('active');
//         $('#dictDiv').css("display", "none");
//     }

//     function hideRegionListDivListener(e){
//         e =e || window.event;
//         var target = $(e.target);
//         if(target.closest("#dict").length == 0){
//             hideRegionDiv();
//             $(document).unbind("click", hideRegionListDivListener);
//         }
//     }

//     function init(tdiv, smap) {
//         if (inited) return;
//         sdmap = smap,
//         typeof tdiv == "object" ? $(tdiv).append(regionpan) : $("#" + tdiv).append(regionpan);

//         sdmap.map.events.on({"moveend": city_moveEndListener, "click":function(){
//             hideRegionDiv();
//         }});

//         //行政定位
//         $('#dict_text').click(function () {
//             if ($(this).hasClass('active')) {
//                 hideRegionDiv();
//             } else {
//                 $('#dictDiv').css("display", "block");
//                 $(this).addClass('active');
//                 $(document).bind("click", hideRegionListDivListener);
//             }
//         });
//         $('#dict_close').click(function (e) {
//             hideRegionDiv();
//         });
//         $('#dictDiv').on('click', 'a', function () {            
//             sdmap.map.events.un({"moveend": city_moveEndListener});
//             //  dictFlag = true;
//             $('#dictDiv').css("display", "none");
//             $('#dictInfo').css("display", "block");
//             $('#dictInfoDiv').css("display", "none");
//             if ($(this).hasClass('shi')) {
//                 dictQuery2($(this).text(), "");
//                 $('#dict_text').text($(this).text());
//                 $('#dictInfo').css("margin-left", $('#dict_text').width() + 50 + "px");
//             }
//             else if ($(this).hasClass('xian')) {
//                 var shi = $(this).siblings(".shi").text();
//                 dictQuery2(shi, $(this).text());
//                 $('#dict_text').text(shi + ">" + $(this).text());
//                 $('#dictInfo').css("margin-left", $('#dict_text').width() + 50 + "px");
//             }
//             else {
//                 if (dictLayer != null) {
//                     dictLayer.removeAllFeatures();
//                 }
//                 $('#dict_text').text("山东省");
//                 $('#dictInfo').css("margin-left", $('#dict_text').width() + 50 + "px");
//                 var lonLat = new OpenLayers.LonLat(119.00, 36.40);
//                 sdmap.map.setCenter(lonLat, 7);
//             }
//             $('#dict_text').removeClass('active');
//         });
// $('#dictInfoClose').click(function (e) {
//     $("#dictInfoDiv").animate({ height: 0 }, "slow", function () {
//         $(this).css({ display: "none",
//             height: "auto"
//         });
//     });

// });
// $('#dictInfo').click(function (e) {
//     if ($('#dictInfoDiv').css('display') == "block") {
//         $('#dictInfoDiv').css("display", "none");
//     }
//     else {
//         $('#dictInfoDiv').css("height", "auto");
//         var completeHeight = $('#dictInfoDiv').height();
//         $('#dictInfoDiv').css("display", "block");
//         $('#dictInfoDiv').css("height", "0px");
//         $("#dictInfoDiv").animate({ height: completeHeight }, "slow", function (e) {
//         });
//     }
// });
// inited = true;
// }

// function city_moveEndListener(){
//     dictQuery();
// }

//     //行政反定位
//     function dictQuery() {
//         $('#dictInfo').css("display", "none");
//         var lonlat = sdmap.map.getCenter();
//         var scale = sdmap.map.getScale();
//         var url = Service.CitySearch + "lon=" + lonlat.lon + "&lat=" + lonlat.lat + "&scale=" + scale;
//         $.ajax({
//             dataType: "xml",
//             url: url,
//             success: function (da) {
//                 var dataText = da.getElementsByTagName("string");
//                 var str = dataText[0].firstChild.nodeValue;
//                 var strarr = str.split(',');
//                 if(strarr.length == 1)
//                     $('#dict_text').text(str);
//                 else if(strarr.length == 2)
//                     $('#dict_text').text(strarr[1]);
//                 else if(strarr.length == 3)
//                     $('#dict_text').text(strarr[1] + ">" + strarr[2]);
//                 else
//                     $('#dict_text').text(dataText[0].firstChild.nodeValue.replace(/,/g, ">"));
//             }
//         });
//     }
//     //行政定位
//     function dictQuery2(cityName, countryName) {
//         var ways = countryName ? 2 : 1;
//         var provinceName = "山东省";
//         var url = Service.CityBound + "cityName=" + encodeURIComponent(cityName) + "&ways=" + ways + "&countryName=" + encodeURIComponent(countryName) + "&provinceName=" + encodeURIComponent(provinceName);
//         $.ajax({
//             dataType: "xml",
//             url: url,
//             success: function (data) {
//                 var dataNode = data.getElementsByTagName("Shape");

//                 if (isIE = navigator.userAgent.indexOf("MSIE") != -1) {
//                     var linkName = data.getElementsByTagName("LinkName")[0].text;
//                     var text = data.getElementsByTagName("Description")[0].text;
//                     var linkUrl = data.getElementsByTagName("LinkURL")[0].text;
//                 }
//                 else {

//                     var linkName = $(data.getElementsByTagName("LinkName")).text();
//                     var text = $(data.getElementsByTagName("Description")).text();
//                     var linkUrl = $(data.getElementsByTagName("LinkURL")).text();
//                 }

//                 $('#dictInfoTitle').text(linkName);
//                 $('#dictInfoText').text(text);
//                 $('#linkId').attr("href", linkUrl);
//                 var dataobj = dataNode[0].childNodes[0].data;
//                 var json = "{rings:[";
//                 var wkt = dataobj.substring(dataobj.indexOf("(") + 1, dataobj.lastIndexOf(")"));
//                 lineJson = wkt.replace(/(\({2})/g, "(");
//                     lineJson = lineJson.replace(/(\){2})/g, ")");
//                     var lineJson = lineJson.replace(/\(/g, "[").replace(/\)/g, "]");
//                     var re = /([\d\.]+)\s([\d\.]+)/g;
//                     lineJson = lineJson.replace(re, "[$1,$2]");
//                     json += lineJson;
//                     json += "]}";
//                     var jsonObj = eval("(" + json + ")");
//                     polygon(jsonObj);
//                     sdmap.map.events.on({"moveend": city_moveEndListener});
//                 //行政信息动画
//                 setTimeout(function () {
//                     $('#dictInfo').click();
//                 }, 500);
//                 setTimeout(function () {
//                     $('#dictInfoClose').click();
//                 }, 3000);
//             }
//         });
// }

//     //行政区划绘制
//     function polygon(jsonObj) {
//         if (dictLayer != null) {
//             dictLayer.removeAllFeatures();
//         }
//         else {
//             var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
//             style.fillOpacity = 0.2;
//             style.strokeColor = "blue";
//             style.fillColor = "blue";

//             style.strokeWidth = 2;
//             style.strokeDashstyle = "longdash";
//             dictLayer = new OpenLayers.Layer.Vector("行政定位", {
//                 style: style
//             });
//             sdmap.addLayer(dictLayer);
//         }

//         var polygonFeature = [];
//         for (var j = 0; j < jsonObj.rings.length; j++) {
//             var pointList = [];
//             for (var i = 0; i < jsonObj.rings[j].length; i++) {
//                 var newPoint = new OpenLayers.Geometry.Point(jsonObj.rings[j][i][0], jsonObj.rings[j][i][1]);
//                 pointList.push(newPoint);
//             }
//             var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
//             var polyg = new OpenLayers.Geometry.Polygon([linearRing]);
//             polygonFeature[j] = new OpenLayers.Feature.Vector(polyg);


//         }
//         dictLayer.addFeatures(polygonFeature);
//         dictLayer.redraw();
//         sdmap.map.zoomToExtent(dictLayer.getDataExtent());
//         color = 1;
//         timer = setInterval(ChangeColor, 600);

//     }

//     //行政区划闪烁
//     function ChangeColor() {
//         if (color == 1) {
//             for (var i = 0; i < dictLayer.features.length; i++) {
//                 dictLayer.features[i].style.fillColor = "green";
//                 dictLayer.features[i].style.fillOpacity = 0.6;
//                 dictLayer.redraw(true);
//             }
//             color = color + 1; ;
//         }
//         else if (color == 2) {
//             for (var i = 0; i < dictLayer.features.length; i++) {
//                 dictLayer.features[i].style.fillColor = "blue";
//                 dictLayer.features[i].style.fillOpacity = 0.6;
//                 dictLayer.redraw(true);
//             }
//             color = color + 1;
//         }
//         else if (color == 3) {
//             for (var i = 0; i < dictLayer.features.length; i++) {
//                 dictLayer.features[i].style.fillColor = "green";
//                 dictLayer.features[i].style.fillOpacity = 0.6;
//                 dictLayer.redraw(true);
//             }
//             color = color + 1;
//         }
//         else if (color == 4) {
//             for (var i = 0; i < dictLayer.features.length; i++) {
//                 dictLayer.features[i].style.fillOpacity = 0;
//                 dictLayer.redraw(true);
//             }
//             color = color + 1;
//         }
//         else {
//             clearTimeout(timer);
//         }
//     }

//     return {
//         init: init,
//         clear: function () {
//             clearTimeout(timer);
//             if (dictLayer != null) {
//                 dictLayer.destroyFeatures();
//                 sdmap.map.removeLayer(dictLayer);
//                 dictLayer = null;
//             }
//         }
//     };
// } ();
/**
* 底图切换
**/
var MapSwitch = function () {

    var inited = false, sdmap, toolui = [
    "<div id='vec_' title='地图' class='active'>",
    "    地 图",
    "</div>",
    "<div id='img_' title='影像'>",
    "    影 像",
    "    </div>",
    "    <div id='img_year_div'>",

    "<div class='switch_zj'><input id='zjshow' type='checkbox' checked='checked'/><label>注记</label></div>",

    "</div>"].join("");
    function init(tdiv, smap) {
        if (inited) return;
        sdmap = smap;
        typeof tdiv == "object" ? $(tdiv).append(toolui) : $("#" + tdiv).append(toolui);
        //切换地图
        $('#img_').click(function (e) {
            $(this).addClass("active");
            $("#vec_").removeClass("active");
            $("#img_year_div").show();
            $(".olControlScaleLineTop").css({ "border": "solid 2px white",
                "border-top": "none",
                "color": "white"
            });
            $(".olControlScaleLineBottom").css({ "border": "solid 2px white",
                "border-bottom": "none",
                "color": "white"
            });
            $(".number_year").removeClass("active");

            sdmap.tileLayerManager.switchMap("img", Bzj);

        });
        $('#vec_').click(function (e) {

            $("#img_year_div").hide();
            $(this).addClass("active");
            $("#img_").removeClass("active");
            $(".olControlScaleLineTop").css({ "border": "solid 2px black",
                "border-top": "none",
                "color": "black"
            });
            $(".olControlScaleLineBottom").css({ "border": "solid 2px black",
                "border-bottom": "none",
                "color": "black"
            });

            sdmap.tileLayerManager.switchMap("vec", true);
        });
        //切换影像
        $('#img_').mouseenter(function (e) {
            if ($(this).hasClass("active")) {
                $("#img_year_div").show();
            }

        });
        $('#img_year_div').mouseleave(function (e) {
            $("#img_year_div").hide();
        });


        $('#zjshow').click(function (e) {
            if ($(this)[0].checked) { sdmap.tileLayerManager.setVisibility("img_n", true); Bzj = true; }

            else { sdmap.tileLayerManager.setVisibility("img_n", false); Bzj = false; }

        })

        inited = true;
    }
    return {
        init: init
    };
} ();

/**
* 城市切换
**/
var RegionSwitch = function () {
    var inited = false, sdmap, dictLayer, timer, color,isactive=true,
    // regionpan = "<div id='dictInfo'title='点击查看详情'><div id='dictInfoDiv'><div id='dictInfoTitle'>山东省</div><div id='dictInfoText'></div><div id='dictInfoClose'></div><a id='linkId'target='_blank'style='color:blue;margin-left: 250px;'>详情链接</a></div></div><div id='dictDiv'><div id='dict_list_title'><a class='sheng'>山东省</a><div id='dict_close'></div></div><div id='dict_item'><ul id='dict_ul'><li><a class='shi'>济南市</a><a class='xian'style='margin-left:20px;'>历下区</a><a class='xian'>市中区</a><a class='xian'>槐荫区</a><a class='xian'>天桥区</a><a class='xian'>历城区</a><a class='xian'>长清区</a><br/><a class='xian'style='margin-left:56px;'>平阴县</a><a class='xian'>济阳县</a><a class='xian'>商河县</a><a class='xian'>章丘县</a></li><li><a class='shi'>青岛市</a><a class='xian'style='margin-left:20px;'>市南区</a><a class='xian'>市北区</a><a class='xian'>黄岛区</a><a class='xian'>崂山区</a><a class='xian'>李沧区</a><a class='xian'>城阳区</a><br/><a class='xian'style='margin-left:56px;'>胶州市</a><a class='xian'>即墨市</a><a class='xian'>平度市</a><a class='xian'>莱西市</a></li><li><a class='shi'>淄博市</a><a class='xian'style='margin-left:20px;'>淄川区</a><a class='xian'>张店区</a><a class='xian'>博山区</a><a class='xian'>临淄区</a><a class='xian'>周村区</a><a class='xian'>桓台县</a><br/><a class='xian'style='margin-left:56px;'>高青县</a><a class='xian'>沂源县</a></li><li><a class='shi'>枣庄市</a><a class='xian'style='margin-left:20px;'>市中区</a><a class='xian'>薛城区</a><a class='xian'>峄城区</a><a class='xian'>台儿庄区</a><a class='xian'>山亭区</a><a class='xian'>滕州市</a></li><li><a class='shi'>东营市</a><a class='xian'style='margin-left:20px;'>东营区</a><a class='xian'>河口区</a><a class='xian'>垦利县</a><a class='xian'>利津县</a><a class='xian'>广饶县</a></li><li><a class='shi'>烟台市</a><a class='xian'style='margin-left:20px;'>芝罘区</a><a class='xian'>福山区</a><a class='xian'>牟平区</a><a class='xian'>莱山区</a><a class='xian'>长岛县</a><a class='xian'>龙口市</a><br/><a class='xian'style='margin-left:56px;'>莱阳市</a><a class='xian'>莱州市</a><a class='xian'>蓬莱市</a><a class='xian'>招远市</a><a class='xian'>栖霞市</a><a class='xian'>海阳市</a></li><li><a class='shi'>潍坊市</a><a class='xian'style='margin-left:20px;'>潍城区</a><a class='xian'>寒亭区</a><a class='xian'>坊子区</a><a class='xian'>奎文区</a><a class='xian'>临朐县</a><a class='xian'>昌乐县</a><br/><a class='xian'style='margin-left:56px;'>青州市</a><a class='xian'>诸城市</a><a class='xian'>寿光市</a><a class='xian'>安丘市</a><a class='xian'>高密市</a><a class='xian'>昌邑市</a></li><li><a class='shi'>济宁市</a><a class='xian'style='margin-left:20px;'>任城区</a><a class='xian'>微山县</a><a class='xian'>鱼台县</a><a class='xian'>金乡县</a><a class='xian'>嘉祥县</a><a class='xian'>汶上县</a><br/><a class='xian'style='margin-left:56px;'>泗水县</a><a class='xian'>梁山县</a><a class='xian'>曲阜市</a><a class='xian'>兖州区</a><a class='xian'>邹城市</a></li><li><a class='shi'>泰安市</a><a class='xian'style='margin-left:20px;'>泰山区</a><a class='xian'>岳岱区</a><a class='xian'>宁阳县</a><a class='xian'>东平县</a><a class='xian'>新泰市</a><a class='xian'>肥城市</a></li><li><a class='shi'>威海市</a><a class='xian'style='margin-left:20px;'>环翠区</a><a class='xian'>文登区</a><a class='xian'>荣成市</a><a class='xian'>乳山市</a></li><li><a class='shi'>日照市</a><a class='xian'style='margin-left:20px;'>东港区</a><a class='xian'>岚山区</a><a class='xian'>五莲县</a><a class='xian'>莒县</a></li><li><a class='shi'>莱芜市</a><a class='xian'style='margin-left:20px;'>莱芜区</a><a class='xian'>钢城区</a></li><li><a class='shi'>临沂市</a><a class='xian'style='margin-left:20px;'>兰山区</a><a class='xian'>罗庄区</a><a class='xian'>河东区</a><a class='xian'>沂南县</a><a class='xian'>郯城县</a><a class='xian'>沂水县</a><br/><a class='xian'style='margin-left:56px;'>兰陵县</a><a class='xian'>费县</a><a class='xian'>平邑县</a><a class='xian'>莒南县</a><a class='xian'>蒙阴县</a><a class='xian'>临沭县</a></li><li><a class='shi'>德州市</a><a class='xian'style='margin-left:20px;'>德城区</a><a class='xian'>陵城区</a><a class='xian'>宁津县</a><a class='xian'>庆云县</a><a class='xian'>临邑县</a><a class='xian'>齐河县</a><br/><a class='xian'style='margin-left:56px;'>平原县</a><a class='xian'>夏津县</a><a class='xian'>武城县</a><a class='xian'>乐陵市</a><a class='xian'>禹城市</a></li><li><a class='shi'>聊城市</a><a class='xian'style='margin-left:20px;'>冠县</a><a class='xian'>高唐县</a><a class='xian'>临清市</a><a class='xian'>东昌府区</a><a class='xian'>阳谷县</a><a class='xian'>莘县</a><br/><a class='xian'style='margin-left:56px;'>茌平县</a><a class='xian'>东阿县</a></li><li><a class='shi'>滨州市</a><a class='xian'style='margin-left:20px;'>惠民县</a><a class='xian'>阳信县</a><a class='xian'>无棣县</a><a class='xian'>沾化区</a><a class='xian'>博兴县</a><a class='xian'>邹平县</a><br/><a class='xian'style='margin-left:56px;'>滨城区</a></li><li><a class='shi'>菏泽市</a><a class='xian'style='margin-left:20px;'>牡丹区</a><a class='xian'>曹县</a><a class='xian'>单县</a><a class='xian'>成武县</a><a class='xian'>巨野县</a><a class='xian'>郓城县</a><br/><a class='xian'style='margin-left:56px;'>鄄城县</a><a class='xian'>定陶县</a><a class='xian'>东明县</a></li></ul></div></div>";
    regionpan = "<div id='dictInfo'title='点击查看详情'><div id='dictInfoDiv'><div id='dictInfoTitle'>山东省</div><div id='dictInfoText'></div><div id='dictInfoClose'></div><a id='linkId'target='_blank'style='color:blue;margin-left: 250px;'>详情链接</a></div></div><div style='clear:both'></div><div id='dictDiv'><div id='dict_list_title'><a class='sheng'>山东省</a><div id='dict_close'></div></div><div id='dict_item'><table border='0' cellspacing='0' cellpadding='0' width='100%' id='cityTable'></table></div></div>";
  //  var bShowRegion = false;
    var curRegionTitle,bflashing=false;
var clearhander,cleartime=10000;//10秒消失

    function markCityList() {
        var city=eval(arguments[0]);
        var nCity = city.length;
        
        var htmlstr = [];
        for (var i = 0; i < nCity; i++) {
            var cs = city[i];
            htmlstr.push("<tr shi='"+cs[0]+"'>");
            htmlstr.push("<td  class='mayerTitle' ><a>" + cs[0] + "</a></td>");
            for (var j = 1; j < cs.length; j++) {
                if ((j - 1) % 6 == 0) {
                    if (j != 1)
                        htmlstr.push("</tr><tr shi='"+cs[0]+"'><td  class='mayerTitle' ></td>");
                    htmlstr.push("<td ><a href='javascript:void(0);'>" + cs[j] + "</a></td>");
                } else
                    htmlstr.push("<td ><a href='javascript:void(0);'>" + cs[j] + "</a></td>");
            }
            htmlstr.push("</tr>");
        }
        $("#cityTable").html(htmlstr.join(""));
    }

    function hideRegionDiv() {
        $('#dict_text').removeClass('active');
        $('#dictDiv').css("display", "none");
    }

    function hideRegionListDivListener(e) {
        e = e || window.event;
        var target = $(e.target);
        if (target.closest("#dict").length == 0) {
            hideRegionDiv();
            $(document).unbind("click", hideRegionListDivListener);
        }
    }

    function init(tdiv, smap) {
        if (inited) return;
        sdmap = smap,
         typeof tdiv == "object" ? $(tdiv).append(regionpan) : $("#" + tdiv).append(regionpan);

        sdmap.map.events.on({ "moveend": city_moveEndListener, "click": function () {
            hideRegionDiv();
        }
        });

$.ajax({url:"proxy/proxy.ashx?http://www.sdmap.gov.cn/dat/cities.txt",dataType:"text",success:markCityList,error:function(a,b,c){

if(console.log)console.log("request cities data failed ! "+ b);
}});
   

        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.fillOpacity = 0;
        style.strokeColor = "blue";
        style.fillColor = "blue";

        style.strokeWidth = 2;
        style.strokeDashstyle = "dot";
        dictLayer = new OpenLayers.Layer.Vector("行政定位", {
            style: style
        });
        sdmap.addLayer(dictLayer);



        //行政定位
        $('#dict_text').click(function () {
            if ($(this).hasClass('active')) {
                hideRegionDiv();
            } else {
                $('#dictDiv').css("display", "block");
                $(this).addClass('active');
           $(document).bind("click", hideRegionListDivListener);

            }
        });
        $('#dict_close').click(function (e) {
            hideRegionDiv();
        });
           $(".sheng").click(function(){
        $('#dictDiv').css("display", "none");
        $('#dictInfoDiv').css("display", "none");
          var lonLat = new OpenLayers.LonLat(119.00, 36.40);
                sdmap.map.setCenter(lonLat, 7);
        });
        $('#cityTable').on('click', 'td', function () {
          if($(this).text()=="")return;
            $('#dictDiv').css("display", "none");
            $('#dictInfo').css("display", "block");
            $('#dictInfoDiv').css("display", "none");
            if ($(this).hasClass('mayerTitle')) {

                dictQuery2($(this).text(), "");
                $('#dict_text').text($(this).text());
                //$('#dictInfo').css("margin-left", $('#dict_text').width() + 50 + "px");
            }
            else {

                dictQuery2($(this).parent().attr("shi"), $(this).text());

                //$('#dictInfo').css("margin-left", $('#dict_text').width() + 50 + "px");
            }

            $('#dict_text').removeClass('active');
        });
        $('#dictInfoClose').click(function (e) {
            $("#dictInfoDiv").animate({ height: 0 }, "slow", function () {
                $(this).css({ display: "none",
                    height: "auto"
                });
            });

        });
        $('#dictInfo').click(function (e) {
            if ($('#dictInfoDiv').css('display') == "block") {
                $('#dictInfoDiv').css("display", "none");
            }
            else {
                $('#dictInfoDiv').css("height", "auto");
                var completeHeight = $('#dictInfoDiv').height();
                $('#dictInfoDiv').css("display", "block");
                $('#dictInfoDiv').css("height", "0px");
                $("#dictInfoDiv").animate({ height: completeHeight }, "slow", function (e) {
                });
            }
        });
        inited = true;
    }

    function city_moveEndListener() {
        if(isactive)
        dictQuery();
    }

    //行政反定位
    function dictQuery() {
        if(bflashing)return;//点击行政切换跳转时，不需要再查询当前行政区
        $('#dictInfo').css("display", "none");
        var lonlat = sdmap.map.getCenter();
        var scale = sdmap.map.getScale();
        var url = Service.CitySearch + "lon=" + lonlat.lon + "&lat=" + lonlat.lat + "&scale=" + scale;
        $.ajax({
            dataType: "xml",
            url: url,
            success: function (da) {
                var dataText = da.getElementsByTagName("string");
                var str = dataText[0].firstChild.nodeValue;
                // if (bShowRegion) {
                //     if (curRegionTitle != str) {
                //         var segs = str.split(',');
                //         if (segs.length == 2) {
                //             dictQuery3(segs[1]);
                //         } else if (segs.length == 3) {
                //             dictQuery3(segs[1], segs[2]);
                //         }

                //     }
                // }
                curRegionTitle = str;
                var strarr = str.split(',');
                if (strarr.length == 1)
                    $('#dict_text').text(str);
                else if (strarr.length == 2)
                    $('#dict_text').text(strarr[1]);
                else if (strarr.length == 3)
                    $('#dict_text').text(strarr[1] + ">" + strarr[2]);
                else
                    $('#dict_text').text(dataText[0].firstChild.nodeValue.replace(/,/g, ">"));
            }
        });
    }



    //行政定位
    function dictQuery2(cityName, countryName) {
        var ways = countryName ? 2 : 1;
        var provinceName = "山东省";
        var url = Service.CityBound + "cityName=" + encodeURIComponent(cityName) + "&ways=" + ways + "&countryName=" + encodeURIComponent(countryName) + "&provinceName=" + encodeURIComponent(provinceName);
        $.ajax({
            dataType: "xml",
            url: url,
            success: function (data) {
                var dataNode = data.getElementsByTagName("Shape");

                if (isIE = navigator.userAgent.indexOf("MSIE") != -1) {
                    var linkName = data.getElementsByTagName("LinkName")[0].text;
                    var text = data.getElementsByTagName("Description")[0].text;
                    var linkUrl = data.getElementsByTagName("LinkURL")[0].text;
                }
                else {

                    var linkName = $(data.getElementsByTagName("LinkName")).text();
                    var text = $(data.getElementsByTagName("Description")).text();
                    var linkUrl = $(data.getElementsByTagName("LinkURL")).text();
                }

                $('#dictInfoTitle').text(linkName);
                $('#dictInfoText').text(text);
                $('#linkId').attr("href", linkUrl);
                var dataobj = dataNode[0].childNodes[0].data;
                if(countryName!="")
                  $('#dict_text').text(cityName + ">" + countryName);
              else
                 $('#dict_text').text(cityName);

                renderRegion(dataobj);

                bflashing=true;
                 sdmap.map.zoomToExtent(dictLayer.getDataExtent());
                 setTimeout(function(){ bflashing=false;},500);

                color = 1;
                timer = setInterval(ChangeColor, 600);
                clearhander=setTimeout(function(){
                    dictLayer.removeAllFeatures();
                },cleartime)

                //行政信息动画
                setTimeout(function () {
                    $('#dictInfo').click();
                }, 500);
                setTimeout(function () {
                    $('#dictInfoClose').click();
                }, 3000);
            }
        });
    }
    function renderRegion(dataobj) {

        var json = "{rings:[";
        var wkt = dataobj.substring(dataobj.indexOf("(") + 1, dataobj.lastIndexOf(")"));
        lineJson = wkt.replace(/(\({2})/g, "(");
        lineJson = lineJson.replace(/(\){2})/g, ")");
        var lineJson = lineJson.replace(/\(/g, "[").replace(/\)/g, "]");
        var re = /([\d\.]+)\s([\d\.]+)/g;
        lineJson = lineJson.replace(re, "[$1,$2]");
        json += lineJson;
        json += "]}";
        var jsonObj = eval("(" + json + ")");

        dictLayer.removeAllFeatures();

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
        dictLayer.redraw();

    }

    //行政区划闪烁
    function ChangeColor() {
        if (color == 1) {
            for (var i = 0; i < dictLayer.features.length; i++) {
                dictLayer.features[i].style.fillColor = "green";
                dictLayer.features[i].style.fillOpacity = 0.6;
                dictLayer.redraw(true);
            }
            color = color + 1; ;
        }
        else if (color == 2) {
            for (var i = 0; i < dictLayer.features.length; i++) {
                dictLayer.features[i].style.fillColor = "blue";
                dictLayer.features[i].style.fillOpacity = 0.6;
                dictLayer.redraw(true);
            }
            color = color + 1;
        }
        else if (color == 3) {
            for (var i = 0; i < dictLayer.features.length; i++) {
                dictLayer.features[i].style.fillColor = "green";
                dictLayer.features[i].style.fillOpacity = 0.6;
                dictLayer.redraw(true);
            }
            color = color + 1;
        }
        else if (color == 4) {
            for (var i = 0; i < dictLayer.features.length; i++) {
                dictLayer.features[i].style.fillOpacity = 0;
                dictLayer.redraw(true);
            }
            color = color + 1;
        }
        else {
            clearTimeout(timer);
        }
    }

    // function switchView(bopen) {
    //     bShowRegion = bopen;
    //     if (!bopen)
    //         dictLayer.removeAllFeatures();
    //     else {
    //         var str = $('#dict_text').text();
    //         if (str != "山东省") {
    //             var segs = str.split(">");
    //             if (segs.length == 1) {
    //                 dictQuery3(segs[0]);
    //             } else dictQuery3(segs[0], segs[1]);
    //         }
    //     }
    // }
    return {
        init: init,
       // switchView: switchView,
        clear: function () {
            dictLayer.removeAllFeatures();
           if(clearhander){ 
           clearTimeout(clearhander);
           clearhander=null;}
            
        },
        setActive:function (bAct) {
            isactive=!!bAct;
           
        }
    };
} ();
var Clean = function () {
    var sdmap, inited = false;
    function clear() {
       // $('#tab_search').click();
        //$('#returnBtn').click();
        
        MeasureTool.clear();
        RegionSwitch.clear();

        $('#searchExtent').hide();
        // if (PathSearch==undefined) {
        //     PathSearch.clearResult();
        // }
        PoiInfoPop.clear();
      //  Plotting.clear();
        WidgetManger.reset();
        qsgk.clear();
    }

    return {
        init: function (smap) {
            if (inited) return;
            sdmap = smap;
            $('#btnClear').click(function (e) {
                $('.olPopup').css("display", "none");
               // queryRectText = null; //终止范围查询
               clear();
           });

            inited = true;
        }
    };
}();

/**
* 地图全屏
**/
var FullScreen = function () {
    var inited = false;

    function init() {
        if (inited) return;
        //全屏
         $('#btnExtent').click(function (e) {

            if (!$("#left_hidden").hasClass("show")) { 
                $('#left_hidden').click();
            }
          //  var topd,cont;
            var height=$(window).height();
            
             if ($(this).hasClass('extent')) {

                $(this).removeClass('extent');
     $("#topDiv").show();
              //   topd=parent.document.getElementById("topDiv");
              //   if(topd)topd.style.display = "block";
              //   cont=parent.document.getElementById("content");
              //   if(cont){
              //     cont.style.top="100px";
              //     cont.style.height=(height-100)+"px";
              //     cont.setAttribute("data-calc-height","100%-100")
              // }

              $('#left_center').css({ height: (height-100) + "px",top:"100px"})
              .attr("data-calc-height","100%-100");
                $(this).html("<span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -128px 0;'></span>全屏</span>");

                $(this).css("width", "54px");
                $('#left_hidden').click();
            }
            else {
                //topd=parent.document.getElementById("topDiv");
                $("#topDiv").hide();
               // $('#left_center').css({ height: height + "px",top:"0"});
              //   if(topd)topd.style.display = "none";

              //  cont=parent.document.getElementById("content");
              //  if(cont){
              //     cont.style.top="0";
              //     cont.style.height=(height+100)+"px";
              //     cont.setAttribute("data-calc-height","100%-0")

                  $('#left_center').css({ height: "100%",top:"0"})              
                  .attr("data-calc-height","100%-0");;
                  $(this).addClass('extent');
                  $(this).css("width", "90px");//76
              // }
                // $(this).text("退出全屏");
                $(this).html("<span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -128px 0;'></span>退出全屏</span>");
          }
             setInterval(function() { $(window).resize(); }, 500);
           sdMap.map.updateSize();
      });
        inited = true;
}
return {
    init: init
};
} ();

/**
 * 地图打印
 */
 var PrintMapTool = function () {
    var toolui = "<li class='toolbagClass' id='btnPrintDiv'><span class='btnToolbar-cont1'><span class='btnToolbar-img' style='background-position: -60px 0;top:3px;width:20px;'></span>打印</span></li>";
    var map = null, inited = false;

    function init(tdiv, smap) {
        if (inited) return;
        typeof tdiv == "object" ? $(tdiv).append(toolui) : $("#" + tdiv).append(toolui);
        map = smap.map;
        //启动标绘
        $('#btnPrintDiv').click(function (e) {
            $('#toolbag_div').css("display", "none");
            createPrintMap('mapDiv');
        });

        inited = true;
    }

    function createPrintMap(id) {
        //设置页面的title和header头部内容显示  
        var titleName = "地图打印",
        headerName = "请输入标题信息，点击输入",
        //设置地图打印按钮背景图片 
        printImgSrc = "images/ToolBar/print.png",
        //设置地图容器的宽度 
        containerWidth = map.getSize().w,
        //设置地图容器的高度 
        containerHeight = map.getSize().h;

        var _window = window.open(""),
        inHtml = document.getElementById(id).innerHTML,
        head = "<!DOCTYPE html><html><head><META HTTP-EQUIV='pragma' CONTENT='no-cache'><META HTTP-EQUIV='Cache-Control' CONTENT='no-cache, must-revalidate'><META HTTP-EQUIV='expires' CONTENT='Wed, 26 Feb 1997 08:21:57 GMT'><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' /><meta name='apple-mobile-web-app-capable' content='yes' /><title>" + titleName + "</title>",
        height = parseInt(containerHeight) - 10,
        content = "<link rel='stylesheet' type='text/css' href='third/jstree/themes/default/style.css' /><link href='Openlayers/theme/default/style.css' rel='stylesheet' type='text/css' /> ",
        g = "";
        content += '<style type="text/css">';
        content += ".olImageLoadError{background-color: pink; opacity: 0!important; filter: alpha(opacity=0)!important;}";
        content = content + ".print-container {margin: auto;width:" + containerWidth + "px;height:" + containerHeight + "px;top: 50px;position: relative;}";
        content += ".geoD {width: 100%;height: 24px;line-height: 24px;border-bottom: 3px solid #B2B2B2;font-size: 14px;margin-bottom: 6px;font-weight:bold;}";
        content += ".geoTitle {width: 300px;height: 20px;line-height: 20px;font-size: 14px;border:none;}";
        content = content + "#" + id + " {position: relative;height:" + height + "px;margin-bottom: 15px;clear: both;}";
        content += '#geoft {content: ".";height: 77px;display: block;overflow: hidden;clear: both;}';
        content += ".printMap {margin-bottom: 20px;float: right;}";
        printImgSrc != void 0 && printImgSrc != "" ? (content = content + ".printMap span {background-position: 0px 0px;cursor: pointer;margin-right: 0px;margin-top: 5px;display: inline-block;width: 69px;height: 29px;background-image: url(" + printImgSrc + ");}", g = "<span id='printMap' onclick = 'printDiv()'></span>") : g = "<input id='printMap' type='button' value='\u6253\u5370' onclick = 'printDiv()'></input>";
        content += "</style>";
        foot = "</head><script type='text/javascript'src='js/util.min.js'></script><body><div class='print-container'><div class='geoD'>标题：<input class='geoTitle' value='" + headerName + "''></input></div><div id='" + id + "' >" + inHtml + "</div><div id='geoft'><div class='printMap'>";
        foot += g;
        foot += "</div></div></div></body></html>";
        _window.document.write(head + content + "<script type = 'text/javascript'>\nfunction printDiv(){var divObj = document.getElementById('printMap');divObj.style.display = 'none';window.print();divObj.style.display = 'block';}<\/script>" + foot);
       

       DynamicLoading.css("css.min/style.min.css",_window);

        _window.document.close();
    }

    return {
        init: init
    };
} ();


/**
*一键制图 专题打印
*/
// var ThemeticPrintTool = function() {
//     function init(tdiv) {
//        var toolui = "<li class='toolbagClass' id='btnPrintDiv'><span class='btnToolbar-cont1'><span class='btnToolbar-img' style='background-position: -73px -23px;top:3px;width:20px;'></span>打印</span></li>";
//        typeof tdiv == "object" ? $(tdiv).append(toolui) : $("#" + tdiv).append(toolui);
 
//         $('#btnPrintDiv').click(function(e) {
//       $("#iframe_",parent.document).attr("src","publishmapClient/map.html?_t="+Date.now());
//         });
//     }

//     return {
//         init: init
//     };
// }();
/**
* 审图号
*/
var CopyRightTool = function () {
    return {
        init: function (sdmap) {
            sdmap.map.events.on({ "zoomend": function (event) {
                var level = event.object.getZoom();
                if (level < 7)
                    $("#"+sdmap.map.div.id+"_remark").text("审图号:GS(2014)6032号(版权:国家测绘地理信息局)");
                else if (level < 14)
                    $("#"+sdmap.map.div.id+"_remark").text("审图号:GS(2014)6032号(版权:国家测绘地理信息局) 鲁SG(2015)088号(版权:山东省国土资源厅)");
                else
                    $("#"+sdmap.map.div.id+"_remark").text("审图号:鲁SG(2015)088号(版权:山东省国土资源厅)");
            } 
        });
        }
    };
} ();
/**
 * 数据采集
 */
var dataCollect=function()
{
    var map,louLy;inited=false;var Bcj=false;
    function MapClick(e)
    {
        var pixel = new OpenLayers.Pixel(e.xy.x,e.xy.y);
        var lonlat = map.getLonLatFromPixel(pixel);
        getQhbm(lonlat);
    }
    function doCollect()
    {
       Bcj=true;
       map.layerContainerDiv.style.cursor = ("url(images/mark/point_edit.png),default");
       map.events.register('click', map,MapClick);

    }
    function stopCollect()
    {
        Bcj=false;
        louLy.removeAllFeatures();
        clearPop();
        map.layerContainerDiv.style.cursor =null;
        map.events.unregister('click', map,MapClick);

    }
    function clearPop()
    {
        if (map.widgetPop != null) {
            map.removePopup(map.widgetPop);
       }
    }
    function getQhbm(lonlat)
    {
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
            returnGeometry: false,
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
                   InfoPop(n.results[0],lonlat);
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
               
            }
        });
    }
    function InfoPop(feature,lonlat) {
     if(feature!=null)
     {
     clearPop();
     var mc=feature.attributes.XZQMC;var bm=feature.attributes.XZQDM;
        map.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", lonlat, null,
             "<div style='padding:0 5px;'><div style = 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'><b>"
             + mc + "[" + bm + "]" + "</b> </div><div id='main' class='main'>" +
             "</div></div>",
                null, true, function () {
                   clearPop();
                });
               map.addPopup(map.widgetPop);
                $("#main").html("<div class='div_left'><input id='i_lh'/><button id='btn_u'>提交</button></div>");
                $('#btn_u').click(function (e) {
                    var lh=$("#i_lh").val();
                  //  if(lh.replace(/(^s*)|(s*$)/g, "").length !=0&&(!isNaN(lh)))
                  if(lh.replace(/(^s*)|(s*$)/g, "").length !=0)
                    {
                    var obj={lh:lh,qh:bm,x:lonlat.lon,y:lonlat.lat};
                    JsonpRequest(Service.comHandl + "type=cj",
            {
                op: "ud",
                param: JSON.stringify(obj)
            },
            function (res) {
                if (res.stat == "0")
                { alert("数据库错误！"); }
                else 
                {
        var Tfea = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat));
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.externalGraphic = "images/" + "mark2/point4.png";
        style.graphicWidth = 37;
        style.graphicHeight = 33;
        style.graphicYOffset = -33 / 2;
        style.fillOpacity = 1;
        style.cursor = "pointer";
        style.label=obj.lh;
        style.labelYOffset=20;
        style.labelOutlineWidth=2;
        Tfea.style = style;
        Tfea.attributes = obj;
        louLy.addFeatures(Tfea);
                }
                clearPop();
            }
            );
                }
                else{
                    alert("楼号得为数字!");
                }

                });
     }
     else{
         alert("所属村庄获取失败!");
     }
    }
        function onSelect(e) 
        {
        clearPop();
        var feature = e.feature;
       }
    return{
        init:function (sdmap) {
        if (inited) return;
        map = sdmap.map;
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        var styleMap = new OpenLayers.StyleMap({
            fillOpacity: 1,
            pointRadius: 3
        });
        louLy = new OpenLayers.Layer.Vector('louLy', {
            style: styleMap,
            renderers: renderer
        });
        sdmap.addLayer(louLy,false);
     /*   louLy.events.on({
            "featureselected": onSelect
        });*/
    },
    dcollect:doCollect,
    scollect:stopCollect,
    B:function(){return Bcj}
    }
}();
/**
 * 显示已采集房屋
 */
var showFw=function()
{
    var Bshow=false;var map;var Tbm;var ly_s;
    function onSelect(e){
                if (map.widgetPop != null) 
                {
            map.removePopup(map.widgetPop);
                }
                    //发请求
                    var fea= e.feature;var attr=fea.attributes;
                    var id=attr[4];var pp=attr[3];var lh=attr[0];var hz=attr[5];
                    var content;
                    if(pp=="1"){
      JsonpRequest(Service.comHandl + "type=cx",
            {
                op: "getzh",
                param: JSON.stringify({id:id})
            },
            function (res) {
                if (res.stat == "0")
                { alert("数据库错误！"); }
                else 
                {
                    content="<table class='gridtable'><tr><th>姓名</th><th>关系</th><th>身份证号</th></tr>";
                    var TStr="";
                   for(var i=0;i<res.dat.length;i++)
                   {
                       var Td=res.dat[i];
                    TStr=TStr+"<tr><td>"+Td[0]+"</td>"+
                         "<td>"+Td[1]+"</td>"+
                         "<td>"+Td[2]+"</td></tr>";
                   }
                   content=content+TStr+"</table>";
                   $("#main").html(content);
                }
            }
            );}else{content="";}
      map.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", fea.geometry.getBounds().getCenterLonLat(), null,
             "<div style='padding:0 5px;'><div style = 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'><b>"
             + hz + "[" + lh + "号楼]" + "</b><button id='btn_del'>删除</button></div><div id='main' class='main_detail'>" +
             "</div></div>",
                null, true, function () {
                  map.removePopup(map.widgetPop);
                });
                map.addPopup(map.widgetPop);
                $('#btn_del').click(function (e) {
                    if(confirm("确定要删除数据吗？"))
                    {
                    JsonpRequest(Service.comHandl + "type=cj",
            {
                op: "delFw",
                param: JSON.stringify({id:id})
            },
            function (res) {
                if (res.stat == "0")
                { alert("删除错误！"); }
                else 
                {
                    map.removePopup(map.widgetPop);
                    ly_s.removeFeatures(fea);
                }
            }
            );
                    }  
                });
    }
    function moveAction()
    {
        //获取中心点
        var  lonlat = sdMap.map.getCenter();
        //获取对应的行政区划
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
            returnGeometry: false,
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
                    var xzqhbm=n.results[0].attributes.XZQDM;
                    if(Tbm!=xzqhbm)
                    {Tbm=xzqhbm;GetFwByBm(Tbm);}
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
               
            }
        });
    }
    function GetFwByBm(bm)
    {
        JsonpRequest(Service.comHandl + "type=cj",
            {
                op: "GetFbC",
                param: JSON.stringify({qh:bm})
            },
            function (res) {
                ly_s.removeAllFeatures();
                if (res.stat != "0")
                {
                for(var i=0;i<res.dat.length;i++)
                {
        var Td=res.dat[i];
        var Tfea = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(Td[1],Td[2]));
      /*  var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        if(Td[3]=="1"){ style.externalGraphic = "images/" + "mark2/point9.png";}
        else{style.externalGraphic = "images/" + "mark2/point13.png";        }
        style.label="["+Td[0]+"]"+Td[5];
        style.graphicWidth = 32;
        style.graphicHeight = 32;
        style.graphicYOffset = -32 / 2;
        style.fillOpacity = 1;
        style.cursor = "pointer";
        style.labelYOffset=20;
        style.labelOutlineWidth=2;*/
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        if(Td[3]=="0"){ style.fillColor = "#F90A0A"}
        else{style.fillColor = "#07F137" }
        //style.label="["+Td[0]+"]"+Td[5];
        style.label=Td[0]+"\n"+Td[5];
        style.cursor = "pointer";
        style.fillOpacity=1;
        style.pointRadius=5;
        style.stroke=false;
        style.labelSelect=true;
        style.labelYOffset=24;
        style.labelOutlineWidth=6;
        style.labelOutlineColor="#077CF3";
        style.fontColor="white";
       // style.fontWeight="bold";
        Tfea.style = style;
        Tfea.attributes = Td;
        ly_s.addFeatures(Tfea);
                }
        
                }
            }
            );
    }
    function show()
    {
        //根本比例尺，中心点确定能用否
      //  var zoomLevel=map.getZoom();
        //判断是否在高唐境内
        //打开地图移动监听
         Bshow=true;
         moveAction();
         map.events.register("moveend", map, moveAction);
    }
    function hide()
    {
    Bshow=false;
    ly_s.removeAllFeatures();Tbm=null;
    map.events.unregister("moveend", map, moveAction);
   }
    function clear()
    {
    ly_s.removeAllFeatures();
   }
    return{
    init: function (sdmap) {
        if (inited) return;
        map = sdmap.map;
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        var styleMap = new OpenLayers.StyleMap({
            fillOpacity: 1,
            pointRadius: 3,
            fillColor:"blue"
        });
        ly_s = new OpenLayers.Layer.Vector('ly_s', {
            style: styleMap,
            renderers: renderer
        });
        sdmap.addLayer(ly_s,true);
        ly_s.events.on({
            "featureselected": onSelect
        });
      },
      show:show,
      hide:hide,
      B:function(){return Bshow;},
      showFwbyCode:function(qh){GetFwByBm(qh)},
      clear:clear
    }
}();

var MapToolUI = function () {
    var toolbar = [
    "    <ul style='margin:3px 0'>",
 //   "        <li id='btnExtent' class='btnToolbar' style='margin-right: 20px;'><span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -128px 0;'></span>全屏</span></li>",
    "        <li id='btntool' class='btnToolbar'><span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -142px 0;'></span>工具</span>",
    "           <div id='toolbag_div' style='width: 60px; border: 1px solid #25abf3; background: #f4f9fd;display: none; color: #777777;margin-top:24px;'>",
    "               <ul></ul>",
    "        </li>",
    "        <li id='btnClear' class='btnToolbar'><span class='btnToolbar-cont'><span class='btnToolbar-img' style='background-position: -158px 0;'></span>清除</span></li>",
    "        <li id='dict'><div id='dict_text'>山东省</div></li>",
    "        <li id='vec_img'></li>",
    "    </ul>"].join("");
    var inited = false;
    return {
        init: function (sdmap) {
            if (inited) return;
            var tooldiv = $("#toolDiv");
            tooldiv.append(toolbar);
            var ele = $("#btntool ul");
            MeasureTool.init(ele);
            FullScreen.init();
            Clean.init(sdmap);
            //Plotting.init(ele, sdmap);
            PrintMapTool.init(ele, sdmap);
            
            RegionSwitch.init(tooldiv.find("#dict"), sdmap);
            MapSwitch.init(tooldiv.find("#vec_img"),sdmap);
            CopyRightTool.init(sdmap);

        //    MapContrast.init(sdmap);

            tooldiv.find('#btntool').mouseenter(function () {
                $('#toolbag_div').css("display", "block");
            });
            tooldiv.find('#btntool').mouseleave(function () {
                $('#toolbag_div').css("display", "none");
            });
            //全图
            $('#btnExtentMap').click(function () {
                var lonLat = new OpenLayers.LonLat(119.00, 36.40);
                sdmap.map.setCenter(lonLat, 7);
            });
            $('#btnThemtic').click(function(){
                window.open("publishmapClient/map.html?_t="+Date.now());
            });
            //对比
            $('#btnImgCompare').click(function () {
            MapContrast.startContrast();
            });

            inited = true;
        }
    };
} ();


;
///<jscompress sourcefile="widgets.js" />

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
 ;
///<jscompress sourcefile="wmswmts.js" />
var wmswmts = function () {//依赖hashtable.js
    var inited = false,Fbind = false;
    var map = null;
    var hashLayers = null;
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
        var para = Service.wmts_cfg;
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
         wmswmts.map.removeLayer(p.l_cur);
         changeStatus(p,false);
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
} ();;
///<jscompress sourcefile="data.js" />
var data = function () {
    var _hashT;var _map;var _layer;var hash_Condition;
    return {
        init: function (map) {
        this._map = map;
        var p={
         id:"1",
         url: Service.qdhyTile,
         layer:[0,1,2,3,4,5,6,7,8]
         }
         wmswmts.addLayer(p);
         var ExtendLay = new OpenLayers.Layer.Vector('extent');
        map.addLayer(ExtendLay, true);
        this._layer=ExtendLay;
        this._hashT = new HashTable();
        this.hash_Condition = new HashTable();
            var Td={
    "features": [
        {
            "attributes": {
                "FID": 0,
                "bm": "110106",
                "y": 39.834829196,
                "x": "116.24273831754"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.28742790854139,
                            39.89574510994808
                        ],
                        [
                            116.28748429572777,
                            39.885782749188294
                        ],
                        [
                            116.31900839823635,
                            39.89584839662902
                        ],
                        [
                            116.31463840947892,
                            39.874411165366965
                        ],
                        [
                            116.3745938951532,
                            39.870196089410804
                        ],
                        [
                            116.37077883972734,
                            39.86561493691427
                        ],
                        [
                            116.3885806131255,
                            39.85751168623693
                        ],
                        [
                            116.4066106856956,
                            39.859047232685604
                        ],
                        [
                            116.41447276484107,
                            39.87183923082676
                        ],
                        [
                            116.4374584539728,
                            39.871007333406205
                        ],
                        [
                            116.43946571977078,
                            39.85990323987867
                        ],
                        [
                            116.46120062626248,
                            39.85417912454845
                        ],
                        [
                            116.40880157356732,
                            39.82843050725901
                        ],
                        [
                            116.41265960306028,
                            39.814329881589
                        ],
                        [
                            116.40314115001766,
                            39.81571062505941
                        ],
                        [
                            116.40305869168854,
                            39.8103919219033
                        ],
                        [
                            116.41563269442291,
                            39.809403078851055
                        ],
                        [
                            116.42249252105782,
                            39.793465430072466
                        ],
                        [
                            116.41323475648699,
                            39.78651285160139
                        ],
                        [
                            116.38941338948004,
                            39.78590451505279
                        ],
                        [
                            116.39175817963789,
                            39.76487594206352
                        ],
                        [
                            116.38448375550145,
                            39.763990987756216
                        ],
                        [
                            116.38337874139285,
                            39.77927809048274
                        ],
                        [
                            116.36092390606484,
                            39.784139445320584
                        ],
                        [
                            116.36020488153541,
                            39.79853987810147
                        ],
                        [
                            116.3396331994385,
                            39.806923069271846
                        ],
                        [
                            116.31637156296298,
                            39.797500962236825
                        ],
                        [
                            116.31501648784277,
                            39.7827345061879
                        ],
                        [
                            116.3010735660347,
                            39.768900094743884
                        ],
                        [
                            116.2874542921596,
                            39.79712705568954
                        ],
                        [
                            116.24590755283607,
                            39.79248385797328
                        ],
                        [
                            116.22136991736308,
                            39.825023788232585
                        ],
                        [
                            116.20743779123197,
                            39.822756225360735
                        ],
                        [
                            116.19368218604232,
                            39.7775370394083
                        ],
                        [
                            116.16267649601701,
                            39.78355247919404
                        ],
                        [
                            116.15371589633408,
                            39.76654093155455
                        ],
                        [
                            116.11523677155616,
                            39.76148528364917
                        ],
                        [
                            116.11122926721937,
                            39.77376093661808
                        ],
                        [
                            116.12929604024711,
                            39.780332929367184
                        ],
                        [
                            116.1086480428641,
                            39.79108644666611
                        ],
                        [
                            116.08485757108177,
                            39.781462964820065
                        ],
                        [
                            116.08222775579236,
                            39.828882510169755
                        ],
                        [
                            116.07725049530752,
                            39.82547468974377
                        ],
                        [
                            116.07817754260225,
                            39.83214488693686
                        ],
                        [
                            116.07622994799554,
                            39.827135272598255
                        ],
                        [
                            116.04764088322142,
                            39.844973305651216
                        ],
                        [
                            116.06406731425916,
                            39.85271110377923
                        ],
                        [
                            116.06343374922028,
                            39.867410990273434
                        ],
                        [
                            116.09466285994887,
                            39.86663887748581
                        ],
                        [
                            116.09578045334895,
                            39.872315197251694
                        ],
                        [
                            116.14816821509108,
                            39.88836637879527
                        ],
                        [
                            116.19173390067546,
                            39.88203160630206
                        ],
                        [
                            116.20067568887926,
                            39.87307113831003
                        ],
                        [
                            116.23307449715342,
                            39.89424289803166
                        ],
                        [
                            116.28742790854139,
                            39.89574510994808
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 1,
                "bm": "110115",
                "y": 39.6473518852,
                "x": "116.411544845662"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.43392474077864,
                            39.828795376058665
                        ],
                        [
                            116.43766704587009,
                            39.81966938506055
                        ],
                        [
                            116.44701691499596,
                            39.82181911786586
                        ],
                        [
                            116.46759191245742,
                            39.80887586891778
                        ],
                        [
                            116.51949957483936,
                            39.82906696726295
                        ],
                        [
                            116.53320926533644,
                            39.822776114194156
                        ],
                        [
                            116.52755494700553,
                            39.81781770983559
                        ],
                        [
                            116.53460897204046,
                            39.80920814500813
                        ],
                        [
                            116.52446973566404,
                            39.79096499257038
                        ],
                        [
                            116.53139407664017,
                            39.780469990619366
                        ],
                        [
                            116.5239413711385,
                            39.77784849299015
                        ],
                        [
                            116.53923960065727,
                            39.76803371167023
                        ],
                        [
                            116.52992800838847,
                            39.767762202453035
                        ],
                        [
                            116.53406222214447,
                            39.76043496402201
                        ],
                        [
                            116.52187845295637,
                            39.760523213475786
                        ],
                        [
                            116.51706946131189,
                            39.76902976417517
                        ],
                        [
                            116.51399413916371,
                            39.76487663904936
                        ],
                        [
                            116.51634811367782,
                            39.74868734742672
                        ],
                        [
                            116.5254191583494,
                            39.74792410645823
                        ],
                        [
                            116.52089438266368,
                            39.74254663100582
                        ],
                        [
                            116.53325130981801,
                            39.74053267214782
                        ],
                        [
                            116.52582015443818,
                            39.738786807288534
                        ],
                        [
                            116.53048847598136,
                            39.7213105345586
                        ],
                        [
                            116.52041231128852,
                            39.7161509092684
                        ],
                        [
                            116.52937887900143,
                            39.711246597712275
                        ],
                        [
                            116.56659514757473,
                            39.71422314726226
                        ],
                        [
                            116.56994038694987,
                            39.70886765218215
                        ],
                        [
                            116.59413167754475,
                            39.71176479662714
                        ],
                        [
                            116.6152918184988,
                            39.72744797199906
                        ],
                        [
                            116.63082521252866,
                            39.72368501608971
                        ],
                        [
                            116.64668725427417,
                            39.70775302643192
                        ],
                        [
                            116.63958979393968,
                            39.7002620332145
                        ],
                        [
                            116.64441197901347,
                            39.68758023459897
                        ],
                        [
                            116.65988680222446,
                            39.68648274537899
                        ],
                        [
                            116.65977688896695,
                            39.67561128926658
                        ],
                        [
                            116.69715391005056,
                            39.67341185225443
                        ],
                        [
                            116.69633956773119,
                            39.6491024355773
                        ],
                        [
                            116.70369633980825,
                            39.63701368436337
                        ],
                        [
                            116.71726615110039,
                            39.63788982349311
                        ],
                        [
                            116.71883724363461,
                            39.62330261744528
                        ],
                        [
                            116.69373470536962,
                            39.620269513802214
                        ],
                        [
                            116.69602002673261,
                            39.60930075995535
                        ],
                        [
                            116.71987829079045,
                            39.59208208633419
                        ],
                        [
                            116.69505357783657,
                            39.5880818112023
                        ],
                        [
                            116.68705365958841,
                            39.600999718192966
                        ],
                        [
                            116.6602092039627,
                            39.60465672755263
                        ],
                        [
                            116.647578076684,
                            39.598957434372544
                        ],
                        [
                            116.61420458538993,
                            39.60096080605009
                        ],
                        [
                            116.60140848130067,
                            39.62410371763603
                        ],
                        [
                            116.58905818402373,
                            39.617437126213844
                        ],
                        [
                            116.57544670566212,
                            39.62344701783789
                        ],
                        [
                            116.55971184344531,
                            39.61925525799902
                        ],
                        [
                            116.56043358853185,
                            39.60359704846616
                        ],
                        [
                            116.53952486518334,
                            39.595313601331604
                        ],
                        [
                            116.53677192823942,
                            39.60257922545695
                        ],
                        [
                            116.53518850894311,
                            39.59313110512169
                        ],
                        [
                            116.51797693275444,
                            39.59601790314289
                        ],
                        [
                            116.51943083639294,
                            39.5721154105725
                        ],
                        [
                            116.50485301546911,
                            39.564671333080454
                        ],
                        [
                            116.50177753323435,
                            39.550341845388175
                        ],
                        [
                            116.46383273542028,
                            39.55372979079805
                        ],
                        [
                            116.4709907191369,
                            39.53443482322405
                        ],
                        [
                            116.45752130461386,
                            39.526571007859914
                        ],
                        [
                            116.4298430046658,
                            39.5254901260879
                        ],
                        [
                            116.43703349910939,
                            39.508824640641855
                        ],
                        [
                            116.42134898847975,
                            39.50540517878771
                        ],
                        [
                            116.41460752248327,
                            39.52428494465143
                        ],
                        [
                            116.39581433412035,
                            39.52445989330129
                        ],
                        [
                            116.39573909408,
                            39.513360358395374
                        ],
                        [
                            116.41647321883016,
                            39.495872240501974
                        ],
                        [
                            116.40503566744641,
                            39.48137531356706
                        ],
                        [
                            116.41947889474515,
                            39.48707133267384
                        ],
                        [
                            116.42089214581243,
                            39.47741215718757
                        ],
                        [
                            116.43692960188025,
                            39.481410733724196
                        ],
                        [
                            116.44895067591793,
                            39.45798902366641
                        ],
                        [
                            116.44397246990557,
                            39.449333951429224
                        ],
                        [
                            116.43369086334184,
                            39.45295648379756
                        ],
                        [
                            116.42121178018827,
                            39.443852956160256
                        ],
                        [
                            116.33543737650835,
                            39.45307604887295
                        ],
                        [
                            116.29765339171844,
                            39.4863281240837
                        ],
                        [
                            116.25277616075233,
                            39.499597376427424
                        ],
                        [
                            116.23168625045469,
                            39.549742989027806
                        ],
                        [
                            116.2393252986657,
                            39.55682389807813
                        ],
                        [
                            116.2145965218105,
                            39.57816473635832
                        ],
                        [
                            116.2199885450809,
                            39.58920632796559
                        ],
                        [
                            116.20924457190368,
                            39.643928266355275
                        ],
                        [
                            116.22261841983553,
                            39.70788217955961
                        ],
                        [
                            116.24165288911804,
                            39.7266668159431
                        ],
                        [
                            116.24362744892564,
                            39.79249237387186
                        ],
                        [
                            116.2874542921596,
                            39.79712705568954
                        ],
                        [
                            116.304119684488,
                            39.76897366578875
                        ],
                        [
                            116.31637156296298,
                            39.797500962236825
                        ],
                        [
                            116.34902535189474,
                            39.80531806320792
                        ],
                        [
                            116.36020488153541,
                            39.79853987810147
                        ],
                        [
                            116.36092390606484,
                            39.784139445320584
                        ],
                        [
                            116.38337874139285,
                            39.77927809048274
                        ],
                        [
                            116.3874848980526,
                            39.764281703294
                        ],
                        [
                            116.38941338948004,
                            39.78590451505279
                        ],
                        [
                            116.41323475648699,
                            39.78651285160139
                        ],
                        [
                            116.42249252105782,
                            39.793465430072466
                        ],
                        [
                            116.41563269442291,
                            39.809403078851055
                        ],
                        [
                            116.40305869168854,
                            39.8103919219033
                        ],
                        [
                            116.40314115001766,
                            39.81571062505941
                        ],
                        [
                            116.41265960306028,
                            39.814329881589
                        ],
                        [
                            116.40888300546709,
                            39.828470544847164
                        ],
                        [
                            116.43392474077864,
                            39.828795376058665
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 2,
                "bm": "110118",
                "y": 40.5256906255,
                "x": "116.988417427494"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.91867270736321,
                            40.77180923207947
                        ],
                        [
                            116.91993964925695,
                            40.74384940044417
                        ],
                        [
                            116.93446113068597,
                            40.73874357248296
                        ],
                        [
                            116.95896880301723,
                            40.708263999772356
                        ],
                        [
                            117.00016039232472,
                            40.693284512992776
                        ],
                        [
                            117.10387785498682,
                            40.70763746604947
                        ],
                        [
                            117.11017679131442,
                            40.69866014858139
                        ],
                        [
                            117.19991032661002,
                            40.69380260955471
                        ],
                        [
                            117.23413086018606,
                            40.67552543017547
                        ],
                        [
                            117.25415048568729,
                            40.680112489859255
                        ],
                        [
                            117.28301570529021,
                            40.65927912090087
                        ],
                        [
                            117.3108064797002,
                            40.656848014590125
                        ],
                        [
                            117.32969680856068,
                            40.662469311680766
                        ],
                        [
                            117.33538093090861,
                            40.672454989118265
                        ],
                        [
                            117.40217929812582,
                            40.68608911679613
                        ],
                        [
                            117.46032052312714,
                            40.67153285420431
                        ],
                        [
                            117.47517988496763,
                            40.677492473513766
                        ],
                        [
                            117.50741461675568,
                            40.659612925114146
                        ],
                        [
                            117.49349704938142,
                            40.63477460022346
                        ],
                        [
                            117.47185423830507,
                            40.63400150755924
                        ],
                        [
                            117.46365213110934,
                            40.64854052985763
                        ],
                        [
                            117.44823887435183,
                            40.651741377794394
                        ],
                        [
                            117.44101405803984,
                            40.626691445835945
                        ],
                        [
                            117.4174318102592,
                            40.624259722567736
                        ],
                        [
                            117.40549089250939,
                            40.60380641746483
                        ],
                        [
                            117.42287638935535,
                            40.57642668173627
                        ],
                        [
                            117.41468081731362,
                            40.56806348155126
                        ],
                        [
                            117.39566376179008,
                            40.5723806682859
                        ],
                        [
                            117.38037289516294,
                            40.559536460124875
                        ],
                        [
                            117.34840228432532,
                            40.57803509316464
                        ],
                        [
                            117.30723869332621,
                            40.57701158359551
                        ],
                        [
                            117.24306286015722,
                            40.54736702896638
                        ],
                        [
                            117.25618270742754,
                            40.51246129208796
                        ],
                        [
                            117.20801535011185,
                            40.51238386428757
                        ],
                        [
                            117.20096461753666,
                            40.49898484860364
                        ],
                        [
                            117.2304593043808,
                            40.46734978627185
                        ],
                        [
                            117.22843632444717,
                            40.45648258278715
                        ],
                        [
                            117.25696386369842,
                            40.44069374391309
                        ],
                        [
                            117.22937617538051,
                            40.41256139076979
                        ],
                        [
                            117.23318831304105,
                            40.39402060347278
                        ],
                        [
                            117.21728155648098,
                            40.37415002439522
                        ],
                        [
                            117.1493646561769,
                            40.37382854780865
                        ],
                        [
                            117.11022572318385,
                            40.352658814190896
                        ],
                        [
                            117.08959852741015,
                            40.3585158899597
                        ],
                        [
                            117.05284004903928,
                            40.336332378263705
                        ],
                        [
                            117.01525175946252,
                            40.33602914345538
                        ],
                        [
                            117.00009412257614,
                            40.3186905958232
                        ],
                        [
                            116.99716563277087,
                            40.29299543462903
                        ],
                        [
                            116.96834416659894,
                            40.28353420175548
                        ],
                        [
                            116.94432728666834,
                            40.26039831086009
                        ],
                        [
                            116.96720804285572,
                            40.25069859764729
                        ],
                        [
                            116.96728146694714,
                            40.24379857156562
                        ],
                        [
                            116.95338654594148,
                            40.23197906518762
                        ],
                        [
                            116.92442436134219,
                            40.22990143894891
                        ],
                        [
                            116.91537819927647,
                            40.21941867783176
                        ],
                        [
                            116.88755015104152,
                            40.231650141482916
                        ],
                        [
                            116.89512210710704,
                            40.23615746440951
                        ],
                        [
                            116.867645828663,
                            40.26755144959236
                        ],
                        [
                            116.86498608738106,
                            40.29006703104089
                        ],
                        [
                            116.85120483813012,
                            40.291503905047556
                        ],
                        [
                            116.84225775200817,
                            40.31042373623501
                        ],
                        [
                            116.82227740421858,
                            40.30358299533472
                        ],
                        [
                            116.8160823560998,
                            40.280456489950765
                        ],
                        [
                            116.78210775325124,
                            40.29054757523196
                        ],
                        [
                            116.76487774280758,
                            40.265597027392204
                        ],
                        [
                            116.73151288641533,
                            40.27775424532699
                        ],
                        [
                            116.74765796179616,
                            40.30276527662053
                        ],
                        [
                            116.76720133064669,
                            40.31452705830326
                        ],
                        [
                            116.75178194401212,
                            40.33294571062903
                        ],
                        [
                            116.71620916159904,
                            40.338284660122426
                        ],
                        [
                            116.71999346057112,
                            40.36025060315607
                        ],
                        [
                            116.6997912184179,
                            40.37283748654352
                        ],
                        [
                            116.70951983268814,
                            40.38323878861416
                        ],
                        [
                            116.70713770298921,
                            40.39489921718858
                        ],
                        [
                            116.69993811873866,
                            40.392896832383514
                        ],
                        [
                            116.7032432972788,
                            40.401969457904286
                        ],
                        [
                            116.73473633512008,
                            40.41530149295978
                        ],
                        [
                            116.71557135025213,
                            40.422835651108336
                        ],
                        [
                            116.70967921845603,
                            40.44074203221807
                        ],
                        [
                            116.71922935303434,
                            40.43887967846059
                        ],
                        [
                            116.71680423852985,
                            40.45758367375328
                        ],
                        [
                            116.7027257126986,
                            40.45722152624028
                        ],
                        [
                            116.68819253975295,
                            40.467481779376335
                        ],
                        [
                            116.6868100508935,
                            40.4807997845061
                        ],
                        [
                            116.697808481577,
                            40.47821367243442
                        ],
                        [
                            116.68605048734051,
                            40.4868880908692
                        ],
                        [
                            116.69433350559756,
                            40.509581592342535
                        ],
                        [
                            116.71043599580064,
                            40.52379367306483
                        ],
                        [
                            116.69524828033813,
                            40.54466507147241
                        ],
                        [
                            116.67345961904556,
                            40.54893080417822
                        ],
                        [
                            116.67238852651299,
                            40.555627466950206
                        ],
                        [
                            116.6590901497185,
                            40.55169085126453
                        ],
                        [
                            116.70810001685858,
                            40.56996805656461
                        ],
                        [
                            116.70448763944341,
                            40.59920888318849
                        ],
                        [
                            116.6912425029284,
                            40.61745575270782
                        ],
                        [
                            116.70544146617006,
                            40.640280494188616
                        ],
                        [
                            116.70664029846446,
                            40.676963331455
                        ],
                        [
                            116.74937791084365,
                            40.7046196360164
                        ],
                        [
                            116.77800517997949,
                            40.70004331307405
                        ],
                        [
                            116.78360515730657,
                            40.72824342866881
                        ],
                        [
                            116.77696463654686,
                            40.75656511367549
                        ],
                        [
                            116.79393469757566,
                            40.744977487421096
                        ],
                        [
                            116.82279951214022,
                            40.748888656994346
                        ],
                        [
                            116.83336098284146,
                            40.75971391774234
                        ],
                        [
                            116.82929406011837,
                            40.770875072321786
                        ],
                        [
                            116.86071532056438,
                            40.78353144989101
                        ],
                        [
                            116.85584008774343,
                            40.79184604944448
                        ],
                        [
                            116.86746241711536,
                            40.798299425047794
                        ],
                        [
                            116.88939803693961,
                            40.79620395786835
                        ],
                        [
                            116.891569957434,
                            40.77602829905906
                        ],
                        [
                            116.91867270736321,
                            40.77180923207947
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 3,
                "bm": "110117",
                "y": 40.2075648469,
                "x": "117.13900487743"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            117.21128628856964,
                            40.37678219480204
                        ],
                        [
                            117.21919046923689,
                            40.3682463784966
                        ],
                        [
                            117.23596160007324,
                            40.36843401362914
                        ],
                        [
                            117.25272879246936,
                            40.33532088986853
                        ],
                        [
                            117.26781126575138,
                            40.33161714629736
                        ],
                        [
                            117.26756485002629,
                            40.30804534002725
                        ],
                        [
                            117.28598670100983,
                            40.29599665783368
                        ],
                        [
                            117.28829568339383,
                            40.27767776926144
                        ],
                        [
                            117.32491561131508,
                            40.28853620943126
                        ],
                        [
                            117.33828693956933,
                            40.23398599148242
                        ],
                        [
                            117.38257371306491,
                            40.22684155989383
                        ],
                        [
                            117.38641359528057,
                            40.220515725496305
                        ],
                        [
                            117.3703024109397,
                            40.21756945059234
                        ],
                        [
                            117.37040075949929,
                            40.20852727758079
                        ],
                        [
                            117.3855218367919,
                            40.20347966119944
                        ],
                        [
                            117.3750025707905,
                            40.20364029895524
                        ],
                        [
                            117.37286501947703,
                            40.195217722822896
                        ],
                        [
                            117.37665657669116,
                            40.1868119795076
                        ],
                        [
                            117.39114165822807,
                            40.19141547780288
                        ],
                        [
                            117.4003573508701,
                            40.186327180638216
                        ],
                        [
                            117.38590842574195,
                            40.174164268272634
                        ],
                        [
                            117.34422861484256,
                            40.171920832187105
                        ],
                        [
                            117.35361821793055,
                            40.14884818887612
                        ],
                        [
                            117.34528751625867,
                            40.136021839315326
                        ],
                        [
                            117.32353785101532,
                            40.13282899053356
                        ],
                        [
                            117.30571769947424,
                            40.13879882562368
                        ],
                        [
                            117.29062117324933,
                            40.11820049544831
                        ],
                        [
                            117.27657265299894,
                            40.11975240720652
                        ],
                        [
                            117.2674608797253,
                            40.10512103469188
                        ],
                        [
                            117.24239316759785,
                            40.11554212781142
                        ],
                        [
                            117.21736211614372,
                            40.09393682112788
                        ],
                        [
                            117.20400478898576,
                            40.095501149677695
                        ],
                        [
                            117.20831441854467,
                            40.08433498443177
                        ],
                        [
                            117.19220257644446,
                            40.066206594423214
                        ],
                        [
                            117.17799936510568,
                            40.084606173528535
                        ],
                        [
                            117.17408151271466,
                            40.069247776812766
                        ],
                        [
                            117.15707692123927,
                            40.07580599037555
                        ],
                        [
                            117.14014407128253,
                            40.060508357017504
                        ],
                        [
                            117.07857848969873,
                            40.07396753588729
                        ],
                        [
                            117.07578926745771,
                            40.0641797734899
                        ],
                        [
                            117.06266475878633,
                            40.06678587620757
                        ],
                        [
                            117.04492682468985,
                            40.0587535190763
                        ],
                        [
                            117.04385795306894,
                            40.04996660842755
                        ],
                        [
                            117.03066730211026,
                            40.04707538285549
                        ],
                        [
                            117.01522731124705,
                            40.02834116603839
                        ],
                        [
                            116.99341959711592,
                            40.02908498829748
                        ],
                        [
                            116.98414641689094,
                            40.040427328231814
                        ],
                        [
                            116.96445332422932,
                            40.0352534370707
                        ],
                        [
                            116.96592239243606,
                            40.04385023716948
                        ],
                        [
                            116.9553241285096,
                            40.05019595381335
                        ],
                        [
                            116.9556118757702,
                            40.062771296496244
                        ],
                        [
                            116.97179828607078,
                            40.06409125694719
                        ],
                        [
                            116.97943661072384,
                            40.07750923547383
                        ],
                        [
                            116.96828595944015,
                            40.08053816458167
                        ],
                        [
                            116.97484735843544,
                            40.0918685017294
                        ],
                        [
                            116.96107607072226,
                            40.10021960624949
                        ],
                        [
                            116.96931602074126,
                            40.11036737921654
                        ],
                        [
                            116.95901938984512,
                            40.12701451164819
                        ],
                        [
                            116.97212598688597,
                            40.15152278420968
                        ],
                        [
                            116.95531591528145,
                            40.174778969809864
                        ],
                        [
                            116.94477362025404,
                            40.174025128121976
                        ],
                        [
                            116.94270609013533,
                            40.189453055851274
                        ],
                        [
                            116.93281634344649,
                            40.19165868954086
                        ],
                        [
                            116.92315488971542,
                            40.20902730435469
                        ],
                        [
                            116.93285486037338,
                            40.2121362879454
                        ],
                        [
                            116.92859772245215,
                            40.22913050960131
                        ],
                        [
                            116.94038771031086,
                            40.23540432191407
                        ],
                        [
                            116.95338654594148,
                            40.23197906518762
                        ],
                        [
                            116.96728146694714,
                            40.24379857156562
                        ],
                        [
                            116.96720804285572,
                            40.25069859764729
                        ],
                        [
                            116.94432728666834,
                            40.26039831086009
                        ],
                        [
                            116.96834416659894,
                            40.28353420175548
                        ],
                        [
                            116.99716563277087,
                            40.29299543462903
                        ],
                        [
                            117.00009412257614,
                            40.3186905958232
                        ],
                        [
                            117.01381585952556,
                            40.335234122739365
                        ],
                        [
                            117.05284004903928,
                            40.336332378263705
                        ],
                        [
                            117.08959852741015,
                            40.3585158899597
                        ],
                        [
                            117.11022572318385,
                            40.352658814190896
                        ],
                        [
                            117.14915255687565,
                            40.373759478343835
                        ],
                        [
                            117.15978889147003,
                            40.37030332639465
                        ],
                        [
                            117.1781819455602,
                            40.37680905606714
                        ],
                        [
                            117.19755436714398,
                            40.37213616126029
                        ],
                        [
                            117.21128628856964,
                            40.37678219480204
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 4,
                "bm": "110119",
                "y": 40.5379617866,
                "x": "116.155863399601"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.2630015679398,
                            40.77590702635443
                        ],
                        [
                            116.2674380919514,
                            40.76226112513729
                        ],
                        [
                            116.28309749930668,
                            40.76332300593997
                        ],
                        [
                            116.2902387121976,
                            40.75646927093394
                        ],
                        [
                            116.31012980524181,
                            40.771299650220996
                        ],
                        [
                            116.36070250436268,
                            40.76941167166775
                        ],
                        [
                            116.40124883913181,
                            40.77948521302429
                        ],
                        [
                            116.40850896795277,
                            40.761057745722
                        ],
                        [
                            116.46138299403452,
                            40.77132566782904
                        ],
                        [
                            116.49407402469197,
                            40.758882895691855
                        ],
                        [
                            116.49488534932702,
                            40.74556809576469
                        ],
                        [
                            116.50698958466668,
                            40.740270571508375
                        ],
                        [
                            116.50399979449945,
                            40.725178882597056
                        ],
                        [
                            116.49589770867273,
                            40.69614576583105
                        ],
                        [
                            116.48195436039916,
                            40.69080617487604
                        ],
                        [
                            116.47739508697708,
                            40.67624423050572
                        ],
                        [
                            116.50920951565688,
                            40.67014151877888
                        ],
                        [
                            116.51178027975433,
                            40.6598145507521
                        ],
                        [
                            116.52803540046924,
                            40.652025161759816
                        ],
                        [
                            116.533377514119,
                            40.65572906921248
                        ],
                        [
                            116.54457451543267,
                            40.641901353195664
                        ],
                        [
                            116.5683321883276,
                            40.63154210966277
                        ],
                        [
                            116.56324287360474,
                            40.62350116223078
                        ],
                        [
                            116.53264833146514,
                            40.62465654253618
                        ],
                        [
                            116.5249253552756,
                            40.59036654022712
                        ],
                        [
                            116.45403993308298,
                            40.523167537132146
                        ],
                        [
                            116.46975635149427,
                            40.51298815900456
                        ],
                        [
                            116.49103477923086,
                            40.517063296944215
                        ],
                        [
                            116.5121504822155,
                            40.49021483329893
                        ],
                        [
                            116.48534728200671,
                            40.480009853313234
                        ],
                        [
                            116.45109865572458,
                            40.48733754621737
                        ],
                        [
                            116.4453515307493,
                            40.47912151839786
                        ],
                        [
                            116.39991942124179,
                            40.48098020906721
                        ],
                        [
                            116.3866325662287,
                            40.47142329950189
                        ],
                        [
                            116.37840483565404,
                            40.47621703084848
                        ],
                        [
                            116.38182171576837,
                            40.482971370913525
                        ],
                        [
                            116.3699182487058,
                            40.484604601629286
                        ],
                        [
                            116.37060409409267,
                            40.495775868209535
                        ],
                        [
                            116.354753862513,
                            40.50031449821416
                        ],
                        [
                            116.3166262108644,
                            40.499169577543
                        ],
                        [
                            116.28582269829593,
                            40.484937722569256
                        ],
                        [
                            116.29999313671738,
                            40.465090175865605
                        ],
                        [
                            116.28297549090398,
                            40.43992929255717
                        ],
                        [
                            116.29006770368991,
                            40.422297238465944
                        ],
                        [
                            116.28018553391634,
                            40.41529474574778
                        ],
                        [
                            116.28394088114634,
                            40.38223469862355
                        ],
                        [
                            116.2770020844792,
                            40.37476739555296
                        ],
                        [
                            116.25131811215876,
                            40.38247476044334
                        ],
                        [
                            116.2425809523433,
                            40.37293869187072
                        ],
                        [
                            116.23668463891907,
                            40.37895520834009
                        ],
                        [
                            116.22495376563344,
                            40.374022327979716
                        ],
                        [
                            116.20723606176796,
                            40.38177660703888
                        ],
                        [
                            116.2012784059194,
                            40.37470774514662
                        ],
                        [
                            116.14161224690983,
                            40.361020603658474
                        ],
                        [
                            116.13852678177395,
                            40.350006475558274
                        ],
                        [
                            116.1483664376153,
                            40.34069021799233
                        ],
                        [
                            116.13930720615735,
                            40.33491006681041
                        ],
                        [
                            116.1391763810489,
                            40.34612904676397
                        ],
                        [
                            116.13217152492945,
                            40.34534995503349
                        ],
                        [
                            116.13507784202646,
                            40.31591919181212
                        ],
                        [
                            116.12574268634295,
                            40.31089687175887
                        ],
                        [
                            116.11522519472126,
                            40.31185254298854
                        ],
                        [
                            116.10334198990964,
                            40.329763073723946
                        ],
                        [
                            116.07953988685794,
                            40.32957611175538
                        ],
                        [
                            116.07008294047178,
                            40.33873649216289
                        ],
                        [
                            116.05468446103384,
                            40.335738019046985
                        ],
                        [
                            116.04702153974868,
                            40.31663483756765
                        ],
                        [
                            116.03166478685517,
                            40.311138227465634
                        ],
                        [
                            116.01005377388537,
                            40.33376077048081
                        ],
                        [
                            115.99223271196658,
                            40.32459420962974
                        ],
                        [
                            115.98428154602684,
                            40.32755499844278
                        ],
                        [
                            115.96640614975459,
                            40.31842991621767
                        ],
                        [
                            115.98353819695186,
                            40.29866430288747
                        ],
                        [
                            115.9726378406029,
                            40.29461099784533
                        ],
                        [
                            115.97502186544274,
                            40.27615463146992
                        ],
                        [
                            115.96043666250412,
                            40.26496182861141
                        ],
                        [
                            115.93931521572189,
                            40.288559539570365
                        ],
                        [
                            115.93680614751118,
                            40.30995055774148
                        ],
                        [
                            115.9152210927823,
                            40.31931542695932
                        ],
                        [
                            115.92010701329109,
                            40.339245450594156
                        ],
                        [
                            115.91168606485084,
                            40.35356754976916
                        ],
                        [
                            115.85864138472792,
                            40.357616206418506
                        ],
                        [
                            115.85343512281838,
                            40.37498143175864
                        ],
                        [
                            115.84020566805955,
                            40.37402115675155
                        ],
                        [
                            115.81266520183887,
                            40.390703233395485
                        ],
                        [
                            115.78716979666065,
                            40.426346214850746
                        ],
                        [
                            115.76352359837685,
                            40.444350887979475
                        ],
                        [
                            115.77469922399945,
                            40.492328515395826
                        ],
                        [
                            115.75695360582654,
                            40.4987128142994
                        ],
                        [
                            115.73582049723602,
                            40.49489045737868
                        ],
                        [
                            115.72887492549347,
                            40.50284241497294
                        ],
                        [
                            115.7477126111612,
                            40.53928952674055
                        ],
                        [
                            115.78442515642878,
                            40.560461085932985
                        ],
                        [
                            115.81322732131567,
                            40.5584957830694
                        ],
                        [
                            115.82035772501001,
                            40.58620565125423
                        ],
                        [
                            115.87909668825705,
                            40.594611615469105
                        ],
                        [
                            115.90308603859673,
                            40.617665490525376
                        ],
                        [
                            115.95647860454216,
                            40.60714698161544
                        ],
                        [
                            115.96724320102253,
                            40.59798907799219
                        ],
                        [
                            115.97421066496024,
                            40.60146597981485
                        ],
                        [
                            115.99163961285035,
                            40.579580965958215
                        ],
                        [
                            115.9953132608017,
                            40.58725215167831
                        ],
                        [
                            115.98291426509817,
                            40.59874723866706
                        ],
                        [
                            116.00663919107859,
                            40.590276810655475
                        ],
                        [
                            116.06669279186558,
                            40.61335857264588
                        ],
                        [
                            116.08902101775261,
                            40.611388819485995
                        ],
                        [
                            116.09195440925629,
                            40.62156529750566
                        ],
                        [
                            116.11525652792464,
                            40.628211909468654
                        ],
                        [
                            116.10473671702829,
                            40.64616822166964
                        ],
                        [
                            116.12787469341552,
                            40.665688392935856
                        ],
                        [
                            116.15719440270026,
                            40.66484352927149
                        ],
                        [
                            116.17955383766471,
                            40.71771610837046
                        ],
                        [
                            116.19479243417372,
                            40.71382515153628
                        ],
                        [
                            116.20947706178326,
                            40.72144590904666
                        ],
                        [
                            116.2065077710099,
                            40.73903497045205
                        ],
                        [
                            116.22703100159563,
                            40.75787324534803
                        ],
                        [
                            116.22819673161298,
                            40.782217128309036
                        ],
                        [
                            116.23996977160292,
                            40.79069694174682
                        ],
                        [
                            116.2630015679398,
                            40.77590702635443
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 5,
                "bm": "110116",
                "y": 40.6279833917,
                "x": "116.578974090672"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.63121043460956,
                            41.05956695521348
                        ],
                        [
                            116.67032558456377,
                            41.04120740938899
                        ],
                        [
                            116.68282698087953,
                            41.043196674224674
                        ],
                        [
                            116.69193556451918,
                            41.01954891768825
                        ],
                        [
                            116.67634333684045,
                            40.99976781547418
                        ],
                        [
                            116.67059324406745,
                            40.97017159497247
                        ],
                        [
                            116.69668258245913,
                            40.93504052047149
                        ],
                        [
                            116.7168460465934,
                            40.93129598076885
                        ],
                        [
                            116.7066264422769,
                            40.908788326414665
                        ],
                        [
                            116.72385142333425,
                            40.89587545537857
                        ],
                        [
                            116.75215433453023,
                            40.889424137602894
                        ],
                        [
                            116.75394410197916,
                            40.87954418976072
                        ],
                        [
                            116.77346174204978,
                            40.87526786045992
                        ],
                        [
                            116.79792431451891,
                            40.83939204507978
                        ],
                        [
                            116.81386321664436,
                            40.84736969043225
                        ],
                        [
                            116.81959800182953,
                            40.839605373779406
                        ],
                        [
                            116.84971673114825,
                            40.83376170332399
                        ],
                        [
                            116.8733005983163,
                            40.81616374003679
                        ],
                        [
                            116.8800931378048,
                            40.80075986492946
                        ],
                        [
                            116.85584008774343,
                            40.79184604944448
                        ],
                        [
                            116.86071532056438,
                            40.78353144989101
                        ],
                        [
                            116.82929406011837,
                            40.770875072321786
                        ],
                        [
                            116.83336098284146,
                            40.75971391774234
                        ],
                        [
                            116.82279951214022,
                            40.748888656994346
                        ],
                        [
                            116.79393469757566,
                            40.744977487421096
                        ],
                        [
                            116.77696463654686,
                            40.75656511367549
                        ],
                        [
                            116.7785832665942,
                            40.70055321110847
                        ],
                        [
                            116.74937791084365,
                            40.7046196360164
                        ],
                        [
                            116.70787459257329,
                            40.678716157139704
                        ],
                        [
                            116.70544146617006,
                            40.640280494188616
                        ],
                        [
                            116.6912425029284,
                            40.61745575270782
                        ],
                        [
                            116.70448763944341,
                            40.59920888318849
                        ],
                        [
                            116.70810001685858,
                            40.56996805656461
                        ],
                        [
                            116.6590901497185,
                            40.55169085126453
                        ],
                        [
                            116.67238852651299,
                            40.555627466950206
                        ],
                        [
                            116.67345961904556,
                            40.54893080417822
                        ],
                        [
                            116.69524828033813,
                            40.54466507147241
                        ],
                        [
                            116.71042579766494,
                            40.524118542991786
                        ],
                        [
                            116.69433350559756,
                            40.509581592342535
                        ],
                        [
                            116.68605048734051,
                            40.4868880908692
                        ],
                        [
                            116.697808481577,
                            40.47821367243442
                        ],
                        [
                            116.6868100508935,
                            40.4807997845061
                        ],
                        [
                            116.68819253975295,
                            40.467481779376335
                        ],
                        [
                            116.7027257126986,
                            40.45722152624028
                        ],
                        [
                            116.71680423852985,
                            40.45758367375328
                        ],
                        [
                            116.71922935303434,
                            40.43887967846059
                        ],
                        [
                            116.70967921845603,
                            40.44074203221807
                        ],
                        [
                            116.71557135025213,
                            40.422835651108336
                        ],
                        [
                            116.73473633512008,
                            40.41530149295978
                        ],
                        [
                            116.7032432972788,
                            40.401969457904286
                        ],
                        [
                            116.69993811873866,
                            40.392896832383514
                        ],
                        [
                            116.70713770298921,
                            40.39489921718858
                        ],
                        [
                            116.70951983268814,
                            40.38323878861416
                        ],
                        [
                            116.6997912184179,
                            40.37283748654352
                        ],
                        [
                            116.71999346057112,
                            40.36025060315607
                        ],
                        [
                            116.71620916159904,
                            40.338284660122426
                        ],
                        [
                            116.75178194401212,
                            40.33294571062903
                        ],
                        [
                            116.76680958142775,
                            40.31279281847536
                        ],
                        [
                            116.74765796179616,
                            40.30276527662053
                        ],
                        [
                            116.67734141150285,
                            40.23351548372796
                        ],
                        [
                            116.66183847071791,
                            40.23667909384667
                        ],
                        [
                            116.66025496551855,
                            40.26195729329649
                        ],
                        [
                            116.61720651028877,
                            40.25987135362313
                        ],
                        [
                            116.61557091695492,
                            40.24977496910764
                        ],
                        [
                            116.59934947884318,
                            40.25008648182264
                        ],
                        [
                            116.59313857337244,
                            40.264678459228996
                        ],
                        [
                            116.56370305340783,
                            40.268140197349105
                        ],
                        [
                            116.55959972501921,
                            40.2772501580328
                        ],
                        [
                            116.53034025146816,
                            40.276329082672895
                        ],
                        [
                            116.53348946739358,
                            40.26634006382018
                        ],
                        [
                            116.52913108378095,
                            40.260815540584446
                        ],
                        [
                            116.518582497705,
                            40.26470030272094
                        ],
                        [
                            116.51734623977048,
                            40.256695355003004
                        ],
                        [
                            116.48182027832027,
                            40.26336357284344
                        ],
                        [
                            116.47240113572713,
                            40.27886217021811
                        ],
                        [
                            116.44265204482124,
                            40.28465294204359
                        ],
                        [
                            116.4368678549448,
                            40.30148625122103
                        ],
                        [
                            116.44884923988599,
                            40.313598013635456
                        ],
                        [
                            116.43141159693751,
                            40.33217237023073
                        ],
                        [
                            116.4099418843024,
                            40.32877059328281
                        ],
                        [
                            116.37763898091575,
                            40.338018453246484
                        ],
                        [
                            116.35825075498029,
                            40.329893935535424
                        ],
                        [
                            116.36267023723481,
                            40.355432958425304
                        ],
                        [
                            116.3419165088051,
                            40.35547703011737
                        ],
                        [
                            116.35301562693509,
                            40.36548447295039
                        ],
                        [
                            116.34851919499094,
                            40.37027358645449
                        ],
                        [
                            116.3170847641428,
                            40.38634626881335
                        ],
                        [
                            116.28870852125115,
                            40.38351858544461
                        ],
                        [
                            116.27708669311252,
                            40.394390870414966
                        ],
                        [
                            116.28024298021843,
                            40.41543198601255
                        ],
                        [
                            116.28983464408954,
                            40.41980850726604
                        ],
                        [
                            116.28297549090398,
                            40.43992929255717
                        ],
                        [
                            116.29999313671738,
                            40.465090175865605
                        ],
                        [
                            116.28488585089121,
                            40.48430786104235
                        ],
                        [
                            116.3223627282372,
                            40.499490236948496
                        ],
                        [
                            116.368302259008,
                            40.497204163128025
                        ],
                        [
                            116.3699182487058,
                            40.484604601629286
                        ],
                        [
                            116.38182171576837,
                            40.482971370913525
                        ],
                        [
                            116.37840483565404,
                            40.47621703084848
                        ],
                        [
                            116.3866325662287,
                            40.47142329950189
                        ],
                        [
                            116.40049661818544,
                            40.48105705028158
                        ],
                        [
                            116.44842616402481,
                            40.47953607041785
                        ],
                        [
                            116.45109865572458,
                            40.48733754621737
                        ],
                        [
                            116.50166435625059,
                            40.48227327041506
                        ],
                        [
                            116.51254828027785,
                            40.49555219814541
                        ],
                        [
                            116.49116518040812,
                            40.51698372283311
                        ],
                        [
                            116.46975635149427,
                            40.51298815900456
                        ],
                        [
                            116.45403993308298,
                            40.523167537132146
                        ],
                        [
                            116.5249253552756,
                            40.59036654022712
                        ],
                        [
                            116.53264833146514,
                            40.62465654253618
                        ],
                        [
                            116.56324287360474,
                            40.62350116223078
                        ],
                        [
                            116.5683321883276,
                            40.63154210966277
                        ],
                        [
                            116.54457451543267,
                            40.641901353195664
                        ],
                        [
                            116.533377514119,
                            40.65572906921248
                        ],
                        [
                            116.52803540046924,
                            40.652025161759816
                        ],
                        [
                            116.51178027975433,
                            40.6598145507521
                        ],
                        [
                            116.50920951565688,
                            40.67014151877888
                        ],
                        [
                            116.47950913456275,
                            40.673606285932
                        ],
                        [
                            116.48195436039916,
                            40.69080617487604
                        ],
                        [
                            116.49589770867273,
                            40.69614576583105
                        ],
                        [
                            116.50695338876469,
                            40.740362267817815
                        ],
                        [
                            116.49488534932702,
                            40.74556809576469
                        ],
                        [
                            116.49345246532002,
                            40.759640187006056
                        ],
                        [
                            116.45869590818133,
                            40.77136423048276
                        ],
                        [
                            116.45214082641077,
                            40.79564680631118
                        ],
                        [
                            116.43419267917982,
                            40.806203187803604
                        ],
                        [
                            116.43071351673083,
                            40.8189597831988
                        ],
                        [
                            116.40159293437627,
                            40.830032598864186
                        ],
                        [
                            116.38248246948562,
                            40.86081323608486
                        ],
                        [
                            116.32738868420753,
                            40.90340609193936
                        ],
                        [
                            116.32751471069423,
                            40.92046094616096
                        ],
                        [
                            116.36334181414604,
                            40.94232696802662
                        ],
                        [
                            116.3920004857964,
                            40.904553467033004
                        ],
                        [
                            116.46762146271247,
                            40.894899606486206
                        ],
                        [
                            116.46698919072502,
                            40.91861234285414
                        ],
                        [
                            116.44068173581807,
                            40.95243070108078
                        ],
                        [
                            116.44891425700392,
                            40.979451632815746
                        ],
                        [
                            116.50958187512268,
                            40.974037689019525
                        ],
                        [
                            116.52889487450906,
                            40.98732954020275
                        ],
                        [
                            116.54872167979461,
                            40.986337920188156
                        ],
                        [
                            116.55716124566527,
                            40.99294077272905
                        ],
                        [
                            116.59211399083513,
                            40.97365213351459
                        ],
                        [
                            116.6095429479504,
                            40.98627151020006
                        ],
                        [
                            116.61660706172921,
                            41.0193409827033
                        ],
                        [
                            116.6098883817638,
                            41.051851903522866
                        ],
                        [
                            116.63121043460956,
                            41.05956695521348
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 6,
                "bm": "110111",
                "y": 39.718362001,
                "x": "115.847333646825"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            115.7970407291345,
                            39.920307874174725
                        ],
                        [
                            115.83852383451527,
                            39.896315572881576
                        ],
                        [
                            115.87323647505838,
                            39.91570763079106
                        ],
                        [
                            115.93464517693569,
                            39.91680958896512
                        ],
                        [
                            115.93885091739868,
                            39.901204623786384
                        ],
                        [
                            115.91541105432681,
                            39.88382216818247
                        ],
                        [
                            115.91935443793595,
                            39.87477371888911
                        ],
                        [
                            115.9476549222611,
                            39.86609889556538
                        ],
                        [
                            115.98914233292561,
                            39.87502914687018
                        ],
                        [
                            115.97845128104767,
                            39.86624090323329
                        ],
                        [
                            115.98221788574061,
                            39.83979459781623
                        ],
                        [
                            116.00125661270843,
                            39.84979736365046
                        ],
                        [
                            116.01263297570169,
                            39.839454138498496
                        ],
                        [
                            116.03888109145615,
                            39.84635824049146
                        ],
                        [
                            116.06575136357732,
                            39.83795447396865
                        ],
                        [
                            116.07622994799554,
                            39.827135272598255
                        ],
                        [
                            116.07817754260225,
                            39.83214488693686
                        ],
                        [
                            116.08485757108177,
                            39.781462964820065
                        ],
                        [
                            116.1086480428641,
                            39.79108644666611
                        ],
                        [
                            116.12929604024711,
                            39.780332929367184
                        ],
                        [
                            116.11122926721937,
                            39.77376093661808
                        ],
                        [
                            116.11523677155616,
                            39.76148528364917
                        ],
                        [
                            116.15371589633408,
                            39.76654093155455
                        ],
                        [
                            116.16267649601701,
                            39.78355247919404
                        ],
                        [
                            116.19368218604232,
                            39.7775370394083
                        ],
                        [
                            116.20743779123197,
                            39.822756225360735
                        ],
                        [
                            116.22827316904926,
                            39.82188437415888
                        ],
                        [
                            116.24590755283607,
                            39.79248385797328
                        ],
                        [
                            116.24061615227568,
                            39.722290994839035
                        ],
                        [
                            116.22261841983553,
                            39.70788217955961
                        ],
                        [
                            116.21246459642437,
                            39.67995028758029
                        ],
                        [
                            116.2146475713827,
                            39.57842997097009
                        ],
                        [
                            116.20144877367827,
                            39.57679246427339
                        ],
                        [
                            116.19739531629743,
                            39.58808507762291
                        ],
                        [
                            116.17775758043135,
                            39.590038310856684
                        ],
                        [
                            116.14646993163016,
                            39.58504274605656
                        ],
                        [
                            116.14234746182699,
                            39.57199742233281
                        ],
                        [
                            116.12832581975876,
                            39.56439785063155
                        ],
                        [
                            116.11443404073557,
                            39.57418206102556
                        ],
                        [
                            116.09925686858291,
                            39.57014308633599
                        ],
                        [
                            116.09463117519556,
                            39.57907717606253
                        ],
                        [
                            116.09234071083925,
                            39.5740831578086
                        ],
                        [
                            116.02909581942541,
                            39.57076863076285
                        ],
                        [
                            116.01801510224666,
                            39.57470035001309
                        ],
                        [
                            116.01969020575139,
                            39.586361155706655
                        ],
                        [
                            116.0072440015197,
                            39.587370044573056
                        ],
                        [
                            116.00085617166867,
                            39.575954229375704
                        ],
                        [
                            115.98833009538257,
                            39.57618790879107
                        ],
                        [
                            115.98496540449315,
                            39.59313922975009
                        ],
                        [
                            115.97310126428383,
                            39.595466295097744
                        ],
                        [
                            115.97375917381285,
                            39.570985488042595
                        ],
                        [
                            115.95040180109473,
                            39.560188489439845
                        ],
                        [
                            115.92362089905525,
                            39.592702191795084
                        ],
                        [
                            115.90336651379687,
                            39.60064107421007
                        ],
                        [
                            115.90638569946852,
                            39.56824877429436
                        ],
                        [
                            115.88423725640327,
                            39.568266196998934
                        ],
                        [
                            115.88652607577737,
                            39.55510480534705
                        ],
                        [
                            115.87631173873744,
                            39.54711729993281
                        ],
                        [
                            115.85946399838592,
                            39.5457879575599
                        ],
                        [
                            115.84901688858304,
                            39.55444132546121
                        ],
                        [
                            115.83948370769419,
                            39.542876934960596
                        ],
                        [
                            115.82155519521197,
                            39.54074749712477
                        ],
                        [
                            115.81213888852574,
                            39.53016074088325
                        ],
                        [
                            115.8218069607007,
                            39.506745966923404
                        ],
                        [
                            115.76090980901343,
                            39.51599750420236
                        ],
                        [
                            115.76244754601395,
                            39.507890900428116
                        ],
                        [
                            115.75687071101655,
                            39.51483137340258
                        ],
                        [
                            115.7451290004667,
                            39.5109759392562
                        ],
                        [
                            115.73177652655802,
                            39.54536216913993
                        ],
                        [
                            115.714573135731,
                            39.54265454128912
                        ],
                        [
                            115.71079540389815,
                            39.55929153830143
                        ],
                        [
                            115.68535725151835,
                            39.56546583057361
                        ],
                        [
                            115.68798924876252,
                            39.585478861488326
                        ],
                        [
                            115.68059180346701,
                            39.601589373319456
                        ],
                        [
                            115.66779054146014,
                            39.60730866762708
                        ],
                        [
                            115.64256901836181,
                            39.59759098787795
                        ],
                        [
                            115.61576152226134,
                            39.60224159243589
                        ],
                        [
                            115.61474025745623,
                            39.59304639944716
                        ],
                        [
                            115.58970590874665,
                            39.587681955590945
                        ],
                        [
                            115.55946760890627,
                            39.59146229663441
                        ],
                        [
                            115.56067461848146,
                            39.60823457146357
                        ],
                        [
                            115.54283270378619,
                            39.6147088441328
                        ],
                        [
                            115.51424855586573,
                            39.60764159808756
                        ],
                        [
                            115.52035813460135,
                            39.616399341329505
                        ],
                        [
                            115.50959345464936,
                            39.62884789513157
                        ],
                        [
                            115.52063074941707,
                            39.63755897082566
                        ],
                        [
                            115.50003279256177,
                            39.64305309183174
                        ],
                        [
                            115.49995978268838,
                            39.651205752622424
                        ],
                        [
                            115.47106594549223,
                            39.65343487587532
                        ],
                        [
                            115.51064479942286,
                            39.69961021885495
                        ],
                        [
                            115.49657708266899,
                            39.70585416761849
                        ],
                        [
                            115.48533526386082,
                            39.737837224290615
                        ],
                        [
                            115.4595479774066,
                            39.73953261645501
                        ],
                        [
                            115.4378560577306,
                            39.7498755853012
                        ],
                        [
                            115.42756550985071,
                            39.769372279481786
                        ],
                        [
                            115.42063204459667,
                            39.77248873076709
                        ],
                        [
                            115.41579394673991,
                            39.76461914103903
                        ],
                        [
                            115.40964124773807,
                            39.76981155149725
                        ],
                        [
                            115.4367455150646,
                            39.78453899118377
                        ],
                        [
                            115.45101536934345,
                            39.78131086622544
                        ],
                        [
                            115.47666180217263,
                            39.79791922116322
                        ],
                        [
                            115.49995980690628,
                            39.78247007100005
                        ],
                        [
                            115.54789132180694,
                            39.794837189789995
                        ],
                        [
                            115.56263023202213,
                            39.81247680146562
                        ],
                        [
                            115.58895189917689,
                            39.819915571112304
                        ],
                        [
                            115.62436405923589,
                            39.87138133115282
                        ],
                        [
                            115.7628476411748,
                            39.92446003139147
                        ],
                        [
                            115.7970407291345,
                            39.920307874174725
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 7,
                "bm": "110114",
                "y": 40.2142061394,
                "x": "116.202961658834"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.28369694290686,
                            40.391922183493335
                        ],
                        [
                            116.2887911321624,
                            40.38350198313203
                        ],
                        [
                            116.31723825779824,
                            40.38630755193774
                        ],
                        [
                            116.3531420717969,
                            40.36580487673794
                        ],
                        [
                            116.34199957061556,
                            40.35540906235046
                        ],
                        [
                            116.36267023723481,
                            40.355432958425304
                        ],
                        [
                            116.35825075498029,
                            40.329893935535424
                        ],
                        [
                            116.37763898091575,
                            40.338018453246484
                        ],
                        [
                            116.4099418843024,
                            40.32877059328281
                        ],
                        [
                            116.43141159693751,
                            40.33217237023073
                        ],
                        [
                            116.44884923988599,
                            40.313598013635456
                        ],
                        [
                            116.4368678549448,
                            40.30148625122103
                        ],
                        [
                            116.44274712880275,
                            40.284530023951646
                        ],
                        [
                            116.47216499698264,
                            40.27898717215146
                        ],
                        [
                            116.48113552338036,
                            40.26374684928979
                        ],
                        [
                            116.49928267779921,
                            40.26105663410955
                        ],
                        [
                            116.49332265990964,
                            40.248463176910704
                        ],
                        [
                            116.47563212947041,
                            40.24569615549186
                        ],
                        [
                            116.47809058409399,
                            40.22245526790591
                        ],
                        [
                            116.47059970333194,
                            40.22335965310951
                        ],
                        [
                            116.4639614879622,
                            40.211456761092776
                        ],
                        [
                            116.48128082144729,
                            40.19080156408871
                        ],
                        [
                            116.46995637518523,
                            40.15812923700329
                        ],
                        [
                            116.48124510640186,
                            40.1569447555852
                        ],
                        [
                            116.47232813229107,
                            40.145895653503835
                        ],
                        [
                            116.48364449324941,
                            40.10202108080703
                        ],
                        [
                            116.45805942905984,
                            40.09251366396691
                        ],
                        [
                            116.45314223153811,
                            40.05929530308991
                        ],
                        [
                            116.41705161653394,
                            40.06517497807541
                        ],
                        [
                            116.4197745781895,
                            40.059226660297405
                        ],
                        [
                            116.40265661462998,
                            40.05455379878041
                        ],
                        [
                            116.3997192151463,
                            40.039375147952356
                        ],
                        [
                            116.38842132789598,
                            40.03573616029588
                        ],
                        [
                            116.36268448989851,
                            40.04580938440276
                        ],
                        [
                            116.35982572317982,
                            40.05218731291971
                        ],
                        [
                            116.37578967605053,
                            40.06038303057313
                        ],
                        [
                            116.36327007849542,
                            40.06854308317223
                        ],
                        [
                            116.3403697225438,
                            40.06272548269276
                        ],
                        [
                            116.33656389099978,
                            40.054412495088755
                        ],
                        [
                            116.29624600829497,
                            40.059192389725524
                        ],
                        [
                            116.28361856740065,
                            40.08229575636779
                        ],
                        [
                            116.273315496029,
                            40.079075043327
                        ],
                        [
                            116.26660538956072,
                            40.09468630673012
                        ],
                        [
                            116.25600351722001,
                            40.09577077313656
                        ],
                        [
                            116.25657747458104,
                            40.109763999197305
                        ],
                        [
                            116.24990145428563,
                            40.10356889358891
                        ],
                        [
                            116.23340624364907,
                            40.10780172490976
                        ],
                        [
                            116.23980256142444,
                            40.13557640644221
                        ],
                        [
                            116.20278601454419,
                            40.13959799612716
                        ],
                        [
                            116.19147427625471,
                            40.15993103921788
                        ],
                        [
                            116.17586583618463,
                            40.157285619628766
                        ],
                        [
                            116.17114353138969,
                            40.14346227016677
                        ],
                        [
                            116.15680142848582,
                            40.138590771615696
                        ],
                        [
                            116.16332075759331,
                            40.122801501291285
                        ],
                        [
                            116.1259430389028,
                            40.120333160246055
                        ],
                        [
                            116.12231376825508,
                            40.113731040672796
                        ],
                        [
                            116.07742689030322,
                            40.11917658740341
                        ],
                        [
                            116.04190248940466,
                            40.08432902656195
                        ],
                        [
                            116.01398168561019,
                            40.07372808751534
                        ],
                        [
                            115.98071907690269,
                            40.08272248831379
                        ],
                        [
                            115.9617640215424,
                            40.0748001251269
                        ],
                        [
                            115.95616247090555,
                            40.101533043857394
                        ],
                        [
                            115.95008950396851,
                            40.095307384874054
                        ],
                        [
                            115.93726213649772,
                            40.10200507003112
                        ],
                        [
                            115.93985140150944,
                            40.10972242726608
                        ],
                        [
                            115.92038815996887,
                            40.130063096467445
                        ],
                        [
                            115.84961890558334,
                            40.146741901252504
                        ],
                        [
                            115.83726923605676,
                            40.164880179174254
                        ],
                        [
                            115.84744739371432,
                            40.17939094753768
                        ],
                        [
                            115.8424374263882,
                            40.18402837471438
                        ],
                        [
                            115.86549943577286,
                            40.18676025354493
                        ],
                        [
                            115.86504256207593,
                            40.20571254982758
                        ],
                        [
                            115.87350783610242,
                            40.20235511291671
                        ],
                        [
                            115.88451638645084,
                            40.232932081474615
                        ],
                        [
                            115.90489873196194,
                            40.233914736085104
                        ],
                        [
                            115.91522190384204,
                            40.24970863846287
                        ],
                        [
                            115.95301947779505,
                            40.25582034844692
                        ],
                        [
                            115.96183919420017,
                            40.26323933520184
                        ],
                        [
                            115.97502186544274,
                            40.27615463146992
                        ],
                        [
                            115.9726378406029,
                            40.29461099784533
                        ],
                        [
                            115.98353819695186,
                            40.29866430288747
                        ],
                        [
                            115.96640614975459,
                            40.31842991621767
                        ],
                        [
                            115.98428154602684,
                            40.32755499844278
                        ],
                        [
                            115.99223271196658,
                            40.32459420962974
                        ],
                        [
                            116.01005377388537,
                            40.33376077048081
                        ],
                        [
                            116.03166478685517,
                            40.311138227465634
                        ],
                        [
                            116.04702153974868,
                            40.31663483756765
                        ],
                        [
                            116.05468446103384,
                            40.335738019046985
                        ],
                        [
                            116.07008294047178,
                            40.33873649216289
                        ],
                        [
                            116.07953988685794,
                            40.32957611175538
                        ],
                        [
                            116.10334198990964,
                            40.329763073723946
                        ],
                        [
                            116.11522519472126,
                            40.31185254298854
                        ],
                        [
                            116.12574268634295,
                            40.31089687175887
                        ],
                        [
                            116.13507784202646,
                            40.31591919181212
                        ],
                        [
                            116.13217152492945,
                            40.34534995503349
                        ],
                        [
                            116.1391763810489,
                            40.34612904676397
                        ],
                        [
                            116.13930720615735,
                            40.33491006681041
                        ],
                        [
                            116.1483664376153,
                            40.34069021799233
                        ],
                        [
                            116.13852678177395,
                            40.350006475558274
                        ],
                        [
                            116.14267814483827,
                            40.36144636403445
                        ],
                        [
                            116.2012784059194,
                            40.37470774514662
                        ],
                        [
                            116.20723606176796,
                            40.38177660703888
                        ],
                        [
                            116.24235795647361,
                            40.372874192699896
                        ],
                        [
                            116.25131811215876,
                            40.38247476044334
                        ],
                        [
                            116.27612336131511,
                            40.374356651066606
                        ],
                        [
                            116.28369694290686,
                            40.391922183493335
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 8,
                "bm": "110105",
                "y": 39.9502421994,
                "x": "116.506207881081"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.54147680221682,
                            40.06147798801647
                        ],
                        [
                            116.54167141640984,
                            40.04642512084536
                        ],
                        [
                            116.59518738183591,
                            40.01301003719327
                        ],
                        [
                            116.62924258149216,
                            40.00312806141134
                        ],
                        [
                            116.6371190607415,
                            39.993007539128996
                        ],
                        [
                            116.62647114086512,
                            39.98303989367693
                        ],
                        [
                            116.63447304298667,
                            39.97977723922397
                        ],
                        [
                            116.63820127755586,
                            39.94544009453241
                        ],
                        [
                            116.62552842179946,
                            39.94983723137064
                        ],
                        [
                            116.62761849838894,
                            39.93772695011453
                        ],
                        [
                            116.61774408871499,
                            39.929278460735105
                        ],
                        [
                            116.62421316980016,
                            39.92073823445659
                        ],
                        [
                            116.61444868883522,
                            39.9223930567138
                        ],
                        [
                            116.61729002039964,
                            39.90367387152373
                        ],
                        [
                            116.60754407150857,
                            39.896327267945466
                        ],
                        [
                            116.60922281506357,
                            39.88896736571273
                        ],
                        [
                            116.62161152051398,
                            39.88974986539966
                        ],
                        [
                            116.61397172014256,
                            39.86773928428147
                        ],
                        [
                            116.6213553897032,
                            39.85979297799914
                        ],
                        [
                            116.5979531254125,
                            39.84877597250935
                        ],
                        [
                            116.5917081980277,
                            39.82402615534046
                        ],
                        [
                            116.57703624467352,
                            39.82423748517436
                        ],
                        [
                            116.5659820374611,
                            39.83422800827096
                        ],
                        [
                            116.53868490556331,
                            39.83535835886098
                        ],
                        [
                            116.5345119493389,
                            39.828784125240304
                        ],
                        [
                            116.52674426462062,
                            39.832138207921695
                        ],
                        [
                            116.52840125427508,
                            39.82386356165094
                        ],
                        [
                            116.50824772945367,
                            39.82945393049279
                        ],
                        [
                            116.49982325853522,
                            39.81687198526388
                        ],
                        [
                            116.48297273715347,
                            39.81808423775733
                        ],
                        [
                            116.46759191245742,
                            39.80887586891778
                        ],
                        [
                            116.4182998530836,
                            39.830849911272004
                        ],
                        [
                            116.4449605581052,
                            39.85092781794133
                        ],
                        [
                            116.46093881839961,
                            39.8517957279733
                        ],
                        [
                            116.43605620255533,
                            39.86525448912414
                        ],
                        [
                            116.43717046875815,
                            39.889078893967266
                        ],
                        [
                            116.44543010888502,
                            39.89130091071485
                        ],
                        [
                            116.44159971195093,
                            39.9022692949772
                        ],
                        [
                            116.42954313412997,
                            39.90090560371103
                        ],
                        [
                            116.42749599432435,
                            39.927689115664826
                        ],
                        [
                            116.43690137173506,
                            39.927667627319025
                        ],
                        [
                            116.44008265155838,
                            39.944965973704235
                        ],
                        [
                            116.42324488884978,
                            39.94915687533374
                        ],
                        [
                            116.42363386764472,
                            39.95857928367849
                        ],
                        [
                            116.40718204193196,
                            39.96094600034172
                        ],
                        [
                            116.40239575237129,
                            39.972985181595746
                        ],
                        [
                            116.40095506652807,
                            39.96101756031762
                        ],
                        [
                            116.38078377876933,
                            39.960369397630586
                        ],
                        [
                            116.38723389273896,
                            39.972005407767305
                        ],
                        [
                            116.37410283341886,
                            39.97166234062074
                        ],
                        [
                            116.36323239834452,
                            40.0004541438789
                        ],
                        [
                            116.34407593739562,
                            40.02581661812882
                        ],
                        [
                            116.38821037766176,
                            40.03180840599468
                        ],
                        [
                            116.3837763774119,
                            40.04022313098828
                        ],
                        [
                            116.3997192151463,
                            40.039375147952356
                        ],
                        [
                            116.40265661462998,
                            40.05455379878041
                        ],
                        [
                            116.4197745781895,
                            40.059226660297405
                        ],
                        [
                            116.41705161653394,
                            40.06517497807541
                        ],
                        [
                            116.4528857145123,
                            40.059128380958846
                        ],
                        [
                            116.46018424548244,
                            40.089244504470805
                        ],
                        [
                            116.54147680221682,
                            40.06147798801647
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 9,
                "bm": "110108",
                "y": 40.0262029238,
                "x": "116.226013160373"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.23980256142444,
                            40.13557640644221
                        ],
                        [
                            116.23340624364907,
                            40.10780172490976
                        ],
                        [
                            116.24990145428563,
                            40.10356889358891
                        ],
                        [
                            116.25657747458104,
                            40.109763999197305
                        ],
                        [
                            116.25600351722001,
                            40.09577077313656
                        ],
                        [
                            116.26660538956072,
                            40.09468630673012
                        ],
                        [
                            116.273315496029,
                            40.079075043327
                        ],
                        [
                            116.28361856740065,
                            40.08229575636779
                        ],
                        [
                            116.29624600829497,
                            40.059192389725524
                        ],
                        [
                            116.33622000284686,
                            40.05438284720635
                        ],
                        [
                            116.35648398082739,
                            40.06782284834647
                        ],
                        [
                            116.37482752722387,
                            40.06535226423442
                        ],
                        [
                            116.36022804230552,
                            40.050137425853535
                        ],
                        [
                            116.38821037766176,
                            40.03180840599468
                        ],
                        [
                            116.34407593739562,
                            40.02581661812882
                        ],
                        [
                            116.37005912611046,
                            39.991425129340016
                        ],
                        [
                            116.37355868604958,
                            39.96721939016742
                        ],
                        [
                            116.36332021811884,
                            39.96687811311357
                        ],
                        [
                            116.36512118297823,
                            39.948063301895985
                        ],
                        [
                            116.34983439059584,
                            39.943615083182706
                        ],
                        [
                            116.34603934422776,
                            39.95018175734414
                        ],
                        [
                            116.34447874039112,
                            39.94204666984984
                        ],
                        [
                            116.32132946798494,
                            39.94145415356374
                        ],
                        [
                            116.3314434174664,
                            39.896451218717004
                        ],
                        [
                            116.30661347645444,
                            39.89592985547595
                        ],
                        [
                            116.28739065386391,
                            39.88579388107369
                        ],
                        [
                            116.28830644756331,
                            39.89559019470525
                        ],
                        [
                            116.24634477424613,
                            39.89641573790571
                        ],
                        [
                            116.24539415879818,
                            39.920184128241395
                        ],
                        [
                            116.20002380121535,
                            39.917088968928006
                        ],
                        [
                            116.21314684098596,
                            39.942630164824216
                        ],
                        [
                            116.17909555576456,
                            39.969304293136794
                        ],
                        [
                            116.17826485990568,
                            39.98491133192747
                        ],
                        [
                            116.17213657595155,
                            39.98728044357
                        ],
                        [
                            116.16422108602383,
                            39.97582016208508
                        ],
                        [
                            116.16040338342334,
                            39.986464751430205
                        ],
                        [
                            116.1503661035801,
                            39.98392034711241
                        ],
                        [
                            116.14667224331238,
                            39.99569382216346
                        ],
                        [
                            116.16868537464906,
                            40.005407410225445
                        ],
                        [
                            116.13222924365986,
                            40.028163410421726
                        ],
                        [
                            116.07119658822236,
                            40.03172099066011
                        ],
                        [
                            116.06439258313627,
                            40.06066080211511
                        ],
                        [
                            116.04221677722639,
                            40.08659674876459
                        ],
                        [
                            116.07738096397007,
                            40.11916442661548
                        ],
                        [
                            116.12231376825508,
                            40.113731040672796
                        ],
                        [
                            116.1259430389028,
                            40.120333160246055
                        ],
                        [
                            116.16332075759331,
                            40.122801501291285
                        ],
                        [
                            116.15680142848582,
                            40.138590771615696
                        ],
                        [
                            116.17114353138969,
                            40.14346227016677
                        ],
                        [
                            116.17586583618463,
                            40.157285619628766
                        ],
                        [
                            116.19147427625471,
                            40.15993103921788
                        ],
                        [
                            116.20278601454419,
                            40.13959799612716
                        ],
                        [
                            116.23980256142444,
                            40.13557640644221
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 10,
                "bm": "110107",
                "y": 39.9322733868,
                "x": "116.171043039241"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.144052851185,
                            39.99259714534024
                        ],
                        [
                            116.151230078259,
                            39.983166565730826
                        ],
                        [
                            116.16040338460508,
                            39.98646475053816
                        ],
                        [
                            116.16398669935404,
                            39.97584188845312
                        ],
                        [
                            116.17213657595155,
                            39.98728044357
                        ],
                        [
                            116.17826486107636,
                            39.98491133193576
                        ],
                        [
                            116.17909555576456,
                            39.969304293136794
                        ],
                        [
                            116.21314684098596,
                            39.942630164824216
                        ],
                        [
                            116.20002380120486,
                            39.91708896982855
                        ],
                        [
                            116.24539415761869,
                            39.92018412913433
                        ],
                        [
                            116.25070627129237,
                            39.894254588474496
                        ],
                        [
                            116.22235866355769,
                            39.88957836548884
                        ],
                        [
                            116.20321073088505,
                            39.873191248911645
                        ],
                        [
                            116.19173390068602,
                            39.8820316054015
                        ],
                        [
                            116.16053054186203,
                            39.886061774617616
                        ],
                        [
                            116.13462111985437,
                            39.92065855084986
                        ],
                        [
                            116.10491530422995,
                            39.94192611795473
                        ],
                        [
                            116.11606263626663,
                            39.966704517674025
                        ],
                        [
                            116.10647224691851,
                            39.98052461516115
                        ],
                        [
                            116.144052851185,
                            39.99259714534024
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 11,
                "bm": "110112",
                "y": 39.8028877474,
                "x": "116.726179976601"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.60769898896936,
                            40.031049770282614
                        ],
                        [
                            116.61364365473051,
                            40.021817094109174
                        ],
                        [
                            116.64441236441677,
                            40.02490382481516
                        ],
                        [
                            116.67966119180566,
                            40.00749597214832
                        ],
                        [
                            116.67896652566021,
                            40.01578061326844
                        ],
                        [
                            116.69059755501884,
                            40.0153121336223
                        ],
                        [
                            116.70268870040354,
                            40.025856030983164
                        ],
                        [
                            116.71068480633929,
                            40.0187497101989
                        ],
                        [
                            116.73549890219171,
                            40.02664975319374
                        ],
                        [
                            116.74672882531745,
                            40.015072198163104
                        ],
                        [
                            116.76569603862457,
                            40.014143954312274
                        ],
                        [
                            116.7680449830953,
                            39.991496331453746
                        ],
                        [
                            116.75321604253106,
                            39.96370133507789
                        ],
                        [
                            116.77797407265297,
                            39.9444978151936
                        ],
                        [
                            116.77905347017553,
                            39.88580296743656
                        ],
                        [
                            116.79777010513025,
                            39.87756658631537
                        ],
                        [
                            116.80541846214068,
                            39.888780893943945
                        ],
                        [
                            116.81014987400927,
                            39.877384865942176
                        ],
                        [
                            116.85930424506617,
                            39.84302316831098
                        ],
                        [
                            116.87873183942901,
                            39.844558412284876
                        ],
                        [
                            116.89221270796648,
                            39.83118273228285
                        ],
                        [
                            116.90047039857366,
                            39.83207634562408
                        ],
                        [
                            116.89578614661305,
                            39.84741471337963
                        ],
                        [
                            116.90808875625756,
                            39.84827171935204
                        ],
                        [
                            116.92329757246846,
                            39.81035745501455
                        ],
                        [
                            116.93521527161334,
                            39.803184911881054
                        ],
                        [
                            116.93120962801055,
                            39.79270425675667
                        ],
                        [
                            116.94724499022992,
                            39.7857749275973
                        ],
                        [
                            116.93960628005188,
                            39.77686553835079
                        ],
                        [
                            116.91346913886979,
                            39.77872685876055
                        ],
                        [
                            116.90885696469883,
                            39.76208371885041
                        ],
                        [
                            116.90131323504505,
                            39.76550544858346
                        ],
                        [
                            116.89321327861813,
                            39.75830383240653
                        ],
                        [
                            116.91046167527229,
                            39.73047453038548
                        ],
                        [
                            116.88098358310926,
                            39.724489273228805
                        ],
                        [
                            116.87689061129933,
                            39.71737517081307
                        ],
                        [
                            116.88682813459457,
                            39.69530547439378
                        ],
                        [
                            116.88084408235335,
                            39.69032600108024
                        ],
                        [
                            116.8980763873507,
                            39.689061656565336
                        ],
                        [
                            116.89976058655894,
                            39.677206715120334
                        ],
                        [
                            116.8435571995209,
                            39.66660766172859
                        ],
                        [
                            116.84601427210985,
                            39.6517165274207
                        ],
                        [
                            116.8210121004044,
                            39.63744192818635
                        ],
                        [
                            116.82844929425269,
                            39.61651240508361
                        ],
                        [
                            116.78279671504144,
                            39.60971065487485
                        ],
                        [
                            116.78895768091812,
                            39.60168433882575
                        ],
                        [
                            116.77272302290581,
                            39.59229203649576
                        ],
                        [
                            116.77079020737591,
                            39.602989233868975
                        ],
                        [
                            116.74904861896825,
                            39.616885919053026
                        ],
                        [
                            116.72389925245179,
                            39.61852575073199
                        ],
                        [
                            116.71694807146336,
                            39.63819058738573
                        ],
                        [
                            116.70369633980825,
                            39.63701368436337
                        ],
                        [
                            116.69715391005056,
                            39.67341185225443
                        ],
                        [
                            116.66304722760613,
                            39.67391020655408
                        ],
                        [
                            116.65988680222446,
                            39.68648274537899
                        ],
                        [
                            116.64441197901347,
                            39.68758023459897
                        ],
                        [
                            116.63958979393968,
                            39.7002620332145
                        ],
                        [
                            116.64668725427417,
                            39.70775302643192
                        ],
                        [
                            116.63082521252866,
                            39.72368501608971
                        ],
                        [
                            116.6152918184988,
                            39.72744797199906
                        ],
                        [
                            116.59413167754475,
                            39.71176479662714
                        ],
                        [
                            116.57073292685065,
                            39.70893363122929
                        ],
                        [
                            116.56659514757473,
                            39.71422314726226
                        ],
                        [
                            116.52374816057589,
                            39.71269350254412
                        ],
                        [
                            116.5306254068874,
                            39.721756912876295
                        ],
                        [
                            116.52582015443818,
                            39.738786807288534
                        ],
                        [
                            116.53325130981801,
                            39.74053267214782
                        ],
                        [
                            116.52089438266368,
                            39.74254663100582
                        ],
                        [
                            116.5254191583494,
                            39.74792410645823
                        ],
                        [
                            116.51634811367782,
                            39.74868734742672
                        ],
                        [
                            116.51399413916371,
                            39.76487663904936
                        ],
                        [
                            116.51706946131189,
                            39.76902976417517
                        ],
                        [
                            116.52187845295637,
                            39.760523213475786
                        ],
                        [
                            116.53406222214447,
                            39.76043496402201
                        ],
                        [
                            116.52992800838847,
                            39.767762202453035
                        ],
                        [
                            116.53924002091769,
                            39.767970667790856
                        ],
                        [
                            116.52901534353288,
                            39.76981739003382
                        ],
                        [
                            116.5265874169301,
                            39.78770925642892
                        ],
                        [
                            116.53512140062877,
                            39.802480581672135
                        ],
                        [
                            116.52674426462062,
                            39.832138207921695
                        ],
                        [
                            116.5659820374611,
                            39.83422800827096
                        ],
                        [
                            116.57703624467352,
                            39.82423748517436
                        ],
                        [
                            116.5917081980277,
                            39.82402615534046
                        ],
                        [
                            116.5979531254125,
                            39.84877597250935
                        ],
                        [
                            116.6213553897032,
                            39.85979297799914
                        ],
                        [
                            116.61397172014256,
                            39.86773928428147
                        ],
                        [
                            116.62161152051398,
                            39.88974986539966
                        ],
                        [
                            116.60922281506357,
                            39.88896736571273
                        ],
                        [
                            116.60754407150857,
                            39.896327267945466
                        ],
                        [
                            116.61729002039964,
                            39.90367387152373
                        ],
                        [
                            116.61444868883522,
                            39.9223930567138
                        ],
                        [
                            116.62421316980016,
                            39.92073823445659
                        ],
                        [
                            116.61774408871499,
                            39.929278460735105
                        ],
                        [
                            116.62761849838894,
                            39.93772695011453
                        ],
                        [
                            116.62552842179946,
                            39.94983723137064
                        ],
                        [
                            116.63820127755586,
                            39.94544009453241
                        ],
                        [
                            116.63447304298667,
                            39.97977723922397
                        ],
                        [
                            116.62647114086512,
                            39.98303989367693
                        ],
                        [
                            116.63728888701715,
                            39.99189310484806
                        ],
                        [
                            116.62924258149216,
                            40.00312806141134
                        ],
                        [
                            116.58894630705632,
                            40.0166229438694
                        ],
                        [
                            116.60769898896936,
                            40.031049770282614
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 12,
                "bm": "110109",
                "y": 39.9933170839,
                "x": "115.785110269135"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            115.9154057539625,
                            40.13351075509871
                        ],
                        [
                            115.93985140150944,
                            40.10972242726608
                        ],
                        [
                            115.93726213649772,
                            40.10200507003112
                        ],
                        [
                            115.95008950396851,
                            40.095307384874054
                        ],
                        [
                            115.95616247090555,
                            40.101533043857394
                        ],
                        [
                            115.9617640215424,
                            40.0748001251269
                        ],
                        [
                            115.98071907690269,
                            40.08272248831379
                        ],
                        [
                            116.01398168561019,
                            40.07372808751534
                        ],
                        [
                            116.04189741441523,
                            40.08432898458421
                        ],
                        [
                            116.06439258313627,
                            40.06066080211511
                        ],
                        [
                            116.07119658822236,
                            40.03172099066011
                        ],
                        [
                            116.12752820753391,
                            40.02965068721796
                        ],
                        [
                            116.1569620196288,
                            40.01591919503875
                        ],
                        [
                            116.16588142714778,
                            40.00004308522789
                        ],
                        [
                            116.10647224574792,
                            39.98052461515212
                        ],
                        [
                            116.1160626351079,
                            39.966704516764565
                        ],
                        [
                            116.10491530306001,
                            39.9419261179457
                        ],
                        [
                            116.13462111869615,
                            39.92065854994059
                        ],
                        [
                            116.16053054187299,
                            39.88606177371708
                        ],
                        [
                            116.14692149027229,
                            39.88802488521448
                        ],
                        [
                            116.09578045334895,
                            39.872315197251694
                        ],
                        [
                            116.09466285994887,
                            39.86663887748581
                        ],
                        [
                            116.06529518839878,
                            39.868145023480054
                        ],
                        [
                            116.06406731425916,
                            39.85271110377923
                        ],
                        [
                            116.04764088322142,
                            39.844973305651216
                        ],
                        [
                            116.01287418156481,
                            39.839409825521564
                        ],
                        [
                            116.00125661270843,
                            39.84979736365046
                        ],
                        [
                            115.98326111930413,
                            39.839514160240064
                        ],
                        [
                            115.97845128104767,
                            39.86624090323329
                        ],
                        [
                            115.9903299802246,
                            39.87454685542836
                        ],
                        [
                            115.9476549222611,
                            39.86609889556538
                        ],
                        [
                            115.91935443793595,
                            39.87477371888911
                        ],
                        [
                            115.91541105432681,
                            39.88382216818247
                        ],
                        [
                            115.93885091739868,
                            39.901204623786384
                        ],
                        [
                            115.9341742943516,
                            39.91700609538745
                        ],
                        [
                            115.87323647505838,
                            39.91570763079106
                        ],
                        [
                            115.83852383451527,
                            39.896315572881576
                        ],
                        [
                            115.7970407291345,
                            39.920307874174725
                        ],
                        [
                            115.7628476411748,
                            39.92446003139147
                        ],
                        [
                            115.62436405923589,
                            39.87138133115282
                        ],
                        [
                            115.58895189917689,
                            39.819915571112304
                        ],
                        [
                            115.56289472344048,
                            39.812673705768994
                        ],
                        [
                            115.50743650099288,
                            39.83695405488787
                        ],
                        [
                            115.50377796832277,
                            39.84404588799126
                        ],
                        [
                            115.52241605467384,
                            39.87493902610798
                        ],
                        [
                            115.50279141278646,
                            39.88083920057486
                        ],
                        [
                            115.51314632749848,
                            39.90202714921534
                        ],
                        [
                            115.4739493824356,
                            39.93477522089972
                        ],
                        [
                            115.41661164634012,
                            39.95470033673935
                        ],
                        [
                            115.42143069816917,
                            39.98328153826816
                        ],
                        [
                            115.4429641597094,
                            39.99235786206431
                        ],
                        [
                            115.43433966898488,
                            40.00958465078112
                        ],
                        [
                            115.44813999630111,
                            40.02955108747239
                        ],
                        [
                            115.4647460656901,
                            40.028749303993486
                        ],
                        [
                            115.50305105086255,
                            40.064720895919166
                        ],
                        [
                            115.54548580121778,
                            40.078526264717716
                        ],
                        [
                            115.55689634422151,
                            40.09804587553856
                        ],
                        [
                            115.58484832673491,
                            40.09655277619554
                        ],
                        [
                            115.59249264334959,
                            40.11937147209641
                        ],
                        [
                            115.63511967726828,
                            40.11531053259348
                        ],
                        [
                            115.64858591073487,
                            40.13127325621132
                        ],
                        [
                            115.67836178263686,
                            40.125871389053756
                        ],
                        [
                            115.70267001213733,
                            40.13386138258431
                        ],
                        [
                            115.72937420095067,
                            40.12944396554875
                        ],
                        [
                            115.73000903602893,
                            40.138197179939176
                        ],
                        [
                            115.74573846164262,
                            40.1461467815028
                        ],
                        [
                            115.7355141855704,
                            40.15390555624684
                        ],
                        [
                            115.76154274490969,
                            40.16503414429911
                        ],
                        [
                            115.7662853772653,
                            40.17538626257607
                        ],
                        [
                            115.78259522675356,
                            40.177852653028765
                        ],
                        [
                            115.80030710308884,
                            40.15210952659637
                        ],
                        [
                            115.8584591401989,
                            40.147927186859675
                        ],
                        [
                            115.87499159468962,
                            40.138386944875805
                        ],
                        [
                            115.9154057539625,
                            40.13351075509871
                        ]
                    ]
                ]
            }
        },
        {
            "attributes": {
                "FID": 13,
                "bm": "110113",
                "y": 40.1492225263,
                "x": "116.715777102184"
            },
            "geometry": {
                "rings": [
                    [
                        [
                            116.86498608738106,
                            40.29006703104089
                        ],
                        [
                            116.867645828663,
                            40.26755144959236
                        ],
                        [
                            116.89512210710704,
                            40.23615746440951
                        ],
                        [
                            116.88755015104152,
                            40.231650141482916
                        ],
                        [
                            116.90723679347276,
                            40.21938362085617
                        ],
                        [
                            116.92442436134219,
                            40.22990143894891
                        ],
                        [
                            116.93427727032396,
                            40.22321971286089
                        ],
                        [
                            116.93191684572493,
                            40.210402110368015
                        ],
                        [
                            116.92284834629102,
                            40.21052880863661
                        ],
                        [
                            116.92947732720795,
                            40.19543107380015
                        ],
                        [
                            116.94228285898652,
                            40.19002472042276
                        ],
                        [
                            116.94026285910891,
                            40.17685975581699
                        ],
                        [
                            116.95531591528145,
                            40.174778969809864
                        ],
                        [
                            116.97212598688597,
                            40.15152278420968
                        ],
                        [
                            116.95901938984512,
                            40.12701451164819
                        ],
                        [
                            116.97599252208767,
                            40.06987411553052
                        ],
                        [
                            116.9556118757702,
                            40.062771296496244
                        ],
                        [
                            116.95529120083509,
                            40.05064367946489
                        ],
                        [
                            116.93861131202583,
                            40.04063144957258
                        ],
                        [
                            116.92299970740328,
                            40.05469839687137
                        ],
                        [
                            116.91030318026044,
                            40.04365961082459
                        ],
                        [
                            116.90392793025597,
                            40.05195326101199
                        ],
                        [
                            116.86436690804841,
                            40.03971872972281
                        ],
                        [
                            116.84355175215518,
                            40.05448970769464
                        ],
                        [
                            116.82494771443258,
                            40.04999858423891
                        ],
                        [
                            116.81617395524071,
                            40.04581804209973
                        ],
                        [
                            116.81586766980202,
                            40.02879302347476
                        ],
                        [
                            116.77437255785067,
                            40.03399167282911
                        ],
                        [
                            116.76569256189556,
                            40.01414440119373
                        ],
                        [
                            116.74672882531745,
                            40.015072198163104
                        ],
                        [
                            116.73549890219171,
                            40.02664975319374
                        ],
                        [
                            116.71068480633929,
                            40.0187497101989
                        ],
                        [
                            116.70268870040354,
                            40.025856030983164
                        ],
                        [
                            116.69059755501884,
                            40.0153121336223
                        ],
                        [
                            116.67896652566021,
                            40.01578061326844
                        ],
                        [
                            116.67966119180566,
                            40.00749597214832
                        ],
                        [
                            116.64441236441677,
                            40.02490382481516
                        ],
                        [
                            116.61364365473051,
                            40.021817094109174
                        ],
                        [
                            116.60769898896936,
                            40.031049770282614
                        ],
                        [
                            116.58894630705632,
                            40.0166229438694
                        ],
                        [
                            116.54072923157118,
                            40.04712836787877
                        ],
                        [
                            116.54147680221682,
                            40.06147798801647
                        ],
                        [
                            116.45793529575941,
                            40.091901577604006
                        ],
                        [
                            116.48570624541053,
                            40.107005152591974
                        ],
                        [
                            116.47232813229107,
                            40.145895653503835
                        ],
                        [
                            116.48124510640186,
                            40.1569447555852
                        ],
                        [
                            116.46995637518523,
                            40.15812923700329
                        ],
                        [
                            116.48128082144729,
                            40.19080156408871
                        ],
                        [
                            116.46396059139856,
                            40.20858840986195
                        ],
                        [
                            116.46699422072847,
                            40.22018567510076
                        ],
                        [
                            116.47809058409399,
                            40.22245526790591
                        ],
                        [
                            116.47563212947041,
                            40.24569615549186
                        ],
                        [
                            116.49332265990964,
                            40.248463176910704
                        ],
                        [
                            116.49800760702897,
                            40.26021087485166
                        ],
                        [
                            116.507620816115,
                            40.25568716530032
                        ],
                        [
                            116.51734623977048,
                            40.256695355003004
                        ],
                        [
                            116.518582497705,
                            40.26470030272094
                        ],
                        [
                            116.52913108378095,
                            40.260815540584446
                        ],
                        [
                            116.53034025146816,
                            40.276329082672895
                        ],
                        [
                            116.55959972501921,
                            40.2772501580328
                        ],
                        [
                            116.56370305340783,
                            40.268140197349105
                        ],
                        [
                            116.59019130444202,
                            40.266052241620365
                        ],
                        [
                            116.59934947884318,
                            40.25008648182264
                        ],
                        [
                            116.61557091695492,
                            40.24977496910764
                        ],
                        [
                            116.61720651028877,
                            40.25987135362313
                        ],
                        [
                            116.66050202332211,
                            40.26191839390597
                        ],
                        [
                            116.66183847071791,
                            40.23667909384667
                        ],
                        [
                            116.67734141150285,
                            40.23351548372796
                        ],
                        [
                            116.7316193871087,
                            40.283529875622925
                        ],
                        [
                            116.73151288641533,
                            40.27775424532699
                        ],
                        [
                            116.76487774280758,
                            40.265597027392204
                        ],
                        [
                            116.78210775325124,
                            40.29054757523196
                        ],
                        [
                            116.8160823560998,
                            40.280456489950765
                        ],
                        [
                            116.82227740421858,
                            40.30358299533472
                        ],
                        [
                            116.84225775200817,
                            40.31042373623501
                        ],
                        [
                            116.85120483813012,
                            40.291503905047556
                        ],
                        [
                            116.86498608738106,
                            40.29006703104089
                        ]
                    ]
                ]
            }
        }
    ]
};
for(var i=0;i<Td.features.length;i++)
{
var item=Td.features[i];
var bm=item.attributes.bm;
var x=item.attributes.x;
var y=item.attributes.y;
var geo=item.geometry;
var Tobj={x:x,y:y,geo:geo};
data._hashT.put(bm,Tobj);
};
var QueryCondition=[
    {id:"1",d:[{name:"不限",c:"100"},{name:"私营企业",c:"101"},{name:"合作社",c:"102"},{name:"企业法人",c:"103"},{name:"股份制",c:"104"},{name:"集体",c:"105"},{name:"其他",c:"106"}]},
    {id:"2",d:[{name:"不限",c:"200"},{name:"50亩以下",c:"201"},{name:"50-200亩",c:"202"},{name:"200亩以上",c:"203"}]},
    {id:"3",d:[{name:"不限",c:"300"},{name:"50亩以下",c:"301"},{name:"50-200亩",c:"302"},{name:"200亩以上",c:"303"}]},
    {id:"4",d:[{name:"不限",c:"400"},{name:"草金鱼",c:"401"},{name:"宫庭金鱼",c:"402"},{name:"锦鲤",c:"403"},{name:"匙吻鲟",c:"404"},{name:"鲢鱼",c:"405"},{name:"鲂鱼",c:"406"},
    {name:"鳙鱼",c:"407"},{name:"罗非",c:"408"},{name:"草鱼",c:"409"},{name:"龟鳖",c:"410"},{name:"鲤鱼",c:"411"},{name:"鲫鱼",c:"412"},
    {name:"虹鳟",c:"413"},{name:"西伯利亚鲟",c:"414"},{name:"达氏鳇",c:"415"},{name:"施氏鲟",c:"416"},{name:"杂交鲟",c:"417"},{name:"欧洲鳇",c:"418"},
    {name:"俄罗斯鲟",c:"419"},{name:"湖鲟",c:"420"},{name:"小体鲟",c:"421"}]},
    {id:"5",d:[{name:"不限",c:"500"},{name:"池塘",c:"501"},{name:"流水",c:"502"},{name:"工厂化",c:"503"},{name:"工业化",c:"504"},{name:"循环温室",c:"505"}]},
    {id:"6",d:[{name:"不限",c:"600"},{name:"精品",c:"601"},{name:"休闲",c:"602"},{name:"籽种",c:"603"}]},
    {id:"7",d:[{name:"不限",c:"700"},{name:"本地",c:"701"},{name:"外埠",c:"702"}]},
    {id:"8",d:[{name:"不限",c:"800"},{name:"100万以下",c:"801"},{name:"100-500万",c:"802"},{name:"500万以上",c:"803"}]},
    {id:"9",d:[{name:"不限",c:"900"},{name:"50万以下",c:"901"},{name:"50-100万",c:"902"},{name:"100万以上",c:"903"}]},
    {id:"10",d:[{name:"不限",c:"1000"},{name:"100万以下",c:"1001"},{name:"100-500万",c:"1002"},{name:"500万以上",c:"1003"}]},
    {id:"11",d:[{name:"不限",c:"1100"},{name:"丰台区",c:"110106"},{name:"大兴区",c:"110115"},{name:"密云县",c:"110118"},
    {name:"平谷区",c:"110117"},{name:"延庆县",c:"110119"},{name:"怀柔区",c:"110116"},{name:"房山区",c:"110111"},
    {name:"昌平区",c:"110114"},{name:"朝阳区",c:"110105"},{name:"海淀区",c:"110108"},{name:"石景山区",c:"110107"},
    {name:"通州区",c:"110112"},{name:"门头沟区",c:"110109"},{name:"顺义区",c:"110113"}
    ]},
    {id:"12",d:[{name:"不限",c:"1200"},{name:"养殖证",c:"1201"},{name:"水质监测",c:"1202"},{name:"自动喂食",c:"1203"},{name:"视频监控",c:"1204"},{name:"监测设备",c:"1205"}]}
];
for(var i=0;i<QueryCondition.length;i++)
{
var item=QueryCondition[i];
data.hash_Condition.put(item.id,item.d);
};

    },
    getCondition:function()
    {
        return data.hash_Condition;
    },
    getHash:function()
    {
        return data._hashT;
    },
    getLay:function()
    {
        return data._layer;
    },
    }

} ();;
///<jscompress sourcefile="qsgk.js" />
var qsgk = function () {
    var _map;var _init=false;var zTree;var zTcondition;
    var setting ;  
   function ParInit()
   {
      setting = 
   {  check: {enable: false},
    view: {showIcon:false},
    data: { key: {name: "name",children:"child"} },
    callback:{onClick:zTreeOnClick}
   };
    var MainMap=qsgk._map.map; var bBind=false;
    MainMap.events.register("zoomend", null, function () { 
             var curZ = MainMap.getZoom();
             if(curZ>12) {if(!bBind){BindMapClick();} }
             else{RemoveMapClick();}
          });
$(".d_item input").attr("readonly","readonly");
$(".d_item input").click(function(){InitConditTree($(this));});
$("#con_tree").mouseleave(function(){$("#con_tree").css({display: "none"});});
$("#btn_Query").click(function(){var a=GetParam();alert(a);});   
  }
  function DoQuery()
  {
             JsonpRequest(Service.comHandl+ "GetCountAll",
            {
                param: JSON.stringify({})
            },
            function (res) {
              var  zNodes=res.result;
                if(zNodes!=null)
                {
                    for(var i=0;i<zNodes.length;i++)
                    {
                     zNodes[i].name=zNodes[i].name+"("+zNodes[i].count+")";
                   //  drawExtent(zNodes[i].code,{opa:"0.3"});
                  // drawAllExtent();
                     CreateCenP(zNodes[i].code,zNodes[i].count);
                    }
                zTree = $.fn.zTree.init($("#qsgk_tree"), setting,zNodes);
                }
            }
            );
  }
  function CreateCenP(b,c)
  {
      var Tobj = data.getHash().get(b);
      var Tlay=data.getLay();
    if(Tobj)
    {
                   var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(Tobj.x, Tobj.y));
                   var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                    style.externalGraphic = "images/statics/Point.png";
                    rr = 45+parseInt(c/15);
                    style.graphicWidth = rr;
                    style.graphicHeight = rr;
                    style.fillOpacity = 1;
                    style.cursor = "pointer";
                    style.label="个数:"+c;
                    style.stroke=false;
                    style.labelSelect=true;
                    style.labelOutlineWidth=2;
                    style.fontColor="blue";
                    feature.style = style;
                    feature.attributes = {bm:b};
                    Tlay.addFeatures(feature);
    }             
  }
    function TreeInit()
    {
       
/*var zNodes=[{name:"昌平[20]",bm:"110106",count:"20",child:[
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘2",x:"116.899",y:"40.398"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"}]},
            {name:"密云[13]",bm:"110115",count:"23",child:[
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"}]},
            {name:"密云[27]",bm:"110118",count:"23",child:[
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"}]},
            {name:"密云[32]",bm:"110117",count:"23",child:[
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"}]},
            {name:"密云[102]",bm:"110119",count:"23",child:[
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},
    {name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"},{name:"鱼塘1",x:"117.026",y:"40.391"}]}
];*/
/*var zNodes=[{name:"昌平[20]",bm:"110106",count:"20"},
            {name:"密云[13]",bm:"110115",count:"23"},
            {name:"密云[27]",bm:"110118",count:"23"},
            {name:"密云[32]",bm:"110117",count:"23"},
            {name:"密云[102]",bm:"110119",count:"23"}
];
zTree = $.fn.zTree.init($("#qsgk_tree"), setting,zNodes); */
       $.ajax({
            type: "GET",
            url:Service.comHandl+"GetCountAll",
            dataType: "JSONP",
            jsonp: "callback",
            success: function (result) {
                zNodes=result.result;
                if(zNodes!=null)
                {
                    for(var i=0;i<zNodes.length;i++)
                    {
                     zNodes[i].name=zNodes[i].name+"("+zNodes[i].count+")";
                    }
                zTree = $.fn.zTree.init($("#qsgk_tree"), setting,zNodes);
                }
 
            },
            error: function (a, b) {
                    console.log("目录树请求错误");
            }
        });
       
    }
    function InitConditTree(obj)
    {
      var Top=obj.position().top;
      var Left=obj.position().left;
      var bm=obj.attr("d");
    $("#con_tree").css({display: "block"});
    $("#con_tree").css("left",Left);
    $("#con_tree").css("top",Top+20);
    var chkType=(bm=="11"||bm=="12")?"checkbox":"radio";
      var setting = 
   {  
	view: {
			showLine: false,
            showIcon:false
			},
    check: {
        enable: true,
        chkStyle: chkType
    },
    data: {
        key: { name: "name"}
    },
    callback:{
        onClick:function(event, treeId, treeNode)
        {
            if(!(bm=="11"||bm=="12")){
            obj.val(treeNode.name);
            obj.attr("c",treeNode.c);
            }
        },
        onCheck:function(event, treeId, treeNode)
        {
            if((bm=="11"||bm=="12"))
            { 
                if(treeNode.c=="1100"||treeNode.c=="1200")
                {
                obj.val(treeNode.name);
                obj.attr("c",treeNode.c);  
                $("#con_tree").css({display: "none"});
                }
                else
                {
            var n="";var c=""; 
            nodes=zTcondition.getCheckedNodes(true);
            for(var i=0;i<nodes.length;i++){
            n+=nodes[i].name + " ";
            c+=nodes[i].c + ",";
             }
            c=(c.substring(c.length-1)==',')?c.substring(0,c.length-1):c;
            obj.val(n);
            obj.attr("c",c);
                }

            }
            else
            {
            obj.val(treeNode.name);
            obj.attr("c",treeNode.c);
            }
        }
    }
};  
var zNodes=data.getCondition().get(bm);
zTcondition = $.fn.zTree.init($("#con_tree"), setting,zNodes); 
    }
    function BindMapClick()
    {
    if(document.attachEvent)
    qsgk._map.map.viewPortDiv.attachEvent("onclick",_mapClickListener,false);
    else
    qsgk._map.map.viewPortDiv.addEventListener("click",_mapClickListener,false);
    }
    function RemoveMapClick()
    {
       if(document.detachEvent)
        qsgk._map.map.viewPortDiv.detachEvent("onclick",_mapClickListener);
        else
        qsgk._map.map.viewPortDiv.removeEventListener("click",_mapClickListener);
    }
    function zTreeOnClick(event, treeId, treeNode) 
    {
        if(treeNode.level=="0")
        {
    var bm=treeNode.code;
    var Tobj = data.getHash().get(bm);
    drawExtent(bm,{opa:"0"});
        }
        else
        {
    var Tlonlat=new OpenLayers.LonLat();    
    Tlonlat.lon=treeNode.x;
    Tlonlat.lat=treeNode.y;
    Doident(Tlonlat);
        }
  };
function GetParam()
{
    var par=[];
    $(".d_item input").each(function(a,b){
        var code = $(b).attr("c");
        if(code!=undefined)
        {
           var type = $(b).attr("d");
           par.push({type:type,code:code});
        }
    });
    return par;
}
function Doident(Tpoint)
{
        var Tmap=qsgk._map.map;
        var extent = Tmap.getExtent();
        var extentStr = extent.left + "," + extent.bottom + "," + extent.right + "," + extent.top;
        var geo =Tpoint;
        var geoStr = "{\"x\":" + geo.lon + ",\"y\":" + geo.lat + "}";

        var size = Tmap.size;
        var displayStr = size.w + "," + size.h + ",96";

        var tolerance = 4;

        var param = {
            imageDisplay: displayStr,
            sr: Tmap.getProjection().split(':')[1],
            mapExtent: extentStr,
            geometry: geoStr,
           // layers: "all:" + ResourceList.queryNode.original.querylayers.join(','),
           layers:"all:"+"0,1,2,3,4,5,6,7,8,9,10",
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
                    PoiInfoPop.show("resourcelist", geo, n.results[0].attributes, null);
                    //gaoliang
                    highLight(n.results[0].geometry);
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                
            }
        });
}
function _mapClickListener(event)
{       var Tmap=qsgk._map.map;
        var px = event.xy;
        if (!px) {
            var off = $(Tmap.div).offset();
            px = { x: event.clientX - off.left, y: event.clientY - off.top };
        }
        var geo = Tmap.getLonLatFromPixel(px);
       // var Tpoint=new 
       //分页
        Doident(geo);

}
 function highLight(GeoObj)
    {
        if (GeoObj!=null) {
        var Tlay=data.getLay();
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style.strokeColor = "red";
        style.strokeWidth = 2;
        style.strokeDashstyle = "longdash";
        style.fillOpacity =0.2;
        style.fillColor ="yellow";
        Tlay.style=style;
        var rings=GeoObj.rings;
        var polygonFeature = [];
        for (var j = 0; j < rings.length; j++) {
            var pointList = [];
            for (var i = 0; i < rings[j].length; i++) {
                var newPoint = new OpenLayers.Geometry.Point(rings[j][i][0], rings[j][i][1]);
                pointList.push(newPoint);
            }
            var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
            var polyg = new OpenLayers.Geometry.Polygon([linearRing]);
            var Tvector=new OpenLayers.Feature.Vector(polyg);
            Tvector.style=style;
            polygonFeature[j] = Tvector;
        }
        Tlay.removeAllFeatures();
        Tlay.addFeatures(polygonFeature);
        qsgk._map.map.zoomToExtent(Tlay.getDataExtent());                          
        }
    }
    function drawAllExtent()
    {
        var Thash=data.getHash();var Tlay=data.getLay();
        Tlay.removeAllFeatures();
        for(var Tbm in Thash.hash) {
            var Tobj = Thash.get(Tbm);
            if(Tobj)
            {
                var rings=Tobj.geo.rings;
                var polygonFeature = [];
        for (var j = 0; j < rings.length; j++) {
            var pointList = [];
            for (var i = 0; i < rings[j].length; i++) {
                var newPoint = new OpenLayers.Geometry.Point(rings[j][i][0], rings[j][i][1]);
                pointList.push(newPoint);
            }
            var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
            var polyg = new OpenLayers.Geometry.Polygon([linearRing]);
            polygonFeature[j] = new OpenLayers.Feature.Vector(polyg);
        }
        Tlay.addFeatures(polygonFeature);
        Tlay.redraw();
        qsgk._map.map.zoomToExtent(Tlay.getDataExtent());
            }                             
        }
    }
    function drawExtent(Tbm,obj)
    {
        var Thash=data.getHash();
        if (Thash.contains(Tbm)) {
        var Tlay=data.getLay();
        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
       // style.cursor = "pointer";
        style.strokeColor = "blue";
        style.strokeWidth = 2;
        style.strokeDashstyle = "longdash";
        style.fillOpacity =(obj!=null)?obj.opa:0.2;
        style.fillColor = (obj!=null)?obj.filC:"blue";
        Tlay.style=style;
            var Tobj = Thash.get(Tbm);
            if(Tobj)
            {
                var rings=Tobj.geo.rings;
                var polygonFeature = [];
        for (var j = 0; j < rings.length; j++) {
            var pointList = [];
            for (var i = 0; i < rings[j].length; i++) {
                var newPoint = new OpenLayers.Geometry.Point(rings[j][i][0], rings[j][i][1]);
                pointList.push(newPoint);
            }
            var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
            var polyg = new OpenLayers.Geometry.Polygon([linearRing]);
            polygonFeature[j] = new OpenLayers.Feature.Vector(polyg);
        }
        Tlay.removeAllFeatures();
        Tlay.addFeatures(polygonFeature);
        qsgk._map.map.zoomToExtent(Tlay.getDataExtent());
            }                           
        }
    }
    return {

        init: function (map) {
         this._map = map;
         if(!_init)
         {
             ParInit();
           //  TreeInit();
           DoQuery();
             _init=true;
         }
           // drawAllExtent();
        },
        clear:function()
        {
            data.getLay().removeAllFeatures();
        }
    }

} ();;
///<jscompress sourcefile="frame.js" />

var sdMap;
// var g_userid = "PT201410139193";
// var g_username = "小杨";
var g_userid = "";
var g_username = "";
var isImg = false;
function initPage() {
    sdMap = new SDMap("mapDiv", {
        scaleLine: true,
        keyboard: true,
        layerSwitch: 0,
        mousePosition: true
    });
    MapToolUI.init(sdMap);
    RightMenu.init(sdMap);
    PoiInfoPop.init(sdMap);
    WidgetManger.init(sdMap);
    TopMenu.init();
    leftMenu.init();
    wmswmts.init(sdMap.map);
    data.init(sdMap);
    qsgk.init(sdMap);
    checkLogin();
}

//main enterance
(function () {

    if (Browser.ie6 || Browser.ie6Compat || Browser.ie7 || Browser.ie7Compat) {
        alert("当前使用ie内核版本太低,部分功能将无法使用，建议使用IE8及以上版本浏览器！");
        //  parent.window.document.getElementById("iframe_").src = "map/ie6.html";
        return;
    }
    LoadCtr();
})();
function LoadCtr() {
    // g_userid = getCookie("USERID");
    // g_username = getCookie("USERNAME");
    // if (!g_userid) {
    // window.location.href="login.html";
    // }
    // else {
        initProject(); 
   // }

  
 }
function initProject() {
    $(function () {

        /* @---top init--------*/
        var html =
     "<div id=\"D_Top\" class=\"DIVtop\">"
     + "<div id=\"D_left\"><div id=\"D_logo\"></div></div>"
     + "<div id=\"D_right\"></div>"
     + "</div>"
     + "    <div id=\"D_menu\" class=\"TopSpan\">"
     + "    <ul id=\"nav\">"
     + "       <li id='d_xxjs' ><div id=\"d_dr\"></div><a>信息检索</a></li>"
     + "       <li id='d_qsgk'><div id=\"d_cj\"></div><a>全市概况</a></li>"
     + "    </ul>"  
     + "    </div>";
       // $("#topDiv").append(html);
        $('#mapDiv').css("width", "100%");
        $('#left_hidden').click(function (e) {
            if ($(this).hasClass('show')) {
                $(this).removeClass('show');
                $(this).attr({ title: "收起左栏" });
                $('#left').css("display", "block");
                $('#center').css({
                    width: $(window).width() - 359,
                    left: 359
                }).attr("data-calc-width", "100%-359px"); //data-calc-width="100%-304px"
                //  $('#mapDiv').css("width", $(window).width() - 304);
            } else {
                $(this).addClass('show');
                $(this).attr({ title: "展开左栏" });
                $('#left').css("display", "none");
                $('#center').css({
                    width: $(window).width(),
                    left: 0
                }).attr("data-calc-width", "100%-0px");

            }
            if (MapContrast.IsStartContrast()) {
                MapContrast.mapDivHandler();
            }
            else { sdMap.map.updateSize(); }

        });

        $("#Rw_top_back").click(function () {
            var Cur = $('#Rw_top_img');
            if (Cur.hasClass("hide")) {
                Cur.removeClass("hide");
                $("#result_content").show();
            }
            else {
                Cur.addClass("hide");
                $("#result_content").hide();
            }

        });

        initPage();
    });
}


//简单封装，以后再细
var TopMenu = function () {

    var submenulist = [];

    function findMenu(pid) {
        for (var o in submenulist) {
            if (submenulist[o].parent == pid) {
                return submenulist[o];
            }
        }
        return null;
    }
    function init() {
        for (var o in submenulist) {
            var item = submenulist[o];
            var htmstr = ["<ul class='submenu'>"];
            if (item.sublist != null) {
                for (var name in item.sublist) {
                    htmstr.push("<li id='" + name + "'>" + item.sublist[name] + "</li>");
                }
                htmstr.push("</ul>");

                $("#" + item.parent).append(htmstr.join(""));
            }
        }

        $("#nav>li").mouseenter(function () {
            var ths = $(this).children(".submenu");
            if (ths.length > 0) {
                ths.show();
            }
        });
        $("#nav>li").mouseleave(function () {
            var ths = $(this).children(".submenu");
            if (ths.length > 0) {
                ths.hide();
            }
        });

        $("#nav").on("click", ".submenu>li", function () {
            var ths = $(this);
            var menOb = findMenu(ths.parent().parent()[0].id);
            //查询事件
            menOb && menOb.handler && menOb.handler(ths[0].id);
        });


        $("#d_xxzy").click(function () {
            leftMenu.addTab({ name: "resource" });
        });
    }


    function addMenu(mObj) {

        var htmstr = ["<ul class='submenu'>"];
        if (mObj.sublist != null) {
            for (var name in mObj.sublist) {
                htmstr.push("<li id='" + name + "'>" + mObj.sublist[name] + "</li>");
            }
            htmstr.push("</ul>");

            $("#" + mObj.parent).append(htmstr.join(""));
        }
        submenulist.push(mObj);
    }
    return { init: init,
        addSubMenu: addMenu

    };



} ();



var leftMenu = function () {
    var fixCount = 0, curTab = 0;
    var listDiv = "leftMenu";
    var callbacks = [];



    // function switchSearch() {
    //     $("#contentPanel #tab_resource_div").show().siblings().hide();
    // }
    function switchResource() {
        $("#contentPanel #tab_resource_div").show().siblings().hide();
       // categry.init(sdMap.map);
       // WholeSearch.clearResult();
    }

    function findItem(name) {
        for (var o in callbacks) {
            if (callbacks[o].name == name) {
                return callbacks[o];
            }
        }
        return null;
    }


    //op 是否显示当前面板
    function addTab(param, vis) {
        if (!vis) {
            $("#contentPanel").children().hide();
            //$("#leftMenu").children().removeClass("cur");
        }

        var itemObj = findItem(param.name);
        if (itemObj) {

            $("#" + itemObj.name + "_menu").addClass("cur").siblings().removeClass("cur");
            $("#contentPanel #" + itemObj.div).show().siblings().hide();
            return;
        }

        var struct = ["<li id='", param.name, "_menu'><img src='", param.imgurl, "'/><span>", param.title, "</span>", "</li>"];

        if (!vis) {
            struct.splice(struct.length - 1, 0, "<div class='deldiv'></div>");
        }

        $('#leftMenu').append(struct.join(""));
        param.handler && param.handler();
        callbacks.push({ name: param.name, div: param.div, handler: param.handler, clear: param.clear });

        //if (!vis) 
        $("#leftMenu li:last").addClass("cur").siblings().removeClass("cur");

    }

    return {
        init: function () {
            //fixed menu
            addTab({ name: "resource", div: "tab_resource_div", title: "导航", imgurl: "images/leftDiv/bdico_03.png", handler: switchResource, clear: null }, true);
          //  addTab({ name: "resource1", div: "tab_resource_div", title: "采集", imgurl: "images/leftDiv/bdico_03.png", handler: switchResource, clear: null }, true);
            $('#leftMenu').on("click", "li", function () {
                var ths = $(this);
                if (ths.hasClass("cur")) return;
                ths.addClass("cur").siblings().removeClass("cur");

                var name = ths[0].id.replace("_menu", "");
                for (var o in callbacks) {
                    if (callbacks[o].name == name) {
                        $("#contentPanel #" + callbacks[o].div).show().siblings().hide();
                        //callbacks[o].handler();
                        break;
                    }
                }

            });
            $('#leftMenu').on("click", ".deldiv", function (e) {
                var ths = $(this).parent();
                var name = ths[0].id.replace("_menu", "");


                for (var o in callbacks) {
                    if (callbacks[o].name == name) {
                        $("#contentPanel #" + callbacks[o].div).hide();
                        callbacks[o].clear && callbacks[o].clear();
                        callbacks.splice(o, 1);
                        break;
                    }
                }

                if (ths.hasClass("cur")) {
                    //切换页面
                    $("#leftMenu li:eq(0)").addClass("cur");
switchResource();
                   // switchSearch();
                }

                ths.remove();

                e.stopImmediatePropagation();

            });
        },
        //name 标题 图标 回调*2 
        addTab: addTab
    };

} ();




function locationLogin() {
    window.location.href = "login.html";
}
function locationReg() {
    window.location.href = "register.html";
}
function userout() {
    delCookie("USERID");
    delCookie("JSESSIONID");
    delCookie("USERNAME");
    $("#login").html("登录");
    $("#login").attr("href", "login.html");
    $("#reg").html("注册");
    $("#reg").attr("href", "register.html"); //用户注册
    window.location.reload();
}

function checkLogin() {
    if (g_userid == "0") return;
    var showuser = getSubString(g_username, 5);
    $("#login").html(showuser);
    $("#login").attr("href", "javascript:void(0)");
    $("#reg").html("退出");
    $("#reg").attr("href", "javaScript:userout()"); //用户退出
};
