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
