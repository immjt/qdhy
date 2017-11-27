$(function() {
    SetCalcValue()
});
$(window).resize(function() {
    SetCalcValue()
});
function SetCalcValue() {
    $("[data-calc-height]").each(function() {
        var b = $(this),
        c = b.parent(),
        e = b.attr("data-calc-height");
        b.height(GetCalcValue(e, c.height()))
    });
    $("[data-calc-width]").each(function() {
        var b = $(this),
        c = b.parent(),
        e = b.attr("data-calc-width");
        b.width(GetCalcValue(e, c.width()))
    });
    $("[data-calc-left]").each(function() {
        var b = $(this),
        c = b.parent(),
        e = b.attr("data-calc-left");
        b.css("left", GetCalcValue(e, c.width()) + "px")
    })
}
function GetCalcValue(b, c) {
    var e = b.split("-");
    return.01 * c * parseInt(e[0].replace("%")) - parseFloat(e[1])
}
var baseURL = "",
isTopPage = !1,
isNewTopPage = !1,
fileServerPath = "http://124.128.48.212:8081/FileServer/",
portalServerPath = "http://localhost:7298/",
teleServerPath = "http://172.20.5.111:80/SendTel/SendTel.aspx",
wztjServerPath = "http://localhost:3495/Statistical.js",
post = function(b, c, e) {
    c = c || {};
    b = portalServerPath + b;
    c.UserID = getCookie("USERID");
    c.SessionID = getCookie("JSESSIONID");
    $.ajax({
        url: b,
        data: JSON.stringify(c),
        type: "post",
        success: function(c) {
            e && $.isFunction(e) && e(c)
        },
        error: function(c, b, d) {},
        contentType: "application/json; charset\x3dutf-8"
    })
},
postSync = function(b, c, e) {
    c = c || {};
    b = portalServerPath + b;
    c.UserID = getCookie("USERID");
    c.SessionID = getCookie("JSESSIONID");
    $.ajax({
        url: b,
        data: JSON.stringify(c),
        type: "post",
        async: !1,
        success: function(c) {
            e && $.isFunction(e) && e(c)
        },
        error: function(c, b, d) {},
        contentType: "application/json; charset\x3dutf-8"
    })
},
get = function(b, c, e) {
    c = c || {};
    b = portalServerPath + b;
    c.UserID = currentUser.userID;
    c.SessionID = currentUser.sessionID;
    $.ajax({
        url: b,
        data: JSON.stringify(c),
        type: "get",
        success: function(c) {
            e(c)
        },
        contentType: "application/json; charset\x3dutf-8"
    })
},
getSync = function(b, c, e) {
    c = c || {};
    b = portalServerPath + b;
    c.UserID = currentUser.userID;
    c.SessionID = currentUser.sessionID;
    $.ajax({
        url: b,
        data: JSON.stringify(c),
        type: "get",
        async: !1,
        success: function(c) {
            e(c)
        },
        contentType: "application/json; charset\x3dutf-8"
    })
},
getUrlParam = function(b) {
    b = new RegExp("(^|\x26)" + b + "\x3d([^\x26]*)(\x26|$)");
    b = window.location.search.substr(1).match(b);
    return null != b ? unescape(b[2]) : null
},
currentUser = {
    userID: "",
    sessionID: "",
    userName: ""
};
$(function() {
    currentUser.userID = getCookie("USERID");
    currentUser.sessionID = getCookie("JSESSIONID");
    currentUser.userName = getCookie("USERNAME")
});
function setCookie(b, c) {
    var e = new Date;
    e.setTime(e.getTime() + 864E5);
    document.cookie = b + "\x3d" + escape(c) + ";expires\x3d" + e.toGMTString() + ";path\x3d/"
}
function getCookie(b) {
    var c;
    return (c = document.cookie.match(new RegExp("(^| )" + b + "\x3d([^;]*)(;|$)"))) ? unescape(c[2]) : null
}
function delCookie(b) {
    var c = new Date;
    c.setTime(c.getTime() - 1E4);
    var e = getCookie(b);
    null != e && (document.cookie = b + "\x3d" + escape(e) + ";expires\x3d" + c.toGMTString() + ";path\x3d/")
}
function checkAuthority(b, c) {
    var e = {};
    e.UserID = getCookie("USERID");
    e.SessionID = getCookie("JSESSIONID");
    e.AuthCode = b;
    post("CheckSession.svc/CheckAuthority", {
        value: JSON.stringify(e)
    },
    function(b) {
        switch (b.State) {
        case 0:
            delCookie("USERID");
            delCookie("JSESSIONID");
            delCookie("USERNAME");
            $("#login").html("\u767b\u5f55");
            $("#login").attr("href", baseURL + "/LoginRegister/login.html");
            $("#reg").html("\u6ce8\u518c");
            $("#reg").attr("href", baseURL + "/LoginRegister/register.html");
            break;
        case 1:
            if (isTopPage) {
                var e = getSubString(getCookie("USERNAME"), 5);
                $("#login").html(e);
                $("#login").attr("href", baseURL + "/myspace.html");
                $("#reg").html("\u9000\u51fa");
                $("#reg").attr("href", "javaScript:userout()");
                b.IsAdmin && ($("#portalManager").show(), $("#moreInfo").css("height", "52"), $("#manageInfo").show(), $("#manageUrl").attr("href", baseURL + b.ManageUrl))
            } else isNewTopPage && (e = getSubString(getCookie("USERNAME"), 5), $("#login").html(e), $("#login").attr("href", baseURL + "/myspace.html"), $("#reg").html("\u9000\u51fa"), $("#reg").attr("href", "javaScript:userout()"), b.IsAdmin && ($("#portalManager").show(), $("#moreImg").show(), $("#manageInfo").show(), $("#manageUrl").attr("href", baseURL + b.ManageUrl)));
            break;
        case 2:
            isTopPage ? (e = getSubString(getCookie("USERNAME"), 5), $("#login").html(e), $("#login").attr("href", baseURL + "/myspace.html"), $("#reg").html("\u9000\u51fa"), $("#reg").attr("href", "javaScript:userout()"), b.IsAdmin && ($("#portalManager").show(), $("#manageInfo").show(), $("#manageUrl").attr("href", baseURL + b.ManageUrl))) : isNewTopPage && (e = getSubString(getCookie("USERNAME"), 5), $("#login").html(e), $("#login").attr("href", baseURL + "/myspace.html"), $("#reg").html("\u9000\u51fa"), $("#reg").attr("href", "javaScript:userout()"), b.IsAdmin && ($("#portalManager").show(), $("#moreImg").show(), $("#manageInfo").show(), $("#manageUrl").attr("href", baseURL + b.ManageUrl)))
        }
        c && $.isFunction(c) && c(b.State)
    })
}
function getSubString(b, c) {
    return null != b && b.length > c ? b.substring(0, c) + "...": b
}
function userout() {
    delCookie("USERID");
    delCookie("JSESSIONID");
    delCookie("USERNAME");
    $("#login").html("\u767b\u5f55");
    $("#login").attr("href", baseURL + "/LoginRegister/login.html");
    $("#reg").html("\u6ce8\u518c");
    $("#reg").attr("href", baseURL + "/LoginRegister/register.html");
    window.location.reload()
}
"object" !== typeof JSON && (JSON = {}); (function() {
    function b(a) {
        return 10 > a ? "0" + a: a
    }
    function c(a) {
        h.lastIndex = 0;
        return h.test(a) ? '"' + a.replace(h,
        function(a) {
            var c = g[a];
            return "string" === typeof c ? c: "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4)
        }) + '"': '"' + a + '"'
    }
    function e(g, b) {
        var l, q, p, v, h = d,
        f, t = b[g];
        t && "object" === typeof t && "function" === typeof t.toJSON && (t = t.toJSON(g));
        "function" === typeof n && (t = n.call(b, g, t));
        switch (typeof t) {
        case "string":
            return c(t);
        case "number":
            return isFinite(t) ? String(t) : "null";
        case "boolean":
        case "null":
            return String(t);
        case "object":
            if (!t) return "null";
            d += a;
            f = [];
            if ("[object Array]" === Object.prototype.toString.apply(t)) {
                v = t.length;
                for (l = 0; l < v; l += 1) f[l] = e(l, t) || "null";
                p = 0 === f.length ? "[]": d ? "[\n" + d + f.join(",\n" + d) + "\n" + h + "]": "[" + f.join(",") + "]";
                d = h;
                return p
            }
            if (n && "object" === typeof n) for (v = n.length, l = 0; l < v; l += 1)"string" === typeof n[l] && (q = n[l], (p = e(q, t)) && f.push(c(q) + (d ? ": ": ":") + p));
            else for (q in t) Object.prototype.hasOwnProperty.call(t, q) && (p = e(q, t)) && f.push(c(q) + (d ? ": ": ":") + p);
            p = 0 === f.length ? "{}": d ? "{\n" + d + f.join(",\n" + d) + "\n" + h + "}": "{" + f.join(",") + "}";
            d = h;
            return p
        }
    }
    "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + b(this.getUTCMonth() + 1) + "-" + b(this.getUTCDate()) + "T" + b(this.getUTCHours()) + ":" + b(this.getUTCMinutes()) + ":" + b(this.getUTCSeconds()) + "Z": null
    },
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
        return this.valueOf()
    });
    var f, h, d, a, g, n;
    "function" !== typeof JSON.stringify && (h = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, g = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    JSON.stringify = function(c, g, b) {
        var l;
        a = d = "";
        if ("number" === typeof b) for (l = 0; l < b; l += 1) a += " ";
        else "string" === typeof b && (a = b);
        if ((n = g) && "function" !== typeof g && ("object" !== typeof g || "number" !== typeof g.length)) throw Error("JSON.stringify");
        return e("", {
            "": c
        })
    });
    "function" !== typeof JSON.parse && (f = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, JSON.parse = function(a, c) {
        function d(a, g) {
            var b, e, p = a[g];
            if (p && "object" === typeof p) for (b in p) Object.prototype.hasOwnProperty.call(p, b) && (e = d(p, b), void 0 !== e ? p[b] = e: delete p[b]);
            return c.call(a, g, p)
        }
        var g;
        a = String(a);
        f.lastIndex = 0;
        f.test(a) && (a = a.replace(f,
        function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice( - 4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return g = eval("(" + a + ")"),
        "function" === typeof c ? d({
            "": g
        },
        "") : g;
        throw new SyntaxError("JSON.parse");
    })
})();
function arrayIndex(b, c) {
    for (var e = 0,
    f; f = b[e]; e++) if (f == c) return e;
    return - 1
}
String.prototype.format = function() {
    var b = arguments;
    return this.replace(/\{(\d+)\}/g,
    function(c, e) {
        return b[e]
    })
};
function parseUrl(b) {
    var c = {};
    b = b.split("\x26");
    for (var e = 0; e < b.length; e++) {
        var f = b[e].indexOf("\x3d");
        if ( - 1 != f) {
            var h = b[e].substring(0, f),
            f = b[e].substring(f + 1),
            f = decodeURIComponent(f);
            c[h.toLowerCase()] = f
        }
    }
    return c
}
function parseParam(b) {
    var c = [],
    e;
    for (e in b) c.push(e + "\x3d" + b[e]);
    return c.join("\x26")
}
function isValid(b) {
    return null != b && "" != b ? !0 : !1
}
String.prototype.ClipStr = function(b) {
    null == b && (b = 14);
    b *= 2;
    for (var c = 0,
    e = 0; e < this.length && c < b; e++) this.charAt(e).match(/[^\x00-\xff]/ig) ? c += 2 : c += 1;
    return e < this.length ? this.substr(0, e - 2) + "...": this
};
String.prototype.Trim = function() {
    return this.replace(/^\s+/g, "").replace(/\s+$/g, "")
};
String.prototype.Placelen = function() {
    if (0 == this.length) return 0;
    for (var b = 0,
    c = 0; c < this.length; c++) this[c].match(/[\x00-\xff]/) ? b++:b += 2;
    return b
};
String.prototype.BreakLine = function(b, c) {
    return this.length <= b ? this: this.substring(0, b) + c + this.substring(b).BreakLine(b, c)
};
var Clone = function(b) {
    var c;
    switch (typeof b) {
    case "undefined":
        break;
    case "string":
        c = b + "";
        break;
    case "number":
        c = b - 0;
        break;
    case "boolean":
        c = b;
        break;
    case "object":
        if (null === b) c = null;
        else if (b instanceof Array) {
            c = [];
            for (var e = 0,
            f = b.length; e < f; e++) c.push(Clone(b[e]))
        } else for (e in c = {},
        b) c[e] = Clone(b[e]);
        break;
    default:
        c = b
    }
    return c
};
function setCookie(b, c) {
    var e = new Date;
    e.setTime(e.getTime() + 864E5);
    document.cookie = b + "\x3d" + escape(c) + ";expires\x3d" + e.toGMTString() + ";path\x3d/"
}
function getCookie(b) {
    var c;
    b = new RegExp("(^| )" + b + "\x3d([^;]*)(;|$)");
    return (c = document.cookie.match(b)) ? unescape(c[2]) : null
}
function delCookie(b) {
    var c = new Date;
    c.setTime(c.getTime() - 1E4);
    var e = getCookie(b);
    null != e && (document.cookie = b + "\x3d" + escape(e) + ";expires\x3d" + c.toGMTString() + ";path\x3d/")
}
function string2xml(b) {
    var c = null;
    window.ActiveXObject ? (c = new ActiveXObject("Microsoft.XMLDOM"), c.loadXML(b)) : window.XMLHttpRequest && (c = (new DOMParser).parseFromString(b, "text/xml"));
    return c
}
Date.now || (Date.now = function() {
    return (new Date).valueOf()
});
var PageCtl = function() {
    function b(c, a) {
        var g, d = [];
        if (0 == c) $("#" + e + " .page").html("");
        else {
            if (a < c && 1 < a) d.push("\x3cli class\x3d'pageon pageprev'\x3e\u4e0a\u4e00\u9875\x3c/li\x3e"),
            d.push("\x3cli class\x3d'pageon'\x3e" + (a - 1) + "\x3c/li\x3e"),
            d.push("\x3cli class\x3d'pagenow'\x3e" + a + "\x3c/li\x3e"),
            d.push("\x3cli class\x3d'pageon'\x3e" + (a + 1) + "\x3c/li\x3e"),
            3 == a ? d.splice(1, 0, "\x3cli class\x3d'pageon'\x3e1\x3c/li\x3e") : 3 < a && d.splice(1, 0, "\x3cli class\x3d'pageon'\x3e1\x3c/li\x3e\x3cli class\x3d'pagepot'\x3e...\x3c/li\x3e"),
            a == c - 2 ? d.push("\x3cli class\x3d'pageon'\x3e" + c + "\x3c/li\x3e") : a < c - 2 && d.push("\x3cli class\x3d'pagepot'\x3e...\x3c/li\x3e\x3cli class\x3d'pageon'\x3e" + c + "\x3c/li\x3e"),
            d.push("\x3cli class\x3d'pageon pagenext'\x3e\u4e0b\u4e00\u9875\x3c/li\x3e");
            else if (1 == a) {
                d.push("\x3cli class\x3d'pageoff'\x3e\u4e0a\u4e00\u9875\x3c/li\x3e");
                d.push("\x3cli class\x3d'pagenow'\x3e1\x3c/li\x3e");
                if (5 > c) for (g = 1; g < c; g++) d.push("\x3cli class\x3d'pageon'\x3e" + (g + 1) + "\x3c/li\x3e");
                else d.push("\x3cli class\x3d'pageon'\x3e2\x3c/li\x3e\x3cli class\x3d'pageon'\x3e3\x3c/li\x3e\x3cli class\x3d'pagepot'\x3e...\x3c/li\x3e\x3cli class\x3d'pageon'\x3e" + c + "\x3c/li\x3e");
                1 == c ? d.push("\x3cli class\x3d'pageoff'\x3e\u4e0b\u4e00\u9875\x3c/li\x3e") : d.push("\x3cli class\x3d'pageon pagenext'\x3e\u4e0b\u4e00\u9875\x3c/li\x3e")
            } else {
                d.push("\x3cli class\x3d'pageon pagenext'\x3e\u4e0a\u4e00\u9875\x3c/li\x3e");
                if (5 > c) for (g = 0; g < c - 1; g++) d.push("\x3cli class\x3d'pageon'\x3e" + (g + 1) + "\x3c/li\x3e");
                else d.push("\x3cli class\x3d'pageon'\x3e1\x3c/li\x3e\x3cli class\x3d'pagepot'\x3e...\x3c/li\x3e"),
                d.push("\x3cli class\x3d'pageon'\x3e" + (c - 2) + "\x3c/li\x3e\x3cli class\x3d'pageon'\x3e" + (c - 1) + "\x3c/li\x3e");
                d.push("\x3cli class\x3d'pagenow'\x3e" + c + "\x3c/li\x3e");
                d.push("\x3cli class\x3d'pageoff'\x3e\u4e0b\u4e00\u9875\x3c/li\x3e")
            }
            $("#" + e + " .page").html(d.join(""))
        }
    }
    var c = 0,
    e, f, h = 10;
    return {
        init: function(d, a, g) {
            PageCtl._cache || (PageCtl._cache = {});
            PageCtl._cache[d] || (PageCtl._cache[d] = !0, e = d, g && (h = g), "function" == typeof a ? (f = a, $("#" + e).delegate(".pageon", "click",
            function(a) {
                a = $(this).text();
                var d = $("#" + e + " li.pagenow"),
                d = 1 > d.length ? 1 : parseInt(d.text());
                a = isNaN(a) ? "\u4e0a\u4e00\u9875" == a ? d - 1 : d + 1 : parseInt(a);
                b(c, a);
                f(a, h)
            })) : console.log && console.log("\u521d\u59cb\u5316\u5931\u8d25\uff01"))
        },
        doPage: function(d, a) {
            a;
            a || (a = 0);
            c = Math.ceil(a / h);
            b(c, d);
            f(d, h)
        },
        startEnd: function(c, a) {
            var d = (c - 1) * h;
            return [d, d + h >= a ? a: d + h]
        }
    }
},
Browser = function() {
    var b = navigator.userAgent.toLowerCase(),
    c = window.opera,
    e = {
        ie: /(msie\s|trident.*rv:)([\w.]+)/.test(b),
        opera: !!c && c.version,
        webkit: -1 < b.indexOf(" applewebkit/"),
        mac: -1 < b.indexOf("macintosh"),
        quirks: "BackCompat" == document.compatMode
    };
    e.gecko = "Gecko" == navigator.product && !e.webkit && !e.opera && !e.ie;
    var f = 0;
    if (e.ie) {
        var f = b.match(/(?:msie\s([\w.]+))/),
        h = b.match(/(?:trident.*rv:([\w.]+))/),
        f = f && h && f[1] && h[1] ? Math.max(1 * f[1], 1 * h[1]) : f && f[1] ? 1 * f[1] : h && h[1] ? 1 * h[1] : 0;
        e.ie11Compat = 11 == document.documentMode;
        e.ie9Compat = 9 == document.documentMode;
        e.ie10Compat = 10 == document.documentMode;
        e.ie8 = !!document.documentMode;
        e.ie8Compat = 8 == document.documentMode;
        e.ie7Compat = 7 == f && !document.documentMode || 7 == document.documentMode;
        e.ie6Compat = 7 > f || e.quirks;
        e.ie9above = 8 < f;
        e.ie9below = 9 > f
    }
    e.gecko && (h = b.match(/rv:([\d\.]+)/)) && (h = h[1].split("."), f = 1E4 * h[0] + 100 * (h[1] || 0) + 1 * (h[2] || 0));
    /chrome\/(\d+\.\d)/i.test(b) && (e.chrome = +RegExp.$1);
    /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(b) && !/chrome/i.test(b) && (e.safari = +(RegExp.$1 || RegExp.$2));
    e.opera && (f = parseFloat(c.version()));
    e.webkit && (f = parseFloat(b.match(/ applewebkit\/(\d+)/)[1]));
    e.version = f;
    return e
} (),
DynamicLoading = DynamicLoading || {
    css: function(b, c) {
        if (!b || 0 === b.length) throw Error('argument "path" is required !');
        c || (c = window);
        var e = c.document.getElementsByTagName("head")[0],
        f = c.document.createElement("link");
        f.href = b;
        f.rel = "stylesheet";
        f.type = "text/css";
        e.appendChild(f)
    },
    js: function(b, c) {
        if (!b || 0 === b.length) throw Error('argument "path" is required !');
        c || (c = window);
        var e = c.document.getElementsByTagName("head")[0],
        f = c.document.createElement("script");
        f.src = b;
        f.type = "text/javascript";
        e.appendChild(f)
    }
};
$.support.cors = !0;
function JsonpRequest(b, c, e, f) {
    "function" != typeof f && (f = function(c, d) {
        console.log && console.log(d)
    });
    $.ajax({
        url: b,
        data: c,
        dataType: "jsonp",
        contentType: "application/json; charset\x3dutf-8",
        success: e,
        error: f
    })
}
function JsonpRequestSync(b, c, e, f) {
    f = function(c, d) {
        console.log && console.log(d)
    };
    $.ajax({
        url: b,
        data: c,
        dataType: "jsonp",
        async: !1,
        contentType: "application/json; charset\x3dutf-8",
        success: e,
        error: f
    })
}
function PostReqest(b, c, e, f) {
    "function" != typeof f && (f = function(c, d) {
        console.log && console.log(d)
    });
    $.ajax({
        url: b,
        data: c,
        dataType: "json",
        type: "POST",
        success: e,
        error: f
    })
}
function encodePolygon(b) {
    if (1 > b.components.length) return - 1;
    b = b.components[0].getVertices();
    if (490 < b.length) return - 1;
    for (var c = b[0], e = 1E3 * Math.floor(100 * c.x), f = 1E3 * Math.floor(100 * c.y), h = [], d = 0; d < b.length; d++) c = b[d],
    h.push([Math.round(1E5 * c.x) - e, Math.round(1E5 * c.y) - f].join(" "));
    return JSON.stringify({
        w: h.join(","),
        o: [e / 1E3, f / 1E3]
    })
}
function decodePolygon(b) {
    var c = [],
    e = 1E3 * b.o[0],
    f = 1E3 * b.o[1];
    b = b.w.split(",");
    for (var h = 0; h < b.length; h++) {
        var d = b[h].split(" "),
        a = (parseInt(d[0]) + e) / 1E5,
        d = (parseInt(d[1]) + f) / 1E5;
        c.push(new Ol2.Geometry.Point(a, d))
    }
    c = new Ol2.Geometry.LinearRing(c);
    return new Ol2.Geometry.Polygon([c])
}
var Service = function() {
    return {
        LS: "proxy/proxy.ashx?http://www.sdmap.gov.cn/QueryService.ashx?city\x3d" + encodeURIComponent("\u5168\u56fd") + "\x26output\x3djson\x26resultmode\x3d255\x26uid\x3dnavinfo\x26st\x3dLocalSearch\x26",
        LSID: "proxy/proxy.ashx?http://www.sdmap.gov.cn/QueryService.ashx?city\x3d" + encodeURIComponent("\u5168\u56fd") + "\x26st\x3dObtain\x26output\x3djson\x26resultmode\x3d255\x26uid\x3dnavinfo\x26",
        PATH: "proxy/proxy.ashx?http://map.tianditu.com/query.shtml?type\x3dsearch\x26postStr\x3d",
        RGC2: "proxy/proxy.ashx?http://www.sdmap.gov.cn/GeoDecodeService.ashx?st\x3dRgc2\x26output\x3djson\x26",
        basemap: [{
            group: "vec",
            name: "\u5929\u5730\u56fe-\u77e2\u91cf",
            url: "http://t0.tianditu.com/vec_c/wmts",
            layer: "vec",
            style: "default",
            matrixSet: "c",
            format: "tiles",
            open: !0,
            minlevel: 3
        },
        {
            group: "vec_n",
            name: "\u5929\u5730\u56fe-\u77e2\u91cf\u6ce8\u8bb0",
            url: "http://t0.tianditu.com/cva_c/wmts",
            layer: "cva",
            style: "default",
            matrixSet: "c",
            format: "tiles",
            open: !0,
            maxlevel: 10
        },
        {
            group: "img",
            name: "\u5929\u5730\u56fe-\u5f71\u50cf\u5730\u56fe",
            url: "http://t5.tianditu.cn/img_c/wmts",
            layer: "img",
            style: "default",
            matrixSet: "c",
            format: "tiles",
            open: !1,
            maxlevel: 19
        },
        {
            group: "img",
            name: "\u5c71\u4e1c\u5f71\u50cf",
            url: "http://www.sdmap.gov.cn/tileservice/SdRasterPubMap",
            layer: "sdimg2015",
            style: "default",
            matrixSet: "img2015",
            format: "image/png",
            open: !1,
            minlevel: 7
        },
        {
            group: "img_n",
            name: "\u5929\u5730\u56fe-\u5f71\u50cf\u6ce8\u8bb0",
            url: "http://t0.tianditu.com/cia_c/wmts",
            layer: "cia",
            style: "default",
            matrixSet: "c",
            format: "tiles",
            open: !1,
            maxlevel: 6
        },
        {
            group: "img_n",
            name: "\u5c71\u4e1c\u5f71\u50cf\u6ce8\u8bb0",
            url: "http://www.sdmap.gov.cn/tileservice/SDRasterPubMapDJ",
            layer: "sdcia",
            style: "default",
            matrixSet: "sdcia",
            format: "image/png",
            open: !1,
            minlevel: 7
        }],
        CityBound: "proxy/proxy.ashx?http://www.sdmap.gov.cn/cityExtentSearch/cityExtentSearch.asmx/getBoundary?",
        CitySearch: "proxy/proxy.ashx?http://www.sdmap.gov.cn/cityExtentSearch/cityExtentSearch.asmx/getDistrict?",
        POITILE: "proxy/proxy.ashx?http://www.sdmap.gov.cn/tileservice/sdpoi?service\x3dpoi\x26request\x3dgetpoi\x26tileMatrixSet\x3dsss\x26format\x3dtext/html",
        IMGMETA: "proxy/proxy.ashx?http://sdgt.sdmap.gov.cn/imgmeta2/imgmetaservice.asmx/QueryMeta?",
        NCM: ["vec", "cva", "img", "cia", "sdcia"],
        comHandl: "http://www.ztldcn.com:81/yykj/f/company/phone/",
        proxy: "proxy/proxy.ashx?",
        wmts_cfg: {
            layer: "sdvec",
            style: "default",
            matrixSet: "tianditu2013",
            format: "image/png",
            open: !0,
            minlevel: 3,
            maxlevel: 15
        },
        qdhyTile: "http://221.214.94.38:6080/arcgis/services/qdhy/qdhy/MapServer/WMSServer",
        ident: "http://221.214.94.38:6080/arcgis/rest/services/qdhy/qdhy/MapServer",
        dy: {
            110119 : "3",
            110118 : "4",
            110117 : "5",
            110116 : "6",
            110115 : "7",
            110114 : "8",
            110113 : "9",
            110112 : "10",
            110111 : "11",
            110109 : "12",
            110108 : "13",
            110106 : "14",
            110105 : "15"
        }
    }
} (),
popup1,
Bzj = !0,
TileLayerManager = function() {
    function b() {
        for (var d = h.zoom,
        a = 0; a < c.length; a++) c[a].open && (c[a].maxlevel >= d && c[a].minlevel <= d ? c[a].layer.setVisibility(!0) : c[a].layer.setVisibility(!1))
    }
    var c = [],
    e = [],
    f = 1,
    h = null;
    return {
        setConfig: function(d, a) {
            h = d;
            for (var g = 0; g < a.length; g++) {
                a[g].open || (a[g].visibility = !1);
                var e = new OpenLayers.Layer.WMTS(a[g]);
                c.push({
                    layer: e,
                    layerid: a[g].layer,
                    group: a[g].group,
                    open: a[g].open,
                    minlevel: a[g].minlevel || 0,
                    maxlevel: a[g].maxlevel || 20
                });
                h.addLayer(e)
            }
            d.Lary = c;
            h.events.register("zoomend", this, b)
        },
        switchMap: function(d, a) {
            var g;
            if (null == d) for (g = 0; g < c.length; g++) c[g].group == f + "_n" && (c[g].layer.setVisibility( !! a), c[g].open = !!a);
            else {
                for (g = 0; g < c.length; g++) a && c[g].group == d + "_n" || c[g].group == d ? (c[g].open = !0, c[g].minlevel <= h.zoom && c[g].maxlevel >= h.zoom && c[g].layer.setVisibility(!0)) : (c[g].open = !1, c[g].layer.setVisibility(!1));
                f = d
            }
            for (g = 0; g < e.length; g++) e[g](f)
        },
        setVisibility: function(d, a) {
            for (i = 0; i < c.length; i++) c[i].group == d && (c[i].layer.setVisibility( !! a), c[i].open = !!a)
        },
        addListener: function(c) {
            "function" == typeof c && e.push(c)
        },
        removeListener: function(c) {
            "function" == typeof c && (c = e.find(function(a) {
                return a === this
            }), e.splice(c, 1))
        },
        getLayer: function(d) {
            var a;
            if (d.group) {
                var g = [];
                for (a = 0; a < c.length; a++) c[a].group == d.group && g.push(c[a].layer);
                return g
            }
            if (d.layer) for (a = 0; a < c.length; a++) if (c[a].layerid == d.layer) return c[a].layer
        },
        getLayers: function() {
            return c
        }
    }
},
SDMap = function(b, c) {
    function e() {
        $(d.div).append("\x3cdiv id\x3d'refrenceDiv'\x3e\x3c/div\x3e");
        c.layerSwitch2 && d.addControl(new OpenLayers.Control.LayerSwitcher);
        c.scaleLine && d.addControl(new OpenLayers.Control.ScaleLine({
            maxWidth: 200,
            topOutUnits: "\u5343\u7c73",
            topInUnits: "\u7c73",
            bottomOutUnits: "",
            bottomInUnits: ""
        }));
        1 == c.zoombar ? d.addControl(new OpenLayers.Control.PanZoomBar) : 2 == c.zoombar && d.addControl(new OpenLayers.Control.Zoom);
        c.keyboard && d.addControl(new OpenLayers.Control.KeyboardDefaults);
        n = new OpenLayers.Control.SelectFeature([a]);
        n.handlers.feature.stopDown = !1;
        n.handlers.feature.stopUp = !1;
        d.addControl(n);
        n.activate();
        var g = new OpenLayers.Control.Navigation({
            dragPanOptions: {
                enableKinetic: !0,
                documentDrag: !1,
                kineticInterval: 10
            },
            zoomWheelEnabled: !0,
            handleRightClicks: !1
        });
        d.addControl(g);
        c.mousePosition && h();
        c.authMark && $("#refrenceDiv").before("\x3cdiv id \x3d'bottomBar'\x3e\x3c/div\x3e\x3cdiv id \x3d'remark'\x3e\u5ba1\u56fe\u53f7:GS(2014)6032\u53f7(\u7248\u6743:\u56fd\u5bb6\u6d4b\u7ed8\u5730\u7406\u4fe1\u606f\u5c40)\x3c/div\x3e");
        1 == c.layerSwitch ? ($(d.div).append($("\x3cstyle\x3e #layerSwitch:hover{border: 1px solid #2D9FBB;}\x3c/style\x3e\x3cdiv id\x3d'layerSwitch'style\x3d'position: absolute;top:3px;width: 50px;height: 50px;right:3px;z-index: 1001;border:1px solid #DEE1E2;font-size:12px;background:url(images/map/img1.png)'\x3e\x3c/div\x3e")), $("#layerSwitch").click(function() {
            var a = $(this);
            a.css("background-image").match(/(img1.png)/) ? (l.switchMap(2, !0), a.css("background-image", "url(images/map/vec1.png)"), f("white")) : (l.switchMap(1), a.css("background-image", "url(images/map/img1.png)"), f("black"))
        })) : 2 == c.layerSwitch && ($(d.div).append($("\x3cdiv id\x3d'layerSwitch'style\x3d'position: absolute;bottom:10px;right: 20px;z-index: 1001;font-size:12px'\x3e\x3cdiv class\x3d'operbtn mapswitchbtn'\x3e\u77e2\u91cf\x3c/div\x3e\x3cdiv class\x3d'operbtn mapswitchbtn' style\x3d'background-color:#b2b2b2'\x3e\u5f71\u50cf\x3c/div\x3e\x3c/div\x3e")), $("#layerSwitch .mapswitchbtn").click(function() {
            var a = $(this);
            "\u77e2\u91cf" == a.text() ? (l.switchMap(1), f("black")) : (l.switchMap(2, !0), f("white"));
            a.removeAttr("style").siblings().css("background-color", "#b2b2b2")
        }))
    }
    function f(a) {
        $("#img_year_div").show();
        $(".olControlScaleLineTop").css({
            border: "solid 2px " + a,
            "border-top": "none",
            color: a
        });
        $(".olControlScaleLineBottom").css({
            border: "solid 2px " + a,
            "border-bottom": "none",
            color: a
        })
    }
    function h() {
        $("#refrenceDiv").before("\x3cdiv id \x3d 'mousePositon'\x3e\x3c/div\x3e");
        $(".olMapViewport").mousemove(function(a) {
            var c = $(this).offset();
            a = new OpenLayers.Pixel(a.clientX - c.left, a.clientY - c.top);
            a = d.getLonLatFromPixel(a);
            $("#mousePositon").text("\u7ecf\u5ea6:" + a.lon.toFixed(3) + ", \u7eac\u5ea6:" + a.lat.toFixed(3))
        })
    }
    var d = null,
    a = null,
    g, n, l = new TileLayerManager;
    c || (c = {});
    OpenLayers.Util.applyDefaults(c, {
        scaleLine: !0,
        zoombar: 1,
        keyboard: !0,
        mousePosition: !0,
        poiIdenty: !1,
        authMark: !0,
        layerSwitch: 1,
        layerSwitch2: !1
    });
    OpenLayers.INCHES_PER_UNIT["\u5343\u7c73"] = OpenLayers.INCHES_PER_UNIT.km;
    OpenLayers.INCHES_PER_UNIT["\u7c73"] = OpenLayers.INCHES_PER_UNIT.m;
    OpenLayers.INCHES_PER_UNIT["\u82f1\u91cc"] = OpenLayers.INCHES_PER_UNIT.mi;
    OpenLayers.INCHES_PER_UNIT["\u82f1\u5c3a"] = OpenLayers.INCHES_PER_UNIT.ft; (function(b) {
        OpenLayers.DOTS_PER_INCH = 96;
        d = new OpenLayers.Map(b, {
            allOverlays: !0,
            numZoomLevels: 20,
            displayProjection: "EPSG:4490",
            controls: [new OpenLayers.Control.ArgParser, new OpenLayers.Control.Attribution]
        });
        l.setConfig(d, Service.basemap);
        c.poiIdenty && (d.poiMrk = new OpenLayers.Ex.PoiMarker(d, l.getLayer({
            layer: "sdvec"
        }), Service.POITILE));
        b = new OpenLayers.StyleMap({
            fillOpacity: 1,
            pointRadius: 2
        });
        a = new OpenLayers.Layer.Vector("SelectableLayer", {
            styleMap: b,
            rendererOptions: {
                zIndexing: !1
            }
        });
        d.addLayer(a);
        g = new OpenLayers.Layer.Vector("GraphicsLayer", {
            styleMap: b,
            rendererOptions: {
                zIndexing: !1
            }
        });
        d.addLayer(g);
        e();
        d.setCenter(new OpenLayers.LonLat(116.399, 40.185), 9)
    })(b);
    return {
        map: d,
        tileLayerManager: l,
        markLayer: a,
        graLayer: g,
        unSelect: function() {
            n.unselectAll()
        },
        addLayer: function(a, c) {
            d.addLayer(a);
            c && n.setLayer(n.layers.concat([a]))
        },
        removeLayer: function(a, c) {
            d.removeLayer(a);
            if (c) for (var g = 0; g < n.layers.length; g++) if (n.layers[g].id == a.id) {
                var b = n.layers;
                b.splice(g, 1);
                n.setLayer(b);
                break
            }
        },
        getSelectCtrl: function() {
            return n
        },
        addPopup: function(a) {
            a && d.addPopup(a)
        },
        removePopup: function(a) {
            if (a) d.removePopup(a);
            else {
                a = d.popups;
                for (var c in a) d.removePopup(a[c])
            }
        }
    }
},
Plotting = function() {
    function b() {
        var a = ["\x3cdiv id\x3d'pointmark_imgdiv'\x3e\x3cul id\x3d'ulPoint'\x3e"],
        c;
        for (c = 0; c < F.length; c++) a.push("\x3cli\x3e\x3cimg src\x3d'images/mark2/" + F[c] + ".png' class\x3d'sp_12'\x3e\x3c/li\x3e");
        a.push("\x3c/ul\x3e\x3cdiv id\x3d'pointImgRtn' class\x3d'toolbtn' style\x3d'position:relative;margin:auto;display:block;'  \x3e\u8fd4\u56de\x3c/div\x3e");
        return a.join("")
    }
    function c(a) {
        w.removeAllFeatures();
        var c = [];
        B = [];
        if (a.d && 0 < a.d.length) {
            for (var d = new OpenLayers.Bounds,
            g = 0; g < a.d.length; g++) {
                var b = a.d[g];
                c.push('\x3cli id\x3d"' + b.ID + '"\x3e\x3cinput type\x3d"checkbox"\x3e\x3cimg src\x3d"images/mark2/plot_' + b.STYLE.type + '.png"\x3e ' + b.TITLE + "\x3c/li\x3e");
                var e = null,
                p = OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style["default"]),
                l = b.GEOMETRY.isWKT,
                f = new OpenLayers.Format.WKT;
                "point" == b.STYLE.type && (e = l ? f.read(b.GEOMETRY.WKT) : new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(b.GEOMETRY.GEOMETRY[0].x, b.GEOMETRY.GEOMETRY[0].y)), p.graphicWidth = b.STYLE.width, p.graphicHeight = b.STYLE.height, p.externalGraphic = b.STYLE.image);
                if ("polyline" == b.STYLE.type) {
                    if (l) e = f.read(b.GEOMETRY.WKT);
                    else {
                        for (var e = [], v = 0; v < b.GEOMETRY.GEOMETRY.length; v++) {
                            var m = new OpenLayers.Geometry.Point(b.GEOMETRY.GEOMETRY[v].x, b.GEOMETRY.GEOMETRY[v].y);
                            e.push(m)
                        }
                        e = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(e))
                    }
                    p.strokeWidth = b.STYLE.weight;
                    p.strokeColor = b.STYLE.color;
                    p.strokeDashstyle = b.STYLE.style ? b.STYLE.style: b.STYLE.dashstyle;
                    p.strokeOpacity = b.STYLE.alpha ? b.STYLE.alpha: b.STYLE.opacity
                }
                if ("polygon" == b.STYLE.type) {
                    if (l) e = f.read(b.GEOMETRY.WKT);
                    else {
                        e = [];
                        for (v = 0; v < b.GEOMETRY.GEOMETRY.length; v++) m = new OpenLayers.Geometry.Point(b.GEOMETRY.GEOMETRY[v].x, b.GEOMETRY.GEOMETRY[v].y),
                        e.push(m);
                        e = new OpenLayers.Geometry.LinearRing(e);
                        e = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(e))
                    }
                    p.strokeWidth = b.STYLE.weight;
                    p.strokeColor = b.STYLE.color;
                    p.strokeDashstyle = b.STYLE.style ? b.STYLE.style: b.STYLE.dashstyle;
                    p.strokeOpacity = b.STYLE.alpha ? b.STYLE.alpha: b.STYLE.opacity;
                    p.fillColor = b.STYLE.fillColor;
                    p.fillOpacity = b.STYLE.fillAlpha ? b.STYLE.fillAlpha: b.STYLE.fillOpacity
                }
                "label" == b.STYLE.type && (e = l ? f.read(b.GEOMETRY.WKT) : new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(b.GEOMETRY.GEOMETRY[0].x, b.GEOMETRY.GEOMETRY[0].y)), p.label = b.TITLE, p.labelAlign = b.STYLE.placement, p.fontColor = b.STYLE.fontColor, p.labelXOffset = b.STYLE.xoffset, p.labelYOffset = b.STYLE.yoffset, p.fontFamily = b.STYLE.fontFamily, p.fontSize = b.STYLE.fontSize, b.STYLE.border && (p.labelOutlineColor = b.STYLE.borderColor), b.STYLE.italic && (p.fontStyle = "italic"), b.STYLE.bold && (p.fontWeight = "bold"));
                e.style = p;
                e.attributes = {
                    id: b.ID,
                    remark: b.MEMO,
                    type: "polyline" == b.STYLE.type ? "line": "label" == b.STYLE.type ? "text": b.STYLE.type,
                    name: b.TITLE
                };
                b = e;
                d.extend(b.geometry.getBounds());
                B.push(b)
            }
            w.addFeatures(B);
            z.map.zoomToExtent(d)
        }
        $("#mark_result").show();
        $("#mark_result #mark_count").text(B.length);
        $("#mark_quryList").empty().append(c.join(""))
    }
    function e(a) {
        var c = [],
        b;
        if (a.CLASS_NAME.match(/(LineString)$/)) for (a = k.geometry.components, b = 0; b < a.length; b++) c.push([a[b].x, a[b].y]);
        else if (a.CLASS_NAME.match(/(Polygon)$/)) for (a = k.geometry.components[0].components, b = 0; b < a.length; b++) c.push([a[b].x, a[b].y]);
        else c.push([a.x, a.y]);
        return c.join(",")
    }
    function f(a, b) {
        if (null != b) return "middle" == a ? "cm": "bottom" == a ? "cb": "top" == a ? "ct": "cm";
        if (!a) return "middle";
        var c = a.substr(a.length - 1, 1);
        return "b" == c ? "bottom": "m" == c ? "middle": "t" == c ? "top": "middle"
    }
    function h() {
        if (g_userid && "0" != g_userid) {
            var a, b = k.style,
            c = k.attributes;
            switch (c.type) {
            case "point":
                a = c.id ? {
                    ID: c.id,
                    TITLE: c.name,
                    OP: "UpdateUserPlot",
                    STYLE: JSON.stringify({
                        type: "point",
                        width: b.graphicWidth,
                        height: b.graphicHeight,
                        image: b.externalGraphic
                    }),
                    GEOMETRY: k.geometry.x + "," + k.geometry.y,
                    MEMO: c.remark,
                    USERID: g_userid
                }: {
                    TITLE: k.attributes.name,
                    OP: "AddUserPlot",
                    STYLE: JSON.stringify({
                        type: "point",
                        width: b.graphicWidth,
                        height: b.graphicHeight,
                        image: b.externalGraphic
                    }),
                    GEOMETRY: k.geometry.x + "," + k.geometry.y,
                    MEMO: c.remark,
                    USERID: g_userid
                };
                break;
            case "line":
                a = c.id ? {
                    ID: c.id,
                    TITLE: c.name,
                    OP: "UpdateUserPlot",
                    STYLE: JSON.stringify({
                        type: "polyline",
                        alpha: b.strokeOpacity,
                        color: b.strokeColor,
                        weight: b.strokeWidth,
                        style: b.strokeDashstyle
                    }),
                    GEOMETRY: e(k.geometry),
                    MEMO: c.remark,
                    USERID: g_userid
                }: {
                    TITLE: c.name,
                    OP: "AddUserPlot",
                    STYLE: JSON.stringify({
                        type: "polyline",
                        alpha: b.strokeOpacity,
                        color: b.strokeColor,
                        weight: b.strokeWidth,
                        style: b.strokeDashstyle
                    }),
                    GEOMETRY: e(k.geometry),
                    MEMO: c.remark,
                    USERID: g_userid
                };
                break;
            case "polygon":
                a = c.id ? {
                    ID: c.id,
                    TITLE: c.name,
                    OP: "UpdateUserPlot",
                    STYLE: JSON.stringify({
                        type: "polygon",
                        alpha: b.strokeOpacity,
                        color: b.strokeColor,
                        weight: b.strokeWidth,
                        style: b.strokeDashstyle,
                        fillColor: b.fillColor,
                        fillAlpha: b.fillOpacity
                    }),
                    GEOMETRY: e(k.geometry),
                    MEMO: c.remark,
                    USERID: g_userid
                }: {
                    TITLE: c.name,
                    OP: "AddUserPlot",
                    STYLE: JSON.stringify({
                        type: "polygon",
                        alpha: b.strokeOpacity,
                        color: b.strokeColor,
                        weight: b.strokeWidth,
                        style: b.strokeDashstyle,
                        fillColor: b.fillColor,
                        fillAlpha: b.fillOpacity
                    }),
                    GEOMETRY: e(k.geometry),
                    MEMO: c.remark,
                    USERID: g_userid
                };
                break;
            case "text":
                a = c.id ? {
                    ID: c.id,
                    TITLE: c.name,
                    OP: "UpdateUserPlot",
                    STYLE: JSON.stringify({
                        type: "label",
                        fontFamily: b.fontFamily,
                        fontSize: b.fontSize,
                        fontColor: b.fontColor,
                        xoffset: b.labelXOffset,
                        yoffset: b.labelYOffset,
                        bold: b.fontWeight,
                        italic: b.fontStyle,
                        color: b.strokeColor,
                        borderColor: b.labelOutlineColor,
                        placement: f(b.labelAlign),
                        border: !0
                    }),
                    GEOMETRY: e(k.geometry),
                    MEMO: c.remark,
                    USERID: g_userid
                }: {
                    TITLE: c.name,
                    OP: "AddUserPlot",
                    STYLE: JSON.stringify({
                        type: "label",
                        fontFamily: b.fontFamily,
                        fontSize: b.fontSize,
                        fontColor: b.fontColor,
                        xoffset: b.labelXOffset,
                        yoffset: b.labelYOffset,
                        bold: b.fontWeight,
                        italic: b.fontStyle,
                        color: b.strokeColor,
                        borderColor: b.labelOutlineColor,
                        placement: f(b.labelAlign),
                        border: !0
                    }),
                    GEOMETRY: e(k.geometry),
                    MEMO: c.remark,
                    USERID: g_userid
                }
            }
            $.ajax({
                type: "POST",
                url: Service.UserPlot,
                data: a,
                success: function(a, b) {
                    "" == a || null == a ? alert("\u4fdd\u5b58\u5931\u8d25\uff01\u8bf7\u91cd\u65b0\u4fdd\u5b58") : (k.attributes.id || (k.attributes.id = a), alert("\u4fdd\u5b58\u6210\u529f"))
                },
                error: function(a, b, c) {
                    alert(b)
                }
            })
        } else alert("\u4eb2\uff0c\u7528\u6237\u767b\u9646\u540e\u624d\u80fd\u591f\u4fdd\u5b58\u54e6\uff01\u8bf7\u767b\u9646\u540e\u518d\u8bd5\u8bd5\uff01")
    }
    function d() {
        confirm("\u5220\u9664\u540e\u4e0d\u53ef\u6062\u590d\uff0c\u786e\u5b9a\u8981\u5220\u9664\u5417\uff1f") && (k.attributes.id && $.ajax({
            type: "POST",
            url: Service.UserPlot,
            data: {
                OP: "DeleteUserPlot",
                ID: k.attributes.id
            },
            success: function(a, b) {
                "" == a || null == a ? alert("\u5220\u9664\u5931\u8d25\uff01") : alert("\u5220\u9664\u6210\u529f")
            },
            error: function(a, b, c) {
                alert(b)
            }
        }), w.removeFeatures([k]), "none" != $("#mark_List").css("display") ? (B = w.features, $("#mark_quryList li[id\x3d'" + k.attributes.id + "']").remove()) : D = w.features, PoiInfoPop.close())
    }
    function a(a) {
        k = a.feature;
        u = OpenLayers.Util.extend({},
        k.style);
        a = k.attributes;
        var b = "";
        "line" == a.type ? (PoiInfoPop.show("plotinfo", k.geometry.components[k.geometry.components.length - 1], {
            type: "line"
        }), $("#markName").text("\u7ebf\u6807\u7ed8"), b = k.geometry.getGeodesicLength(z.map.getProjectionObject()), b = 1E3 < b ? "\u957f\u5ea6\uff1a" + (b / 1E3).toFixed(3) + "\u516c\u91cc": "\u957f\u5ea6\uff1a" + b.toFixed(3) + "\u7c73") : "polygon" == a.type ? (PoiInfoPop.show("plotinfo", k.geometry.getCentroid(), {
            type: "polygon"
        }), $("#markName").text("\u9762\u6807\u7ed8"), b = k.geometry.getGeodesicArea(z.map.getProjectionObject()), b = 1E5 < b ? "\u9762\u79ef\uff1a" + (b / 1E6).toFixed(3) + "\u5e73\u65b9\u516c\u91cc": "\u9762\u79ef\uff1a" + b.toFixed(3) + "\u5e73\u65b9\u7c73") : "text" == a.type ? (PoiInfoPop.show("plotinfo", k.geometry, {
            type: "text"
        }), $("#markName").text("\u6587\u5b57\u6807\u7ed8")) : (PoiInfoPop.show("plotinfo", k.geometry, {
            type: "point"
        }), $("#markName").text("\u70b9\u6807\u7ed8"));
        $("#mark_title").append("\x3cinput type\x3d'button' id\x3d'popEditBtn' class\x3d'popEditBtn' title\x3d'\u4fee\u6539' style\x3d'margin-right:20px'\x3e\x3cinput type\x3d'button'class\x3d'popEditBtn' id\x3d'popDelBtn'  title\x3d'\u5220\u9664'\x3e");
        $("#right_pointNameInfo").html("\x3cdiv\x3e\u540d\u79f0\uff1a" + k.attributes.name + "\x3c/div\x3e\x3cdiv style\x3d'max-width:260px'\x3e\u5907\u6ce8\uff1a" + (k.attributes.remark || "\u65e0") + "\x3c/div\x3e\x3cdiv\x3e" + b + "\x3c/div\x3e");
        PoiInfoPop.resize();
        g()
    }
    function g() {
        $("#popEditBtn").click(function() {
            var a = k.attributes.type;
            "line" == a ? (PoiInfoPop.show("plotedit", k.geometry.components[k.geometry.components.length - 1], "line"), m()) : "polygon" == a ? (PoiInfoPop.show("plotedit", k.geometry.getCentroid(), "polygon"), p()) : "text" == a ? (PoiInfoPop.show("plotedit", k.geometry, "text"), x()) : (PoiInfoPop.show("plotedit", k.geometry, "point"), l())
        });
        $("#popDelBtn").click(function() {
            PoiInfoPop.close();
            d()
        })
    }
    function n(a) {
        $("#mark_tool_div .active").removeClass("active");
        var b = a.geometry;
        u.externalGraphic = "images/mark2/point7.png";
        u.graphicWidth = 24;
        u.graphicHeight = 24;
        u.graphicYOffset = -22;
        u.fillOpacity = 1;
        u.cursor = "pointer";
        a.style = OpenLayers.Util.extend({},
        u);
        a.style.label = "";
        a.attributes.type = "point";
        k = a;
        D.push(k);
        w.drawFeature(k);
        t[A].deactivate();
        PoiInfoPop.show("plotedit", b);
        l()
    }
    function l() {
        $("#poi_pop_info").css("height", "180px");
        $("#pointPopupContent").append(C);
        $("#pointmark_name").val(k.attributes.name || "").after("\x3cdiv id\x3d'changeImg' style\x3d'cursor:pointer;position: absolute;top: 35px;right: 5px;text-decoration: underline;'\x3e\x3cimg id\x3d'pointImg' style\x3d'width:20px;'src\x3d'" + u.externalGraphic + "'/\x3e\x3cbr/\x3e\u66f4\u6362\x3c/div\x3e");
        $("#pointmark_desc").text(k.attributes.remark || "");
        $("#pointPopupContent").after(b());
        $("#markName").text("\u70b9\u6807\u7ed8");
        PoiInfoPop.resize();
        $("#changeImg").click(function() {
            $("#pointPopupContent").hide();
            $("#pointmark_imgdiv").show()
        });
        $("#pointmark_imgdiv .sp_12").click(function() {
            var a = $(this).attr("src");
            $("#pointImg").attr("src", a);
            k.style.externalGraphic = a;
            w.drawFeature(k);
            $("#pointImgRtn").click()
        });
        $("#pointImgRtn").click(function() {
            $("#pointPopupContent").show();
            $("#pointmark_imgdiv").hide()
        });
        $("#pointmark_save").click(function() {
            k.attributes.name = $("#pointmark_name").val();
            k.attributes.remark = $("#pointmark_desc").val();
            a({
                feature: k
            });
            h()
        });
        $("#pointmark_delete").click(function() {
            PoiInfoPop.close();
            d()
        })
    }
    function q(a) {
        $("#mark_tool_div .active").removeClass("active");
        u.strokeWidth = 2;
        u.strokeOpacity = 1;
        u.strokeColor = "#0000ff";
        u.label = "";
        u.cursor = "pointer";
        a.style = OpenLayers.Util.extend({},
        u);
        a.style.label = "";
        a.attributes.type = "line";
        k = a;
        D.push(k);
        w.drawFeature(k);
        t[A].deactivate();
        PoiInfoPop.show("plotedit", k.geometry.components[a.geometry.components.length - 1]);
        m()
    }
    function m() {
        $("#poi_pop_info").css("height", "240px");
        $("#pointPopupContent").append(C);
        $("#pointmark_name").val(k.attributes.name || "");
        $("#pointmark_desc").text(k.attributes.remark || "");
        $("#markName").text("\u7ebf\u6807\u7ed8");
        $("#style_panel").append(G);
        y();
        $("#style_panel .ltrans").val(k.style.strokeOpacity);
        $.jPicker.List[0].color.active.val("hex", k.style.strokeColor.replace("#", ""), this);
        $("#style_panel .lwidth").val(k.style.strokeWidth);
        $("#style_panel .dropdown").attr("val", k.style.strokeDashstyle);
        $("#style_panel .dropdown p img").attr("src", $("#style_panel .dropdown img[val\x3d'" + k.style.strokeDashstyle + "']").attr("src"));
        PoiInfoPop.resize();
        $("#pointmark_save").click(function() {
            k.attributes.name = $("#pointmark_name").val();
            k.attributes.remark = $("#pointmark_desc").val();
            k.style.strokeOpacity = $("#style_panel .ltrans").val();
            k.style.strokeColor = "#" + $.jPicker.List[0].color.active.val("hex");
            k.style.strokeWidth = $("#style_panel .lwidth").val();
            k.style.strokeDashstyle = $("#style_panel .dropdown").attr("val");
            w.drawFeature(k);
            a({
                feature: k
            });
            h()
        });
        $("#pointmark_delete").click(function() {
            PoiInfoPop.close();
            d()
        })
    }
    function r(a) {
        u.pointRadius = 24;
        u.fillColor = "#0000ff";
        u.fillOpacity = .5;
        u.strokeWidth = 2;
        u.strokeOpacity = 1;
        u.strokeColor = "#0000ff";
        u.cursor = "pointer";
        a.style = OpenLayers.Util.extend({},
        u);
        a.style.label = "";
        a.attributes.type = "polygon";
        k = a;
        D.push(k);
        w.drawFeature(k);
        PoiInfoPop.show("plotedit", k.geometry.getCentroid());
        t[A].deactivate();
        p()
    }
    function p() {
        $("#poi_pop_info").css("height", "270px");
        $("#pointPopupContent").append(C);
        $("#pointmark_name").val(k.attributes.name || "");
        $("#pointmark_desc").text(k.attributes.remark || "");
        $("#markName").text("\u9762\u6807\u7ed8");
        $("#style_panel").append(H);
        y();
        $("#style_panel .ltrans").val(k.style.strokeOpacity);
        $.jPicker.List[0].color.active.val("hex", k.style.strokeColor.replace("#", ""));
        $("#style_panel .lwidth").val(k.style.strokeWidth);
        $("#style_panel .dropdown").attr("val", k.style.strokeDashstyle);
        $("#style_panel .dropdown p img").attr("src", $("#style_panel .dropdown img[val\x3d'" + k.style.strokeDashstyle + "']").attr("src"));
        $.jPicker.List[1].color.active.val("hex", k.style.fillColor.replace("#", ""));
        $("#style_panel .ftrans").val(k.style.fillOpacity);
        PoiInfoPop.resize();
        $("#pointmark_save").click(function() {
            k.attributes.name = $("#pointmark_name").val();
            k.attributes.remark = $("#pointmark_desc").val();
            k.style.strokeOpacity = $("#style_panel .ltrans").val();
            k.style.strokeColor = "#" + $.jPicker.List[0].color.active.val("hex");
            k.style.strokeWidth = $("#style_panel .lwidth").val();
            k.style.strokeDashstyle = "#" + $("#style_panel .dropdown").attr("val");
            k.style.fillColor = "#" + $.jPicker.List[1].color.active.val("hex");
            k.style.fillOpacity = $("#style_panel .ftrans").val();
            w.drawFeature(k);
            a({
                feature: k
            });
            h()
        });
        $("#pointmark_delete").click(function() {
            PoiInfoPop.close();
            d()
        })
    }
    function v(a) {
        $("#mark_tool_div .active").removeClass("active");
        u.pointRadius = 8;
        u.fillOpacity = 0;
        u.strokeOpacity = 0;
        u.fontColor = "#0000ff";
        u.fontSize = "12px";
        u.cursor = "pointer";
        u.labelOutlineColor = "#ffffff";
        u.labelSelect = !0;
        u.fontWeight = "bold";
        a.style = OpenLayers.Util.extend({},
        u);
        a.style.label = "";
        a.attributes.type = "text";
        k = a;
        D.push(k);
        w.drawFeature(k);
        PoiInfoPop.show("plotedit", k.geometry);
        t[A].deactivate();
        x()
    }
    function x() {
        $("#poi_pop_info").css("height", "290px");
        $("#pointPopupContent").append(C);
        $("#pointmark_name").val(k.attributes.name || "");
        $("#pointmark_desc").text(k.attributes.remark || "");
        $("#markName").text("\u6587\u5b57\u6807\u7ed8");
        $("#style_panel").append(I);
        y();
        $("#style_panel .tpos").val(f(k.style.labelAlign));
        $("#style_panel .xoff").val(k.style.labelXOffset || 0);
        $("#style_panel .yoff").val(k.style.labelYOffset || 0);
        k.style.labelOutlineColor ? ($.jPicker.List[1].color.active.val("hex", k.style.labelOutlineColor.replace("#", "")), $("#style_panel .tbord")[0].checked = !0) : ($("#style_panel .tbord")[0].checked = !1, $("#style_panel .lcolor").hide());
        $("#style_panel .txie")[0].checked = "italic" == k.style.fontStyle ? !0 : !1;
        $("#style_panel .tchu")[0].checked = "bold" == k.style.fontWeight ? !0 : !1;
        $.jPicker.List[0].color.active.val("hex", k.style.fontColor.replace("#", ""));
        $("#style_panel .tcolor").val(k.style.fontColor);
        $("#style_panel .tsize").val(parseInt(k.style.fontSize));
        $("#style_panel .tfam").val(k.style.fontFamily || "\u5b8b\u4f53");
        PoiInfoPop.resize();
        $("#pointmark_save").click(function() {
            k.attributes.name = $("#pointmark_name").val();
            k.attributes.remark = $("#pointmark_desc").val();
            k.style.label = k.attributes.name;
            k.style.labelAlign = f($("#style_panel .tpos").val(), "r");
            k.style.labelXOffset = $("#style_panel .xoff").val();
            k.style.labelYOffset = $("#style_panel .yoff").val();
            $("#style_panel .tbord")[0].checked && (k.style.labelOutlineColor = "#" + $.jPicker.List[1].color.active.val("hex"));
            k.style.fontStyle = $("#style_panel .txie")[0].checked ? "italic": "nomal";
            k.style.fontWeight = $("#style_panel .tchu")[0].checked ? "bold": "nomal";
            k.style.fontColor = "#" + $.jPicker.List[0].color.active.val("hex");
            k.style.fontSize = $("#style_panel .tsize").val() + "px";
            k.style.fontFamily = $("#style_panel .tfam").val();
            w.drawFeature(k);
            a({
                feature: k
            });
            h()
        });
        $("#pointmark_delete").click(function() {
            PoiInfoPop.close();
            d()
        })
    }
    function y() {
        if (0 < $.jPicker.List.length) for (var a = $.jPicker.List.length - 1; - 1 < a; a--) $.jPicker.List[a].destroy();
        $(".colorBtn").jPicker({
            window: {
                expandable: !0,
                position: {
                    x: "screenCenter",
                    y: "center"
                }
            }
        },
        function(a, b) {},
        function(a, b) {},
        function(a, b) {});
        $("#poi_pop_info").parent().after($(".dropdown").remove());
        $(".spinner.wh").spinner({
            step: 1,
            min: 0,
            max: 10,
            numberFormat: "n"
        });
        $(".spinner.trans").spinner({
            step: .05,
            min: 0,
            max: 1,
            numberFormat: "n"
        });
        $(".spinner.unlimit").spinner({
            step: 1,
            numberFormat: "n"
        });
        $(".dropdown p").click(function() {
            var a = $(this).siblings("ul");
            "none" == a.css("display") ? a.slideDown("fast") : a.slideUp("fast")
        });
        $(".dropdown").mouseleave(function() {
            $(this).children("ul").hide()
        });
        $(".dropdown ul li img").click(function() {
            var a = $(this),
            b = a.attr("src"),
            c = a.parents(".dropdown");
            c.attr("val", a.attr("val"));
            c.find("p img").attr("src", b);
            c.children("ul").hide()
        })
    }
    var t = [],
    A = 0,
    w,
    E = !1,
    u,
    z,
    k,
    C,
    F,
    G,
    I,
    H,
    D = [],
    B = [];
    return {
        init: function(b, d) {
            if (!E) {
                G = "\x3cdiv class\x3d'stylediv line' style\x3d'position: relative;'\x3e       \x3cdiv\x3e\u7ebf\u989c\u8272:\x3cspan class\x3d'colorBtn'/\x3e\x3c/div\x3e       \x3cdiv\x3e\u7ebf\u6837\u5f0f:\x3cdiv  style\x3d'position:relative;width:60px;height:24px;display:inline-block;'\x3e           \x3cdiv class\x3d'dropdown' val\x3d'solid'\x3e               \x3cp \x3e\x3cimg src\x3d'images/linestyle/solid.png'\x3e\x3c/p\x3e               \x3cul\x3e                   \x3cli \x3e\x3cimg val\x3d'solid' src\x3d'images/linestyle/solid.png'\x3e\x3c/li\x3e                   \x3cli \x3e\x3cimg val\x3d'dash' src\x3d'images/linestyle/dash.png'\x3e\x3c/li\x3e                   \x3cli \x3e\x3cimg val\x3d'dot' src\x3d'images/linestyle/dot.png'\x3e\x3c/li\x3e                   \x3cli \x3e\x3cimg val\x3d'dashdot' src\x3d'images/linestyle/dashdot.png'\x3e\x3c/li\x3e                   \x3cli \x3e\x3cimg val\x3d'longdashdot' src\x3d'images/linestyle/longdashdot.png'\x3e\x3c/li\x3e               \x3c/ul\x3e           \x3c/div\x3e       \x3c/div\x3e   \x3c/div\x3e   \x3cdiv\x3e\u7ebf\u5bbd:\x3cinput class\x3d'spinner wh lwidth'  value\x3d'2' /\x3e\x3c/div\x3e\x3cdiv\x3e\u900f\u660e\u5ea6:\x3cinput class\x3d'spinner trans ltrans' value\x3d'1' /\x3e\x3c/div\x3e\x3c/div\x3e";
                I = " \x3cdiv  class\x3d'stylediv text' style\x3d'position: relative;'\x3e       \x3cdiv\x3e\u6587\u5b57\u4f4d\u7f6e:\x3cselect class\x3d'tpos'\x3e\x3coption\x3emiddle\x3c/option\x3e\x3coption\x3etop\x3c/option\x3e\x3coption\x3ebottom\x3c/option\x3e\x3c/select\x3e\x3c/div\x3e       \x3cdiv\x3e\u6587\u5b57\u989c\u8272:\x3cspan class\x3d'colorBtn'/\x3e\x3c/div\x3e       \x3cdiv\x3ex\u8f74\u504f\u79fb:\x3cinput class\x3d'spinner unlimit xoff'  value\x3d'0' /\x3e\x3c/div\x3e       \x3cdiv\x3ey\u8f74\u504f\u79fb:\x3cinput class\x3d'spinner unlimit yoff'  value\x3d'0' /\x3e\x3c/div\x3e       \x3cdiv\x3e\u5b57\u4f53:\x3cselect style\x3d'max-width:100px' class\x3d'tfam'\x3e           \x3coption\x3e\u5b8b\u4f53\x3c/option\x3e           \x3coption\x3e\u5fae\u8f6f\u96c5\u9ed1\x3c/option\x3e           \x3coption\x3e\u6977\u4f53\x3c/option\x3e           \x3coption\x3e\u4eff\u5b8b\x3c/option\x3e           \x3coption\x3eAlgerian\x3c/option\x3e           \x3coption\x3eArial\x3c/option\x3e           \x3coption\x3eBroadway\x3c/option\x3e           \x3coption\x3eComicSansMS\x3c/option\x3e           \x3coption\x3eCourier\x3c/option\x3e           \x3coption\x3eVerdana\x3c/option\x3e           \x3coption\x3eTimesNewRoman\x3c/option\x3e       \x3c/select\x3e   \x3c/div\x3e   \x3cdiv\x3e\u5927\u5c0f:\x3cselect class\x3d'tsize'\x3e       \x3coption\x3e8\x3c/option\x3e       \x3coption\x3e10\x3c/option\x3e       \x3coption\x3e12\x3c/option\x3e       \x3coption\x3e14\x3c/option\x3e       \x3coption\x3e16\x3c/option\x3e       \x3coption\x3e18\x3c/option\x3e       \x3coption\x3e20\x3c/option\x3e   \x3c/select\x3e\x3c/div\x3e   \x3cdiv\x3e\x3cinput class\x3d'tbord' type\x3d'checkbox'/\x3e\u4f7f\u7528\u8fb9\u6846       \x3cspan class\x3d'colorBtn'/\x3e\x3c/div\x3e       \x3cdiv\x3e\x3cinput class\x3d'txie' type\x3d'checkbox'/\x3e\u659c\u4f53\x3c/div\x3e       \x3cdiv\x3e\x3cinput class\x3d'tchu' type\x3d'checkbox'/\x3e\u52a0\u7c97\x3c/div\x3e   \x3c/div\x3e";
                H = "\x3cdiv class\x3d'stylediv polygon' style\x3d'position: relative'\x3e           \x3cdiv\x3e\u7ebf\u989c\u8272:\x3cspan class\x3d'colorBtn'/\x3e\x3c/div\x3e\x3cdiv\x3e\u7ebf\u6837\u5f0f:\x3cdiv style\x3d'position:relative;width:60px;height:24px;display:inline-block;'\x3e           \x3cdiv class\x3d'dropdown' val\x3d'solid'\x3e               \x3cp\x3e\x3cimg src\x3d'images/linestyle/solid.png'\x3e\x3c/p\x3e               \x3cul\x3e                   \x3cli \x3e\x3cimg val\x3d'solid' src\x3d'images/linestyle/solid.png'\x3e\x3c/li\x3e                   \x3cli \x3e\x3cimg val\x3d'dash' src\x3d'images/linestyle/dash.png'\x3e\x3c/li\x3e                   \x3cli \x3e\x3cimg val\x3d'dot' src\x3d'images/linestyle/dot.png'\x3e\x3c/li\x3e                   \x3cli \x3e\x3cimg val\x3d'dashdot' src\x3d'images/linestyle/dashdot.png'\x3e\x3c/li\x3e                   \x3cli \x3e\x3cimg val\x3d'longdashdot' src\x3d'images/linestyle/longdashdot.png'\x3e\x3c/li\x3e               \x3c/ul\x3e           \x3c/div\x3e       \x3c/div\x3e   \x3c/div\x3e   \x3cdiv\x3e\u7ebf\u5bbd:\x3cinput class\x3d'spinner wh lwidth'  value\x3d'2' /\x3e\x3c/div\x3e\x3cdiv\x3e\u900f\u660e\u5ea6:\x3cinput class\x3d'spinner trans ltrans' value\x3d'1' /\x3e\x3c/div\x3e   \x3cdiv\x3e\u586b\u5145\u989c\u8272:\x3cspan class\x3d'colorBtn'/\x3e\x3c/div\x3e\x3cdiv\x3e\u586b\u5145\u900f\u660e\u5ea6:\x3cinput class\x3d'spinner trans ftrans'  value\x3d'1' /\x3e\x3c/div\x3e\x3c/div\x3e";
                C = "\x3cdiv\x3e\x3cspan\x3e\u540d\u79f0:\x3c/span\x3e\x3cinput type\x3d'text' style\x3d'width:245px' id\x3d'pointmark_name'\x3e\x3c/div\x3e\x3cdiv style\x3d'margin-top:10px;'\x3e\x3cspan style\x3d'float:left;'\x3e\u5907\u6ce8:\x3c/span\x3e\x3ctextarea id\x3d'pointmark_desc'\x3e\x3c/textarea\x3e\x3c/div\x3e\x3cdiv id\x3d'style_panel'\x3e\x3c/div\x3e\x3cdiv style\x3d'height:25px;margin-top:10px;margin-left:80px;width:280px;' id\x3d'popup1BtnDiv'\x3e\x3cdiv id\x3d'pointmark_save'\x3e\u4fdd  \u5b58\x3c/div\x3e\x3cdiv id\x3d'pointmark_delete' style\x3d'margin-left:10px;'\x3e\u5220  \u9664\x3c/div\x3e\x3c/div\x3e";
                F = "point0 point1 point2 point3 point4 point5 point6 point7 point8 point9 point10 point11 point12 point13 point14 point15 point16 point17 point18 point19 point20".split(" ");
                "object" == typeof b ? $(b).append("\x3cli class\x3d'toolbagClass' id\x3d'btnMarkDiv'\x3e\x3cspan class\x3d'btnToolbar-cont1'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -40px 0;top:4px;width:20px;'\x3e\x3c/span\x3e\u6807\u7ed8\x3c/span\x3e\x3c/li\x3e") : $("#" + b).append("\x3cli class\x3d'toolbagClass' id\x3d'btnMarkDiv'\x3e\x3cspan class\x3d'btnToolbar-cont1'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -40px 0;top:4px;width:20px;'\x3e\x3c/span\x3e\u6807\u7ed8\x3c/span\x3e\x3c/li\x3e");
                z = d;
                $(z.map.div).after("\x3cdiv id \x3d 'mark_tool_div'title\x3d'\u5730\u56fe\u6807\u7ed8' onselectstart\x3d'return false' style\x3d'-moz-user-select:none;display:none'\x3e\t\x3cdiv class\x3d'marktool'\x3e\x3cul\x3e\t\t\x3cli class \x3d 'markClas' style \x3d 'background:url(images/ToolBar/tool_markpointer.png) no-repeat center'\x3e\x3c/li\x3e\t\t\x3cli class \x3d 'markClas' style \x3d 'background:url(images/ToolBar/tool_markline.png) no-repeat center'\x3e\x3c/li\x3e\t\t\x3cli class \x3d 'markClas' style \x3d 'background:url(images/ToolBar/tool_markpolygon.png) no-repeat center'\x3e\x3c/li\x3e       \x3cli class \x3d 'markClas' style \x3d 'background:url(images/ToolBar/tool_marktext.png) no-repeat center'\x3e\x3c/li\x3e\t\x3c/ul\x3e\x3c/div\x3e\t\x3cdiv class\x3d'marklist' style\x3d'display:none;' \x3e\x3cdiv style\x3d\"padding: 5px 5px 10px 5px;border-bottom: 1px dotted blue;margin-bottom: 8px;\"\x3e\x3cinput style\x3d\"width:100px;\"  id\x3d\"mark_qurytitle\"\x3e \x3cinput type\x3d\"button\" class\x3d\"markBtn\" style\x3d\"width:45px\" value\x3d\"\u67e5\u8be2\" id\x3d\"mark_qurybtn\"\x3e \x3cinput type\x3d\"button\" style\x3d\"width: 55px;color:gray\" class\x3d\"markBtn\" value\x3d\"\u4e0b\u8f7dshp\" id\x3d\"mark_download\"\x3e\x3c/div\x3e\x3cdiv id\x3d'mark_result'style\x3d'display:none'\x3e\x3cinput id\x3d'mark_selectall' style\x3d'vertical-align:middle;margin: 0 4px;' type\x3d'checkbox'\x3e\u67e5\u8be2\u7ed3\u679c (\u5171\x3cspan id\x3d'mark_count'\x3e10\x3c/span\x3e\u6761)\x3cinput type\x3d'button' style\x3d'width: 65px;height:21px;margin-left:60px' class\x3d'markBtn' value\x3d'\u6e05\u9664\u7ed3\u679c'id\x3d'mark_quryclear'/\x3e\x3cul id\x3d'mark_quryList' \x3e\x3c/ul\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e");
                $("#mark_tool_div").dialog({
                    autoOpen: !1,
                    resizable: !1,
                    position: [.5 * $(window).width() + 85, 32],
                    width: "auto",
                    maxHeight: "300px",
                    minHeight: "inherit",
                    minWidth: "inherit"
                });
                $("#mark_tool_div").css("min-height", "inherit");
                $(".ui-dialog").css({
                    "z-index": "1000",
                    width: "auto",
                    "font-size": "12px",
                    border: "1px solid #25abf3"
                });
                $(".ui-dialog-title").after('\x3cspan style\x3d"position: absolute;right: 0;"\x3e\x3cimg id\x3d"mark_close" src\x3d"images/blank.gif" title\x3d"\u5173\u95ed"\x3e\x3cimg id\x3d"mark_List" src\x3d"images/blank.gif" title\x3d"\u6807\u7ed8\u8bb0\u5f55"\x3e\x3cimg id\x3d"mark_spin" src\x3d"images/blank.gif" title\x3d"\u6807\u7ed8"\x3e\x3c/span\x3e');
                $(".ui-dialog .ui-dialog-titlebar ").css({
                    color: "#4d4d4d",
                    "font-weight": "700",
                    padding: "0 2px",
                    "font-size": "14px",
                    background: "url(Openlayers/theme/default/img/cloud-popup-relative.png) no-repeat -2px -1px",
                    border: "none"
                });
                $(".ui-dialog-titlebar-close ").hide();
                var g = new OpenLayers.StyleMap({
                    "default": {
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
                u = OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style["default"]);
                w = new OpenLayers.Layer.Vector("plotLayer", {
                    style: g
                });
                z.addLayer(w, !0);
                t = [new OpenLayers.Control.DrawFeature(w, OpenLayers.Handler.Point, {
                    handlerOptions: {
                        layerOptions: {
                            renderers: void 0,
                            styleMap: g
                        }
                    },
                    featureAdded: n
                }), new OpenLayers.Control.DrawFeature(w, OpenLayers.Handler.Path, {
                    handlerOptions: {
                        layerOptions: {
                            renderers: void 0,
                            styleMap: g
                        }
                    },
                    featureAdded: q
                }), new OpenLayers.Control.DrawFeature(w, OpenLayers.Handler.Polygon, {
                    handlerOptions: {
                        layerOptions: {
                            renderers: void 0,
                            styleMap: g
                        }
                    },
                    featureAdded: r
                }), new OpenLayers.Control.DrawFeature(w, OpenLayers.Handler.Point, {
                    handlerOptions: {
                        layerOptions: {
                            renderers: void 0,
                            styleMap: g
                        }
                    },
                    featureAdded: v
                })];
                z.map.addControls(t);
                w.events.on({
                    featureselected: a
                });
                $("#btnMarkDiv").click(function(a) {
                    $("#toolbag_div").css("display", "none");
                    $("#mark_tool_div").css("display", "block").find(".markClas:eq(0)").addClass("active");
                    A = 0;
                    t[A].activate();
                    $("#mark_tool_div").dialog("open")
                });
                $("#mark_close").on("click",
                function(a) {
                    $("#mark_tool_div .active").removeClass("active");
                    $("#mark_tool_div\x3e.marktool").show();
                    $("#mark_tool_div\x3e.marklist").hide();
                    $("#mark_tool_div").dialog("close");
                    w.removeAllFeatures();
                    t[A].deactivate();
                    markers && markers.removeAllFeatures()
                });
                $("#mark_List").on("click",
                function() {
                    t[A].deactivate();
                    $("#mark_tool_div\x3e.marktool").hide();
                    $("#mark_tool_div\x3e.marklist").show();
                    $("#mark_tool_div").css({
                        width: "260px",
                        height: "280px"
                    });
                    w.removeAllFeatures();
                    w.addFeatures(B)
                });
                $("#mark_spin").on("click",
                function() {
                    t[A].activate();
                    $("#mark_tool_div").css({
                        width: "145px",
                        height: "40px"
                    });
                    $("#mark_tool_div\x3e.marktool").show();
                    $("#mark_tool_div\x3e.marklist").hide();
                    w.removeAllFeatures();
                    w.addFeatures(D)
                });
                $(".markClas").on("click",
                function() {
                    $(".markClas").siblings().removeClass("active");
                    t[A].deactivate();
                    A = $(this).index();
                    $(this).addClass("active");
                    t[A].activate()
                });
                $("#mark_quryclear").click(function() {
                    w.removeAllFeatures();
                    B = [];
                    $("#mark_download").css({
                        color: "gray"
                    });
                    $("#mark_result").hide()
                });
                $("#mark_qurybtn").click(function() {
                    if (g_userid && "0" != g_userid) {
                        var a = $("#mark_qurytitle").val();
                        $("#mark_download").css({
                            color: "black"
                        });
                        $.ajax({
                            url: Service.GETUserPlot,
                            data: JSON.stringify({
                                USERID: g_userid,
                                TITLE: a
                            }),
                            type: "post",
                            success: c,
                            error: function() {},
                            contentType: "application/json; charset\x3dutf-8"
                        })
                    } else alert("\u5f53\u524d\u672a\u767b\u5f55\uff0c\u8bf7\u767b\u9646\u540e\u518d\u67e5\u8be2\u5386\u53f2\u6807\u7ed8\u4fe1\u606f\uff01")
                });
                $("#mark_download").click(function() {
                    if ("none" != $("#mark_result").css("display")) {
                        var a = [];
                        $("#mark_quryList li :checkbox:checked").each(function() {
                            a.push($(this).parent().attr("id"))
                        });
                        1 > a.length && alert("\u5f53\u524d\u672a\u9009\u4e2d\u4efb\u4f55\u6807\u7ed8\uff01");
                        $.ajax({
                            url: Service.DOWNLOAD,
                            type: "post",
                            dataType: "text",
                            data: {
                                userid: g_userid,
                                request: "download",
                                id: a.join("|") + "|"
                            },
                            success: function(a) {
                                window.saveFrame && a && (window.saveFrame.location = a, window.imgFrame.document.execCommand("SaveAs"));
                                return ! 1
                            },
                            error: function(a, b, c) {}
                        })
                    }
                });
                $("#mark_result #mark_quryList").on("dblclick", "li",
                function() {
                    for (var b = $(this).attr("id"), c = 0; c < B.length; c++) if (B[c].attributes.id == b) {
                        z.map.zoomToExtent(B[c].geometry.getBounds());
                        a({
                            feature: B[c]
                        });
                        break
                    }
                });
                $("#mark_selectall").change(function() {
                    this.checked ? $("#mark_quryList li :checkbox").each(function() {
                        this.checked = !0
                    }) : $("#mark_quryList li :checkbox").each(function() {
                        this.checked = !1
                    })
                });
                E = !0
            }
        },
        clear: function() {
            w.removeAllFeatures();
            D = [];
            B = [];
            PoiInfoPop.close()
        }
    }
} (),
RightMenu = function() {
    var b, c = !1,
    e;
    return {
        init: function(f) {
            c || (b = f, $(".olMapViewport").mouseup(function(c) {
                if (3 == c.which) {
                    var d, a = $(this).offset();
                    d = c.clientX - a.left;
                    c = c.clientY - a.top;
                    e = b.map.getLonLatFromPixel(new OpenLayers.Pixel(d, c));
                    $("#rightDiv").css({
                        display: "block",
                        left: d + 2,
                        top: c
                    })
                }
            }).click(function() {
                $("#rightDiv").hide()
            }).after("\x3cdiv id \x3d 'rightDiv'\x3e\t\x3cul\x3e\t\t\x3cli id \x3d 'right_from' style \x3d 'margin-top:3px;'\x3e\u4ee5\u6b64\u4e3a\u8d77\u70b9\x3c/li\x3e\t    \x3cli id \x3d 'right_to'  \x3e\u4ee5\u6b64\u4e3a\u7ec8\u70b9\x3c/li\x3e\t    \x3cli id \x3d 'right_around' style\x3d'height:23px;'\x3e\x3cdiv class\x3d'splitline'\x3e\u5728\u6b64\u70b9\u9644\u8fd1\u627e...\x3c/div\x3e\x3c/li\x3e     \t\t\x3cli id \x3d 'right_zoomin' \x3e\u653e\u5927\x3c/li\x3e\t\t\x3cli id \x3d 'right_zoomout' \x3e\u7f29\u5c0f\x3c/li\x3e\t\x3c/ul\x3e\x3c/div\x3e"), $("#rightDiv li").click(function() {
                $("#rightDiv").css("display", "none");
                switch (this.id) {
                case "right_from":
                    switchSearch("s3");
                    PathSearch.setStart(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(e.lon, e.lat)), 2);
                    break;
                case "right_to":
                    switchSearch("s3");
                    PathSearch.setEnd(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(e.lon, e.lat)), 2);
                    break;
                case "right_around":
                    PoiInfoPop.show("around", e);
                    break;
                case "right_zoomout":
                    b.map.zoomOut();
                    break;
                case "right_zoomin":
                    b.map.zoomIn()
                }
            }), c = !0)
        }
    }
} (),
PoiInfoPop = function() {
    function b(b, c) {
        g && a.graLayer.removeFeatures([g]);
        n && a.graLayer.removeFeatures([n]);
        g = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon.createRegularPolygon(b, c / (12742024 * Math.PI) * 360, 100, 0));
        var d = OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style["default"]);
        d.fillColor = "blue";
        d.fillOpacity = .2;
        d.labelAlign = "lb";
        d.labelXOffset = 20;
        d.strokeColor = "red";
        d.strokeOpacity = 1;
        g.style = d;
        n = new OpenLayers.Feature.Vector(b);
        d = OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style["default"]);
        d.externalGraphic = "images/leftDiv/png/0[2].png";
        d.graphicWidth = 19;
        d.graphicHeight = 29;
        d.fillOpacity = 1;
        d.cursor = "pointer";
        n.style = d;
        a.graLayer.addFeatures([g, n]);
        a.map.zoomToExtent(g.geometry.getBounds())
    }
    function c(a) {
        if ("ok" == a.status && (a = a.result)) {
            var b = String(a.district_text).split("\x3e").join("").replace("\u5e02\u8f96\u533a", "").replace("\u5c71\u4e1c\u7701", ""),
            c = "";
            a.road && "" != a.road.name && (c = a.road.name);
            var d = "";
            a.address && (d = a.address);
            a.point && "" != a.point.name ? $("#markName").text(a.point.name + "\u9644\u8fd1") : $("#markName").text(b + c);
            $("#right_pointNameInfo").html("\x3cdiv id\x3d'address'\x3e\u5730\u5740:" + b + c + d + "\x3c/div\x3e");
            m.updateSize()
        }
    }
    function e(a) {
        var b = $("#tabs\x3eul:eq(0)").offset();
        $("#poiSearch_suglist").empty().append(a).show().css({
            left: b.left + 45 + "px",
            top: b.top + 65 + "px"
        }).children("div").click(h)
    }
    function f() {
        $("#pointFromText").keyup(function(a) { (a = $(this).val()) && WholeSearch.request("list", {
                words: a
            },
            e)
        });
        $("#pointToText").keyup(function(a) { (a = $(this).val()) && WholeSearch.request("list", {
                words: a
            },
            e)
        });
        $("#pointFromButton").click(function() {
            l.attributes = {
                name: $("#markName").text()
            };
            PathSearch.setStart(r, 3);
            PathSearch.setEnd(l, 3)
        });
        $("#pointToButton").click(function() {
            l.attributes = {
                name: $("#markName").text()
            };
            PathSearch.setStart(l, 3);
            PathSearch.setEnd(r, 3)
        });
        $("#pointPopupSearchBtn").click(function() {
            $("#left_query_text").val(l.attributes.name);
            var a = $("#pointSearch").val();
            if (a) {
                switchSearch("s2");
                var c = l.geometry,
                d = parseInt($("#selectRadius").val());
                WholeSearch.request("buffer", {
                    words: a,
                    radius: d,
                    area: "POINT(" + c.x + " " + c.y + ")",
                    mode: 1
                });
                b(c, d);
                PoiInfoPop.close()
            }
        });
        $("#tabs3 \x3e .pointPopupBtn").click(function() {
            $("#left_query_text").val(l.attributes.name);
            var a = $(this).attr("code");
            switchSearch("s2");
            var c = l.geometry,
            d = parseInt($("#selectRadius").val());
            WholeSearch.request("buffer", {
                "class": a,
                radius: d,
                area: "POINT(" + c.x + " " + c.y + ")",
                mode: 1
            });
            b(c, d);
            PoiInfoPop.close()
        });
        $("#poi_correct").click(function() {
            var a = l.attributes;
            MapCorrect.openCorrect(a.lsid ? {
                FID: a.id,
                LSID: a.lsid
            }: {
                FID: a.id,
                name: a.name,
                tel: a.telephone,
                addr: a.address,
                catg: a.catg,
                x: l.geometry.x,
                y: l.geometry.y
            })
        })
    }
    function h() {
        var a = $(this).attr("crd").split(",");
        r = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(parseFloat(a[0]), parseFloat(a[1])));
        a = a[3];
        r.attributes = {
            name: a
        };
        $("#tabs\x3ediv:visible :text").val(a);
        $("#poiSearch_suglist").hide()
    }
    function d() {
        a.unSelect();
        m && a.map.removePopup(m)
    }
    var a, g, n, l, q = !1,
    m, r;
    return {
        init: function(b) {
            q || (a = b, 0 == $("#poiSearch_suglist").length && ($(document.body).append("\x3cdiv id\x3d'poiSearch_suglist' style\x3d'position:absolute;display:none;'\x3e\x3c/div\x3e"), $("#poiSearch_suglist").delegate("a", "click",
            function() {
                $("#poiSearch_suglist").hide()
            })), q = !0)
        },
        show: function(b, g, e, r) {
            g = new OpenLayers.LonLat(g.lon || g.x, g.lat || g.y);
            var p;
            null != m && a.map.removePopup(m);
            switch (b) {
            case "local":
                m = new OpenLayers.Popup.FramedCloud("\u641c\u7d22", g, null, '\x3cdiv id\x3d"poi_pop_info" style \x3d "min-height:90px;width:333px;font-size:12px;"\x3e\x3cdiv id \x3d "mark_title"\x3e\x3cdiv id\x3d"markName" style\x3d"padding-left:10px;font-size:14px;color:#3b9cfe;font-weight:700;margin-top:-2px;"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id \x3d "pointPopupContent" style \x3d "margin-top:10px;display:block"\x3e\x3cdiv id\x3d"right_pointNameInfo"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e', null, !0, d);
                a.map.addPopup(m);
                p = [];
                "" != e.address && p.push("\x3cdiv id\x3d'address'\x3e\u5730\u5740:" + e.address + "\x3c/div\x3e");
                "" != e.telephone && p.push("\x3cdiv id\x3d'phone'\x3e\u7535\u8bdd:" + e.telephone + "\x3c/div\x3e");
                $("#right_pointNameInfo").append(p.join(""));
                $("#pointPopupContent").append('\x3cdiv id\x3d"tabs"\x3e\x3cul\x3e\x3cli id \x3d "tabs-li1"\x3e\x3ca href\x3d"#tabs1" class\x3d"selected"\x3e\x3cimg src\x3d"images/blank.gif"/\x3e\u5230\u8fd9\u91cc\u53bb    \x3c/a\x3e\x3c/li\x3e\x3cli id \x3d "tabs-li2"\x3e\x3ca href\x3d"#tabs2" \x3e\x3cimg src\x3d"images/blank.gif"/\x3e\u4ece\u8fd9\u91cc\u51fa\u53d1    \x3c/a\x3e\x3c/li\x3e\x3cli id \x3d "tabs-li3"\x3e\x3ca href\x3d"#tabs3" \x3e\x3cimg src\x3d"images/blank.gif"/\x3e\u5468\u8fb9\u641c\u7d22    \x3c/a\x3e\x3c/li\x3e\x3c/ul\x3e\x3cdiv id\x3d"tabs1" class \x3d "pointTabDiv"\x3e\x3cspan style\x3d"margin-right:4px;"\x3e\u8d77\u70b9\x3c/span\x3e\x3cinput type\x3d"text" id\x3d"pointFromText"\x3e\x3cinput type\x3d"button" id\x3d"pointFromButton" class\x3d"btnSmall" style\x3d"margin:-5px 0 0 10px" value\x3d"\u9a7e\u8f66"\x3e\x3c/div\x3e\x3cdiv id\x3d"tabs2"\x3e\x3cspan style\x3d"margin-right:4px;"\x3e\u7ec8\u70b9\x3c/span\x3e\x3cinput type\x3d"text" id\x3d"pointToText"\x3e\x3cinput type \x3d"button" id\x3d"pointToButton" class\x3d"btnSmall" style\x3d"margin:-5px 0 0 10px" value\x3d"\u9a7e\u8f66"\x3e\x3c/div\x3e\x3cdiv id\x3d"tabs3"\x3e\x3cinput type \x3d "button" class \x3d "pointPopupBtn" code\x3d"5080 5082:5085 5380 5501 5502 5400" value \x3d"\u5bbe\u9986"\x3e\x3cinput type \x3d "button" class \x3d "pointPopupBtn" code\x3d"A180:A192 A195:A19C" value \x3d"\u94f6\u884c"\x3e\x3cinput type \x3d "button" class \x3d "pointPopupBtn" code\x3d"7200 7203:7206 7280 7281 7500" value \x3d"\u533b\u9662"\x3e\x3cinput type \x3d "text" id \x3d "pointSearch" style \x3d "width:80px"\x3e\x3cselect name\x3d"selectAge" id\x3d"selectRadius" style\x3d"height:23px;margin-left:2px;border: #b3b3b3 solid 1px;"\x3e\x3coption value\x3d"500"\x3e500\u7c73\x3c/option\x3e\x3coption value\x3d"800"\x3e800\u7c73\x3c/option\x3e\x3coption value\x3d"1000"\x3e1000\u7c73\x3c/option\x3e\x3coption value\x3d"2000"\x3e2000\u7c73\x3c/option\x3e\x3coption value\x3d"5000"\x3e5000\u7c73\x3c/option\x3e\x3c/select\x3e\x3cinput type \x3d"button" value \x3d "\u641c\u7d22" id \x3d "pointPopupSearchBtn" class \x3d "btnSmall"  style\x3d"margin:-5px 0 0 4px" \x3e\x3c/div\x3e\x3c/div\x3e');
                $("#mark_title").append("\x3cdiv id\x3d'poi_correct' title\x3d'\u7ea0\u9519'\x3e\x3c/div\x3e");
                $("#poi_pop_info").css({
                    width: "333px"
                });
                $("#markName").text(e.name);
                break;
            case "around":
                m = new OpenLayers.Popup.FramedCloud("\u641c\u7d22", g, null, '\x3cdiv id\x3d"poi_pop_info" style \x3d "min-height:90px;width:333px;font-size:12px;"\x3e\x3cdiv id \x3d "mark_title"\x3e\x3cdiv id\x3d"markName" style\x3d"padding-left:10px;font-size:14px;color:#3b9cfe;font-weight:700;margin-top:-2px;"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id \x3d "pointPopupContent" style \x3d "margin-top:10px;display:block"\x3e\x3cdiv id\x3d"right_pointNameInfo"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e', null, !0, d);
                m.autoSize = !0;
                a.map.addPopup(m);
                $("#poi_pop_info").css({
                    width: "333px",
                    height: "100px"
                });
                m.updateSize();
                $("#pointPopupContent").append('\x3cdiv id\x3d"tabs"\x3e\x3cul\x3e\x3cli id \x3d "tabs-li1"\x3e\x3ca href\x3d"#tabs1" class\x3d"selected"\x3e\x3cimg src\x3d"images/blank.gif"/\x3e\u5230\u8fd9\u91cc\u53bb    \x3c/a\x3e\x3c/li\x3e\x3cli id \x3d "tabs-li2"\x3e\x3ca href\x3d"#tabs2" \x3e\x3cimg src\x3d"images/blank.gif"/\x3e\u4ece\u8fd9\u91cc\u51fa\u53d1    \x3c/a\x3e\x3c/li\x3e\x3cli id \x3d "tabs-li3"\x3e\x3ca href\x3d"#tabs3" \x3e\x3cimg src\x3d"images/blank.gif"/\x3e\u5468\u8fb9\u641c\u7d22    \x3c/a\x3e\x3c/li\x3e\x3c/ul\x3e\x3cdiv id\x3d"tabs1" class \x3d "pointTabDiv"\x3e\x3cspan style\x3d"margin-right:4px;"\x3e\u8d77\u70b9\x3c/span\x3e\x3cinput type\x3d"text" id\x3d"pointFromText"\x3e\x3cinput type\x3d"button" id\x3d"pointFromButton" class\x3d"btnSmall" style\x3d"margin:-5px 0 0 10px" value\x3d"\u9a7e\u8f66"\x3e\x3c/div\x3e\x3cdiv id\x3d"tabs2"\x3e\x3cspan style\x3d"margin-right:4px;"\x3e\u7ec8\u70b9\x3c/span\x3e\x3cinput type\x3d"text" id\x3d"pointToText"\x3e\x3cinput type \x3d"button" id\x3d"pointToButton" class\x3d"btnSmall" style\x3d"margin:-5px 0 0 10px" value\x3d"\u9a7e\u8f66"\x3e\x3c/div\x3e\x3cdiv id\x3d"tabs3"\x3e\x3cinput type \x3d "button" class \x3d "pointPopupBtn" code\x3d"5080 5082:5085 5380 5501 5502 5400" value \x3d"\u5bbe\u9986"\x3e\x3cinput type \x3d "button" class \x3d "pointPopupBtn" code\x3d"A180:A192 A195:A19C" value \x3d"\u94f6\u884c"\x3e\x3cinput type \x3d "button" class \x3d "pointPopupBtn" code\x3d"7200 7203:7206 7280 7281 7500" value \x3d"\u533b\u9662"\x3e\x3cinput type \x3d "text" id \x3d "pointSearch" style \x3d "width:80px"\x3e\x3cselect name\x3d"selectAge" id\x3d"selectRadius" style\x3d"height:23px;margin-left:2px;border: #b3b3b3 solid 1px;"\x3e\x3coption value\x3d"500"\x3e500\u7c73\x3c/option\x3e\x3coption value\x3d"800"\x3e800\u7c73\x3c/option\x3e\x3coption value\x3d"1000"\x3e1000\u7c73\x3c/option\x3e\x3coption value\x3d"2000"\x3e2000\u7c73\x3c/option\x3e\x3coption value\x3d"5000"\x3e5000\u7c73\x3c/option\x3e\x3c/select\x3e\x3cinput type \x3d"button" value \x3d "\u641c\u7d22" id \x3d "pointPopupSearchBtn" class \x3d "btnSmall"  style\x3d"margin:-5px 0 0 4px" \x3e\x3c/div\x3e\x3c/div\x3e');
                WholeSearch.request("rgc2", {
                    point: g.lon + "," + g.lat,
                    type: 1
                },
                c);
                $("#markName").text("\u672a\u77e5\u5730\u70b9");
                break;
            case "plotinfo":
                m = new OpenLayers.Popup.FramedCloud("\u6807\u6ce8\u4fe1\u606f", g, null, '\x3cdiv id\x3d"poi_pop_info" style \x3d "min-height:90px;width:333px;font-size:12px;"\x3e\x3cdiv id \x3d "mark_title"\x3e\x3cdiv id\x3d"markName" style\x3d"padding-left:10px;font-size:14px;color:#3b9cfe;font-weight:700;margin-top:-2px;"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id \x3d "pointPopupContent" style \x3d "margin-top:10px;display:block"\x3e\x3cdiv id\x3d"right_pointNameInfo"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e', null, !0, d);
                a.map.addPopup(m);
                "point" == e.type && ($("#pointPopupContent").append('\x3cdiv id\x3d"tabs"\x3e\x3cul\x3e\x3cli id \x3d "tabs-li1"\x3e\x3ca href\x3d"#tabs1" class\x3d"selected"\x3e\x3cimg src\x3d"images/blank.gif"/\x3e\u5230\u8fd9\u91cc\u53bb    \x3c/a\x3e\x3c/li\x3e\x3cli id \x3d "tabs-li2"\x3e\x3ca href\x3d"#tabs2" \x3e\x3cimg src\x3d"images/blank.gif"/\x3e\u4ece\u8fd9\u91cc\u51fa\u53d1    \x3c/a\x3e\x3c/li\x3e\x3cli id \x3d "tabs-li3"\x3e\x3ca href\x3d"#tabs3" \x3e\x3cimg src\x3d"images/blank.gif"/\x3e\u5468\u8fb9\u641c\u7d22    \x3c/a\x3e\x3c/li\x3e\x3c/ul\x3e\x3cdiv id\x3d"tabs1" class \x3d "pointTabDiv"\x3e\x3cspan style\x3d"margin-right:4px;"\x3e\u8d77\u70b9\x3c/span\x3e\x3cinput type\x3d"text" id\x3d"pointFromText"\x3e\x3cinput type\x3d"button" id\x3d"pointFromButton" class\x3d"btnSmall" style\x3d"margin:-5px 0 0 10px" value\x3d"\u9a7e\u8f66"\x3e\x3c/div\x3e\x3cdiv id\x3d"tabs2"\x3e\x3cspan style\x3d"margin-right:4px;"\x3e\u7ec8\u70b9\x3c/span\x3e\x3cinput type\x3d"text" id\x3d"pointToText"\x3e\x3cinput type \x3d"button" id\x3d"pointToButton" class\x3d"btnSmall" style\x3d"margin:-5px 0 0 10px" value\x3d"\u9a7e\u8f66"\x3e\x3c/div\x3e\x3cdiv id\x3d"tabs3"\x3e\x3cinput type \x3d "button" class \x3d "pointPopupBtn" code\x3d"5080 5082:5085 5380 5501 5502 5400" value \x3d"\u5bbe\u9986"\x3e\x3cinput type \x3d "button" class \x3d "pointPopupBtn" code\x3d"A180:A192 A195:A19C" value \x3d"\u94f6\u884c"\x3e\x3cinput type \x3d "button" class \x3d "pointPopupBtn" code\x3d"7200 7203:7206 7280 7281 7500" value \x3d"\u533b\u9662"\x3e\x3cinput type \x3d "text" id \x3d "pointSearch" style \x3d "width:80px"\x3e\x3cselect name\x3d"selectAge" id\x3d"selectRadius" style\x3d"height:23px;margin-left:2px;border: #b3b3b3 solid 1px;"\x3e\x3coption value\x3d"500"\x3e500\u7c73\x3c/option\x3e\x3coption value\x3d"800"\x3e800\u7c73\x3c/option\x3e\x3coption value\x3d"1000"\x3e1000\u7c73\x3c/option\x3e\x3coption value\x3d"2000"\x3e2000\u7c73\x3c/option\x3e\x3coption value\x3d"5000"\x3e5000\u7c73\x3c/option\x3e\x3c/select\x3e\x3cinput type \x3d"button" value \x3d "\u641c\u7d22" id \x3d "pointPopupSearchBtn" class \x3d "btnSmall"  style\x3d"margin:-5px 0 0 4px" \x3e\x3c/div\x3e\x3c/div\x3e'), $("#poi_pop_info").css({
                    width: "333px"
                }));
                break;
            case "plotedit":
                m = new OpenLayers.Popup.FramedCloud("\u6807\u6ce8\u4fe1\u606f", g, null, '\x3cdiv id\x3d"poi_pop_info" style \x3d "min-height:90px;width:333px;font-size:12px;"\x3e\x3cdiv id \x3d "mark_title"\x3e\x3cdiv id\x3d"markName" style\x3d"padding-left:10px;font-size:14px;color:#3b9cfe;font-weight:700;margin-top:-2px;"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id \x3d "pointPopupContent" style \x3d "margin-top:10px;display:block"\x3e\x3cdiv id\x3d"right_pointNameInfo"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e', null, !0, d);
                m.autoSize = !0;
                a.map.addPopup(m);
                $("#poi_pop_info").css({
                    width: "313px"
                });
                break;
            case "resourcelist":
                m = new OpenLayers.Popup.FramedCloud("\u641c\u7d22", g, null, '\x3cdiv id\x3d"poi_pop_info" style \x3d "min-height:90px;width:333px;font-size:12px;"\x3e\x3cdiv id \x3d "mark_title"\x3e\x3cdiv id\x3d"markName" style\x3d"padding-left:10px;font-size:14px;color:#3b9cfe;font-weight:700;margin-top:-2px;"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id \x3d "pointPopupContent" style \x3d "margin-top:10px;display:block"\x3e\x3cdiv id\x3d"right_pointNameInfo"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e', null, !0, d);
                p = "\x3cdiv class\x3d'resource_detail'\x3e";
                $.each(e,
                function(a) {
                    "OBJECTID" != a.toUpperCase() && "NAME" != a.toUpperCase() && 0 > a.toUpperCase().indexOf("SHAPE") && (p += a + ":" + e[a] + "\x3cbr/\x3e")
                });
                p += "\x3c/div\x3e";
                m.autoSize = !0;
                a.map.addPopup(m);
                m.updateSize();
                $("#right_pointNameInfo").append(p);
                $("#markName").text(e.NAME || e.\u540d\u79f0);
                break;
            case "publicservice":
                m = new OpenLayers.Popup.FramedCloud("\u641c\u7d22", g, null, '\x3cdiv id\x3d"poi_pop_info" style \x3d "min-height:90px;width:333px;font-size:12px;"\x3e\x3cdiv id \x3d "mark_title"\x3e\x3cdiv id\x3d"markName" style\x3d"padding-left:10px;font-size:14px;color:#3b9cfe;font-weight:700;margin-top:-2px;"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id \x3d "pointPopupContent" style \x3d "margin-top:10px;display:block"\x3e\x3cdiv id\x3d"right_pointNameInfo"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e', null, !0, d),
                p = "\x3cdiv class\x3d'resource_detail'\x3e",
                $.each(e,
                function(a) {
                    "OBJECTID" != a.toUpperCase() && "NAME" != a.toUpperCase() && 0 > a.toUpperCase().indexOf("SHAPE") && (p += a + ":" + e[a] + "\x3cbr/\x3e")
                }),
                p += "\x3c/div\x3e",
                m.autoSize = !0,
                a.map.addPopup(m),
                m.updateSize(),
                $("#right_pointNameInfo").append(p),
                $("#markName").text(e.NAME || e.\u540d\u79f0)
            }
            l = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(g.lon, g.lat), e);
            $("#tabs ul").idTabs();
            $("#tabs-li3 a").click();
            m.updateSize();
            f()
        },
        close: d,
        clear: function() {
            a.graLayer.removeAllFeatures()
        },
        resize: function() {
            m.updateSize();
            m.panIntoView()
        }
    }
} (),
MeasureTool = function() {
    var b = !1,
    c = [];
    return {
        init: function(e) {
            if (!b) {
                "object" == typeof e ? $(e).append("\x3cli class\x3d'toolbagClass' id\x3d'btnMeasureLine'\x3e\x3cspan class\x3d'btnToolbar-cont1'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: 0 0;top:7px;width:20px;'\x3e\x3c/span\x3e\u6d4b\u8ddd\x3c/span\x3e\x3c/li\x3e\x3cli class\x3d'toolbagClass' id\x3d'btnMeasurePolygon'\x3e\x3cspan class\x3d'btnToolbar-cont1'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -20px 0;top:4px;width:20px;'\x3e\x3c/span\x3e\u6d4b\u9762\x3c/span\x3e\x3c/li\x3e") : $("#" + e).append("\x3cli class\x3d'toolbagClass' id\x3d'btnMeasureLine'\x3e\x3cspan class\x3d'btnToolbar-cont1'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: 0 0;top:7px;width:20px;'\x3e\x3c/span\x3e\u6d4b\u8ddd\x3c/span\x3e\x3c/li\x3e\x3cli class\x3d'toolbagClass' id\x3d'btnMeasurePolygon'\x3e\x3cspan class\x3d'btnToolbar-cont1'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -20px 0;top:4px;width:20px;'\x3e\x3c/span\x3e\u6d4b\u9762\x3c/span\x3e\x3c/li\x3e");
                e = new OpenLayers.Style;
                e.addRules([new OpenLayers.Rule({
                    symbolizer: {
                        Point: {
                            pointRadius: 5,
                            fillColor: "white",
                            fillOpacity: 1,
                            strokeWidth: 2,
                            strokeOpacity: 1,
                            strokeColor: "#FF0000"
                        },
                        Line: {
                            strokeWidth: 3,
                            strokeOpacity: .5,
                            strokeColor: "red",
                            strokeDashstyle: "solid"
                        },
                        Polygon: {
                            strokeWidth: 3,
                            strokeOpacity: .5,
                            strokeColor: "red",
                            fillColor: "white",
                            fillOpacity: .3
                        }
                    }
                })]);
                var f = new OpenLayers.StyleMap({
                    "default": e
                }),
                h = OpenLayers.Util.getParameters(window.location.href).renderer,
                h = h ? [h] : OpenLayers.Layer.Vector.prototype.renderers;
                e = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
                    persist: !0,
                    geodesic: !0,
                    handlerOptions: {
                        layerOptions: {
                            renderers: h,
                            styleMap: f
                        }
                    }
                });
                e.events.on({
                    measure: function(b) {
                        var a = b.geometry,
                        d = a.components.length,
                        e = b.units;
                        b = b.measure;
                        var l = a.components[d - 1].x,
                        f = a.components[d - 1].y,
                        m = this.map.getResolution();
                        this.handler.layer.addFeatures([new OpenLayers.Feature.Vector(a.components[d - 1])]);
                        var a = new OpenLayers.LonLat(l + 2 * m, f + 22 * m),
                        d = "",
                        r = null,
                        p = OpenLayers.Function.bind(function(a) {
                            r = this.map.getLayer(a);
                            for (var b = this.lengthPopup.length - 1; 0 <= b; b--) try {
                                h = this.lengthPopup[b],
                                h.id == a && this.map.removePopup(h)
                            } catch(w) {}
                            r && r.destroyFeatures();
                            this.handler.point = null;
                            this.handler.line = null;
                            try {
                                that.map.removeLayer(r),
                                c.remove(x)
                            } catch(w) {}
                        },
                        this, this.handler.layer.id),
                        e = "km" == e ? "\u516c\u91cc": "\u7c73",
                        l = this.handler.layer.id.replace(/\./g, "") + "measureLine",
                        d = '\x3cdiv\x3e\x3clabel unselectable\x3d"on" style\x3d"float:left; display: inline; cursor: inherit; background-color: rgb(255, 255, 255); border: 1px solid rgb(255, 1, 3); padding: 3px 5px; white-space: nowrap; font-style: normal; font-variant: normal; font-weight: normal; font-size: 12px; line-height: normal; font-family: arial, simsun; z-index: 85; color: rgb(51, 51, 51); -webkit-user-select: none;"\x3e\u603b\u957f\uff1a\x3cspan\x3e' + b.toFixed(2) + "\x3c/span\x3e" + e + '\x3c/label\x3e\x3cdiv style\x3d"float:left; margin: 0px; padding: 0px; width: 12px; height: 12px; overflow: hidden;"\x3e\x3cimg src\x3d"images/measure/close.png" id\x3d"' + l + '" class\x3d"celianClose"\x3e\x3c/div\x3e\x3c/div\x3e',
                        h = new OpenLayers.Popup.Anchored(this.handler.layer.id, a, null, d, {
                            size: new OpenLayers.Size(15, 10),
                            offset: new OpenLayers.Pixel(0, 0)
                        },
                        !1, p);
                        h.calculateNewPx = function(a) {
                            a = a.offset(this.anchor.offset);
                            a.y += this.anchor.size.h;
                            a.x += this.anchor.size.w;
                            return a
                        };
                        h.contentDiv.className = "olAnchoredPopupContent";
                        h.autoSize = !0;
                        h.minSize = new OpenLayers.Size(300, 24);
                        h.opacity = "1";
                        h.backgroundColor = "#fff";
                        h.backgroundColor = null;
                        this.map.addPopup(h);
                        var x = this.handler.layer.clone();
                        x.id = this.handler.layer.id;
                        c.push(x);
                        sdMap.map.addLayer(x);
                        var y = this.handler.layer.id;
                        $("#" + l).unbind("click").click(function() {
                            p(y)
                        });
                        $(".celianClose").css("cursor", "pointer");
                        this.lengthPopup || (this.lengthPopup = []);
                        this.lengthPopup.push(h);
                        this.handler.measureDistance = null;
                        this.map.getControl("measureLineControl").deactivate();
                        this.oldmousepop = b.toFixed(2) + e;
                        $("div.olMap").css({
                            cursor: "default"
                        })
                    },
                    measurepartial: function(b) {
                        var a = b.geometry,
                        c = a.components.length,
                        d = a.components[c - 1].x,
                        c = a.components[c - 1].y;
                        this.getBestLength(a);
                        a = this.map.getResolution();
                        this.handler.layer.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(d, c))]);
                        a = new OpenLayers.LonLat(d + 2 * a, c + 22 * a);
                        a.add(d, c);
                        d = b.units;
                        b = b.measure;
                        d = "km" == d ? "\u516c\u91cc": "\u7c73";
                        this.newmousepop = d = "0.00" == b.toFixed(2) ? "\u8d77\u70b9": b.toFixed(2) + d;
                        b = '\x3clabel style\x3d"border:medium none;padding:0px;background-color:#fff;display:inline;font:12px arial,simsun;wite-space:nowrap;color:#333;white-space:nowrap;"\x3e\x3cspan style\x3d"width:5px;height:17px;position:absolute;display:block;background-image:url(\'images/measure/dis_box_01.gif\');background-attachment:scroll;background-repeat:no-repeat;background-position-x:left;background-position-y:top;background-color:transparent;"\x3e\x3cspan style\x3d"left:5px;color:#7a7a7a;line-height:17px;padding: 0px 4px 1px 0px;position:absolute;background:url(\'images/measure/dis_box_01.gif\') no-repeat scroll right top transparent;"\x3e' + d + "\x3c/span\x3e\x3c/span\x3e\x3c/label\x3e";
                        d = OpenLayers.Util.getRenderedDimensions("\x3cspan style\x3d\"left:5px;color:#7a7a7a;line-height:17px;padding: 0px 4px 1px 0px;position:relative;background:url('images/measure/dis_box_01.gif') no-repeat scroll right top transparent;\"\x3e" + d + "\x3c/span\x3e", null, {});
                        d.h = 17;
                        d.w += 5;
                        a = new OpenLayers.Popup.AnchoredPopup(this.handler.layer.id, a, d, b, {
                            size: new OpenLayers.Size(15, 10),
                            offset: new OpenLayers.Pixel(0, 0)
                        },
                        !1, null);
                        a.calculateNewPx = function(a) {
                            a = a.offset(this.anchor.offset);
                            a.y += this.anchor.size.h;
                            a.x += this.anchor.size.w;
                            return a
                        };
                        a.minSize = d;
                        a.opacity = "1";
                        a.backgroundColor = null;
                        this.oldmousepop == this.newmousepop ? this.oldmousepop = this.newmousepop = null: this.map.addPopup(a);
                        this.lengthPopup || (this.lengthPopup = []);
                        this.lengthPopup.push(a)
                    }
                });
                e.id = "measureLineControl";
                f = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
                    persist: !0,
                    geodesic: !0,
                    handlerOptions: {
                        layerOptions: {
                            renderers: h,
                            styleMap: f
                        }
                    }
                });
                f.events.on({
                    measure: function(b) {
                        var a = b.geometry,
                        d = a.components[0].components.length,
                        e = b.units;
                        b = b.measure;
                        var l = a.components[0].components[d - 2].x,
                        a = a.components[0].components[d - 2].y,
                        d = this.map.getResolution(),
                        l = new OpenLayers.LonLat(l + 2 * d, a + 22 * d),
                        a = "",
                        e = "km" == e ? "\u5e73\u65b9\u516c\u91cc": "\u5e73\u65b9\u7c73",
                        a = "\u603b\u9762\u79ef:" + b.toFixed(2) + e,
                        f = OpenLayers.Function.bind(function(a) {
                            for (var b = this.map.getLayer(a), d = this.lengthPopup.length - 1; 0 <= d; d--) try {
                                m = this.lengthPopup[d],
                                m.id == a && this.map.removePopup(m)
                            } catch(t) {}
                            b && b.destroyFeatures();
                            this.handler.point = null;
                            this.handler.line = null;
                            this.handler.polygon = null;
                            try {
                                that.map.removeLayer(b),
                                c.remove(h)
                            } catch(t) {}
                        },
                        this, this.handler.layer.id);
                        this.handler.removePoint();
                        var d = this.handler.layer.id.replace(/\./g, "") + "measureArea",
                        a = '\x3cdiv\x3e\x3clabel class\x3d" unselectable\x3d"on" style\x3d"float:left; display: inline; cursor: inherit; background-color: rgb(255, 255, 255); border: 1px solid rgb(255, 1, 3); padding: 3px 5px; white-space: nowrap; font-style: normal; font-variant: normal; font-weight: normal; font-size: 12px; line-height: normal; font-family: arial, simsun; z-index: 85; color: rgb(51, 51, 51); -webkit-user-select: none;"\x3e\u603b\u9762\u79ef\uff1a\x3cspan\x3e' + b.toFixed(2) + "\x3c/span\x3e" + e + '\x3c/label\x3e\x3cdiv style\x3d"float:left; margin: 0px; padding: 0px; width: 12px; height: 12px; overflow: hidden;"\x3e\x3cimg  src\x3d"images/measure/close.png" id\x3d"' + d + '" class\x3d"celianClose"\x3e\x3c/div\x3e\x3c/div\x3e',
                        m = new OpenLayers.Popup.Anchored(this.handler.layer.id, l, null, a, {
                            size: new OpenLayers.Size(15, 10),
                            offset: new OpenLayers.Pixel(0, 0)
                        },
                        !1, f);
                        m.calculateNewPx = function(a) {
                            a = a.offset(this.anchor.offset);
                            a.y += this.anchor.size.h;
                            a.x += this.anchor.size.w;
                            return a
                        };
                        m.contentDiv.className = "olAnchoredPopupContent";
                        m.autoSize = !0;
                        m.minSize = new OpenLayers.Size(300, 24);
                        m.opacity = "1";
                        m.backgroundColor = "#fff";
                        m.backgroundColor = null;
                        this.map.addPopup(m);
                        var h = this.handler.layer.clone();
                        h.id = this.handler.layer.id;
                        c.push(h);
                        sdMap.map.addLayer(h);
                        var p = this.handler.layer.id;
                        $("#" + d).click(function() {
                            f(p)
                        });
                        $(".celianClose").css("cursor", "pointer");
                        this.lengthPopup || (this.lengthPopup = []);
                        this.lengthPopup.push(m);
                        this.handler.measureDistance = null;
                        this.map.getControl("measurePolygonControl").deactivate();
                        $("div.olMap").css({
                            cursor: "default"
                        })
                    },
                    measurepartial: function(b) {}
                });
                f.id = "measurePolygonControl";
                sdMap.map.addControl(e);
                sdMap.map.addControl(f);
                $("#btnMeasureLine").click(function(b) {
                    $("#toolbag_div").css("display", "none");
                    sdMap.map.getControl("measurePolygonControl").deactivate();
                    sdMap.map.getControl("measureLineControl").activate();
                    $("div.olMap").css({
                        cursor: "url('images/Line.cur'),auto"
                    })
                });
                $("#btnMeasurePolygon").click(function(b) {
                    $("#toolbag_div").css("display", "none");
                    sdMap.map.getControl("measureLineControl").deactivate();
                    sdMap.map.getControl("measurePolygonControl").activate();
                    $("div.olMap").css({
                        cursor: "url('images/Line.cur'),auto"
                    })
                });
                b = !0
            }
        },
        clear: function() {
            if (0 < c.length) for (var b = c.length; b--; 0 < b) {
                var f = c[b];
                f.removeAllFeatures();
                sdMap.map.removeLayer(f)
            }
            c = []
        }
    }
} (),
MapSwitch = function() {
    var b = !1,
    c;
    return {
        init: function(e, f) {
            b || (c = f, "object" == typeof e ? $(e).append("\x3cdiv id\x3d'vec_' title\x3d'\u5730\u56fe' class\x3d'active'\x3e    \u5730 \u56fe\x3c/div\x3e\x3cdiv id\x3d'img_' title\x3d'\u5f71\u50cf'\x3e    \u5f71 \u50cf    \x3c/div\x3e    \x3cdiv id\x3d'img_year_div'\x3e\x3cdiv class\x3d'switch_zj'\x3e\x3cinput id\x3d'zjshow' type\x3d'checkbox' checked\x3d'checked'/\x3e\x3clabel\x3e\u6ce8\u8bb0\x3c/label\x3e\x3c/div\x3e\x3c/div\x3e") : $("#" + e).append("\x3cdiv id\x3d'vec_' title\x3d'\u5730\u56fe' class\x3d'active'\x3e    \u5730 \u56fe\x3c/div\x3e\x3cdiv id\x3d'img_' title\x3d'\u5f71\u50cf'\x3e    \u5f71 \u50cf    \x3c/div\x3e    \x3cdiv id\x3d'img_year_div'\x3e\x3cdiv class\x3d'switch_zj'\x3e\x3cinput id\x3d'zjshow' type\x3d'checkbox' checked\x3d'checked'/\x3e\x3clabel\x3e\u6ce8\u8bb0\x3c/label\x3e\x3c/div\x3e\x3c/div\x3e"), $("#img_").click(function(b) {
                $(this).addClass("active");
                $("#vec_").removeClass("active");
                $("#img_year_div").show();
                $(".olControlScaleLineTop").css({
                    border: "solid 2px white",
                    "border-top": "none",
                    color: "white"
                });
                $(".olControlScaleLineBottom").css({
                    border: "solid 2px white",
                    "border-bottom": "none",
                    color: "white"
                });
                $(".number_year").removeClass("active");
                c.tileLayerManager.switchMap("img", Bzj)
            }), $("#vec_").click(function(b) {
                $("#img_year_div").hide();
                $(this).addClass("active");
                $("#img_").removeClass("active");
                $(".olControlScaleLineTop").css({
                    border: "solid 2px black",
                    "border-top": "none",
                    color: "black"
                });
                $(".olControlScaleLineBottom").css({
                    border: "solid 2px black",
                    "border-bottom": "none",
                    color: "black"
                });
                c.tileLayerManager.switchMap("vec", !0)
            }), $("#img_").mouseenter(function(b) {
                $(this).hasClass("active") && $("#img_year_div").show()
            }), $("#img_year_div").mouseleave(function(b) {
                $("#img_year_div").hide()
            }), $("#zjshow").click(function(b) {
                $(this)[0].checked ? (c.tileLayerManager.setVisibility("img_n", !0), Bzj = !0) : (c.tileLayerManager.setVisibility("img_n", !1), Bzj = !1)
            }), b = !0)
        }
    }
} (),
RegionSwitch = function() {
    function b(a) {
        a = eval(a);
        for (var b = a.length,
        c = [], d = 0; d < b; d++) {
            var e = a[d];
            c.push("\x3ctr shi\x3d'" + e[0] + "'\x3e");
            c.push("\x3ctd  class\x3d'mayerTitle' \x3e\x3ca\x3e" + e[0] + "\x3c/a\x3e\x3c/td\x3e");
            for (var g = 1; g < e.length; g++) 0 == (g - 1) % 6 && 1 != g && c.push("\x3c/tr\x3e\x3ctr shi\x3d'" + e[0] + "'\x3e\x3ctd  class\x3d'mayerTitle' \x3e\x3c/td\x3e"),
            c.push("\x3ctd \x3e\x3ca href\x3d'javascript:void(0);'\x3e" + e[g] + "\x3c/a\x3e\x3c/td\x3e");
            c.push("\x3c/tr\x3e")
        }
        $("#cityTable").html(c.join(""))
    }
    function c() {
        $("#dict_text").removeClass("active");
        $("#dictDiv").css("display", "none")
    }
    function e(a) {
        a = a || window.event;
        0 == $(a.target).closest("#dict").length && (c(), $(document).unbind("click", e))
    }
    function f() {
        p && h()
    }
    function h() {
        if (!v) {
            $("#dictInfo").css("display", "none");
            var a = l.map.getCenter(),
            b = l.map.getScale();
            $.ajax({
                dataType: "xml",
                url: Service.CitySearch + "lon\x3d" + a.lon + "\x26lat\x3d" + a.lat + "\x26scale\x3d" + b,
                success: function(a) {
                    a = a.getElementsByTagName("string");
                    var b = a[0].firstChild.nodeValue,
                    c = b.split(",");
                    1 == c.length ? $("#dict_text").text(b) : 2 == c.length ? $("#dict_text").text(c[1]) : 3 == c.length ? $("#dict_text").text(c[1] + "\x3e" + c[2]) : $("#dict_text").text(a[0].firstChild.nodeValue.replace(/,/g, "\x3e"))
                }
            })
        }
    }
    function d(b, c) {
        var d = c ? 2 : 1,
        d = Service.CityBound + "cityName\x3d" + encodeURIComponent(b) + "\x26ways\x3d" + d + "\x26countryName\x3d" + encodeURIComponent(c) + "\x26provinceName\x3d" + encodeURIComponent("\u5c71\u4e1c\u7701");
        $.ajax({
            dataType: "xml",
            url: d,
            success: function(d) {
                var e = d.getElementsByTagName("Shape");
                if (isIE = -1 != navigator.userAgent.indexOf("MSIE")) {
                    var p = d.getElementsByTagName("LinkName")[0].text,
                    f = d.getElementsByTagName("Description")[0].text;
                    d = d.getElementsByTagName("LinkURL")[0].text
                } else p = $(d.getElementsByTagName("LinkName")).text(),
                f = $(d.getElementsByTagName("Description")).text(),
                d = $(d.getElementsByTagName("LinkURL")).text();
                $("#dictInfoTitle").text(p);
                $("#dictInfoText").text(f);
                $("#linkId").attr("href", d);
                e = e[0].childNodes[0].data;
                "" != c ? $("#dict_text").text(b + "\x3e" + c) : $("#dict_text").text(b);
                a(e);
                v = !0;
                l.map.zoomToExtent(q.getDataExtent());
                setTimeout(function() {
                    v = !1
                },
                500);
                r = 1;
                m = setInterval(g, 600);
                x = setTimeout(function() {
                    q.removeAllFeatures()
                },
                1E4);
                setTimeout(function() {
                    $("#dictInfo").click()
                },
                500);
                setTimeout(function() {
                    $("#dictInfoClose").click()
                },
                3E3)
            }
        })
    }
    function a(a) {
        var b = "{rings:[";
        a = a.substring(a.indexOf("(") + 1, a.lastIndexOf(")")).replace(/(\({2})/g, "(");
        a = a.replace(/(\){2})/g, ")");
        a = a.replace(/\(/g, "[").replace(/\)/g, "]");
        a = a.replace(/([\d\.]+)\s([\d\.]+)/g, "[$1,$2]");
        b = eval("(" + (b + a + "]}") + ")");
        q.removeAllFeatures();
        a = [];
        for (var c = 0; c < b.rings.length; c++) {
            for (var d = [], e = 0; e < b.rings[c].length; e++) {
                var g = new OpenLayers.Geometry.Point(b.rings[c][e][0], b.rings[c][e][1]);
                d.push(g)
            }
            d = new OpenLayers.Geometry.LinearRing(d);
            d = new OpenLayers.Geometry.Polygon([d]);
            a[c] = new OpenLayers.Feature.Vector(d)
        }
        q.addFeatures(a);
        q.redraw()
    }
    function g() {
        if (1 == r) {
            for (var a = 0; a < q.features.length; a++) q.features[a].style.fillColor = "green",
            q.features[a].style.fillOpacity = .6,
            q.redraw(!0);
            r += 1
        } else if (2 == r) {
            for (a = 0; a < q.features.length; a++) q.features[a].style.fillColor = "blue",
            q.features[a].style.fillOpacity = .6,
            q.redraw(!0);
            r += 1
        } else if (3 == r) {
            for (a = 0; a < q.features.length; a++) q.features[a].style.fillColor = "green",
            q.features[a].style.fillOpacity = .6,
            q.redraw(!0);
            r += 1
        } else if (4 == r) {
            for (a = 0; a < q.features.length; a++) q.features[a].style.fillOpacity = 0,
            q.redraw(!0);
            r += 1
        } else clearTimeout(m)
    }
    var n = !1,
    l, q, m, r, p = !0,
    v = !1,
    x;
    return {
        init: function(a, g) {
            if (!n) {
                l = g;
                "object" == typeof a ? $(a).append("\x3cdiv id\x3d'dictInfo'title\x3d'\u70b9\u51fb\u67e5\u770b\u8be6\u60c5'\x3e\x3cdiv id\x3d'dictInfoDiv'\x3e\x3cdiv id\x3d'dictInfoTitle'\x3e\u5c71\u4e1c\u7701\x3c/div\x3e\x3cdiv id\x3d'dictInfoText'\x3e\x3c/div\x3e\x3cdiv id\x3d'dictInfoClose'\x3e\x3c/div\x3e\x3ca id\x3d'linkId'target\x3d'_blank'style\x3d'color:blue;margin-left: 250px;'\x3e\u8be6\u60c5\u94fe\u63a5\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'clear:both'\x3e\x3c/div\x3e\x3cdiv id\x3d'dictDiv'\x3e\x3cdiv id\x3d'dict_list_title'\x3e\x3ca class\x3d'sheng'\x3e\u5c71\u4e1c\u7701\x3c/a\x3e\x3cdiv id\x3d'dict_close'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d'dict_item'\x3e\x3ctable border\x3d'0' cellspacing\x3d'0' cellpadding\x3d'0' width\x3d'100%' id\x3d'cityTable'\x3e\x3c/table\x3e\x3c/div\x3e\x3c/div\x3e") : $("#" + a).append("\x3cdiv id\x3d'dictInfo'title\x3d'\u70b9\u51fb\u67e5\u770b\u8be6\u60c5'\x3e\x3cdiv id\x3d'dictInfoDiv'\x3e\x3cdiv id\x3d'dictInfoTitle'\x3e\u5c71\u4e1c\u7701\x3c/div\x3e\x3cdiv id\x3d'dictInfoText'\x3e\x3c/div\x3e\x3cdiv id\x3d'dictInfoClose'\x3e\x3c/div\x3e\x3ca id\x3d'linkId'target\x3d'_blank'style\x3d'color:blue;margin-left: 250px;'\x3e\u8be6\u60c5\u94fe\u63a5\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'clear:both'\x3e\x3c/div\x3e\x3cdiv id\x3d'dictDiv'\x3e\x3cdiv id\x3d'dict_list_title'\x3e\x3ca class\x3d'sheng'\x3e\u5c71\u4e1c\u7701\x3c/a\x3e\x3cdiv id\x3d'dict_close'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d'dict_item'\x3e\x3ctable border\x3d'0' cellspacing\x3d'0' cellpadding\x3d'0' width\x3d'100%' id\x3d'cityTable'\x3e\x3c/table\x3e\x3c/div\x3e\x3c/div\x3e");
                l.map.events.on({
                    moveend: f,
                    click: function() {
                        c()
                    }
                });
                $.ajax({
                    url: "proxy/proxy.ashx?http://www.sdmap.gov.cn/dat/cities.txt",
                    dataType: "text",
                    success: b,
                    error: function(a, b, c) {
                        console.log && console.log("request cities data failed ! " + b)
                    }
                });
                var p = OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style["default"]);
                p.fillOpacity = 0;
                p.strokeColor = "blue";
                p.fillColor = "blue";
                p.strokeWidth = 2;
                p.strokeDashstyle = "dot";
                q = new OpenLayers.Layer.Vector("\u884c\u653f\u5b9a\u4f4d", {
                    style: p
                });
                l.addLayer(q);
                $("#dict_text").click(function() {
                    $(this).hasClass("active") ? c() : ($("#dictDiv").css("display", "block"), $(this).addClass("active"), $(document).bind("click", e))
                });
                $("#dict_close").click(function(a) {
                    c()
                });
                $(".sheng").click(function() {
                    $("#dictDiv").css("display", "none");
                    $("#dictInfoDiv").css("display", "none");
                    var a = new OpenLayers.LonLat(119, 36.4);
                    l.map.setCenter(a, 7)
                });
                $("#cityTable").on("click", "td",
                function() {
                    "" != $(this).text() && ($("#dictDiv").css("display", "none"), $("#dictInfo").css("display", "block"), $("#dictInfoDiv").css("display", "none"), $(this).hasClass("mayerTitle") ? (d($(this).text(), ""), $("#dict_text").text($(this).text())) : d($(this).parent().attr("shi"), $(this).text()), $("#dict_text").removeClass("active"))
                });
                $("#dictInfoClose").click(function(a) {
                    $("#dictInfoDiv").animate({
                        height: 0
                    },
                    "slow",
                    function() {
                        $(this).css({
                            display: "none",
                            height: "auto"
                        })
                    })
                });
                $("#dictInfo").click(function(a) {
                    "block" == $("#dictInfoDiv").css("display") ? $("#dictInfoDiv").css("display", "none") : ($("#dictInfoDiv").css("height", "auto"), a = $("#dictInfoDiv").height(), $("#dictInfoDiv").css("display", "block"), $("#dictInfoDiv").css("height", "0px"), $("#dictInfoDiv").animate({
                        height: a
                    },
                    "slow",
                    function(a) {}))
                });
                n = !0
            }
        },
        clear: function() {
            q.removeAllFeatures();
            x && (clearTimeout(x), x = null)
        },
        setActive: function(a) {
            p = !!a
        }
    }
} (),
Clean = function() {
    var b = !1;
    return {
        init: function(c) {
            b || ($("#btnClear").click(function(b) {
                $(".olPopup").css("display", "none");
                MeasureTool.clear();
                PoiInfoPop.clear();
                WidgetManger.reset();
                qsgk.clear()
            }), b = !0)
        }
    }
} (),
FullScreen = function() {
    var b = !1;
    return {
        init: function() {
            b || ($("#btnExtent").click(function(b) {
                $("#left_hidden").hasClass("show") || $("#left_hidden").click();
                b = $(window).height();
                $(this).hasClass("extent") ? ($(this).removeClass("extent"), $("#topDiv").show(), $("#left_center").css({
                    height: b - 100 + "px",
                    top: "100px"
                }).attr("data-calc-height", "100%-100"), $(this).html("\x3cspan class\x3d'btnToolbar-cont'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -128px 0;'\x3e\x3c/span\x3e\u5168\u5c4f\x3c/span\x3e"), $(this).css("width", "54px"), $("#left_hidden").click()) : ($("#topDiv").hide(), $("#left_center").css({
                    height: "100%",
                    top: "0"
                }).attr("data-calc-height", "100%-0"), $(this).addClass("extent"), $(this).css("width", "90px"), $(this).html("\x3cspan class\x3d'btnToolbar-cont'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -128px 0;'\x3e\x3c/span\x3e\u9000\u51fa\u5168\u5c4f\x3c/span\x3e"));
                setInterval(function() {
                    $(window).resize()
                },
                500);
                sdMap.map.updateSize()
            }), b = !0)
        }
    }
} (),
PrintMapTool = function() {
    var b = null,
    c = !1;
    return {
        init: function(e, f) {
            c || ("object" == typeof e ? $(e).append("\x3cli class\x3d'toolbagClass' id\x3d'btnPrintDiv'\x3e\x3cspan class\x3d'btnToolbar-cont1'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -60px 0;top:3px;width:20px;'\x3e\x3c/span\x3e\u6253\u5370\x3c/span\x3e\x3c/li\x3e") : $("#" + e).append("\x3cli class\x3d'toolbagClass' id\x3d'btnPrintDiv'\x3e\x3cspan class\x3d'btnToolbar-cont1'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -60px 0;top:3px;width:20px;'\x3e\x3c/span\x3e\u6253\u5370\x3c/span\x3e\x3c/li\x3e"), b = f.map, $("#btnPrintDiv").click(function(c) {
                $("#toolbag_div").css("display", "none");
                var d = b.getSize().w,
                a = b.getSize().h;
                c = window.open("");
                var e = document.getElementById("mapDiv").innerHTML,
                f = parseInt(a) - 10,
                d = "\x3clink rel\x3d'stylesheet' type\x3d'text/css' href\x3d'third/jstree/themes/default/style.css' /\x3e\x3clink href\x3d'Openlayers/theme/default/style.css' rel\x3d'stylesheet' type\x3d'text/css' /\x3e \x3cstyle type\x3d\"text/css\"\x3e.olImageLoadError{background-color: pink; opacity: 0!important; filter: alpha(opacity\x3d0)!important;}.print-container {margin: auto;width:" + d + "px;height:" + a + "px;top: 50px;position: relative;}.geoD {width: 100%;height: 24px;line-height: 24px;border-bottom: 3px solid #B2B2B2;font-size: 14px;margin-bottom: 6px;font-weight:bold;}.geoTitle {width: 300px;height: 20px;line-height: 20px;font-size: 14px;border:none;}",
                d = d + "#mapDiv {position: relative;height:" + f + "px;margin-bottom: 15px;clear: both;}",
                d = d + '#geoft {content: ".";height: 77px;display: block;overflow: hidden;clear: both;}',
                d = d + ".printMap {margin-bottom: 20px;float: right;}",
                d = d + ".printMap span {background-position: 0px 0px;cursor: pointer;margin-right: 0px;margin-top: 5px;display: inline-block;width: 69px;height: 29px;background-image: url(images/ToolBar/print.png);}",
                d = d + "\x3c/style\x3e";
                foot = "\x3c/head\x3e\x3cscript type\x3d'text/javascript'src\x3d'js/util.min.js'\x3e\x3c/script\x3e\x3cbody\x3e\x3cdiv class\x3d'print-container'\x3e\x3cdiv class\x3d'geoD'\x3e\u6807\u9898\uff1a\x3cinput class\x3d'geoTitle' value\x3d'\u8bf7\u8f93\u5165\u6807\u9898\u4fe1\u606f\uff0c\u70b9\u51fb\u8f93\u5165''\x3e\x3c/input\x3e\x3c/div\x3e\x3cdiv id\x3d'mapDiv' \x3e" + e + "\x3c/div\x3e\x3cdiv id\x3d'geoft'\x3e\x3cdiv class\x3d'printMap'\x3e";
                foot += "\x3cspan id\x3d'printMap' onclick \x3d 'printDiv()'\x3e\x3c/span\x3e";
                foot += "\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/body\x3e\x3c/html\x3e";
                c.document.write("\x3c!DOCTYPE html\x3e\x3chtml\x3e\x3chead\x3e\x3cMETA HTTP-EQUIV\x3d'pragma' CONTENT\x3d'no-cache'\x3e\x3cMETA HTTP-EQUIV\x3d'Cache-Control' CONTENT\x3d'no-cache, must-revalidate'\x3e\x3cMETA HTTP-EQUIV\x3d'expires' CONTENT\x3d'Wed, 26 Feb 1997 08:21:57 GMT'\x3e\x3cmeta http-equiv\x3d'Content-Type' content\x3d'text/html; charset\x3dutf-8' /\x3e\x3cmeta name\x3d'viewport' content\x3d'width\x3ddevice-width, initial-scale\x3d1.0, maximum-scale\x3d1.0, user-scalable\x3d0' /\x3e\x3cmeta name\x3d'apple-mobile-web-app-capable' content\x3d'yes' /\x3e\x3ctitle\x3e\u5730\u56fe\u6253\u5370\x3c/title\x3e" + d + "\x3cscript type \x3d 'text/javascript'\x3e\nfunction printDiv(){var divObj \x3d document.getElementById('printMap');divObj.style.display \x3d 'none';window.print();divObj.style.display \x3d 'block';}\x3c/script\x3e" + foot);
                DynamicLoading.css("css.min/style.min.css", c);
                c.document.close()
            }), c = !0)
        }
    }
} (),
CopyRightTool = function() {
    return {
        init: function(b) {
            b.map.events.on({
                zoomend: function(c) {
                    c = c.object.getZoom();
                    7 > c ? $("#" + b.map.div.id + "_remark").text("\u5ba1\u56fe\u53f7:GS(2014)6032\u53f7(\u7248\u6743:\u56fd\u5bb6\u6d4b\u7ed8\u5730\u7406\u4fe1\u606f\u5c40)") : 14 > c ? $("#" + b.map.div.id + "_remark").text("\u5ba1\u56fe\u53f7:GS(2014)6032\u53f7(\u7248\u6743:\u56fd\u5bb6\u6d4b\u7ed8\u5730\u7406\u4fe1\u606f\u5c40) \u9c81SG(2015)088\u53f7(\u7248\u6743:\u5c71\u4e1c\u7701\u56fd\u571f\u8d44\u6e90\u5385)") : $("#" + b.map.div.id + "_remark").text("\u5ba1\u56fe\u53f7:\u9c81SG(2015)088\u53f7(\u7248\u6743:\u5c71\u4e1c\u7701\u56fd\u571f\u8d44\u6e90\u5385)")
                }
            })
        }
    }
} (),
dataCollect = function() {
    function b(a) {
        a = new OpenLayers.Pixel(a.xy.x, a.xy.y);
        a = h.getLonLatFromPixel(a);
        e(a)
    }
    function c() {
        null != h.widgetPop && h.removePopup(h.widgetPop)
    }
    function e(a) {
        var b = h.getExtent(),
        b = b.left + "," + b.bottom + "," + b.right + "," + b.top,
        c = '{"x":' + a.lon + ',"y":' + a.lat + "}",
        d = h.size,
        b = {
            imageDisplay: d.w + "," + d.h + ",96",
            sr: h.getProjection().split(":")[1],
            mapExtent: b,
            geometry: c,
            layers: "all:0",
            geometryType: "esriGeometryPoint",
            returnGeometry: !1,
            tolerance: 15,
            f: "json"
        },
        c = Service.ident + "/identify";
        jQuery.support.cors = !0;
        $.ajax({
            data: b,
            method: "POST",
            url: c,
            success: function(b) {
                b = JSON.parse(b);
                null != b.results && 0 < b.results.length && f(b.results[0], a)
            },
            error: function(a, b, c) {}
        })
    }
    function f(a, b) {
        if (null != a) {
            c();
            var e = a.attributes.XZQDM;
            h.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", b, null, "\x3cdiv style\x3d'padding:0 5px;'\x3e\x3cdiv style \x3d 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'\x3e\x3cb\x3e" + a.attributes.XZQMC + "[" + e + "]\x3c/b\x3e \x3c/div\x3e\x3cdiv id\x3d'main' class\x3d'main'\x3e\x3c/div\x3e\x3c/div\x3e", null, !0,
            function() {
                c()
            });
            h.addPopup(h.widgetPop);
            $("#main").html("\x3cdiv class\x3d'div_left'\x3e\x3cinput id\x3d'i_lh'/\x3e\x3cbutton id\x3d'btn_u'\x3e\u63d0\u4ea4\x3c/button\x3e\x3c/div\x3e");
            $("#btn_u").click(function(a) {
                a = $("#i_lh").val();
                if (0 != a.replace(/(^s*)|(s*$)/g, "").length) {
                    var g = {
                        lh: a,
                        qh: e,
                        x: b.lon,
                        y: b.lat
                    };
                    JsonpRequest(Service.comHandl + "type\x3dcj", {
                        op: "ud",
                        param: JSON.stringify(g)
                    },
                    function(a) {
                        if ("0" == a.stat) alert("\u6570\u636e\u5e93\u9519\u8bef\uff01");
                        else {
                            a = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(b.lon, b.lat));
                            var e = OpenLayers.Util.extend({},
                            OpenLayers.Feature.Vector.style["default"]);
                            e.externalGraphic = "images/mark2/point4.png";
                            e.graphicWidth = 37;
                            e.graphicHeight = 33;
                            e.graphicYOffset = -16.5;
                            e.fillOpacity = 1;
                            e.cursor = "pointer";
                            e.label = g.lh;
                            e.labelYOffset = 20;
                            e.labelOutlineWidth = 2;
                            a.style = e;
                            a.attributes = g;
                            d.addFeatures(a)
                        }
                        c()
                    })
                } else alert("\u697c\u53f7\u5f97\u4e3a\u6570\u5b57!")
            })
        } else alert("\u6240\u5c5e\u6751\u5e84\u83b7\u53d6\u5931\u8d25!")
    }
    var h, d, a = inited = !1;
    return {
        init: function(a) {
            if (!inited) {
                h = a.map;
                var b = OpenLayers.Util.getParameters(window.location.href).renderer,
                c = new OpenLayers.StyleMap({
                    fillOpacity: 1,
                    pointRadius: 3
                });
                d = new OpenLayers.Layer.Vector("louLy", {
                    style: c,
                    renderers: b
                });
                a.addLayer(d, !1)
            }
        },
        dcollect: function() {
            a = !0;
            h.layerContainerDiv.style.cursor = "url(images/mark/point_edit.png),default";
            h.events.register("click", h, b)
        },
        scollect: function() {
            a = !1;
            d.removeAllFeatures();
            c();
            h.layerContainerDiv.style.cursor = null;
            h.events.unregister("click", h, b)
        },
        B: function() {
            return a
        }
    }
} (),
showFw = function() {
    function b(b) {
        null != h.widgetPop && h.removePopup(h.widgetPop);
        var c = b.feature;
        b = c.attributes;
        var d = b[4],
        e = b[0],
        g = b[5],
        f;
        "1" == b[3] ? JsonpRequest(Service.comHandl + "type\x3dcx", {
            op: "getzh",
            param: JSON.stringify({
                id: d
            })
        },
        function(a) {
            if ("0" == a.stat) alert("\u6570\u636e\u5e93\u9519\u8bef\uff01");
            else {
                f = "\x3ctable class\x3d'gridtable'\x3e\x3ctr\x3e\x3cth\x3e\u59d3\u540d\x3c/th\x3e\x3cth\x3e\u5173\u7cfb\x3c/th\x3e\x3cth\x3e\u8eab\u4efd\u8bc1\u53f7\x3c/th\x3e\x3c/tr\x3e";
                for (var b = "",
                c = 0; c < a.dat.length; c++) var d = a.dat[c],
                b = b + "\x3ctr\x3e\x3ctd\x3e" + d[0] + "\x3c/td\x3e\x3ctd\x3e" + d[1] + "\x3c/td\x3e\x3ctd\x3e" + d[2] + "\x3c/td\x3e\x3c/tr\x3e";
                f = f + b + "\x3c/table\x3e";
                $("#main").html(f)
            }
        }) : f = "";
        h.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", c.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style\x3d'padding:0 5px;'\x3e\x3cdiv style \x3d 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'\x3e\x3cb\x3e" + g + "[" + e + "\u53f7\u697c]\x3c/b\x3e\x3cbutton id\x3d'btn_del'\x3e\u5220\u9664\x3c/button\x3e\x3c/div\x3e\x3cdiv id\x3d'main' class\x3d'main_detail'\x3e\x3c/div\x3e\x3c/div\x3e", null, !0,
        function() {
            h.removePopup(h.widgetPop)
        });
        h.addPopup(h.widgetPop);
        $("#btn_del").click(function(b) {
            confirm("\u786e\u5b9a\u8981\u5220\u9664\u6570\u636e\u5417\uff1f") && JsonpRequest(Service.comHandl + "type\x3dcj", {
                op: "delFw",
                param: JSON.stringify({
                    id: d
                })
            },
            function(b) {
                "0" == b.stat ? alert("\u5220\u9664\u9519\u8bef\uff01") : (h.removePopup(h.widgetPop), a.removeFeatures(c))
            })
        })
    }
    function c() {
        var a = sdMap.map.getCenter(),
        b = h.getExtent(),
        b = b.left + "," + b.bottom + "," + b.right + "," + b.top,
        a = '{"x":' + a.lon + ',"y":' + a.lat + "}",
        c = h.size,
        b = {
            imageDisplay: c.w + "," + c.h + ",96",
            sr: h.getProjection().split(":")[1],
            mapExtent: b,
            geometry: a,
            layers: "all:0",
            geometryType: "esriGeometryPoint",
            returnGeometry: !1,
            tolerance: 15,
            f: "json"
        },
        a = Service.ident + "/identify";
        jQuery.support.cors = !0;
        $.ajax({
            data: b,
            method: "POST",
            url: a,
            success: function(a) {
                a = JSON.parse(a);
                null != a.results && 0 < a.results.length && (a = a.results[0].attributes.XZQDM, d != a && (d = a, e(d)))
            },
            error: function(a, b, c) {}
        })
    }
    function e(b) {
        JsonpRequest(Service.comHandl + "type\x3dcj", {
            op: "GetFbC",
            param: JSON.stringify({
                qh: b
            })
        },
        function(b) {
            a.removeAllFeatures();
            if ("0" != b.stat) for (var c = 0; c < b.dat.length; c++) {
                var d = b.dat[c],
                e = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(d[1], d[2])),
                g = OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style["default"]);
                g.fillColor = "0" == d[3] ? "#F90A0A": "#07F137";
                g.label = d[0] + "\n" + d[5];
                g.cursor = "pointer";
                g.fillOpacity = 1;
                g.pointRadius = 5;
                g.stroke = !1;
                g.labelSelect = !0;
                g.labelYOffset = 24;
                g.labelOutlineWidth = 6;
                g.labelOutlineColor = "#077CF3";
                g.fontColor = "white";
                e.style = g;
                e.attributes = d;
                a.addFeatures(e)
            }
        })
    }
    var f = !1,
    h, d, a;
    return {
        init: function(c) {
            if (!inited) {
                h = c.map;
                var d = OpenLayers.Util.getParameters(window.location.href).renderer,
                e = new OpenLayers.StyleMap({
                    fillOpacity: 1,
                    pointRadius: 3,
                    fillColor: "blue"
                });
                a = new OpenLayers.Layer.Vector("ly_s", {
                    style: e,
                    renderers: d
                });
                c.addLayer(a, !0);
                a.events.on({
                    featureselected: b
                })
            }
        },
        show: function() {
            f = !0;
            c();
            h.events.register("moveend", h, c)
        },
        hide: function() {
            f = !1;
            a.removeAllFeatures();
            d = null;
            h.events.unregister("moveend", h, c)
        },
        B: function() {
            return f
        },
        showFwbyCode: function(a) {
            e(a)
        },
        clear: function() {
            a.removeAllFeatures()
        }
    }
} (),
MapToolUI = function() {
    var b = !1;
    return {
        init: function(c) {
            if (!b) {
                var e = $("#toolDiv");
                e.append("    \x3cul style\x3d'margin:3px 0'\x3e        \x3cli id\x3d'btntool' class\x3d'btnToolbar'\x3e\x3cspan class\x3d'btnToolbar-cont'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -142px 0;'\x3e\x3c/span\x3e\u5de5\u5177\x3c/span\x3e           \x3cdiv id\x3d'toolbag_div' style\x3d'width: 60px; border: 1px solid #25abf3; background: #f4f9fd;display: none; color: #777777;margin-top:24px;'\x3e               \x3cul\x3e\x3c/ul\x3e        \x3c/li\x3e        \x3cli id\x3d'btnClear' class\x3d'btnToolbar'\x3e\x3cspan class\x3d'btnToolbar-cont'\x3e\x3cspan class\x3d'btnToolbar-img' style\x3d'background-position: -158px 0;'\x3e\x3c/span\x3e\u6e05\u9664\x3c/span\x3e\x3c/li\x3e        \x3cli id\x3d'vec_img'\x3e\x3c/li\x3e    \x3c/ul\x3e");
                var f = $("#btntool ul");
                MeasureTool.init(f);
                FullScreen.init();
                Clean.init(c);
                MapSwitch.init(e.find("#vec_img"), c);
                CopyRightTool.init(c);
                e.find("#btntool").mouseenter(function() {
                    $("#toolbag_div").css("display", "block")
                });
                e.find("#btntool").mouseleave(function() {
                    $("#toolbag_div").css("display", "none")
                });
                b = !0
            }
        }
    }
} ();
function WeatherWidget() {
    function b() {
        $.ajax({
            type: "GET",
            url: "proxy/proxy.ashx?http://flash.weather.com.cn/wmaps/xml/shandong.xml?64138/",
            datatype: "xml",
            success: function(a) {
                if (a && (a = a.getElementsByTagName("city"), null != a && 0 != a.length)) for (var b = 0,
                c = a.length; b < c; b++) {
                    for (var d = a[b].attributes, f = {},
                    m = 0, r = d.length; m < r; m++) f[d[m].name] = d[m].text ? d[m].text: d[m].textContent;
                    d = f;
                    m = e[d.cityname];
                    f = m.split(",")[0];
                    m = m.split(",")[1];
                    f = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(f, m));
                    m = OpenLayers.Util.extend({},
                    OpenLayers.Feature.Vector.style["default"]);
                    m.externalGraphic = "images/Weather/b_" + d.state1 + ".png";
                    m.graphicWidth = 57;
                    m.graphicHeight = 54;
                    m.fillOpacity = 1;
                    m.cursor = "pointer";
                    f.style = m;
                    f.attributes = d;
                    h.addFeatures(f)
                }
            },
            error: function(a, b) {
                console.log && console.log("\u5929\u6c14\u6570\u636e\u8bf7\u6c42" + b)
            }
        })
    }
    function c(a) {
        null != f.widgetPop && f.removePopup(f.widgetPop);
        a = a.feature;
        for (var b = parseInt(a.attributes.humidity.substr(0, a.attributes.humidity.length - 1)), c = Math.floor(b / 20), d = "\x3cdiv class\x3d'weather_bk'\x3e", e = 0; e < c; e++) d += "\x3cdiv class\x3d'weather_ubk'\x3e\x3c/div\x3e";
        b = (b - 20 * c) / 2;
        0 < b ? d += "\x3cdiv class\x3d'weather_ubk ' style\x3d'width:" + b + "px;margin-right:0;'\x3e\x3c/div\x3e": 5 == c && (d = d.substr(0, d.length - 7) + " style\x3d'margin-right:0'\x3e\x3c/div\x3e");
        d += "\x3c/div\x3e";
        f.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", a.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style\x3d'padding:0 5px;'\x3e\x3cdiv style \x3d 'position:relative; margin-bottom:15px;color:#3b9cfe;'\x3e\x3cb\x3e\u5929\u6c14\u72b6\u51b5\x3c/b\x3e \x3c/div\x3e \x3cdiv style\x3d'margin:10px 5px;'\x3e\x3cdiv style\x3d'float:left; '\x3e \x3cdiv style \x3d 'text-align: center;'\x3e" + a.attributes.cityname + "\x3c/div\x3e\x3cimg src\x3d'images/Weather/a_" + a.attributes.state1 + ".gif'\x3e\x3c/img\x3e\x3cdiv style \x3d 'text-align: center;'\x3e" + a.attributes.stateDetailed + "\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'padding-left:110px;line-height:1.5em;' \x3e\u6e29\u5ea6:\x26nbsp;" + a.attributes.tem1 + "~" + a.attributes.tem2 + "\u2103\x3cbr\x3e\u98ce:\x26nbsp;" + a.attributes.windState + "\x3cbr\x3e\u6e7f\u5ea6:\x26nbsp;" + d + a.attributes.humidity + "\x3cbr\x3e\u5b9e\u65f6\u6e29\u5ea6:\x26nbsp;" + a.attributes.temNow + "\u2103\x3cbr\x3e\u66f4\u65b0\u65f6\u95f4:\x26nbsp;" + a.attributes.time + "\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e", null, !0,
        function() {
            f.removePopup(f.widgetPop);
            f.unSelect()
        });
        a.popup = f.widgetPop;
        f.addPopup(f.widgetPop)
    }
    if (null != WeatherWidget.unique) return WeatherWidget.unique;
    WeatherWidget.unique = this;
    var e = {
        "\u6d4e\u5357": "116.982064247,36.682902373046",
        "\u5fb7\u5dde": "116.32242,37.432249",
        "\u804a\u57ce": "116.027043,36.47981",
        "\u6cf0\u5b89": "117.142239,36.221535",
        "\u6d4e\u5b81": "116.62678,35.423526",
        "\u83cf\u6cfd": "115.48461,35.244151",
        "\u6dc4\u535a": "118.019627,36.834141",
        "\u83b1\u829c": "117.648383,36.292486",
        "\u67a3\u5e84": "117.562787,34.802768",
        "\u4e34\u6c82": "118.336634,35.075951",
        "\u6ee8\u5dde": "117.985961,37.402161",
        "\u65e5\u7167": "119.504325,35.407683",
        "\u4e1c\u8425": "118.522883,37.433393",
        "\u6f4d\u574a": "119.146,36.716416",
        "\u9752\u5c9b": "120.397349,36.165004",
        "\u70df\u53f0": "121.317919,37.517425",
        "\u5a01\u6d77": "122.071352,37.483144"
    },
    f = null,
    h = null,
    d = !1;
    return {
        init: function(a, b, e) {
            h = new OpenLayers.Layer.Vector("\u5929\u6c14", {
                style: b,
                renderers: a
            });
            f = e;
            f.addLayer(h, !0);
            h.events.on({
                featureselected: c
            });
            d = !0
        },
        Show: function() {
            d && b()
        },
        Hide: function() {
            h.setVisibility(!1);
            null != f.widgetPop && f.removePopup(f.widgetPop)
        },
        Dispose: function() {
            f.removeLayer(h, !0);
            null != f.widgetPop && f.removePopup(f.widgetPop);
            d = !1;
            h = null
        },
        isInit: function() {
            return d
        }
    }
}
String.prototype.trim = function() {
    return Trim(this)
};
function LTrim(b) {
    var c;
    for (c = 0; c < b.length && (" " == b.charAt(c) || " " == b.charAt(c)); c++);
    return b = b.substring(c, b.length)
}
function RTrim(b) {
    var c;
    for (c = b.length - 1; 0 <= c && (" " == b.charAt(c) || " " == b.charAt(c)); c--);
    return b = b.substring(0, c + 1)
}
function Trim(b) {
    return LTrim(RTrim(b))
}
function SeaStateWidget() {
    function b() {
        $.ajax({
            type: "GET",
            url: "proxy/proxy.ashx?http://www.sdmf.org.cn/",
            datatype: "xml",
            success: function(a) {
                a = $.trim(a.substring(a.indexOf("var cityTidalList"), a.indexOf("//   var cityWaveList")));
                a = $.trim(a.substring(a.indexOf("["), a.indexOf("]") + 1));
                a = eval(a);
                c(a)
            },
            error: function(a, b) {
                console.log && console.log("\u6d77\u51b5\u6570\u636e\u8bf7\u6c42" + b)
            }
        })
    }
    function c(a) {
        if (a && null != a && 0 != a.length) for (var b = 0,
        c = a.length; b < c; b++) {
            var e = a[b],
            g = f[e.CITY_NAME],
            h = g.split(",")[0],
            g = g.split(",")[1],
            h = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(h, g)),
            g = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]);
            g.externalGraphic = "images/mark2/point0.png";
            g.graphicWidth = 37;
            g.graphicHeight = 33;
            g.graphicYOffset = -16.5;
            g.fillOpacity = 1;
            g.cursor = "pointer";
            h.style = g;
            h.attributes = e;
            d.addFeatures(h)
        }
    }
    function e(a) {
        null != h.widgetPop && h.removePopup(h.widgetPop);
        a = a.feature;
        h.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", a.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style\x3d'padding:0 5px;'\x3e\x3cdiv style \x3d 'position:relative; margin-bottom:15px;color:#3b9cfe;'\x3e\x3cb\x3e\u8fd1\u6d77\u72b6\u51b5\x3c/b\x3e \x3c/div\x3e \x3cdiv style\x3d'margin:10px 5px;'\x3e\x3cdiv style\x3d'float:left; '\x3e \x3cdiv style \x3d 'line-height: 18px;'\x3e" + a.attributes.CITY_NAME + "\x3c/div\x3e\x3cdiv style \x3d 'line-height: 18px;'\x3e\u6d6a\u9ad8:\x26nbsp;" + a.attributes.WAVE_HEIGHT + "m\x3c/div\x3e\x3cdiv style \x3d 'line-height: 18px;'\x3e\u8868\u5c42\u6c34\u6e29:\x26nbsp;" + a.attributes.WATER_TEMP + "\u2103\x3c/div\x3e\x3cdiv style \x3d 'line-height: 18px;'\x3e\u53d1\u5e03\u65e5\u671f:\x26nbsp;" + a.attributes.PUBLISHDATE + "\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'padding-left:130px;line-height:1.5em;' \x3e\u7b2c\u4e00\u6b21\u9ad8\u6f6e\u65f6:\x26nbsp;" + a.attributes.FIRST_HEIGHT_TIDAL + "\x3cbr\x3e\u7b2c\u4e00\u6b21\u4f4e\u6f6e\u65f6:\x26nbsp;" + a.attributes.FIRST_LOW_TIDAL + "\x3cbr\x3e\u7b2c\u4e8c\u6b21\u9ad8\u6f6e\u65f6:\x26nbsp;" + a.attributes.SECOND_HEIGHT_TIDAL + "\x3cbr\x3e\u7b2c\u4e8c\u6b21\u4f4e\u6f6e\u65f6:\x26nbsp;" + a.attributes.SECOND_LOW_TIDAL + "\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e", null, !0,
        function() {
            h.removePopup(h.widgetPop);
            h.unSelect()
        });
        a.popup = h.widgetPop;
        h.addPopup(h.widgetPop)
    }
    if (null != SeaStateWidget.unique) return SeaStateWidget.unique;
    SeaStateWidget.unique = this;
    var f = {
        "\u6ee8\u5dde": "118.03,38.35",
        "\u4e1c\u8425": "119.09,38.20",
        "\u9752\u5c9b": "120.56,36.02",
        "\u65e5\u7167": "119.63,35.26",
        "\u5a01\u6d77": "122.64,36.97",
        "\u6f4d\u574a": "119.22,37.30",
        "\u70df\u53f0": "120.61,37.91"
    },
    h = null,
    d = null,
    a = !1;
    return {
        init: function(b, c, f) {
            d = new OpenLayers.Layer.Vector("\u6d77\u51b5", {
                style: c,
                renderers: b
            });
            h = f;
            h.addLayer(d, !0);
            d.events.on({
                featureselected: e
            });
            a = !0
        },
        Show: function() {
            a && b()
        },
        Hide: function() {
            d.setVisibility(!1);
            null != h.widgetPop && h.removePopup(h.widgetPop)
        },
        Dispose: function() {
            h.removeLayer(d, !0);
            null != h.widgetPop && h.removePopup(h.widgetPop);
            a = !1;
            d = null
        },
        isInit: function() {
            return a
        }
    }
}
function SZJCWidget() {
    function b(a, b) {
        $.ajax({
            type: "GET",
            url: "0" == a ? "http://222.175.99.123:81/hyservice/szjcService.asmx/GetList": "http://222.175.99.123:81/hyservice/szjcService.asmx/GetHis?",
            datatype: "text",
            data: b,
            success: function(b) {
                c(b, a)
            },
            error: function(a, b) {
                console.log && console.log("\u6c34\u8d28\u76d1\u6d4b\u6570\u636e\u8bf7\u6c42" + b)
            }
        })
    }
    function c(a, b) {
        var c;
        c = a.childNodes[0].textContent ? a.childNodes[0].textContent: a.text;
        if ("0" == b) {
            c = eval("(" + c + ")").data;
            for (var d = 0,
            g = c.length; d < g; d++) e(c[d])
        } else c = eval("(" + c + ")"),
        h(c)
    }
    function e(b) {
        var c = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(b.X, b.Y)),
        d = OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style["default"]);
        d.externalGraphic = "images/mark2/point4.png";
        d.graphicWidth = 37;
        d.graphicHeight = 33;
        d.graphicYOffset = -16.5;
        d.fillOpacity = 1;
        d.cursor = "pointer";
        c.style = d;
        c.attributes = b;
        a.addFeatures(c)
    }
    function f(a) {
        null != d.widgetPop && d.removePopup(d.widgetPop);
        var c = a.feature;
        tabstr = "\x3cdiv id \x3d 'staticsTab1'\x3e\x3cdiv class\x3d'stc_hispic'\x3e\x3c/div\x3e\x3cdiv class\x3d'stc_title'\x3e\u57fa\u672c\u4fe1\u606f\x3c/div\x3e\x3c/div\x3e\x3cdiv id \x3d 'staticsTab2'\x3e\x3cdiv class\x3d'stc_xqpic'\x3e\x3c/div\x3e\x3cdiv class\x3d'stc_title'\x3e\u5386\u53f2\u5bf9\u6bd4\x3c/div\x3e\x3c/div\x3e\x3cdiv id \x3d 'staticsTab3'\x3e\x3cdiv class\x3d'stc_xqpic'\x3e\x3c/div\x3e\x3cdiv class\x3d'stc_title'\x3e\u5b9e\u65f6\u89c6\u9891\x3c/div\x3e\x3c/div\x3e";
        d.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", c.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style\x3d'padding:0 5px;'\x3e\x3cdiv style \x3d 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'\x3e\x3cb\x3e" + c.attributes.ADDR + "[" + c.attributes.ID + "]\x3c/b\x3e \x3c/div\x3e\x3cdiv class\x3d'maindiv'\x3e\x3cdiv class\x3d'titlediv' \x3e" + tabstr + "\x3c/div\x3e\x3cdiv id \x3d 'staticsDiv'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e", null, !0,
        function() {
            d.removePopup(d.widgetPop);
            d.unSelect()
        });
        var e = "\x3cdiv style\x3d'padding:0 5px;'\x3e\x3cdiv style \x3d 'font-size:14px; position:relative;color:#3b9cfe;'\x3e \x3cdiv style\x3d'line-height:42px;font-size: 12px;color: black;margin-top: 10px;'\x3e\x3cdiv class\x3d'div_left'\x3e\u7bb1\u6e29\u5ea6:\x3cspan class\x3d'span_road'\x3e" + c.attributes.WD_X + "\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d'div_right'\x3e\u7bb1\u6e7f\u5ea6:\x3cspan class\x3d'span_road'\x3e" + c.attributes.SD_X + "\x3c/span\x3e\x3c/div\x3e\x3chr style\x3d'width:100%; border-top: 0px #B8B6B6 solid'\x3e\x3cdiv class\x3d'div_left'\x3e\u6d77\u6e29\u5ea6:\x3cspan class\x3d'span_road'\x3e" + c.attributes.WD_H + "\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d'div_right'\x3e\u6c34\u6d41\u901f:\x3cspan class\x3d'span_road'\x3e" + c.attributes.LS + "\x3c/span\x3e\x3c/div\x3e\x3chr style\x3d'width:100%; border-top: 0px #B8B6B6 solid'\x3e\x3cdiv class\x3d'div_left'\x3e\u6eb6\u6c27:\x3cspan class\x3d'span_road'\x3e" + c.attributes.RY + "\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d'div_right'\x3e\u6eb6\u6c27\u6e29\u5ea6:\x3cspan class\x3d'span_road'\x3e" + c.attributes.RY_WD + "\x3c/span\x3e\x3c/div\x3e\x3chr style\x3d'width:100%; border-top: 0px #B8B6B6 solid'\x3e\x3cdiv class\x3d'div_left'\x3ePH:\x3cspan class\x3d'span_road'\x3e" + c.attributes.PH + "\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d'div_right'\x3e\u538b\u529b:\x3cspan class\x3d'span_road'\x3e" + c.attributes.YL + "\x3c/span\x3e\x3c/div\x3e\x3chr style\x3d'width:100%; border-top: 0px #B8B6B6 solid'\x3e\x3cdiv class\x3d'div_left'\x3e\u7535\u538b:\x3cspan class\x3d'span_road'\x3e" + c.attributes.DY + "\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d'div_right'\x3e\u76d0\u5ea6:\x3cspan class\x3d'span_road'\x3e" + c.attributes.YD + "\x3c/span\x3e\x3c/div\x3e\x3chr style\x3d'width:100%; border-top: 0px #B8B6B6 solid'\x3e\x3cdiv class\x3d'div_left'\x3e\u7535\u5bfc:\x3cspan class\x3d'span_road'\x3e" + c.attributes.DD + "\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d'div_right'\x3e\u65f6\u95f4:\x3cspan class\x3d'span_road'\x3e" + c.attributes.TIME + "\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e";
        c.popup = d.widgetPop;
        d.addPopup(d.widgetPop);
        $(".titlediv\x3ediv").click(function(a) {
            a = $(this);
            if ("staticsTab1" == this.id) $("#staticsDiv").html(e);
            else if ("staticsTab2" == this.id) b("1", {
                id: "RD_MPYX_0_0",
                n: 7
            });
            else {
                var d;
                d = null != c.attributes.SPCH && "" != c.attributes.SPCH ? "video/szjc/realVideo.html?ch\x3d" + c.attributes.SPCH: "video/iermu.html?title\x3dtest\x26shareid\x3d4425243d0e7e313d616bdd4bf3cc1f95\x26uk\x3d878364372";
                $("#staticsDiv").html("\x3ciframe name\x3d'myiframe' width\x3d'100%' height\x3d'100%' marginwidth\x3d'0' marginheight\x3d'0' hspace\x3d'0' vspace\x3d'0' frameborder\x3d'0' scrolling\x3d'no' src\x3d'" + d + "'\x3e\x3c/iframe\x3e")
            }
            a.children().addClass("active");
            a.siblings().children().removeClass("active")
        });
        $("#staticsTab1").click()
    }
    function h(a) {
        $("#staticsDiv").highcharts({
            title: {
                text: "\u8fc7\u53bb7\u5c0f\u65f6\u5185\u53d8\u5316\u60c5\u51b5",
                x: -20
            },
            xAxis: {
                categories: a.cate
            },
            yAxis: {
                title: {
                    text: ""
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: "#808080"
                }]
            },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
                borderWidth: 0
            },
            series: a.series,
            credits: {
                enabled: !1
            }
        })
    }
    if (null != SZJCWidget.unique) return SZJCWidget.unique;
    SZJCWidget.unique = this;
    var d = null,
    a = null,
    g = !1;
    return {
        init: function(b, c, e) {
            a = new OpenLayers.Layer.Vector("\u6d77\u51b5", {
                style: c,
                renderers: b
            });
            d = e;
            d.addLayer(a, !0);
            a.events.on({
                featureselected: f
            });
            g = !0
        },
        Show: function() {
            g && b("0", null)
        },
        Hide: function() {
            a.setVisibility(!1);
            null != d.widgetPop && d.removePopup(d.widgetPop)
        },
        Dispose: function() {
            d.removeLayer(a, !0);
            null != d.widgetPop && d.removePopup(d.widgetPop);
            g = !1;
            a = null
        },
        isInit: function() {
            return g
        }
    }
}
function RoadWiget() {
    function b(a) {
        null != a ? n[a] ? (d.removeFeatures(g[a]), n[a] = !1) : (d.addFeatures(g[a]), n[a] = !0) : (g = {
            road_kou: [],
            road_event: [],
            road_hu: []
        },
        $.ajax({
            type: "GET",
            url: f + "?request\x3dGSCRK",
            datatype: "xml",
            success: function(a) {
                $.ajax({
                    type: "POST",
                    url: f,
                    datatype: "xml",
                    data: {
                        request: "GSEVENT",
                        type: "007001"
                    },
                    success: function(a) {
                        c(a)
                    },
                    error: function(a, b) {
                        console.log && console.log("\u8def\u51b5\u517b\u62a4\u6570\u636e\u8bf7\u6c42" + b)
                    }
                });
                $.ajax({
                    type: "POST",
                    url: f,
                    datatype: "xml",
                    data: {
                        request: "GSEVENT",
                        type: "007002"
                    },
                    success: function(a) {
                        c(a)
                    },
                    error: function(a, b) {
                        console.log && console.log("\u4ea4\u901a\u4e8b\u6545\u6570\u636e\u8bf7\u6c42" + b)
                    }
                });
                c(a)
            },
            error: function(a, b) {
                console.log && console.log("\u51fa\u5165\u53e3\u6570\u636e\u8bf7\u6c42" + b)
            }
        }))
    }
    function c(a) {
        if (a && (a = string2xml(a).getElementsByTagName("event"), null != a && 0 != a.length)) for (var b = 0,
        c = a.length; b < c; b++) {
            for (var e = a[b].childNodes, f = {},
            h = 0, l = e.length; h < l; h++) f[e[h].tagName] = e[h].text ? e[h].text: e[h].textContent;
            e = f;
            f = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(e.x, e.y));
            h = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]);
            h.graphicWidth = 26;
            h.graphicHeight = 26;
            h.fillOpacity = 1;
            h.cursor = "pointer";
            f.attributes = e;
            null == e.eventtype ? (h.externalGraphic = "images/Road/crk" + ("\u5c01\u95ed" == e.enterstatus && "\u5c01\u95ed" == e.exitstatus ? "33": "\u7545\u901a" == e.enterstatus && "\u5c01\u95ed" == e.exitstatus ? "02": "\u5c01\u95ed" == e.enterstatus && "\u7545\u901a" == e.exitstatus ? "11": "33") + ".png", f.style = h, g.road_kou.push(f)) : "\u517b\u62a4\u65bd\u5de5" == e.eventtype ? (h.externalGraphic = "images/Road/roadStruct_pic.png", f.style = h, g.road_hu.push(f)) : (h.externalGraphic = "images/Road/accident_pic.png", f.style = h, g.road_event.push(f));
            d.addFeatures(f)
        }
    }
    function e(a) {
        null != h.widgetPop && h.removePopup(h.widgetPop);
        a = a.feature;
        if (null != a.attributes.eventtype) {
            var b = a.attributes.glmc + "   \u65b9\u5411:" + a.attributes.roadfx,
            c, d;
            a.attributes.eventms ? (c = 12 * a.attributes.eventms.length + 100, c = (370 < c ? c: 370) + "px") : c = "370px";
            d = "\u517b\u62a4\u65bd\u5de5" == a.attributes.eventtype ? "div_shigong": "div_shigu";
            h.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", a.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style\x3d'padding:0 5px;'\x3e\x3cdiv style \x3d 'font-size:14px; position:relative;color:#3b9cfe;'\x3e\x3cb style\x3d'margin-left: 20px'\x3e" + b + "\x3c/b\x3e\x3cdiv class\x3d'div_content_r'\x3e\x3cdiv class\x3d" + d + "\x3e\x3c/div\x3e\x3cdiv style \x3d 'line-height:40px;font-size:12px;color:red;width:" + c + ";'\x3e" + a.attributes.eventms + "\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e \x3cdiv style\x3d'line-height:34px;' \x3e\x3chr style\x3d'width:100%; border-top: 0px #B8B6B6 solid'\x3e\x3cdiv class\x3d'div_left'\x3e\u9053\u8def\u8c03\u6574\u63aa\u65bd:\x3cspan class\x3d'span_road'\x3e" + a.attributes.steptime + "\x3c/span\x3e\x3c/div\x3e\x3chr style\x3d'width:100%; border-top: 0px #B8B6B6 solid'\x3e\x3cdiv class\x3d'div_left'\x3e\u8d77\u59cb\u8282\u70b9:\x3cspan class\x3d'span_road'\x3e" + a.attributes.startnode + "\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d'div_right'\x3e\u7ec8\u6b62\u8282\u70b9:\x3cspan class\x3d'span_road'\x3e" + a.attributes.endnode + "\x3c/span\x3e\x3c/div\x3e\x3chr style\x3d'width:100%; border-top: 0px #B8B6B6 solid'\x3e\x3cdiv class\x3d'div_left'\x3e\u5f00\u59cb\u6869\u53f7:\x3cspan class\x3d'span_road'\x3e" + a.attributes.startzh + "\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d'div_right'\x3e\u7ed3\u675f\u6869\u53f7:\x3cspan class\x3d'span_road'\x3e" + a.attributes.endzh + "\x3c/span\x3e\x3c/div\x3e\x3chr style\x3d'width:100%; border-top: 0px #B8B6B6 solid'\x3e\x3cdiv class\x3d'div_left'\x3e\u5f00\u59cb\u65f6\u95f4:\x3cspan class\x3d'span_road'\x3e" + a.attributes.starttime + "\x3c/span\x3e\x3cbr\x3e\u9884\u8ba1\u7ed3\u675f\u65f6\u95f4:\x3cspan class\x3d'span_road'\x3e" + a.attributes.endtime + "\x3c/span\x3e\x3c/div\x3e\x3cbr\x3e\x3c/div\x3e\x3c/div\x3e", null, !0,
            function() {
                null != h.widgetPop && (h.removePopup(h.widgetPop), h.unSelect())
            })
        } else b = "\u5c01\u95ed" == a.attributes.enterstatus ? "span_active_road": "span_normal_road",
        c = "\u5c01\u95ed" == a.attributes.exitstatus ? "span_active_road": "span_normal_road",
        h.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", a.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style\x3d'padding:0 5px;min-width:130px;'\x3e\x3cdiv style \x3d 'position:relative;margin-bottom:10px;color:#3b9cfe;font-size:14px;margin-left:8px'\x3e\x3cb\x3e" + a.attributes.tollbooth + "\x3c/b\x3e\x3c/div\x3e \x3cdiv style\x3d'line-height:30px;margin-left:10px'\x3e\u5165\u53e3:\x3cspan class\x3d" + b + "\x3e" + a.attributes.enterstatus + "\x3c/span\x3e\x3cbr\x3e\u51fa\u53e3:\x3cspan class\x3d" + c + "\x3e" + a.attributes.exitstatus + "\x3c/span\x3e\x3cbr\x3e\x3c/div\x3e\x3c/div\x3e", null, !0,
        function() {
            null != h.widgetPop && h.removePopup(h.widgetPop)
        });
        a.popup = h.widgetPop;
        h.addPopup(h.widgetPop)
    }
    if (null != RoadWiget.unique) return RoadWiget.unique;
    RoadWiget.unique = this;
    var f = inProxy + "http://www.sdmap.gov.cn/ShareRoadService.ashx",
    h = null,
    d = null,
    a = !1,
    g = null,
    n = {
        road_kou: !0,
        road_event: !0,
        road_hu: !0
    };
    return {
        init: function(b, c, g) {
            d = new OpenLayers.Layer.Vector("\u9053\u8def", {
                style: c,
                renderers: b
            });
            h = g;
            h.addLayer(d, !0);
            d.events.on({
                featureselected: e
            });
            a = !0
        },
        Show: function(c) {
            a && b(c)
        },
        Hide: function() {
            d.setVisibility(!1);
            null != h.widgetPop && h.removePopup(h.widgetPop)
        },
        Dispose: function() {
            h.removeLayer(d, !0);
            null != h.widgetPop && h.removePopup(h.widgetPop);
            a = !1;
            g = {
                road_kou: [],
                road_event: [],
                road_hu: []
            };
            d = null
        },
        isInit: function() {
            return a
        }
    }
}
function EnvironmentWidget() {
    function b(a) {
        null != d.widgetPop && d.removePopup(d.widgetPop);
        $.ajax({
            type: "GET",
            url: "proxy/proxy.ashx?http://58.56.98.78:8801/AirDeploy.Web/Ajax/AirQuality/AirQuality.ashx?Method\x3dGetStationMarkOnMap",
            datatype: "json",
            success: function(a) {
                c(a)
            },
            error: function(a, b) {
                console.log && console.log("AQI\u6570\u636e\u8bf7\u6c42" + b)
            }
        })
    }
    function c(a) {
        if (a && (a = eval("(" + a + ")"), 0 < a.items.length)) {
            a = a.items;
            for (var b = 0; b < a.length; b++) e(a[b])
        }
    }
    function e(b) {
        var c = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(parseFloat(b.longitude), parseFloat(b.latitude))),
        d = OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style["default"]);
        d.externalGraphic = "images/environment/pm25_" + h[b.lev].i + ".png";
        d.graphicWidth = 25;
        d.graphicHeight = 25;
        d.fillOpacity = 1;
        d.cursor = "pointer";
        c.style = d;
        c.attributes = b;
        a.addFeatures(c)
    }
    function f(a) {
        null != d.widgetPop && d.removePopup(d.widgetPop);
        a = a.feature;
        var b = $.ajax({
            async: !1,
            url: "proxy/proxy.ashx?http://58.56.98.78:8801/AirDeploy.Web/Ajax/AirQuality/AirQuality.ashx/AirQuality.ashx?Method\x3dGetQualityItemsValues\x26StationID\x3d" + a.attributes.subid,
            dataType: "json"
        }),
        b = eval("(" + b.responseText + ")");
        d.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", a.geometry.getBounds().getCenterLonLat(), null, ["\x3cdiv style \x3d 'width:340px;height:210px;font-size:12px;padding:0 5px;'\x3e\x3cdiv style \x3d 'position:absolute;top:0px;line-height:20px;color:#3b9cfe;'\x3e\x3cb style\x3d'font-size:14px;'\x3e", b.CityName, " ", b.DT, "\x3c/b\x3e\x3c/div\x3e\x3cdiv style\x3d'padding-top:25px;'\x3e\x3cdiv  style\x3d'float:left;line-height:1.5em;width:220px;display:inline-block;'\x3e\x3ctable\x3e\x3ctr\x3e\x3ctd style\x3d' font-weight: bold;color:#4d4d4d;'\x3e\u7a7a\u6c14\u8d28\u91cf\u6307\u6570AQI\uff1a\x3c/td\x3e\x3ctd\x3e", b.AQI, "\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3ctable\x3e\x3ctr\x3e\x3ctd style\x3d' font-weight: bold;color:#4d4d4d;'\x3e\u7a7a\u6c14\u8d28\u91cf\u7b49\u7ea7\uff1a\x3c/td\x3e\x3ctd\x3e", b.Quality, "(", b.Level, ")\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3ctable\x3e\x3ctr\x3e\x3ctd style\x3d' font-weight: bold;color:#4d4d4d;'\x3e\u9996\u8981\u6c61\u67d3\u7269\uff1a\x3c/td\x3e\x3ctd\x3e", b.POL, "\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3ctable\x3e\x3ctr\x3e\x3ctd style\x3d' font-weight: bold;width:65px;color:#4d4d4d;'\x3e\u5065\u5eb7\u6307\u5f15\uff1a\x3c/td\x3e\x3ctd style\x3d'width:120px;'\x3e", h[b.Level].intro, "\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/div\x3e\x3cdiv style \x3d 'display:inline-block;clear:right;'\x3e\x3cimg width\x3d'91px'height\x3d'102px' src\x3d'images/environment/", h[b.Level].i, ".png'\x3e\x3c/img\x3e\x3cdiv style\x3d'width:120px;'\x3e", h[b.Level].jianyi, "\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'float:left;clear:both'\x3e\x3cstyle\x3e.paramindex{padding-left:25px;} .paramindex tr{font-size:14px;font-weight:bold;}.paramindex td{width:100px;}.paramindex span{color:#046abe;font-size:14px;padding-right:0px;}\x3c/style\x3e\x3ctable class\x3d'paramindex'\x3e\x3ctbody\x3e\x3ctr\x3e\x3ctd\x3e\x3cspan\x3ePM2.5\uff1a\x3c/span\x3e", Math.ceil(1E3 * parseFloat(b.PM25)), "\x3c/td\x3e\x3ctd\x3e\x3cspan\x3ePM10\uff1a\x3c/span\x3e", Math.ceil(1E3 * parseFloat(b.PM10)), "\x3c/td\x3e\x3ctd\x3e\x3cspan\x3eSO2\uff1a\x3c/span\x3e", Math.ceil(1E3 * parseFloat(b.SO2)), "\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3cspan\x3eNO2\uff1a\x3c/span\x3e", Math.ceil(1E3 * parseFloat(b.NO2)), "\x3c/td\x3e\x3ctd\x3e\x3cspan\x3eCO\uff1a\x3c/span\x3e", b.CO, "\x3c/td\x3e\x3ctd\x3e\x3cspan\x3eO3\uff1a\x3c/span\x3e", Math.ceil(1E3 * parseFloat(b.O3)), "\x3c/td\x3e\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e\x3c/div\x3e\x3cdiv style\x3d'float:right;clear:both;padding-top:5px;'\x3e\u5355\u4f4d:CO\u6beb\u514b/\u7acb\u65b9\u7c73\uff0c\u5176\u5b83 \u5fae\u514b/\u7acb\u65b9\u7c73\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e"].join(""), null, !0,
        function() {
            null != d.widgetPop && (d.removePopup(d.widgetPop), d.unSelect())
        });
        a.popup = d.widgetPop;
        d.addPopup(d.widgetPop)
    }
    if (null != EnvironmentWidget.unique) return EnvironmentWidget.unique;
    EnvironmentWidget.unique = this;
    var h = {
        "\u2160": {
            i: 1,
            intro: "\u7a7a\u6c14\u8d28\u91cf\u4ee4\u4eba\u6ee1\u610f\uff0c\u57fa\u672c\u65e0\u7a7a\u6c14\u6c61\u67d3",
            jianyi: "\u975e\u5e38\u9002\u5b9c\u6237\u5916\u6d3b\u52a8"
        },
        "\u2161": {
            i: 2,
            intro: "\u7a7a\u6c14\u8d28\u91cf\u53ef\u63a5\u53d7\uff0c\u4f46\u67d0\u4e9b\u6c61\u67d3\u7269\u53ef\u80fd\u5bf9\u6781\u5c11\u6570\u5f02\u5e38\uff0c\u654f\u611f\u4eba\u7fa4\u5065\u5eb7\u6709\u8f83\u5f31\u5f71\u54cd",
            jianyi: "\u9002\u5b9c\u6237\u5916\u6d3b\u52a8\u6216\u953b\u70bc"
        },
        "\u2162": {
            i: 3,
            intro: "\u6613\u611f\u4eba\u7fa4\u75c7\u72b6\u6709\u8f7b\u5ea6\u52a0\u5267\uff0c\u5065\u5eb7\u4eba\u7fa4\u51fa\u73b0\u523a\u6fc0\u75c7\u72b6",
            jianyi: "\u51cf\u5c11\u6237\u5916\u953b\u70bc"
        },
        "\u2163": {
            i: 4,
            intro: "\u8fdb\u4e00\u6b65\u52a0\u5267\u6613\u611f\u4eba\u7fa4\u75c7\u72b6\uff0c\u53ef\u80fd\u5bf9\u5065\u5eb7\u4eba\u7fa4\u5fc3\u810f\u3001\u547c\u5438\u7cfb\u7edf\u6709\u5f71\u54cd",
            jianyi: "\u505c\u6b62\u6237\u5916\u953b\u70bc\uff0c\u51cf\u5c11\u6237\u5916\u6d3b\u52a8"
        },
        "\u2164": {
            i: 5,
            intro: "\u5fc3\u810f\u75c5\u548c\u80ba\u75c5\u60a3\u8005\u75c7\u72b6\u663e\u8457\u52a0\u5267\uff0c\u8fd0\u52a8\u8010\u53d7\u529b\u51cf\u4f4e\uff0c\u5065\u5eb7\u4eba\u7fa4\u666e\u904d\u51fa\u73b0\u75c7\u72b6",
            jianyi: "\u4e0d\u9002\u5b9c\u6237\u5916\u6d3b\u52a8\uff0c\u6237\u5916\u6d3b\u52a8\u65f6\u5e94\u4f69\u6234\u53e3\u7f69"
        },
        "\u2165": {
            i: 6,
            intro: "\u5065\u5eb7\u4eba\u8fd0\u52a8\u8010\u53d7\u529b\u51cf\u4f4e\uff0c\u6709\u663e\u8457\u5f3a\u70c8\u75c7\u72b6\uff0c\u63d0\u524d\u51fa\u73b0\u67d0\u4e9b\u75be\u75c5",
            jianyi: "\u53d6\u6d88\u4e0d\u5fc5\u8981\u7684\u6237\u5916\u6d3b\u52a8"
        },
        "--": {
            i: 7,
            intro: "\u65e0\u6570\u636e",
            jianyi: "\u8bbe\u5907\u6545\u969c"
        }
    },
    d = null,
    a = null,
    g = !1,
    n = null;
    return {
        init: function(b, c, e) {
            a = new OpenLayers.Layer.Vector("\u73af\u5883", {
                style: c,
                renderers: b
            });
            d = e;
            n = $("\x3cdiv\x3e\x3c/div\x3e").attr("id", "lengend_envri").addClass("legenddiv").css("width", "300px").append("\x3cimg src\x3d'Images/environment/aqi.png' width\x3d'300px' height\x3d'100px'/\x3e");
            $("#" + d.map.div.id).append(n);
            d.addLayer(a, !0);
            a.events.on({
                featureselected: f
            });
            g = !0
        },
        Show: function() {
            g && (b(), a.setVisibility(!0), $("#lengend_envri").show())
        },
        Hide: function() {
            a.setVisibility(!1);
            $("#lengend_envri").hide();
            null != d.widgetPop && d.removePopup(d.widgetPop)
        },
        Dispose: function() {
            d.removeLayer(a, !0);
            null != d.widgetPop && d.removePopup(d.widgetPop);
            g = !1;
            a = null;
            n.remove();
            n = null
        },
        isInit: function() {
            return g
        }
    }
}
function WaterQuanlityWidget() {
    function b() {
        $.ajax({
            type: "GET",
            url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/testServ/waterservice.asmx/QueryTempa?parm\x3d1",
            success: function(a) {
                $.ajax({
                    type: "GET",
                    url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/testServ/waterservice.asmx/QueryTempa?parm\x3d2",
                    success: e,
                    error: function(a, b) {
                        console.log && console.log("\u9762\u6570\u636e\u8bf7\u6c42" + b)
                    }
                });
                e(a)
            },
            error: function(a, b) {
                console.log && console.log("\u7ebf\u6570\u636e\u8bf7\u6c42" + b)
            }
        })
    }
    function c(a) {
        m = a.xy
    }
    function e(a) {
        a = eval(a.documentElement.textContent || a.documentElement.text);
        for (var b = a.length,
        c = 0; c < b; c++) {
            var e = a[c].geom.split("@"),
            g = e.length;
            if (! (2 > g)) {
                for (var h = [], m = 1; m < g; m++) h.push(d(e[m]));
                a[c].geom = null;
                f(h, a[c])
            }
        }
    }
    function f(a, b) {
        var c = a.length,
        d, e;
        if (! (1 > c)) {
            if ("1" == b.gtype) if (1 == c) c = new OpenLayers.Geometry.LineString(a[0]);
            else {
                d = [];
                for (e = 0; e < c; e++) d.push(new OpenLayers.Geometry.LineString(a[e]));
                c = new OpenLayers.Geometry.MultiLineString(d)
            } else if (1 == c) c = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(a[0])]);
            else {
                d = [];
                for (e = 0; e < c; e++) d.push(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(a[e])]));
                c = new OpenLayers.Geometry.MultiPolygon(d)
            }
            c = new OpenLayers.Feature.Vector(c);
            c.attributes = b;
            d = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]);
            d.fillColor = h(b.water);
            d.fillOpacity = .5;
            d.strokeWidth = 2;
            d.strokeColor = h(b.water);
            d.cursor = "pointer";
            c.style = d;
            n.addFeatures(c)
        }
    }
    function h(a) {
        switch (a) {
        case "I":
        case "II":
        case "III":
            a = "green";
            break;
        case "IV":
            a = "yellow";
            break;
        case "V":
            a = "coral";
            break;
        case "\u52a3V":
            a = "red";
            break;
        default:
            a = "black"
        }
        return a
    }
    function d(a) {
        for (var b = a.length,
        c = [], d, e, g = 0; g < b; g += 10) e = a.substr(g, 5),
        d = a.substr(g + 5, 5),
        e = parseInt(e, 36) / 1E5,
        d = parseInt(d, 36) / 1E5,
        c.push(new OpenLayers.Geometry.Point(e, d));
        return c
    }
    function a(a) {
        var b = g.map.getLonLatFromViewPortPx(m);
        null != g.widgetPop && g.removePopup(g.widgetPop);
        var c = a.attributes,
        d = ["\x3cdiv style\x3d'padding:0 5px;min-width:130px;'\x3e\x3cdiv style \x3d 'position:relative; margin-bottom:10px;color:#3b9cfe;'\x3e\x3cb\x3e\u4e3b\u8981\u6cb3\u6d41\u6c34\u8d28\u72b6\u51b5\x3c/b\x3e\x3c/div\x3e \x3cdiv style \x3d 'line-height:1.5em;'\x3e\u521b\u5efa\u65e5\u671f\uff1a"];
        d.push(c.year + "-" + c.month);
        d.push("\x3cbr\x3e\u6d41\u57df\u540d\u79f0\uff1a");
        d.push(c.basin);
        d.push("\x3cbr\x3e\u6cb3\u6d41\u540d\u79f0\uff1a");
        d.push(c.river);
        d.push("\x3cbr\x3e\u65ad\u9762\u540d\u79f0\uff1a");
        d.push(c.section);
        d.push("\x3cbr\x3e\u63a7\u5236\u6c34\u57df\uff1a");
        d.push(c.city);
        d.push("\x3cbr\x3e\u6c34\u8d28\u7c7b\u522b\uff1a");
        d.push(c.water);
        d.push("\x3cbr\x3e\u5e38\u89c1\u9c7c\u7c7b\uff1a\x3cimg src\x3d'images/water/fish1.png' width\x3d'30px' height\x3d'30px'/\x3e\x3c/div\x3e\x3c/div\x3e");
        g.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", b, null, d.join(""), null, !0,
        function() {
            g.removePopup(g.widgetPop);
            g.unSelect()
        });
        a.popup = g.widgetPop;
        g.addPopup(g.widgetPop)
    }
    if (null != WaterQuanlityWidget.unique) return WaterQuanlityWidget.unique;
    WaterQuanlityWidget.unique = this;
    var g = null,
    n = null,
    l = !1,
    q = null,
    m = null;
    return {
        init: function(b, d, e) {
            n = new OpenLayers.Layer.Vector("\u6c34\u8d28", {
                style: d,
                renderers: b
            });
            g = e;
            q = $("\x3cdiv\x3e\x3c/div\x3e").attr("id", "lengend_water").addClass("legenddiv").css("width", "239px").append("\x3cimg src\x3d'Images/water/waterlegend.png' width\x3d'239px' height\x3d'50px'/\x3e");
            $("#" + g.map.div.id).append(q);
            g.addLayer(n, !0);
            n.events.on({
                featureselected: function(b) {
                    a(b.feature)
                }
            });
            g.map.events.register("mousemove", g, c);
            l = !0
        },
        Show: function() {
            l && b()
        },
        Hide: function() {
            n.setVisibility(!1);
            null != g.widgetPop && g.removePopup(g.widgetPop)
        },
        Dispose: function() {
            g.removeLayer(n, !0);
            null != g.widgetPop && g.removePopup(g.widgetPop);
            l = !1;
            q.remove();
            n = q = null;
            g.map.events.unregister("mousemove", g, c)
        },
        isInit: function() {
            return l
        }
    }
}
function WaterConditionWidget() {
    function b(a) {
        n = a;
        0 < l.kp.length ? e() : ($.ajax({
            type: "GET",
            url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/tdmap_newinfo.xml",
            dataType: "xml",
            success: function(a) {
                void 0 == a ? alert("\u83b7\u53d6\u5931\u8d25\uff01") : c(a, 1)
            },
            error: function(a, b, c) {
                console.log(a)
            }
        }), $.ajax({
            type: "GET",
            url: h,
            dataType: "xml",
            success: c
        }))
    }
    function c(a, b) {
        var c, d, g, f, h, m, n, q;
        q = a.getElementsByTagName("STTP");
        a = "ZZ" == q[0].getAttribute("VALUE") ? 0 : 1;
        if (1 != b) {
            n = q[1 - a].getElementsByTagName("item");
            for (c = 0; c < n.length; c++) g = n[c],
            d = g.getAttribute("id"),
            f = g.getAttribute("name"),
            h = g.getAttribute("x"),
            m = g.getAttribute("y"),
            g = g.getAttribute("flag"),
            l.kp.push({
                id: d,
                name: f,
                x: h,
                y: m,
                flag: g
            });
            n = q[a].getElementsByTagName("item");
            for (c = 0; c < n.length; c++) g = n[c],
            d = g.getAttribute("id"),
            f = g.getAttribute("name"),
            h = g.getAttribute("x"),
            m = g.getAttribute("y"),
            q = g.getAttribute("angle"),
            g = g.getAttribute("flag"),
            l.hp.push({
                id: d,
                name: f,
                x: h,
                y: m,
                angle: q,
                flag: g
            });
            e()
        } else {
            n = q[1 - a].getElementsByTagName("STCD");
            for (c = 0; c < n.length; c++) g = n[c],
            d = g.getAttribute("VALUE"),
            f = g.childNodes[0].nodeValue.replace(/<[\w\s='"\d%-;:#,]*>/g, "@").replace(/(&nbsp;)/g, "").replace(/@{2,}/g, "@").replace(/(\u7c73@3@\/\u79d2)/, "\u7acb\u65b9\u7c73/\u79d2"),
            l.ka[d] = f;
            n = q[a].getElementsByTagName("STCD");
            for (c = 0; c < n.length; c++) g = n[c],
            d = g.getAttribute("VALUE"),
            f = g.childNodes[0].nodeValue.replace(/<[\w\s='"\d%-;:#,]*>/g, "@").replace(/(&nbsp;)/g, "").replace(/@{2,}/g, "@"),
            l.ha[d] = f
        }
    }
    function e() {
        var b, c;
        a.removeAllFeatures();
        null != d.widgetPop && d.removePopup(d.widgetPop);
        if ("river" == n) for (b = 0; b < l.hp.length; b++) {
            c = l.hp[b];
            var e = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(c.x, c.y)),
            g = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]);
            g.externalGraphic = "images/rain/zz.png";
            g.graphicWidth = 8;
            g.graphicHeight = 16;
            g.fillOpacity = 1;
            g.rotation = c.angle;
            g.cursor = "pointer";
            e.style = g;
            e.attributes = {
                id: c.id,
                name: c.name
            };
            a.addFeatures(e)
        } else for (b = 0; b < l.kp.length; b++) c = l.kp[b],
        e = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(c.x, c.y)),
        g = OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style["default"]),
        g.externalGraphic = "images/rain/rr.png",
        g.graphicWidth = 12,
        g.graphicHeight = 11,
        g.fillOpacity = 1,
        g.cursor = "pointer",
        e.style = g,
        e.attributes = {
            id: c.id,
            name: c.name
        },
        a.addFeatures(e)
    }
    function f(a) {
        null != d.widgetPop && d.removePopup(d.widgetPop);
        var b;
        if (b = "river" == n ? l.ha[a.attributes.id] : l.ka[a.attributes.id]) {
            b = b.split("@");
            var c = b[1],
            e;
            4 < b.length ? (e = "\u65f6\u95f4\uff1a" + b[2] + "\x3cbr/\x3e" + b[3] + "\x3cbr/\x3e", e += b.splice(4, b.length).join("").replace("\u7c733", "\u7acb\u65b9\u7c73").replace("/\u79d2", "/\u79d2\x3cbr/\x3e")) : (c = "\u672a\u77e5", e = "\u65e0\u6570\u636e\uff01")
        } else c = "\u672a\u77e5",
        e = "\u65e0\u6570\u636e\uff01";
        d.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", a.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style\x3d'padding:0 5px;min-width:130px;'\x3e\x3cdiv style \x3d 'position:absolute;top:0px;color:#3b9cfe;'\x3e\x3cb\x3e" + c + "\x3c/b\x3e\x3c/div\x3e\x3cdiv style\x3d'line-height:1.5em;margin-top:25px;'\x3e" + e + "\x3c/div\x3e\x3c/div\x3e", null, !0,
        function() {
            d.removePopup(d.widgetPop);
            d.unSelect()
        });
        a.popup = d.widgetPop;
        d.addPopup(d.widgetPop)
    }
    if (null != WaterConditionWidget.unique) return WaterConditionWidget.unique;
    WaterConditionWidget.unique = this;
    var h = inProxy + "http://www.sdmap.gov.cn/widgets/Rain/rainmap.xml",
    d = null,
    a = null,
    g = !1,
    n = "",
    l = {
        kp: [],
        hp: [],
        ka: [],
        ha: []
    };
    return {
        init: function(b, c, e) {
            a = new OpenLayers.Layer.Vector("\u6c34\u60c5", {
                style: c,
                renderers: b
            });
            d = e;
            d.addLayer(a, !0);
            a.events.on({
                featureselected: function(a) {
                    f(a.feature)
                }
            });
            g = !0
        },
        Show: function(a) {
            a = null == a ? "river": a.split("_")[1];
            g && a != n && b(a)
        },
        Hide: function() {
            a.setVisibility(!1);
            null != d.widgetPop && d.removePopup(d.widgetPop)
        },
        Dispose: function() {
            d.removeLayer(a, !0);
            null != d.widgetPop && d.removePopup(d.widgetPop);
            l = {
                kp: [],
                hp: [],
                ka: [],
                ha: []
            };
            g = !1;
            n = "";
            a = null
        },
        isInit: function() {
            return g
        }
    }
}
function VideoWidget() {
    function b() {
        $.ajax({
            type: "GET",
            url: "video/videodata.txt",
            datatype: "text",
            success: function(a) {
                d = JSON.parse(a);
                for (a = 0; a < d.length; a++) {
                    var b = d[a],
                    c = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(b.x, b.y)),
                    e = OpenLayers.Util.extend({},
                    OpenLayers.Feature.Vector.style["default"]);
                    e.externalGraphic = "images/video/video.png";
                    e.graphicWidth = 24;
                    e.graphicHeight = 24;
                    e.fillOpacity = 1;
                    e.cursor = "pointer";
                    c.style = e;
                    c.attributes = b;
                    f.addFeatures(c)
                }
            },
            error: function(a, b) {
                console.log && console.log("\u89c6\u9891\u6570\u636e\u8bf7\u6c42" + b)
            }
        })
    }
    function c(a) {
        null != e.widgetPop && e.removePopup(e.widgetPop);
        e.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", a.geometry.getBounds().getCenterLonLat(), null, '\x3cdiv id \x3d "PopDiv" style \x3d ""\x3e\x3cdiv id \x3d "PopDiv_title" style\x3d"width:420px;height:22px;font-weight:bold;font-size: 14px;line-height: 22px;padding-left: 5px;color:#3b9cfe;"\x3e\x3c/div\x3e\x3cdiv id \x3d "PopDiv_frame" style\x3d"width:430px;height:330px;"\x3e\x3ciframe id\x3d"popiframe" width\x3d"100%" height\x3d"100%" frameborder\x3d"0"\x3e\x3c/iframe\x3e\x3cdiv/\x3e\x3c/div\x3e', null, !0,
        function() {
            null != e.widgetPop && (e.removePopup(e.widgetPop), e.unSelect())
        });
        a.popup = e.widgetPop;
        a.popup.autoSize = !0;
        e.addPopup(e.widgetPop);
        var b;
        "1" == a.attributes.type ? (b = "video/iermu.html?title\x3d" + encodeURI(a.attributes.name) + "\x26" + a.attributes.request, $("#PopDiv_frame").css("width", "470px"), $("#PopDiv_frame").css("height", "333px")) : (b = "video/anqiaoqiao.html?title\x3d" + encodeURI(a.attributes.name) + "\x26request\x3d" + a.attributes.request, $("#PopDiv_frame").css("width", "430px"), $("#PopDiv_frame").css("height", "330px"));
        a.popup.updateSize();
        $("#popiframe").attr("src", b);
        $("#PopDiv_title").empty();
        $("#PopDiv_title").html(a.attributes.name)
    }
    if (null != VideoWidget.unique) return VideoWidget.unique;
    VideoWidget.unique = this;
    var e = null,
    f = null,
    h = !1,
    d = [{
        id: "wrs",
        name: "\u671b\u4eba\u677e",
        x: 117.106774,
        y: 36.246327
    },
    {
        id: "gongbei",
        name: "\u62f1\u5317\u77f3",
        x: 117.106063,
        y: 36.256359
    },
    {
        id: "wydz",
        name: "\u5929\u8857",
        x: 117.098694,
        y: 36.2558
    },
    {
        id: "nantian",
        name: "\u5357\u5929\u95e8",
        x: 117.098355,
        y: 36.255723
    }];
    return {
        init: function(a, b, d) {
            f = new OpenLayers.Layer.Vector("\u89c6\u9891", {
                style: b,
                renderers: a
            });
            e = d;
            e.addLayer(f, !0);
            f.events.on({
                featureselected: function(a) {
                    c(a.feature)
                }
            });
            h = !0
        },
        Show: function(a) {
            h && b(a)
        },
        Hide: function() {
            f.setVisibility(!1);
            null != e.widgetPop && e.removePopup(e.widgetPop)
        },
        Dispose: function() {
            e.removeLayer(f, !0);
            null != e.widgetPop && e.removePopup(e.widgetPop);
            h = !1;
            f = null
        },
        isInit: function() {
            return h
        }
    }
}
function PopulationWidget() {
    function b(b) {
        b != x && (null != a.widgetPop && a.removePopup(a.widgetPop), x = b, "rkzs" == x ? (v.css({
            width: "166px",
            height: "82px",
            display: "block",
            background: "url('images/statics/rk_legend1.png')"
        }), 0 < q.length ? c() : $.ajax({
            type: "GET",
            url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/Statistics/StatisticsService.asmx/GetRKZS?year\x3d2013",
            datatype: "xml",
            success: function(a) {
                e(a)
            },
            error: function(a, b) {
                console.log && console.log("\u4eba\u53e3\u7edf\u8ba1\u6570\u636e\u8bf7\u6c42" + b)
            }
        })) : (v.css({
            width: "381px",
            height: "148px",
            display: "block",
            background: "url('images/statics/rk_legend.png')"
        }), 0 < r.length ? f() : $.ajax({
            type: "GET",
            url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/Statistics/StatisticsService.asmx/GetRKMD?year\x3d2013\x26level\x3d3",
            datatype: "xml",
            success: function(a) {
                e(a)
            },
            error: function(a, b) {
                console.log && console.log("\u4eba\u53e3\u7edf\u8ba1\u6570\u636e\u8bf7\u6c42" + b)
            }
        })))
    }
    function c(b) {
        console.log(" PopulationWidget  zoomed");
        557114 < a.map.getScale() ? 3 == p && f(2) : 2 == p && f(3)
    }
    function e(b) {
        if (b) {
            var c;
            c = b.documentElement.textContent || b.documentElement.text;
            c = eval("(" + c + ")");
            b = c.Result;
            var d = c.Count;
            if ("rkzs" == x) {
                for (c = 0; c < d; c++)"2" == b[c].level ? q.push(b[c]) : m.push(b[c]);
                557114 < a.map.getScale() ? f(2) : f(3)
            } else {
                var e = new OpenLayers.Format.WKT;
                for (c = 0; c < d; c++) r.push({
                    rkmd: b[c].rkmd,
                    geom: e.read(b[c].geometry)
                });
                f()
            }
        }
    }
    function f(a) {
        g.removeAllFeatures();
        if ("rkzs" == x) {
            p = a;
            var b, c, d, e, f;
            if (2 == p) for (d = 0, e = q.length; d < e; d++) c = q[d],
            a = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(c.x, c.y)),
            b = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]),
            b.externalGraphic = "images/statics/point.png",
            f = parseInt(Math.sqrt(2 * c.rkzs)),
            b.graphicWidth = f,
            b.graphicHeight = f,
            b.fillOpacity = 1,
            b.cursor = "pointer",
            a.style = b,
            a.attributes = c,
            g.addFeatures(a);
            else for (d = 0, e = m.length; d < e; d++) c = m[d],
            a = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(c.x, c.y)),
            b = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]),
            b.externalGraphic = "images/statics/point.png",
            f = parseInt(Math.sqrt(20 * c.rkzs)),
            b.graphicWidth = f,
            b.graphicHeight = f,
            b.fillOpacity = 1,
            b.cursor = "pointer",
            a.style = b,
            a.attributes = c,
            g.addFeatures(a)
        } else for (d = 0, e = r.length; d < e; d++) c = r[d],
        a = c.geom,
        b = OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style["default"]),
        f = 3E3 < c.rkmd ? "#6b0000": 800 < c.rkmd ? "#ad5313": 500 < c.rkmd ? "#f2a72e": 300 < c.rkmd ? "#fad155": "#ffff80",
        b.strokeColor = "#ffffff",
        b.strokeOpacity = .75,
        b.fillColor = f,
        b.strokeWidth = 1,
        b.fillOpacity = .75,
        b.cursor = "pointer",
        a.style = b,
        a.attributes = {
            rkmd: c.rkmd
        },
        g.addFeatures(a)
    }
    function h() {
        y.style.fillOpacity = .75;
        g.drawFeature(y);
        a.removePopup(a.widgetPop);
        y = null;
        a.unSelect()
    }
    function d(b) {
        function c() {
            $("#staticsDiv").highcharts({
                chart: {
                    type: "column"
                },
                title: {
                    text: ""
                },
                legend: {
                    enabled: !1
                },
                xAxis: {
                    categories: [f.Result[0].year, f.Result[1].year, f.Result[2].year]
                },
                yAxis: {
                    min: k - 3,
                    title: {
                        text: "\u4e07\u4eba"
                    }
                },
                tooltip: {
                    headerFormat: '\x3cspan style\x3d"font-size:10px"\x3e{point.key}\x3c/span\x3e\x3ctable\x3e',
                    pointFormat: '\x3ctr\x3e\x3ctd style\x3d"color:{series.color};padding:0"\x3e{series.name}: \x3c/td\x3e\x3ctd style\x3d"padding:0"\x3e\x3cb\x3e{point.y:.1f}\u4e07\x3c/b\x3e\x3c/td\x3e\x3c/tr\x3e',
                    footerFormat: "\x3c/table\x3e",
                    shared: !0,
                    useHTML: !0
                },
                series: [{
                    name: "\u4eba\u53e3\u6570",
                    data: m,
                    size: "30%",
                    dataLabels: {
                        formatter: function() {
                            return this.point.name
                        },
                        color: "yellow",
                        distance: -15
                    }
                }]
            })
        }
        function d() {
            $("#staticsDiv").highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: !1
                },
                legend: {
                    align: "center"
                },
                title: {
                    text: ""
                },
                tooltip: {
                    pointFormat: "{series.name}: \x3cb\x3e{point.percentage:.1f}%\x3c/b\x3e"
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: !0,
                        cursor: "pointer",
                        dataLabels: {
                            enabled: !0,
                            color: "#000000",
                            connectorColor: "#000000",
                            format: "\x3cb\x3e{point.y}\x3c/b\x3e"
                        },
                        showInLegend: !0
                    }
                },
                series: [{
                    type: "pie",
                    name: "\u767e\u5206\u6bd4",
                    data: n,
                    size: "100%",
                    dataLabels: {
                        formatter: function() {
                            return this.point.name
                        },
                        color: "white",
                        distance: -25
                    }
                }]
            })
        }
        null != a.widgetPop && a.removePopup(a.widgetPop);
        if ("rkmd" == x) y && (y.style.fillOpacity = .75, g.drawFeature(y)),
        y = b,
        a.widgetPop = new OpenLayers.Popup("\u6587\u672c\u6807\u6ce8", b.geometry.getBounds().getCenterLonLat(), new OpenLayers.Size(80, 18), "\x3cdiv style \x3d 'position:relative; cursor:pointer;'\x3e\x3cb\x3e" + b.attributes.rkmd + "\x3c/div\x3e", !0, h),
        y.style.fillOpacity = .5,
        g.drawFeature(y),
        b.popup = a.widgetPop,
        a.addPopup(a.widgetPop);
        else {
            var e = "";
            2 == p && (e = "\x3cdiv id \x3d 'staticsTab2'\x3e\x3cdiv class\x3d'stc_xqpic'\x3e\x3c/div\x3e\x3cdiv class\x3d'stc_title'\x3e\u53bf\u533a\u6bd4\u4f8b\u56fe\x3c/div\x3e\x3c/div\x3e");
            a.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", b.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style\x3d'padding:0 5px;'\x3e\x3cdiv style \x3d 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'\x3e\x3cb\x3e" + b.attributes.name + "\u4eba\u53e3\u6570\u636e\x3c/b\x3e \x3c/div\x3e\x3cdiv class\x3d'maindiv'\x3e\x3cdiv class\x3d'titlediv' \x3e\x3cdiv id \x3d 'staticsTab1'\x3e\x3cdiv class\x3d'stc_hispic active'\x3e\x3c/div\x3e\x3cdiv class\x3d'stc_title active'\x3e\u5386\u5e74\u5bf9\u6bd4\u56fe\x3c/div\x3e\x3c/div\x3e" + e + "\x3c/div\x3e\x3cdiv id \x3d 'staticsDiv'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e", null, !0,
            function() {
                a.removePopup(a.widgetPop);
                a.unSelect()
            });
            b.popup = a.widgetPop;
            a.addPopup(a.widgetPop);
            b = $.ajax({
                url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/Statistics/StatisticsService.asmx/GetHistoryRKZS?pac\x3d" + b.attributes.pac + "\x26year\x3d2013",
                dataType: "xml",
                async: !1
            });
            b = b.responseText;
            b = b.substring(76, b.length - 9);
            var f = eval("(" + b + ")"),
            m = [parseFloat(f.Result[0].rkzs), parseFloat(f.Result[1].rkzs), parseFloat(f.Result[2].rkzs)],
            k = 0,
            k = m[0] < m[1] ? m[0] : m[1] < m[2] ? m[1] : m[2],
            n = [];
            if (0 < f.items.length) for (b = 0, e = f.items.length; b < e; b++) n.push({
                name: f.items[b].name,
                y: parseFloat(f.items[b].rkzs)
            });
            $(".titlediv\x3ediv").click(function(a) {
                a = $(this);
                "staticsTab1" == this.id ? c() : d();
                a.children().addClass("active");
                a.siblings().children().removeClass("active")
            });
            c()
        }
    }
    if (null != PopulationWidget.unique) return PopulationWidget.unique;
    PopulationWidget.unique = this;
    var a = null,
    g = null,
    n = !1,
    l = null,
    q = [],
    m = [],
    r = [],
    p,
    v = null,
    x = "",
    y = null;
    return {
        init: function(b, c, e) {
            g = new OpenLayers.Layer.Vector("\u4eba\u53e3", {
                style: c,
                renderers: b
            });
            a = e;
            a.addLayer(g, !0);
            g.events.on({
                featureselected: function(a) {
                    d(a.feature)
                }
            });
            l = new OpenLayers.Control.EditingToolbar(g);
            a.map.addControl(l);
            $(".olControlEditingToolbar").hide();
            v = $("\x3cdiv style\x3d'z-index:980;border:1px solid #696969;position:absolute;right:50px;bottom:50px;'\x3e\x3c/div\x3e");
            $(a.map.div).after(v);
            n = !0
        },
        Show: function(d) {
            d = null == d ? "rkzs": d.split("_")[1];
            n && (b(d), a.map.events.register("zoomend", a.map, c))
        },
        Hide: function() {
            g.setVisibility(!1);
            null != a.widgetPop && a.removePopup(a.widgetPop);
            v.hide()
        },
        Dispose: function() {
            a.removeLayer(g, !0);
            null != a.widgetPop && a.removePopup(a.widgetPop);
            a.map.events.unregister("zoomend", a.map, c);
            n = !1;
            g = null;
            v.remove();
            v = null;
            x = "";
            q = [];
            m = [];
            r = []
        },
        isInit: function() {
            return n
        }
    }
}
function EconomicWidget() {
    function b(b) {
        b != r && (null != a.widgetPop && a.removePopup(a.widgetPop), r = b, 0 < q[r].length ? c() : $.ajax({
            type: "GET",
            url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/Statistics/StatisticsService.asmx" + ("gdp" == r ? "/GetGDP?year\x3d2013": "czsr" == r ? "/GetCZSR?year\x3d2013": "/GetBQX?year\x3d2013"),
            datatype: "xml",
            success: function(a) {
                e(a)
            },
            error: function(a, b) {
                console.log && console.log(r + "\u6570\u636e\u8bf7\u6c42" + b)
            }
        }))
    }
    function c(b) {
        console.log("EconomicWidget zoomed");
        557114 < a.map.getScale() ? 3 != m && b || f(2) : 2 != m && b || f(3)
    }
    function e(b) {
        if (b) {
            var c;
            c = b.documentElement.textContent || b.documentElement.text;
            c = eval("(" + c + ")");
            b = c.Result;
            var d = c.Count,
            e = [],
            g = [];
            if ("bqx" != r) {
                for (c = 0; c < d; c++)"2" == b[c].level ? e.push(b[c]) : g.push(b[c]);
                q[r] = [e, g];
                557114 < a.map.getScale() ? f(2) : f(3)
            } else q[r] = b,
            f()
        }
    }
    function f(a) {
        g.removeAllFeatures();
        m = a;
        var b, c, d, e, f, h = [];
        if ("gdp" == r) for (l.css({
            width: "185px",
            height: "85px",
            display: "block",
            background: "url('images/statics/jj_legend1.png')"
        }), f = q[r][m - 2], d = 0, e = f.length; d < e; d++) c = f[d],
        a = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(c.x, c.y)),
        b = OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style["default"]),
        b.fillOpacity = 1,
        b.cursor = "pointer",
        b.externalGraphic = "images/statics/bar.png",
        b.graphicWidth = 20,
        b.graphicHeight = 2 == m ? parseInt(c.sczz / 100) : parseInt(c.sczz / 10),
        a.style = b,
        a.attributes = c,
        h.push(a);
        else if ("czsr" == r) {
            l.css({
                width: "167px",
                height: "83px",
                display: "block",
                background: "url('images/statics/jj_legend2.png')"
            });
            var p;
            f = q[r][m - 2];
            d = 0;
            for (e = f.length; d < e; d++) c = f[d],
            a = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(c.x, c.y)),
            b = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]),
            b.fillOpacity = 1,
            b.cursor = "pointer",
            b.externalGraphic = "images/statics/boll.png",
            p = 2 == m ? parseInt(Math.sqrt(8 * c.dfsr)) : parseInt(Math.sqrt(40 * c.dfsr)),
            b.graphicWidth = b.graphicHeight = p,
            a.style = b,
            a.attributes = c,
            h.push(a)
        } else for (l.css({
            width: "145px",
            height: "85px",
            display: "block",
            background: "url('images/statics/jj_legend3.png')"
        }), f = q[r], d = 0, e = f.length; d < e; d++) c = f[d],
        a = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(c.x, c.y)),
        b = OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style["default"]),
        b.fillOpacity = 1,
        b.cursor = "pointer",
        b.externalGraphic = "images/statics/boll.png",
        b.graphicWidth = b.graphicHeight = 40,
        b.label = c.name + "\u7b2c" + c.order + "\u4f4d",
        b.labelYOffset = -25,
        b.fontColor = "blue",
        b.fontWeight = "bold",
        a.style = b,
        a.attributes = c,
        h.push(a);
        g.addFeatures(h)
    }
    function h() {
        a.removePopup(a.widgetPop);
        a.unSelect()
    }
    function d(b) {
        function c() {
            $("#staticsDiv").highcharts({
                chart: {
                    type: "column"
                },
                title: {
                    text: ""
                },
                legend: {
                    enabled: !1
                },
                xAxis: {
                    categories: q
                },
                yAxis: {
                    min: n,
                    title: {
                        text: "\u4ebf\u5143"
                    }
                },
                tooltip: {
                    headerFormat: '\x3cspan style\x3d"font-size:10px"\x3e{point.key}\x3c/span\x3e\x3ctable\x3e',
                    pointFormat: '\x3ctr\x3e\x3ctd style\x3d"color:{series.color};padding:0"\x3e{series.name}: \x3c/td\x3e\x3ctd style\x3d"padding:0"\x3e\x3cb\x3e{point.y:.1f}\u4ebf\u5143\x3c/b\x3e\x3c/td\x3e\x3c/tr\x3e',
                    footerFormat: "\x3c/table\x3e",
                    shared: !0,
                    useHTML: !0
                },
                series: [{
                    name: g,
                    data: l,
                    size: "30%",
                    dataLabels: {
                        formatter: function() {
                            return this.point.name
                        },
                        color: "yellow",
                        distance: -15
                    }
                }]
            })
        }
        function d() {
            $("#staticsDiv").highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: !1
                },
                legend: {
                    align: "center"
                },
                title: {
                    text: ""
                },
                tooltip: {
                    pointFormat: "{series.name}: \x3cb\x3e{point.percentage:.1f}%\x3c/b\x3e"
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: !0,
                        cursor: "pointer",
                        dataLabels: {
                            enabled: !0,
                            color: "#000000",
                            connectorColor: "#000000",
                            format: "\x3cb\x3e{point.y}\x3c/b\x3e"
                        },
                        showInLegend: !0
                    }
                },
                series: [{
                    type: "pie",
                    name: "\u767e\u5206\u6bd4",
                    data: C,
                    size: "100%",
                    dataLabels: {
                        formatter: function() {
                            return this.point.name
                        },
                        color: "white",
                        distance: -25
                    }
                }]
            })
        }
        null != a.widgetPop && a.removePopup(a.widgetPop);
        if ("bqx" == r) a.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", b.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style \x3d'position:relative;margin:0 5px;cursor:pointer;color:#3B9CFE;font-size:14px;'\x3e\x3cb\x3e" + b.attributes.name + "\x3c/b\x3e\x3c/div \x3e\x3cbr/\x3e\x3cdiv style\x3d'margin:0 6px;'\x3e\u56fd\u6c11\u751f\u4ea7\u603b\u503c(GDP):" + b.attributes.sczz + "\u4ebf\u5143\x3cbr/\x3e\u8d22\u653f\u6536\u5165\uff1a" + b.attributes.dfsr + "\u4ebf\u5143\x3c/div\x3e", null, !0, h),
        b.popup = a.widgetPop,
        a.addPopup(a.widgetPop);
        else {
            var e = "",
            g, f, p;
            "gdp" == r ? (f = "/GetHistoryGDP", g = "\u56fd\u6c11\u751f\u4ea7\u603b\u503c(GDP)", p = "sczz") : (f = "/GetHistoryCZSR", g = "\u8d22\u653f\u6536\u5165", p = "dfsr");
            2 == m && (e = "\x3cdiv id \x3d 'staticsTab2'\x3e\x3cdiv class\x3d'stc_xqpic'\x3e\x3c/div\x3e\x3cdiv class\x3d'stc_title'\x3e\u53bf\u533a\u6bd4\u4f8b\u56fe\x3c/div\x3e\x3c/div\x3e");
            a.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", b.geometry.getBounds().getCenterLonLat(), null, "\x3cdiv style\x3d'padding:0 5px;'\x3e\x3cdiv style \x3d 'position:relative;font-size: 14px; margin-bottom:10px;cursor:pointer;color:#3b9cfe;'\x3e\x3cb\x3e" + b.attributes.name + g + "\x3c/b\x3e \x3c/div\x3e\x3cdiv class\x3d'maindiv'\x3e\x3cdiv class\x3d'titlediv' \x3e\x3cdiv id \x3d 'staticsTab1'\x3e\x3cdiv class\x3d'stc_hispic active'\x3e\x3c/div\x3e\x3cdiv class\x3d'stc_title active'\x3e\u5386\u5e74\u5bf9\u6bd4\u56fe\x3c/div\x3e\x3c/div\x3e" + e + "\x3c/div\x3e\x3cdiv id \x3d 'staticsDiv'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e", null, !0, h);
            b.popup = a.widgetPop;
            a.addPopup(a.widgetPop);
            b = $.ajax({
                url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/Statistics/StatisticsService.asmx" + f + "?pac\x3d" + b.attributes.pac + "\x26year\x3d2013",
                dataType: "xml",
                async: !1
            });
            b = b.responseText;
            b = b.substring(76, b.length - 9);
            b = eval("(" + b + ")");
            var n = 0,
            l = [],
            q = [],
            k;
            f = 0;
            for (e = b.Count; f < e; f++) k = parseFloat(b.Result[f][p]),
            0 != k && (l.push(k), q.push(b.Result[f].year), n > l[f] && (n = l[f]));
            var C = [];
            if (0 < b.items.length) for (f = 0, e = b.items.length; f < e; f++) C.push({
                name: b.items[f].name,
                y: parseFloat(b.items[f][p])
            });
            $(".titlediv\x3ediv").click(function(a) {
                a = $(this);
                "staticsTab1" == this.id ? c() : d();
                a.children().addClass("active");
                a.siblings().children().removeClass("active")
            });
            c()
        }
    }
    if (null != EconomicWidget.unique) return EconomicWidget.unique;
    EconomicWidget.unique = this;
    var a = null,
    g = null,
    n = !1,
    l, q = {
        gdp: [],
        czsr: [],
        bqx: []
    },
    m,
    r = "";
    return {
        init: function(b, c, e) {
            g = new OpenLayers.Layer.Vector("\u7ecf\u6d4e", {
                style: new OpenLayers.StyleMap({
                    "default": {
                        strokeColor: "red",
                        strokeOpacity: .8,
                        strokeWidth: 2,
                        fillColor: "red",
                        fillOpacity: .8,
                        pointRadius: 4,
                        pointerEvents: "visiblePainted",
                        label: "${label}",
                        fontColor: "blue",
                        fontSize: "12px",
                        fontFamily: "SimHei",
                        fontWeight: "bold",
                        labelOutlineColor: "white",
                        labelOutlineWidth: 1
                    }
                }),
                renderers: b
            });
            a = e;
            a.addLayer(g, !0);
            g.events.on({
                featureselected: function(a) {
                    d(a.feature)
                }
            });
            l = $("\x3cdiv style\x3d'z-index:980;border:1px solid #696969;position:absolute;right:50px;bottom:50px;'\x3e\x3c/div\x3e");
            $(a.map.div).after(l);
            n = !0
        },
        Show: function(d) {
            d = null == d ? "gdp": d.split("_")[1];
            n && (b(d), a.map.events.register("zoomend", a.map, c))
        },
        Hide: function() {
            g.setVisibility(!1);
            null != a.widgetPop && a.removePopup(a.widgetPop);
            l.hide()
        },
        Dispose: function() {
            a.removeLayer(g, !0);
            null != a.widgetPop && a.removePopup(a.widgetPop);
            a.map.events.unregister("zoomend", a.map, c);
            g = null;
            n = !1;
            l.remove();
            q = {
                gdp: [],
                czsr: [],
                bqx: []
            };
            r = ""
        },
        isInit: function() {
            return n
        }
    }
}
function ScenicWidget() {
    function b() {
        0 < q.length ? e() : $.ajax({
            type: "GET",
            url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/sdmapServices/ScenicWebService.asmx/GetHotScenics?scale\x3d2000",
            datatype: "xml",
            success: function(a) {
                c(a)
            },
            error: function(a, b) {
                console.log && console.log("\u65c5\u6e38\u6570\u636e\u8bf7\u6c42" + b)
            }
        })
    }
    function c(a) {
        if (a) {
            var b, c = a.documentElement.textContent || a.documentElement.text,
            c = eval(c),
            d = [],
            f = [],
            g = [];
            a = 0;
            for (b = c.length; a < b; a++)"100000" == c[a].scale ? d.push(c[a]) : "414059" == c[a].scale ? f.push(c[a]) : g.push(c[a]);
            q = [d, f, g];
            e()
        }
    }
    function e() {
        var b, c, d = [],
        e = [];
        1E5 >= a.map.getScale() ? (d = q[0].concat(q[1]).concat(q[2]), g = 3) : 414059 >= a.map.getScale() ? (d = q[1].concat(q[2]), g = 2) : 9999999 >= a.map.getScale() && (d = q[2], g = 1);
        b = 0;
        for (c = d.length; b < c; b++) {
            var f = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(d[b].x, d[b].y)),
            h = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]);
            h.externalGraphic = "http://www.sdmap.gov.cn:8081/pics/thumbnail/" + d[b].id + ".jpg";
            h.graphicWidth = 80;
            h.graphicHeight = 53;
            h.fillOpacity = 1;
            h.cursor = "pointer";
            f.style = h;
            f.attributes = d[b];
            e.push(f)
        }
        n.removeAllFeatures();
        n.addFeatures(e)
    }
    function f(b) {
        null != a.widgetPop && (a.removePopup(a.widgetPop), c = $("#ssss_conn"));
        "string" == typeof d && (d = $(d));
        var c = d,
        e = $.ajax({
            url: "proxy/proxy.ashx?http://www.sdmap.gov.cn:8081/sdmapServices/ScenicWebService.asmx/GetScenicInfo?scenicId\x3d" + b.attributes.id,
            datatype: "xml",
            async: !1
        }),
        e = e.responseText,
        e = e.substring(76, e.length - 9),
        e = eval("(" + e + ")"),
        f,
        g = [],
        h;
        h = !1;
        var n;
        c.find("#s_title_cont").text(e.nameCn);
        var l = e.pictures;
        for (f = 0; f < l.length; f++)"\u56fe\u7247" == l[f].phoFormat ? (g.push("\x3cli\x3e\x3cimg width\x3d'32'height\x3d'32'src\x3d'http://www.sdmap.gov.cn:8081/pics" + l[f].phoPath + "'/\x3e\x3c/li\x3e"), h || (c.find("#s_reppic img").attr("src", "http://www.sdmap.gov.cn:8081/pics" + l[f].phoPath), h = !0)) : "\u89c6\u9891" == l[f].phoFormat && (n = f);
        c.find("#s_gallery .imglist").empty().append(g.join(""));
        h = e.scenicLevel.length - 1;
        f = 0;
        for (g = []; f < h; f++) g.push("\x3cimg src\x3d'images/scenic/bookmark.png'/\x3e");
        c.find("#s_jian_tj").empty().append(g.join(""));
        c.find("#s_jian_jb").attr("title", e.scenicLevel).text(e.scenicLevel);
        c.find("#s_jian_lx").attr("title", e.scenicTypes).text(e.scenicTypes);
        c.find("#s_jian_mp").text(e.scenicPrices[0].priceType + e.scenicPrices[0].price);
        h = e.contacts;
        f = 0;
        for (g = []; f < h.length; f++) g.push(h[f].BusType + h[f].contactType + ":" + h[f].contact);
        h = g.join(",");
        c.find("#s_jian_lianx").attr("title", h).text(h);
        "" != e.comWebsite && c.find("#s_jian_url").attr("href", e.comWebsite);
        c.find("#s_jian_addr").text(e.address);
        h = e.bestSeasons;
        c.find("#s_jian_bst").text("");
        null != n && c.find("#s_video embed").attr("flashvars", "vcastr_file\x3dhttp://www.sdmap.gov.cn:8081/pics" + l[n].phoPath + "\x26IsAutoPlay\x3d0");
        c.find("#s_xq_cont").text(e.attdesM);
        c.find("#s_jt_zx").text(e.trafficInf);
        c.find("#s_jt_ly").text(e.busInf);
        c.find("#s_jt_zj").text(e.selfDrInf);
        c.find("#s_jt_tc").text(e.suppSerFac);
        "1" == e.ifGasstation && c.find("#s_jt_jy").text(e.gasStationName + "\u8ddd\u79bb" + e.nameCn + "\u7ea6" + e.disGasStation + "\u516c\u91cc");
        c.find("#s_fw_xm").text("\u65e0\u4fe1\u606f");
        c.find("#s_fw_jj").text(e.exposterPrice);
        c.find("#s_fw_pt").text(e.suppSerFac);
        c.find("#s_fw_hd").text("\u65e0\u4fe1\u606f");
        c.find("#s_fw_rq").text(e.adaptGroups);
        c.find("#s_fw_kk").text(e.viewdegree);
        c.find("#s_fw_cj").text(e.incitement);
        n = new OpenLayers.Size(486, 285);
        a.widgetPop = new OpenLayers.Popup.FramedCloud("chicken", b.geometry.getBounds().getCenterLonLat(), n, c.html(), null, !1);
        b.popup = a.widgetPop;
        a.addPopup(a.widgetPop);
        $("#close_popup").click(function() {
            a.removePopup(a.widgetPop);
            a.unSelect()
        });
        $("#s_gallery").xslider({
            unitdisplayed: 4,
            movelength: 1,
            unitlen: 33
        });
        $("#s_title :button").click(function(a) {
            a = $(this);
            var b = a.index();
            a.css("color", "blue").siblings().css("color", "black");
            $("#s_content\x3ediv:eq(" + b + ")").css("display", "block").siblings().css("display", "none")
        });
        $("#s_gallery .imglist_w li").click(function() {
            var a = $(this);
            a.css("border", "solid 2px blueviolet").siblings().css("border", "solid 1px #ddd");
            a = a.children().attr("src");
            $("#s_reppic img").attr("src", a)
        })
    }
    function h() {
        console.log("ScenicWidget zoomed");
        var b = !1;
        1E5 > a.map.getScale() ? 3 != g && (b = !0) : 414059 > a.map.getScale() ? 2 != g && (b = !0) : 9999999 >= a.map.getScale() && 1 != g && (b = !0);
        b && e()
    }
    if (null != ScenicWidget.unique) return ScenicWidget.unique;
    ScenicWidget.unique = this;
    var d = "\x3cdiv id\x3d'ssss_conn'\x3e\x3cdiv id\x3d's_title' style\x3d'width: 460px;height: 25px;'\x3e\x3cspan id\x3d's_title_cont' style\x3d'color: #ff9800;font-size: 14px;font-weight: bold;padding-left:10px;'\x3e\x3c/span\x3e\x3cdiv style\x3d'position:absolute;right:20px;top:0'\x3e\x3cinput type\x3d'button' style\x3d'color:blue;' value\x3d'\u666f\u533a\u7b80\u4ecb' /\x3e\x3cinput type\x3d'button' value\x3d'\u666f\u533a\u8be6\u60c5' /\x3e\x3cinput type\x3d'button' value\x3d'\u4ea4\u901a\u6307\u5357' /\x3e\x3cinput type\x3d'button' value\x3d'\u670d\u52a1\u6307\u5357' /\x3e\x3c/div\x3e\x3cimg id\x3d'close_popup' src\x3d'images/close.gif' style\x3d'position:absolute;top:2px;right:0'/\x3e\x3c/div\x3e\x3cdiv id\x3d's_content' style\x3d'width: 460px;padding-top: 5px; height:245px;background-color: white'\x3e\x3cdiv id\x3d's_jianjie' style\x3d'display: block'\x3e\x3cdiv style\x3d'float: left;width: 210px'\x3e\x3cdiv id\x3d's_reppic'\x3e\x3cimg src\x3d'' width\x3d'208' height\x3d'208' /\x3e\x3c/div\x3e\x3cdiv class\x3d'scrolllist' id\x3d's_gallery'\x3e\x3ca class\x3d'abtn aleft' href\x3d'#left' title\x3d'\u5de6\u79fb'\x3e\x3c/a\x3e\x3cdiv class\x3d'imglist_w'\x3e\x3cul class\x3d'imglist'\x3e\x3c/ul\x3e\x3c/div\x3e\x3ca class\x3d'abtn aright' href\x3d'#right' title\x3d'\u53f3\u79fb'\x3e\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'jianjie' style\x3d'float: left;margin-left: 10px;width: 230px;overflow:hidden;white-space: nowrap'\x3e\u63a8\u8350\u5ea6\uff1a\x3cspan id\x3d's_jian_tj'\x3e\x3c/span\x3e\x3cbr /\x3e\u666f\u70b9\u7ea7\u522b\uff1a\x3cspan id\x3d's_jian_jb'\x3e\x3c/span\x3e\x3cbr /\x3e\u666f\u533a\u7c7b\u578b:\x3cspan id\x3d's_jian_lx'\x3e\x3c/span\x3e\x3cbr /\x3e\u95e8\u7968\u4fe1\u606f\uff1a\x3cspan id\x3d's_jian_mp'\x3e\x3c/span\x3e\x3cbr /\x3e \u8054\u7cfb\u65b9\u5f0f\uff1a\x3cspan id\x3d's_jian_lianx'\x3e\x3c/span\x3e\x3cbr /\x3e\u666f\u533a\u7f51\u5740\uff1a\x3cspan\x3e\x3ca id\x3d's_jian_url' href\x3d'' target\x3d'_blank'\x3e\u70b9\u51fb\u67e5\u770b\u8be6\u60c5\x3c/a\x3e\x3c/span\x3e\x3cbr /\x3e\u8be6\u7ec6\u5730\u5740\uff1a\x3cspan id\x3d's_jian_addr'\x3e\x3c/span\x3e\x3cbr /\x3e\u6700\u4f73\u6d4f\u89c8\u5b63\u8282\uff1a\x3cspan id\x3d's_jian_bst'\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d's_xiangqing' style\x3d'display: none'\x3e\x3cdiv id\x3d's_video' style\x3d'width: 256px;height: 244px;float: left;'\x3e\x3cobject classid\x3d'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase\x3d'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version\x3d6,0,29,0' width\x3d'256' height\x3d'244'\x3e\x3cparam name\x3d'movie' value\x3d'third/vcastr22.swf'\x3e\x3c/param\x3e\x3cparam name\x3d'quality' value\x3d'high'\x3e\x3c/param\x3e\x3cparam name\x3d'allowFullScreen' value\x3d'false'\x3e\x3c/param\x3e\x3cembed src\x3d'third/vcastr22.swf' allowfullscreen\x3d'true' flashvars\x3d'vcastr_file\x3d' quality\x3d'high' pluginspage\x3d'http://www.macromedia.com/go/getflashplayer' type\x3d'application/x-shockwave-flash' width\x3d'256' height\x3d'244' /\x3e\x3c/object\x3e\x3c/div\x3e\x3cdiv id\x3d's_xq_cont' style\x3d'width:188px;float: left ;height: 230px;margin-left: 10px;padding: 0;line-height: 16px;'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d's_jiaotong' style\x3d'display: none;'\x3e\x3cdiv style\x3d'height: 47px;'\x3e\x3cdiv style\x3d'float: left;width:82px;font-size: 13px;font-weight: bold; '\x3e\u4ea4\u901a\u54a8\u8be2\uff1a\x3c/div\x3e\x3cdiv id\x3d's_jt_zx' style\x3d'float: left;overflow-y: auto;padding: 4px 0; width: 370px'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 47px;'\x3e\x3cdiv style\x3d'float: left;width:82px;font-size: 13px;font-weight: bold;'\x3e\u65c5\u6e38\u4e13\u7ebf\uff1a\x3c/div\x3e\x3cdiv id\x3d's_jt_ly' style\x3d'float: left;overflow-y: auto;padding: 4px 0; width: 370px;height: 47px'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 47px;'\x3e\x3cdiv style\x3d'float: left;width:82px;font-size: 13px;font-weight: bold;'\x3e\u81ea\u9a7e\u6307\u5357\uff1a\x3c/div\x3e\x3cdiv id\x3d's_jt_zj' style\x3d'float: left;overflow-y: auto;padding: 4px 0;width: 370px;height: 47px'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 27px;'\x3e\x3cdiv style\x3d'float: left;width:92px;font-size: 13px;font-weight: bold;'\x3e\u505c\u8f66\u573a\u4fe1\u606f\uff1a\x3c/div\x3e\x3cdiv id\x3d's_jt_tc' style\x3d'float: left;overflow-y: auto;padding: 4px 0;width: 358px;height: 47px'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 27px;'\x3e\x3cdiv style\x3d'float: left;width:82px;font-size: 13px;font-weight: bold;'\x3e\u52a0\u6cb9\u7ad9\uff1a\x3c/div\x3e\x3cdiv id\x3d's_jt_jy' style\x3d'float:left;overflow-y: auto;width: 350px'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv id\x3d's_fuwu' style\x3d'display:none;line-height: 20px'\x3e\x3cdiv style\x3d'height: 36px;'\x3e\x3cdiv style\x3d'float: left;width:102px;font-size: 13px;font-weight: bold;'\x3e\u666f\u533a\u65c5\u6e38\u9879\u76ee\uff1a\x3c/div\x3e\x3cdiv id\x3d's_fw_xm' style\x3d'float: left;overflow-y: auto; width: 345px;height: 36px'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 36px;'\x3e\x3cdiv style\x3d'float: left;width:102px;font-size: 13px;font-weight: bold;'\x3e\u8bb2\u89e3\u5458\u4ef7\u683c\uff1a\x3c/div\x3e\x3cdiv id\x3d's_fw_jj' style\x3d'float: left;overflow-y: auto;width: 350px;height:36px'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 47px;'\x3e\x3cdiv style\x3d'float: left;width:102px;font-size: 13px;font-weight: bold;'\x3e\u914d\u5957\u670d\u52a1\u8bbe\u65bd\uff1a\x3c/div\x3e\x3cdiv id\x3d's_fw_pt' style\x3d'float: left;overflow-y: auto;width: 345px;height: 47px'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 47px;'\x3e\x3cdiv style\x3d'float: left;width:102px;font-size: 13px;font-weight: bold;'\x3e\u5e38\u8bbe\u65c5\u6e38\u6d3b\u52a8\uff1a\x3c/div\x3e\x3cdiv id\x3d's_fw_hd' style\x3d'float: left;overflow-y:uto;width: 350px;height: 47px;'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 27px;'\x3e\x3cdiv style\x3d'float: left;width:82px;font-size: 13px;font-weight: bold;'\x3e\u9002\u5408\u4eba\u7fa4\uff1a\x3c/div\x3e\x3cdiv id\x3d's_fw_rq' style\x3d'float: left;overflow-y: auto;width: 350px;height: 27px;'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 27px;'\x3e\x3cdiv style\x3d'float: left;width:82px;font-size: 13px;font-weight: bold;'\x3e\u53ef\u770b\u5ea6\uff1a\x3c/div\x3e\x3cdiv id\x3d's_fw_kk' style\x3d'float: left;overflow-y: auto;width: 350px;height: 27px;'\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv style\x3d'height: 27px;'\x3e\x3cdiv style\x3d'float: left;width:82px;font-size: 13px;font-weight: bold;'\x3e\u523a\u6fc0\u5ea6\uff1a\x3c/div\x3e\x3cdiv id\x3d's_fw_cj' style\x3d'float: left;overflow-y: auto;width: 350px;height: 27px;'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e",
    a = null,
    g, n = null,
    l = !1,
    q = [];
    return {
        init: function(b, c, d) {
            n = new OpenLayers.Layer.Vector("\u666f\u70b9", {
                style: c,
                renderers: b
            });
            a = d;
            a.addLayer(n, !0);
            n.events.on({
                featureselected: function(a) {
                    f(a.feature)
                }
            });
            l = !0
        },
        Show: function() {
            l && (b(), a.map.events.register("zoomend", a.map, h))
        },
        Hide: function() {
            n.setVisibility(!1);
            null != a.widgetPop && a.removePopup(a.widgetPop)
        },
        Dispose: function() {
            a.removeLayer(n, !0);
            null != a.widgetPop && a.removePopup(a.widgetPop);
            l = !1;
            a.map.events.unregister("zoomend", a.map, h);
            n = null;
            q = []
        },
        isInit: function() {
            return l
        }
    }
}
var WidgetManger = function() {
    function b(b, d) {
        c[b] && (!c[b].isInit() && c[b].init(f, e, h), d ? c[b].Show(d) : c[b].Show(a[b]))
    }
    var c, e, f, h, d = !1,
    a = [];
    a.rain = "r_river";
    a.population = "popu_rkzs";
    a.economy = "eco_gdp";
    return {
        init: function(g) {
            d || (h = g, 0 < $("#d_gzfw").length && $("#d_gzfw").append("\x3cul id\x3d'Rwidget_ul' class\x3d'submenu'\x3e    \x3cli id\x3d'weather' class\x3d'rightBtn'\x3e\x3cdiv\x3e\x3c/div\x3e\u5929\u6c14\x3c/li\x3e    \x3cli id\x3d'seastate' class\x3d'rightBtn'\x3e\x3cdiv\x3e\x3c/div\x3e\u6d77\u51b5\x3c/li\x3e    \x3cli id\x3d'taifeng' class\x3d'rightBtn'\x3e\x3cdiv\x3e\x3c/div\x3e\u53f0\u98ce\x3c/li\x3e    \x3cli id\x3d'enviroment' class\x3d'rightBtn'\x3e\x3cdiv\x3e\x3c/div\x3e\u7a7a\u6c14\x3c/li\x3e\x3c/ul\x3e"), $(".rightBtn").click(function() {
                var a = $(this),
                d = a.children("div");
                a.hasClass("active") ? (d.removeClass("active"), a.removeClass("active"), a.children("ul").css({
                    display: "none"
                }), "taifeng" == a.attr("id") ? TaiFeng.close() : (a = a.attr("id"), c[a] && c[a].Dispose())) : (d.addClass("active"), a.addClass("active"), a.children("ul").css({
                    display: "block"
                }), "taifeng" == a.attr("id") ? TaiFeng.open() : b(a.attr("id")))
            }), $(".rightBtnList").click(function(c) {
                var d = $(this),
                e,
                f;
                e = d.parents(".rightBtn").attr("id");
                "LI" == c.target.tagName ? (f = d.attr("id"), 0 < d.children(":checkbox").length ? d.children(":checkbox")[0].checked ? d.children(":checkbox")[0].checked = !1 : d.children(":checkbox")[0].checked = !0 : d.addClass("selitem").siblings().removeClass("selitem"), b(e, f)) : "INPUT" == c.target.tagName && (f = d.attr("id"), b(e, f));
                a[e] = f;
                c.stopImmediatePropagation()
            }), $(".rightBtn").mouseenter(function(a) {
                a = $(this);
                a.hasClass("active") && a.children("ul").css("display", "block")
            }), $(".rightBtn").mouseleave(function(a) {
                $(this).children("ul").css("display", "none")
            }), c = {
                weather: new WeatherWidget,
                seastate: new SeaStateWidget,
                enviroment: new EnvironmentWidget
            },
            e = new OpenLayers.StyleMap({
                fillOpacity: 1,
                pointRadius: 3
            }), f = OpenLayers.Util.getParameters(window.location.href).renderer, d = !0)
        },
        reset: function() {
            for (var a in c) c[a] && c[a].isInit() && c[a].Dispose();
            $(".rightBtn.active").each(function(a, b) {
                $(b).removeClass("active").children().removeClass("active")
            })
        }
    }
} (),
wmswmts = function() {
    function b(b, c, d) {
        var a = Service.wmts_cfg,
        e = a.minlevel || 0,
        f = a.maxlevel || 20,
        h = wmswmts.map.getZoom();
        d = {
            LAYERS: null != d ? d: [0],
            TRANSPARENT: !0,
            STYLES: "",
            FORMAT: "image/png",
            SRS: wmswmts.map.getProjection()
        };
        d = new OpenLayers.Layer.WMS("wmsWmts", c, d, {
            isBaseLayer: !1,
            opacity: .7,
            singleTile: !0
        });
        a.url = c.replace(/WMSServer/, "WMTS").replace(/arcgis/, "arcgis/rest");
        a.minlevel = e;
        a.maxlevel = f;
        c = new OpenLayers.Layer.WMTS(a);
        h = h > f || h < e ? d: c;
        e = {
            l_wms: d,
            l_wmts: c,
            l_cur: h,
            min: e,
            max: f,
            open: !0
        };
        wmswmts.map.addLayer(h);
        wmswmts.hashLayers.put(b, e)
    }
    var c = !1,
    e = !1;
    return {
        init: function(b) {
            c || (wmswmts.map = b, wmswmts.hashLayers = new HashTable, c = !0)
        },
        addLayer: function(c) {
            e || (wmswmts.map.events.register("zoomend", null,
            function() {
                var b = wmswmts.map.getZoom(),
                c;
                for (c in wmswmts.hashLayers.hash) {
                    var a = wmswmts.hashLayers.get(c),
                    e = a.l_cur;
                    b > a.max || b < a.min ? e != a.l_wms && (a.l_cur = a.l_wms, 1 == a.open && (wmswmts.map.removeLayer(e), wmswmts.map.addLayer(a.l_wms))) : e != a.l_wmts && (a.l_cur = a.l_wmts, 1 == a.open && (wmswmts.map.removeLayer(e), wmswmts.map.addLayer(a.l_wmts)))
                }
            }), e = !0);
            wmswmts.hashLayers.contains(c.id) ? (c = wmswmts.hashLayers.get(c.id), wmswmts.map.addLayer(c.l_cur), c.open = !0) : b(c.id, c.url, c.layer)
        },
        removeLayer: function(b) {
            wmswmts.hashLayers.contains(b) && (b = wmswmts.hashLayers.get(b), b.open && (wmswmts.map.removeLayer(b.l_cur), b.open = !1))
        }
    }
} (),
data = function() {
    return {
        init: function(b) {
            this._map = b;
            this.addTileLayer();
            var c = new OpenLayers.Layer.Vector("extent");
            b.addLayer(c, !0);
            this._layer = c;
            c = new OpenLayers.Layer.Vector("label");
            b.addLayer(c, !0);
            this._layer1 = c;
            this._hashT = new HashTable;
            this.hash_Condition = new HashTable;
            b = [{
                attributes: {
                    FID: 0,
                    bm: "110106",
                    y: 39.834829196,
                    x: "116.24273831754"
                },
                geometry: {
                    rings: [[[116.28742790854139, 39.89574510994808], [116.28748429572777, 39.885782749188294], [116.31900839823635, 39.89584839662902], [116.31463840947892, 39.874411165366965], [116.3745938951532, 39.870196089410804], [116.37077883972734, 39.86561493691427], [116.3885806131255, 39.85751168623693], [116.4066106856956, 39.859047232685604], [116.41447276484107, 39.87183923082676], [116.4374584539728, 39.871007333406205], [116.43946571977078, 39.85990323987867], [116.46120062626248, 39.85417912454845], [116.40880157356732, 39.82843050725901], [116.41265960306028, 39.814329881589], [116.40314115001766, 39.81571062505941], [116.40305869168854, 39.8103919219033], [116.41563269442291, 39.809403078851055], [116.42249252105782, 39.793465430072466], [116.41323475648699, 39.78651285160139], [116.38941338948004, 39.78590451505279], [116.39175817963789, 39.76487594206352], [116.38448375550145, 39.763990987756216], [116.38337874139285, 39.77927809048274], [116.36092390606484, 39.784139445320584], [116.36020488153541, 39.79853987810147], [116.3396331994385, 39.806923069271846], [116.31637156296298, 39.797500962236825], [116.31501648784277, 39.7827345061879], [116.3010735660347, 39.768900094743884], [116.2874542921596, 39.79712705568954], [116.24590755283607, 39.79248385797328], [116.22136991736308, 39.825023788232585], [116.20743779123197, 39.822756225360735], [116.19368218604232, 39.7775370394083], [116.16267649601701, 39.78355247919404], [116.15371589633408, 39.76654093155455], [116.11523677155616, 39.76148528364917], [116.11122926721937, 39.77376093661808], [116.12929604024711, 39.780332929367184], [116.1086480428641, 39.79108644666611], [116.08485757108177, 39.781462964820065], [116.08222775579236, 39.828882510169755], [116.07725049530752, 39.82547468974377], [116.07817754260225, 39.83214488693686], [116.07622994799554, 39.827135272598255], [116.04764088322142, 39.844973305651216], [116.06406731425916, 39.85271110377923], [116.06343374922028, 39.867410990273434], [116.09466285994887, 39.86663887748581], [116.09578045334895, 39.872315197251694], [116.14816821509108, 39.88836637879527], [116.19173390067546, 39.88203160630206], [116.20067568887926, 39.87307113831003], [116.23307449715342, 39.89424289803166], [116.28742790854139, 39.89574510994808]]]
                }
            },
            {
                attributes: {
                    FID: 1,
                    bm: "110115",
                    y: 39.6473518852,
                    x: "116.411544845662"
                },
                geometry: {
                    rings: [[[116.43392474077864, 39.828795376058665], [116.43766704587009, 39.81966938506055], [116.44701691499596, 39.82181911786586], [116.46759191245742, 39.80887586891778], [116.51949957483936, 39.82906696726295], [116.53320926533644, 39.822776114194156], [116.52755494700553, 39.81781770983559], [116.53460897204046, 39.80920814500813], [116.52446973566404, 39.79096499257038], [116.53139407664017, 39.780469990619366], [116.5239413711385, 39.77784849299015], [116.53923960065727, 39.76803371167023], [116.52992800838847, 39.767762202453035], [116.53406222214447, 39.76043496402201], [116.52187845295637, 39.760523213475786], [116.51706946131189, 39.76902976417517], [116.51399413916371, 39.76487663904936], [116.51634811367782, 39.74868734742672], [116.5254191583494, 39.74792410645823], [116.52089438266368, 39.74254663100582], [116.53325130981801, 39.74053267214782], [116.52582015443818, 39.738786807288534], [116.53048847598136, 39.7213105345586], [116.52041231128852, 39.7161509092684], [116.52937887900143, 39.711246597712275], [116.56659514757473, 39.71422314726226], [116.56994038694987, 39.70886765218215], [116.59413167754475, 39.71176479662714], [116.6152918184988, 39.72744797199906], [116.63082521252866, 39.72368501608971], [116.64668725427417, 39.70775302643192], [116.63958979393968, 39.7002620332145], [116.64441197901347, 39.68758023459897], [116.65988680222446, 39.68648274537899], [116.65977688896695, 39.67561128926658], [116.69715391005056, 39.67341185225443], [116.69633956773119, 39.6491024355773], [116.70369633980825, 39.63701368436337], [116.71726615110039, 39.63788982349311], [116.71883724363461, 39.62330261744528], [116.69373470536962, 39.620269513802214], [116.69602002673261, 39.60930075995535], [116.71987829079045, 39.59208208633419], [116.69505357783657, 39.5880818112023], [116.68705365958841, 39.600999718192966], [116.6602092039627, 39.60465672755263], [116.647578076684, 39.598957434372544], [116.61420458538993, 39.60096080605009], [116.60140848130067, 39.62410371763603], [116.58905818402373, 39.617437126213844], [116.57544670566212, 39.62344701783789], [116.55971184344531, 39.61925525799902], [116.56043358853185, 39.60359704846616], [116.53952486518334, 39.595313601331604], [116.53677192823942, 39.60257922545695], [116.53518850894311, 39.59313110512169], [116.51797693275444, 39.59601790314289], [116.51943083639294, 39.5721154105725], [116.50485301546911, 39.564671333080454], [116.50177753323435, 39.550341845388175], [116.46383273542028, 39.55372979079805], [116.4709907191369, 39.53443482322405], [116.45752130461386, 39.526571007859914], [116.4298430046658, 39.5254901260879], [116.43703349910939, 39.508824640641855], [116.42134898847975, 39.50540517878771], [116.41460752248327, 39.52428494465143], [116.39581433412035, 39.52445989330129], [116.39573909408, 39.513360358395374], [116.41647321883016, 39.495872240501974], [116.40503566744641, 39.48137531356706], [116.41947889474515, 39.48707133267384], [116.42089214581243, 39.47741215718757], [116.43692960188025, 39.481410733724196], [116.44895067591793, 39.45798902366641], [116.44397246990557, 39.449333951429224], [116.43369086334184, 39.45295648379756], [116.42121178018827, 39.443852956160256], [116.33543737650835, 39.45307604887295], [116.29765339171844, 39.4863281240837], [116.25277616075233, 39.499597376427424], [116.23168625045469, 39.549742989027806], [116.2393252986657, 39.55682389807813], [116.2145965218105, 39.57816473635832], [116.2199885450809, 39.58920632796559], [116.20924457190368, 39.643928266355275], [116.22261841983553, 39.70788217955961], [116.24165288911804, 39.7266668159431], [116.24362744892564, 39.79249237387186], [116.2874542921596, 39.79712705568954], [116.304119684488, 39.76897366578875], [116.31637156296298, 39.797500962236825], [116.34902535189474, 39.80531806320792], [116.36020488153541, 39.79853987810147], [116.36092390606484, 39.784139445320584], [116.38337874139285, 39.77927809048274], [116.3874848980526, 39.764281703294], [116.38941338948004, 39.78590451505279], [116.41323475648699, 39.78651285160139], [116.42249252105782, 39.793465430072466], [116.41563269442291, 39.809403078851055], [116.40305869168854, 39.8103919219033], [116.40314115001766, 39.81571062505941], [116.41265960306028, 39.814329881589], [116.40888300546709, 39.828470544847164], [116.43392474077864, 39.828795376058665]]]
                }
            },
            {
                attributes: {
                    FID: 2,
                    bm: "110118",
                    y: 40.5256906255,
                    x: "116.988417427494"
                },
                geometry: {
                    rings: [[[116.91867270736321, 40.77180923207947], [116.91993964925695, 40.74384940044417], [116.93446113068597, 40.73874357248296], [116.95896880301723, 40.708263999772356], [117.00016039232472, 40.693284512992776], [117.10387785498682, 40.70763746604947], [117.11017679131442, 40.69866014858139], [117.19991032661002, 40.69380260955471], [117.23413086018606, 40.67552543017547], [117.25415048568729, 40.680112489859255], [117.28301570529021, 40.65927912090087], [117.3108064797002, 40.656848014590125], [117.32969680856068, 40.662469311680766], [117.33538093090861, 40.672454989118265], [117.40217929812582, 40.68608911679613], [117.46032052312714, 40.67153285420431], [117.47517988496763, 40.677492473513766], [117.50741461675568, 40.659612925114146], [117.49349704938142, 40.63477460022346], [117.47185423830507, 40.63400150755924], [117.46365213110934, 40.64854052985763], [117.44823887435183, 40.651741377794394], [117.44101405803984, 40.626691445835945], [117.4174318102592, 40.624259722567736], [117.40549089250939, 40.60380641746483], [117.42287638935535, 40.57642668173627], [117.41468081731362, 40.56806348155126], [117.39566376179008, 40.5723806682859], [117.38037289516294, 40.559536460124875], [117.34840228432532, 40.57803509316464], [117.30723869332621, 40.57701158359551], [117.24306286015722, 40.54736702896638], [117.25618270742754, 40.51246129208796], [117.20801535011185, 40.51238386428757], [117.20096461753666, 40.49898484860364], [117.2304593043808, 40.46734978627185], [117.22843632444717, 40.45648258278715], [117.25696386369842, 40.44069374391309], [117.22937617538051, 40.41256139076979], [117.23318831304105, 40.39402060347278], [117.21728155648098, 40.37415002439522], [117.1493646561769, 40.37382854780865], [117.11022572318385, 40.352658814190896], [117.08959852741015, 40.3585158899597], [117.05284004903928, 40.336332378263705], [117.01525175946252, 40.33602914345538], [117.00009412257614, 40.3186905958232], [116.99716563277087, 40.29299543462903], [116.96834416659894, 40.28353420175548], [116.94432728666834, 40.26039831086009], [116.96720804285572, 40.25069859764729], [116.96728146694714, 40.24379857156562], [116.95338654594148, 40.23197906518762], [116.92442436134219, 40.22990143894891], [116.91537819927647, 40.21941867783176], [116.88755015104152, 40.231650141482916], [116.89512210710704, 40.23615746440951], [116.867645828663, 40.26755144959236], [116.86498608738106, 40.29006703104089], [116.85120483813012, 40.291503905047556], [116.84225775200817, 40.31042373623501], [116.82227740421858, 40.30358299533472], [116.8160823560998, 40.280456489950765], [116.78210775325124, 40.29054757523196], [116.76487774280758, 40.265597027392204], [116.73151288641533, 40.27775424532699], [116.74765796179616, 40.30276527662053], [116.76720133064669, 40.31452705830326], [116.75178194401212, 40.33294571062903], [116.71620916159904, 40.338284660122426], [116.71999346057112, 40.36025060315607], [116.6997912184179, 40.37283748654352], [116.70951983268814, 40.38323878861416], [116.70713770298921, 40.39489921718858], [116.69993811873866, 40.392896832383514], [116.7032432972788, 40.401969457904286], [116.73473633512008, 40.41530149295978], [116.71557135025213, 40.422835651108336], [116.70967921845603, 40.44074203221807], [116.71922935303434, 40.43887967846059], [116.71680423852985, 40.45758367375328], [116.7027257126986, 40.45722152624028], [116.68819253975295, 40.467481779376335], [116.6868100508935, 40.4807997845061], [116.697808481577, 40.47821367243442], [116.68605048734051, 40.4868880908692], [116.69433350559756, 40.509581592342535], [116.71043599580064, 40.52379367306483], [116.69524828033813, 40.54466507147241], [116.67345961904556, 40.54893080417822], [116.67238852651299, 40.555627466950206], [116.6590901497185, 40.55169085126453], [116.70810001685858, 40.56996805656461], [116.70448763944341, 40.59920888318849], [116.6912425029284, 40.61745575270782], [116.70544146617006, 40.640280494188616], [116.70664029846446, 40.676963331455], [116.74937791084365, 40.7046196360164], [116.77800517997949, 40.70004331307405], [116.78360515730657, 40.72824342866881], [116.77696463654686, 40.75656511367549], [116.79393469757566, 40.744977487421096], [116.82279951214022, 40.748888656994346], [116.83336098284146, 40.75971391774234], [116.82929406011837, 40.770875072321786], [116.86071532056438, 40.78353144989101], [116.85584008774343, 40.79184604944448], [116.86746241711536, 40.798299425047794], [116.88939803693961, 40.79620395786835], [116.891569957434, 40.77602829905906], [116.91867270736321, 40.77180923207947]]]
                }
            },
            {
                attributes: {
                    FID: 3,
                    bm: "110117",
                    y: 40.2075648469,
                    x: "117.13900487743"
                },
                geometry: {
                    rings: [[[117.21128628856964, 40.37678219480204], [117.21919046923689, 40.3682463784966], [117.23596160007324, 40.36843401362914], [117.25272879246936, 40.33532088986853], [117.26781126575138, 40.33161714629736], [117.26756485002629, 40.30804534002725], [117.28598670100983, 40.29599665783368], [117.28829568339383, 40.27767776926144], [117.32491561131508, 40.28853620943126], [117.33828693956933, 40.23398599148242], [117.38257371306491, 40.22684155989383], [117.38641359528057, 40.220515725496305], [117.3703024109397, 40.21756945059234], [117.37040075949929, 40.20852727758079], [117.3855218367919, 40.20347966119944], [117.3750025707905, 40.20364029895524], [117.37286501947703, 40.195217722822896], [117.37665657669116, 40.1868119795076], [117.39114165822807, 40.19141547780288], [117.4003573508701, 40.186327180638216], [117.38590842574195, 40.174164268272634], [117.34422861484256, 40.171920832187105], [117.35361821793055, 40.14884818887612], [117.34528751625867, 40.136021839315326], [117.32353785101532, 40.13282899053356], [117.30571769947424, 40.13879882562368], [117.29062117324933, 40.11820049544831], [117.27657265299894, 40.11975240720652], [117.2674608797253, 40.10512103469188], [117.24239316759785, 40.11554212781142], [117.21736211614372, 40.09393682112788], [117.20400478898576, 40.095501149677695], [117.20831441854467, 40.08433498443177], [117.19220257644446, 40.066206594423214], [117.17799936510568, 40.084606173528535], [117.17408151271466, 40.069247776812766], [117.15707692123927, 40.07580599037555], [117.14014407128253, 40.060508357017504], [117.07857848969873, 40.07396753588729], [117.07578926745771, 40.0641797734899], [117.06266475878633, 40.06678587620757], [117.04492682468985, 40.0587535190763], [117.04385795306894, 40.04996660842755], [117.03066730211026, 40.04707538285549], [117.01522731124705, 40.02834116603839], [116.99341959711592, 40.02908498829748], [116.98414641689094, 40.040427328231814], [116.96445332422932, 40.0352534370707], [116.96592239243606, 40.04385023716948], [116.9553241285096, 40.05019595381335], [116.9556118757702, 40.062771296496244], [116.97179828607078, 40.06409125694719], [116.97943661072384, 40.07750923547383], [116.96828595944015, 40.08053816458167], [116.97484735843544, 40.0918685017294], [116.96107607072226, 40.10021960624949], [116.96931602074126, 40.11036737921654], [116.95901938984512, 40.12701451164819], [116.97212598688597, 40.15152278420968], [116.95531591528145, 40.174778969809864], [116.94477362025404, 40.174025128121976], [116.94270609013533, 40.189453055851274], [116.93281634344649, 40.19165868954086], [116.92315488971542, 40.20902730435469], [116.93285486037338, 40.2121362879454], [116.92859772245215, 40.22913050960131], [116.94038771031086, 40.23540432191407], [116.95338654594148, 40.23197906518762], [116.96728146694714, 40.24379857156562], [116.96720804285572, 40.25069859764729], [116.94432728666834, 40.26039831086009], [116.96834416659894, 40.28353420175548], [116.99716563277087, 40.29299543462903], [117.00009412257614, 40.3186905958232], [117.01381585952556, 40.335234122739365], [117.05284004903928, 40.336332378263705], [117.08959852741015, 40.3585158899597], [117.11022572318385, 40.352658814190896], [117.14915255687565, 40.373759478343835], [117.15978889147003, 40.37030332639465], [117.1781819455602, 40.37680905606714], [117.19755436714398, 40.37213616126029], [117.21128628856964, 40.37678219480204]]]
                }
            },
            {
                attributes: {
                    FID: 4,
                    bm: "110119",
                    y: 40.5379617866,
                    x: "116.155863399601"
                },
                geometry: {
                    rings: [[[116.2630015679398, 40.77590702635443], [116.2674380919514, 40.76226112513729], [116.28309749930668, 40.76332300593997], [116.2902387121976, 40.75646927093394], [116.31012980524181, 40.771299650220996], [116.36070250436268, 40.76941167166775], [116.40124883913181, 40.77948521302429], [116.40850896795277, 40.761057745722], [116.46138299403452, 40.77132566782904], [116.49407402469197, 40.758882895691855], [116.49488534932702, 40.74556809576469], [116.50698958466668, 40.740270571508375], [116.50399979449945, 40.725178882597056], [116.49589770867273, 40.69614576583105], [116.48195436039916, 40.69080617487604], [116.47739508697708, 40.67624423050572], [116.50920951565688, 40.67014151877888], [116.51178027975433, 40.6598145507521], [116.52803540046924, 40.652025161759816], [116.533377514119, 40.65572906921248], [116.54457451543267, 40.641901353195664], [116.5683321883276, 40.63154210966277], [116.56324287360474, 40.62350116223078], [116.53264833146514, 40.62465654253618], [116.5249253552756, 40.59036654022712], [116.45403993308298, 40.523167537132146], [116.46975635149427, 40.51298815900456], [116.49103477923086, 40.517063296944215], [116.5121504822155, 40.49021483329893], [116.48534728200671, 40.480009853313234], [116.45109865572458, 40.48733754621737], [116.4453515307493, 40.47912151839786], [116.39991942124179, 40.48098020906721], [116.3866325662287, 40.47142329950189], [116.37840483565404, 40.47621703084848], [116.38182171576837, 40.482971370913525], [116.3699182487058, 40.484604601629286], [116.37060409409267, 40.495775868209535], [116.354753862513, 40.50031449821416], [116.3166262108644, 40.499169577543], [116.28582269829593, 40.484937722569256], [116.29999313671738, 40.465090175865605], [116.28297549090398, 40.43992929255717], [116.29006770368991, 40.422297238465944], [116.28018553391634, 40.41529474574778], [116.28394088114634, 40.38223469862355], [116.2770020844792, 40.37476739555296], [116.25131811215876, 40.38247476044334], [116.2425809523433, 40.37293869187072], [116.23668463891907, 40.37895520834009], [116.22495376563344, 40.374022327979716], [116.20723606176796, 40.38177660703888], [116.2012784059194, 40.37470774514662], [116.14161224690983, 40.361020603658474], [116.13852678177395, 40.350006475558274], [116.1483664376153, 40.34069021799233], [116.13930720615735, 40.33491006681041], [116.1391763810489, 40.34612904676397], [116.13217152492945, 40.34534995503349], [116.13507784202646, 40.31591919181212], [116.12574268634295, 40.31089687175887], [116.11522519472126, 40.31185254298854], [116.10334198990964, 40.329763073723946], [116.07953988685794, 40.32957611175538], [116.07008294047178, 40.33873649216289], [116.05468446103384, 40.335738019046985], [116.04702153974868, 40.31663483756765], [116.03166478685517, 40.311138227465634], [116.01005377388537, 40.33376077048081], [115.99223271196658, 40.32459420962974], [115.98428154602684, 40.32755499844278], [115.96640614975459, 40.31842991621767], [115.98353819695186, 40.29866430288747], [115.9726378406029, 40.29461099784533], [115.97502186544274, 40.27615463146992], [115.96043666250412, 40.26496182861141], [115.93931521572189, 40.288559539570365], [115.93680614751118, 40.30995055774148], [115.9152210927823, 40.31931542695932], [115.92010701329109, 40.339245450594156], [115.91168606485084, 40.35356754976916], [115.85864138472792, 40.357616206418506], [115.85343512281838, 40.37498143175864], [115.84020566805955, 40.37402115675155], [115.81266520183887, 40.390703233395485], [115.78716979666065, 40.426346214850746], [115.76352359837685, 40.444350887979475], [115.77469922399945, 40.492328515395826], [115.75695360582654, 40.4987128142994], [115.73582049723602, 40.49489045737868], [115.72887492549347, 40.50284241497294], [115.7477126111612, 40.53928952674055], [115.78442515642878, 40.560461085932985], [115.81322732131567, 40.5584957830694], [115.82035772501001, 40.58620565125423], [115.87909668825705, 40.594611615469105], [115.90308603859673, 40.617665490525376], [115.95647860454216, 40.60714698161544], [115.96724320102253, 40.59798907799219], [115.97421066496024, 40.60146597981485], [115.99163961285035, 40.579580965958215], [115.9953132608017, 40.58725215167831], [115.98291426509817, 40.59874723866706], [116.00663919107859, 40.590276810655475], [116.06669279186558, 40.61335857264588], [116.08902101775261, 40.611388819485995], [116.09195440925629, 40.62156529750566], [116.11525652792464, 40.628211909468654], [116.10473671702829, 40.64616822166964], [116.12787469341552, 40.665688392935856], [116.15719440270026, 40.66484352927149], [116.17955383766471, 40.71771610837046], [116.19479243417372, 40.71382515153628], [116.20947706178326, 40.72144590904666], [116.2065077710099, 40.73903497045205], [116.22703100159563, 40.75787324534803], [116.22819673161298, 40.782217128309036], [116.23996977160292, 40.79069694174682], [116.2630015679398, 40.77590702635443]]]
                }
            },
            {
                attributes: {
                    FID: 5,
                    bm: "110116",
                    y: 40.6279833917,
                    x: "116.578974090672"
                },
                geometry: {
                    rings: [[[116.63121043460956, 41.05956695521348], [116.67032558456377, 41.04120740938899], [116.68282698087953, 41.043196674224674], [116.69193556451918, 41.01954891768825], [116.67634333684045, 40.99976781547418], [116.67059324406745, 40.97017159497247], [116.69668258245913, 40.93504052047149], [116.7168460465934, 40.93129598076885], [116.7066264422769, 40.908788326414665], [116.72385142333425, 40.89587545537857], [116.75215433453023, 40.889424137602894], [116.75394410197916, 40.87954418976072], [116.77346174204978, 40.87526786045992], [116.79792431451891, 40.83939204507978], [116.81386321664436, 40.84736969043225], [116.81959800182953, 40.839605373779406], [116.84971673114825, 40.83376170332399], [116.8733005983163, 40.81616374003679], [116.8800931378048, 40.80075986492946], [116.85584008774343, 40.79184604944448], [116.86071532056438, 40.78353144989101], [116.82929406011837, 40.770875072321786], [116.83336098284146, 40.75971391774234], [116.82279951214022, 40.748888656994346], [116.79393469757566, 40.744977487421096], [116.77696463654686, 40.75656511367549], [116.7785832665942, 40.70055321110847], [116.74937791084365, 40.7046196360164], [116.70787459257329, 40.678716157139704], [116.70544146617006, 40.640280494188616], [116.6912425029284, 40.61745575270782], [116.70448763944341, 40.59920888318849], [116.70810001685858, 40.56996805656461], [116.6590901497185, 40.55169085126453], [116.67238852651299, 40.555627466950206], [116.67345961904556, 40.54893080417822], [116.69524828033813, 40.54466507147241], [116.71042579766494, 40.524118542991786], [116.69433350559756, 40.509581592342535], [116.68605048734051, 40.4868880908692], [116.697808481577, 40.47821367243442], [116.6868100508935, 40.4807997845061], [116.68819253975295, 40.467481779376335], [116.7027257126986, 40.45722152624028], [116.71680423852985, 40.45758367375328], [116.71922935303434, 40.43887967846059], [116.70967921845603, 40.44074203221807], [116.71557135025213, 40.422835651108336], [116.73473633512008, 40.41530149295978], [116.7032432972788, 40.401969457904286], [116.69993811873866, 40.392896832383514], [116.70713770298921, 40.39489921718858], [116.70951983268814, 40.38323878861416], [116.6997912184179, 40.37283748654352], [116.71999346057112, 40.36025060315607], [116.71620916159904, 40.338284660122426], [116.75178194401212, 40.33294571062903], [116.76680958142775, 40.31279281847536], [116.74765796179616, 40.30276527662053], [116.67734141150285, 40.23351548372796], [116.66183847071791, 40.23667909384667], [116.66025496551855, 40.26195729329649], [116.61720651028877, 40.25987135362313], [116.61557091695492, 40.24977496910764], [116.59934947884318, 40.25008648182264], [116.59313857337244, 40.264678459228996], [116.56370305340783, 40.268140197349105], [116.55959972501921, 40.2772501580328], [116.53034025146816, 40.276329082672895], [116.53348946739358, 40.26634006382018], [116.52913108378095, 40.260815540584446], [116.518582497705, 40.26470030272094], [116.51734623977048, 40.256695355003004], [116.48182027832027, 40.26336357284344], [116.47240113572713, 40.27886217021811], [116.44265204482124, 40.28465294204359], [116.4368678549448, 40.30148625122103], [116.44884923988599, 40.313598013635456], [116.43141159693751, 40.33217237023073], [116.4099418843024, 40.32877059328281], [116.37763898091575, 40.338018453246484], [116.35825075498029, 40.329893935535424], [116.36267023723481, 40.355432958425304], [116.3419165088051, 40.35547703011737], [116.35301562693509, 40.36548447295039], [116.34851919499094, 40.37027358645449], [116.3170847641428, 40.38634626881335], [116.28870852125115, 40.38351858544461], [116.27708669311252, 40.394390870414966], [116.28024298021843, 40.41543198601255], [116.28983464408954, 40.41980850726604], [116.28297549090398, 40.43992929255717], [116.29999313671738, 40.465090175865605], [116.28488585089121, 40.48430786104235], [116.3223627282372, 40.499490236948496], [116.368302259008, 40.497204163128025], [116.3699182487058, 40.484604601629286], [116.38182171576837, 40.482971370913525], [116.37840483565404, 40.47621703084848], [116.3866325662287, 40.47142329950189], [116.40049661818544, 40.48105705028158], [116.44842616402481, 40.47953607041785], [116.45109865572458, 40.48733754621737], [116.50166435625059, 40.48227327041506], [116.51254828027785, 40.49555219814541], [116.49116518040812, 40.51698372283311], [116.46975635149427, 40.51298815900456], [116.45403993308298, 40.523167537132146], [116.5249253552756, 40.59036654022712], [116.53264833146514, 40.62465654253618], [116.56324287360474, 40.62350116223078], [116.5683321883276, 40.63154210966277], [116.54457451543267, 40.641901353195664], [116.533377514119, 40.65572906921248], [116.52803540046924, 40.652025161759816], [116.51178027975433, 40.6598145507521], [116.50920951565688, 40.67014151877888], [116.47950913456275, 40.673606285932], [116.48195436039916, 40.69080617487604], [116.49589770867273, 40.69614576583105], [116.50695338876469, 40.740362267817815], [116.49488534932702, 40.74556809576469], [116.49345246532002, 40.759640187006056], [116.45869590818133, 40.77136423048276], [116.45214082641077, 40.79564680631118], [116.43419267917982, 40.806203187803604], [116.43071351673083, 40.8189597831988], [116.40159293437627, 40.830032598864186], [116.38248246948562, 40.86081323608486], [116.32738868420753, 40.90340609193936], [116.32751471069423, 40.92046094616096], [116.36334181414604, 40.94232696802662], [116.3920004857964, 40.904553467033004], [116.46762146271247, 40.894899606486206], [116.46698919072502, 40.91861234285414], [116.44068173581807, 40.95243070108078], [116.44891425700392, 40.979451632815746], [116.50958187512268, 40.974037689019525], [116.52889487450906, 40.98732954020275], [116.54872167979461, 40.986337920188156], [116.55716124566527, 40.99294077272905], [116.59211399083513, 40.97365213351459], [116.6095429479504, 40.98627151020006], [116.61660706172921, 41.0193409827033], [116.6098883817638, 41.051851903522866], [116.63121043460956, 41.05956695521348]]]
                }
            },
            {
                attributes: {
                    FID: 6,
                    bm: "110111",
                    y: 39.718362001,
                    x: "115.847333646825"
                },
                geometry: {
                    rings: [[[115.7970407291345, 39.920307874174725], [115.83852383451527, 39.896315572881576], [115.87323647505838, 39.91570763079106], [115.93464517693569, 39.91680958896512], [115.93885091739868, 39.901204623786384], [115.91541105432681, 39.88382216818247], [115.91935443793595, 39.87477371888911], [115.9476549222611, 39.86609889556538], [115.98914233292561, 39.87502914687018], [115.97845128104767, 39.86624090323329], [115.98221788574061, 39.83979459781623], [116.00125661270843, 39.84979736365046], [116.01263297570169, 39.839454138498496], [116.03888109145615, 39.84635824049146], [116.06575136357732, 39.83795447396865], [116.07622994799554, 39.827135272598255], [116.07817754260225, 39.83214488693686], [116.08485757108177, 39.781462964820065], [116.1086480428641, 39.79108644666611], [116.12929604024711, 39.780332929367184], [116.11122926721937, 39.77376093661808], [116.11523677155616, 39.76148528364917], [116.15371589633408, 39.76654093155455], [116.16267649601701, 39.78355247919404], [116.19368218604232, 39.7775370394083], [116.20743779123197, 39.822756225360735], [116.22827316904926, 39.82188437415888], [116.24590755283607, 39.79248385797328], [116.24061615227568, 39.722290994839035], [116.22261841983553, 39.70788217955961], [116.21246459642437, 39.67995028758029], [116.2146475713827, 39.57842997097009], [116.20144877367827, 39.57679246427339], [116.19739531629743, 39.58808507762291], [116.17775758043135, 39.590038310856684], [116.14646993163016, 39.58504274605656], [116.14234746182699, 39.57199742233281], [116.12832581975876, 39.56439785063155], [116.11443404073557, 39.57418206102556], [116.09925686858291, 39.57014308633599], [116.09463117519556, 39.57907717606253], [116.09234071083925, 39.5740831578086], [116.02909581942541, 39.57076863076285], [116.01801510224666, 39.57470035001309], [116.01969020575139, 39.586361155706655], [116.0072440015197, 39.587370044573056], [116.00085617166867, 39.575954229375704], [115.98833009538257, 39.57618790879107], [115.98496540449315, 39.59313922975009], [115.97310126428383, 39.595466295097744], [115.97375917381285, 39.570985488042595], [115.95040180109473, 39.560188489439845], [115.92362089905525, 39.592702191795084], [115.90336651379687, 39.60064107421007], [115.90638569946852, 39.56824877429436], [115.88423725640327, 39.568266196998934], [115.88652607577737, 39.55510480534705], [115.87631173873744, 39.54711729993281], [115.85946399838592, 39.5457879575599], [115.84901688858304, 39.55444132546121], [115.83948370769419, 39.542876934960596], [115.82155519521197, 39.54074749712477], [115.81213888852574, 39.53016074088325], [115.8218069607007, 39.506745966923404], [115.76090980901343, 39.51599750420236], [115.76244754601395, 39.507890900428116], [115.75687071101655, 39.51483137340258], [115.7451290004667, 39.5109759392562], [115.73177652655802, 39.54536216913993], [115.714573135731, 39.54265454128912], [115.71079540389815, 39.55929153830143], [115.68535725151835, 39.56546583057361], [115.68798924876252, 39.585478861488326], [115.68059180346701, 39.601589373319456], [115.66779054146014, 39.60730866762708], [115.64256901836181, 39.59759098787795], [115.61576152226134, 39.60224159243589], [115.61474025745623, 39.59304639944716], [115.58970590874665, 39.587681955590945], [115.55946760890627, 39.59146229663441], [115.56067461848146, 39.60823457146357], [115.54283270378619, 39.6147088441328], [115.51424855586573, 39.60764159808756], [115.52035813460135, 39.616399341329505], [115.50959345464936, 39.62884789513157], [115.52063074941707, 39.63755897082566], [115.50003279256177, 39.64305309183174], [115.49995978268838, 39.651205752622424], [115.47106594549223, 39.65343487587532], [115.51064479942286, 39.69961021885495], [115.49657708266899, 39.70585416761849], [115.48533526386082, 39.737837224290615], [115.4595479774066, 39.73953261645501], [115.4378560577306, 39.7498755853012], [115.42756550985071, 39.769372279481786], [115.42063204459667, 39.77248873076709], [115.41579394673991, 39.76461914103903], [115.40964124773807, 39.76981155149725], [115.4367455150646, 39.78453899118377], [115.45101536934345, 39.78131086622544], [115.47666180217263, 39.79791922116322], [115.49995980690628, 39.78247007100005], [115.54789132180694, 39.794837189789995], [115.56263023202213, 39.81247680146562], [115.58895189917689, 39.819915571112304], [115.62436405923589, 39.87138133115282], [115.7628476411748, 39.92446003139147], [115.7970407291345, 39.920307874174725]]]
                }
            },
            {
                attributes: {
                    FID: 7,
                    bm: "110114",
                    y: 40.2142061394,
                    x: "116.202961658834"
                },
                geometry: {
                    rings: [[[116.28369694290686, 40.391922183493335], [116.2887911321624, 40.38350198313203], [116.31723825779824, 40.38630755193774], [116.3531420717969, 40.36580487673794], [116.34199957061556, 40.35540906235046], [116.36267023723481, 40.355432958425304], [116.35825075498029, 40.329893935535424], [116.37763898091575, 40.338018453246484], [116.4099418843024, 40.32877059328281], [116.43141159693751, 40.33217237023073], [116.44884923988599, 40.313598013635456], [116.4368678549448, 40.30148625122103], [116.44274712880275, 40.284530023951646], [116.47216499698264, 40.27898717215146], [116.48113552338036, 40.26374684928979], [116.49928267779921, 40.26105663410955], [116.49332265990964, 40.248463176910704], [116.47563212947041, 40.24569615549186], [116.47809058409399, 40.22245526790591], [116.47059970333194, 40.22335965310951], [116.4639614879622, 40.211456761092776], [116.48128082144729, 40.19080156408871], [116.46995637518523, 40.15812923700329], [116.48124510640186, 40.1569447555852], [116.47232813229107, 40.145895653503835], [116.48364449324941, 40.10202108080703], [116.45805942905984, 40.09251366396691], [116.45314223153811, 40.05929530308991], [116.41705161653394, 40.06517497807541], [116.4197745781895, 40.059226660297405], [116.40265661462998, 40.05455379878041], [116.3997192151463, 40.039375147952356], [116.38842132789598, 40.03573616029588], [116.36268448989851, 40.04580938440276], [116.35982572317982, 40.05218731291971], [116.37578967605053, 40.06038303057313], [116.36327007849542, 40.06854308317223], [116.3403697225438, 40.06272548269276], [116.33656389099978, 40.054412495088755], [116.29624600829497, 40.059192389725524], [116.28361856740065, 40.08229575636779], [116.273315496029, 40.079075043327], [116.26660538956072, 40.09468630673012], [116.25600351722001, 40.09577077313656], [116.25657747458104, 40.109763999197305], [116.24990145428563, 40.10356889358891], [116.23340624364907, 40.10780172490976], [116.23980256142444, 40.13557640644221], [116.20278601454419, 40.13959799612716], [116.19147427625471, 40.15993103921788], [116.17586583618463, 40.157285619628766], [116.17114353138969, 40.14346227016677], [116.15680142848582, 40.138590771615696], [116.16332075759331, 40.122801501291285], [116.1259430389028, 40.120333160246055], [116.12231376825508, 40.113731040672796], [116.07742689030322, 40.11917658740341], [116.04190248940466, 40.08432902656195], [116.01398168561019, 40.07372808751534], [115.98071907690269, 40.08272248831379], [115.9617640215424, 40.0748001251269], [115.95616247090555, 40.101533043857394], [115.95008950396851, 40.095307384874054], [115.93726213649772, 40.10200507003112], [115.93985140150944, 40.10972242726608], [115.92038815996887, 40.130063096467445], [115.84961890558334, 40.146741901252504], [115.83726923605676, 40.164880179174254], [115.84744739371432, 40.17939094753768], [115.8424374263882, 40.18402837471438], [115.86549943577286, 40.18676025354493], [115.86504256207593, 40.20571254982758], [115.87350783610242, 40.20235511291671], [115.88451638645084, 40.232932081474615], [115.90489873196194, 40.233914736085104], [115.91522190384204, 40.24970863846287], [115.95301947779505, 40.25582034844692], [115.96183919420017, 40.26323933520184], [115.97502186544274, 40.27615463146992], [115.9726378406029, 40.29461099784533], [115.98353819695186, 40.29866430288747], [115.96640614975459, 40.31842991621767], [115.98428154602684, 40.32755499844278], [115.99223271196658, 40.32459420962974], [116.01005377388537, 40.33376077048081], [116.03166478685517, 40.311138227465634], [116.04702153974868, 40.31663483756765], [116.05468446103384, 40.335738019046985], [116.07008294047178, 40.33873649216289], [116.07953988685794, 40.32957611175538], [116.10334198990964, 40.329763073723946], [116.11522519472126, 40.31185254298854], [116.12574268634295, 40.31089687175887], [116.13507784202646, 40.31591919181212], [116.13217152492945, 40.34534995503349], [116.1391763810489, 40.34612904676397], [116.13930720615735, 40.33491006681041], [116.1483664376153, 40.34069021799233], [116.13852678177395, 40.350006475558274], [116.14267814483827, 40.36144636403445], [116.2012784059194, 40.37470774514662], [116.20723606176796, 40.38177660703888], [116.24235795647361, 40.372874192699896], [116.25131811215876, 40.38247476044334], [116.27612336131511, 40.374356651066606], [116.28369694290686, 40.391922183493335]]]
                }
            },
            {
                attributes: {
                    FID: 8,
                    bm: "110105",
                    y: 39.9502421994,
                    x: "116.506207881081"
                },
                geometry: {
                    rings: [[[116.54147680221682, 40.06147798801647], [116.54167141640984, 40.04642512084536], [116.59518738183591, 40.01301003719327], [116.62924258149216, 40.00312806141134], [116.6371190607415, 39.993007539128996], [116.62647114086512, 39.98303989367693], [116.63447304298667, 39.97977723922397], [116.63820127755586, 39.94544009453241], [116.62552842179946, 39.94983723137064], [116.62761849838894, 39.93772695011453], [116.61774408871499, 39.929278460735105], [116.62421316980016, 39.92073823445659], [116.61444868883522, 39.9223930567138], [116.61729002039964, 39.90367387152373], [116.60754407150857, 39.896327267945466], [116.60922281506357, 39.88896736571273], [116.62161152051398, 39.88974986539966], [116.61397172014256, 39.86773928428147], [116.6213553897032, 39.85979297799914], [116.5979531254125, 39.84877597250935], [116.5917081980277, 39.82402615534046], [116.57703624467352, 39.82423748517436], [116.5659820374611, 39.83422800827096], [116.53868490556331, 39.83535835886098], [116.5345119493389, 39.828784125240304], [116.52674426462062, 39.832138207921695], [116.52840125427508, 39.82386356165094], [116.50824772945367, 39.82945393049279], [116.49982325853522, 39.81687198526388], [116.48297273715347, 39.81808423775733], [116.46759191245742, 39.80887586891778], [116.4182998530836, 39.830849911272004], [116.4449605581052, 39.85092781794133], [116.46093881839961, 39.8517957279733], [116.43605620255533, 39.86525448912414], [116.43717046875815, 39.889078893967266], [116.44543010888502, 39.89130091071485], [116.44159971195093, 39.9022692949772], [116.42954313412997, 39.90090560371103], [116.42749599432435, 39.927689115664826], [116.43690137173506, 39.927667627319025], [116.44008265155838, 39.944965973704235], [116.42324488884978, 39.94915687533374], [116.42363386764472, 39.95857928367849], [116.40718204193196, 39.96094600034172], [116.40239575237129, 39.972985181595746], [116.40095506652807, 39.96101756031762], [116.38078377876933, 39.960369397630586], [116.38723389273896, 39.972005407767305], [116.37410283341886, 39.97166234062074], [116.36323239834452, 40.0004541438789], [116.34407593739562, 40.02581661812882], [116.38821037766176, 40.03180840599468], [116.3837763774119, 40.04022313098828], [116.3997192151463, 40.039375147952356], [116.40265661462998, 40.05455379878041], [116.4197745781895, 40.059226660297405], [116.41705161653394, 40.06517497807541], [116.4528857145123, 40.059128380958846], [116.46018424548244, 40.089244504470805], [116.54147680221682, 40.06147798801647]]]
                }
            },
            {
                attributes: {
                    FID: 9,
                    bm: "110108",
                    y: 40.0262029238,
                    x: "116.226013160373"
                },
                geometry: {
                    rings: [[[116.23980256142444, 40.13557640644221], [116.23340624364907, 40.10780172490976], [116.24990145428563, 40.10356889358891], [116.25657747458104, 40.109763999197305], [116.25600351722001, 40.09577077313656], [116.26660538956072, 40.09468630673012], [116.273315496029, 40.079075043327], [116.28361856740065, 40.08229575636779], [116.29624600829497, 40.059192389725524], [116.33622000284686, 40.05438284720635], [116.35648398082739, 40.06782284834647], [116.37482752722387, 40.06535226423442], [116.36022804230552, 40.050137425853535], [116.38821037766176, 40.03180840599468], [116.34407593739562, 40.02581661812882], [116.37005912611046, 39.991425129340016], [116.37355868604958, 39.96721939016742], [116.36332021811884, 39.96687811311357], [116.36512118297823, 39.948063301895985], [116.34983439059584, 39.943615083182706], [116.34603934422776, 39.95018175734414], [116.34447874039112, 39.94204666984984], [116.32132946798494, 39.94145415356374], [116.3314434174664, 39.896451218717004], [116.30661347645444, 39.89592985547595], [116.28739065386391, 39.88579388107369], [116.28830644756331, 39.89559019470525], [116.24634477424613, 39.89641573790571], [116.24539415879818, 39.920184128241395], [116.20002380121535, 39.917088968928006], [116.21314684098596, 39.942630164824216], [116.17909555576456, 39.969304293136794], [116.17826485990568, 39.98491133192747], [116.17213657595155, 39.98728044357], [116.16422108602383, 39.97582016208508], [116.16040338342334, 39.986464751430205], [116.1503661035801, 39.98392034711241], [116.14667224331238, 39.99569382216346], [116.16868537464906, 40.005407410225445], [116.13222924365986, 40.028163410421726], [116.07119658822236, 40.03172099066011], [116.06439258313627, 40.06066080211511], [116.04221677722639, 40.08659674876459], [116.07738096397007, 40.11916442661548], [116.12231376825508, 40.113731040672796], [116.1259430389028, 40.120333160246055], [116.16332075759331, 40.122801501291285], [116.15680142848582, 40.138590771615696], [116.17114353138969, 40.14346227016677], [116.17586583618463, 40.157285619628766], [116.19147427625471, 40.15993103921788], [116.20278601454419, 40.13959799612716], [116.23980256142444, 40.13557640644221]]]
                }
            },
            {
                attributes: {
                    FID: 10,
                    bm: "110107",
                    y: 39.9322733868,
                    x: "116.171043039241"
                },
                geometry: {
                    rings: [[[116.144052851185, 39.99259714534024], [116.151230078259, 39.983166565730826], [116.16040338460508, 39.98646475053816], [116.16398669935404, 39.97584188845312], [116.17213657595155, 39.98728044357], [116.17826486107636, 39.98491133193576], [116.17909555576456, 39.969304293136794], [116.21314684098596, 39.942630164824216], [116.20002380120486, 39.91708896982855], [116.24539415761869, 39.92018412913433], [116.25070627129237, 39.894254588474496], [116.22235866355769, 39.88957836548884], [116.20321073088505, 39.873191248911645], [116.19173390068602, 39.8820316054015], [116.16053054186203, 39.886061774617616], [116.13462111985437, 39.92065855084986], [116.10491530422995, 39.94192611795473], [116.11606263626663, 39.966704517674025], [116.10647224691851, 39.98052461516115], [116.144052851185, 39.99259714534024]]]
                }
            },
            {
                attributes: {
                    FID: 11,
                    bm: "110112",
                    y: 39.8028877474,
                    x: "116.726179976601"
                },
                geometry: {
                    rings: [[[116.60769898896936, 40.031049770282614], [116.61364365473051, 40.021817094109174], [116.64441236441677, 40.02490382481516], [116.67966119180566, 40.00749597214832], [116.67896652566021, 40.01578061326844], [116.69059755501884, 40.0153121336223], [116.70268870040354, 40.025856030983164], [116.71068480633929, 40.0187497101989], [116.73549890219171, 40.02664975319374], [116.74672882531745, 40.015072198163104], [116.76569603862457, 40.014143954312274], [116.7680449830953, 39.991496331453746], [116.75321604253106, 39.96370133507789], [116.77797407265297, 39.9444978151936], [116.77905347017553, 39.88580296743656], [116.79777010513025, 39.87756658631537], [116.80541846214068, 39.888780893943945], [116.81014987400927, 39.877384865942176], [116.85930424506617, 39.84302316831098], [116.87873183942901, 39.844558412284876], [116.89221270796648, 39.83118273228285], [116.90047039857366, 39.83207634562408], [116.89578614661305, 39.84741471337963], [116.90808875625756, 39.84827171935204], [116.92329757246846, 39.81035745501455], [116.93521527161334, 39.803184911881054], [116.93120962801055, 39.79270425675667], [116.94724499022992, 39.7857749275973], [116.93960628005188, 39.77686553835079], [116.91346913886979, 39.77872685876055], [116.90885696469883, 39.76208371885041], [116.90131323504505, 39.76550544858346], [116.89321327861813, 39.75830383240653], [116.91046167527229, 39.73047453038548], [116.88098358310926, 39.724489273228805], [116.87689061129933, 39.71737517081307], [116.88682813459457, 39.69530547439378], [116.88084408235335, 39.69032600108024], [116.8980763873507, 39.689061656565336], [116.89976058655894, 39.677206715120334], [116.8435571995209, 39.66660766172859], [116.84601427210985, 39.6517165274207], [116.8210121004044, 39.63744192818635], [116.82844929425269, 39.61651240508361], [116.78279671504144, 39.60971065487485], [116.78895768091812, 39.60168433882575], [116.77272302290581, 39.59229203649576], [116.77079020737591, 39.602989233868975], [116.74904861896825, 39.616885919053026], [116.72389925245179, 39.61852575073199], [116.71694807146336, 39.63819058738573], [116.70369633980825, 39.63701368436337], [116.69715391005056, 39.67341185225443], [116.66304722760613, 39.67391020655408], [116.65988680222446, 39.68648274537899], [116.64441197901347, 39.68758023459897], [116.63958979393968, 39.7002620332145], [116.64668725427417, 39.70775302643192], [116.63082521252866, 39.72368501608971], [116.6152918184988, 39.72744797199906], [116.59413167754475, 39.71176479662714], [116.57073292685065, 39.70893363122929], [116.56659514757473, 39.71422314726226], [116.52374816057589, 39.71269350254412], [116.5306254068874, 39.721756912876295], [116.52582015443818, 39.738786807288534], [116.53325130981801, 39.74053267214782], [116.52089438266368, 39.74254663100582], [116.5254191583494, 39.74792410645823], [116.51634811367782, 39.74868734742672], [116.51399413916371, 39.76487663904936], [116.51706946131189, 39.76902976417517], [116.52187845295637, 39.760523213475786], [116.53406222214447, 39.76043496402201], [116.52992800838847, 39.767762202453035], [116.53924002091769, 39.767970667790856], [116.52901534353288, 39.76981739003382], [116.5265874169301, 39.78770925642892], [116.53512140062877, 39.802480581672135], [116.52674426462062, 39.832138207921695], [116.5659820374611, 39.83422800827096], [116.57703624467352, 39.82423748517436], [116.5917081980277, 39.82402615534046], [116.5979531254125, 39.84877597250935], [116.6213553897032, 39.85979297799914], [116.61397172014256, 39.86773928428147], [116.62161152051398, 39.88974986539966], [116.60922281506357, 39.88896736571273], [116.60754407150857, 39.896327267945466], [116.61729002039964, 39.90367387152373], [116.61444868883522, 39.9223930567138], [116.62421316980016, 39.92073823445659], [116.61774408871499, 39.929278460735105], [116.62761849838894, 39.93772695011453], [116.62552842179946, 39.94983723137064], [116.63820127755586, 39.94544009453241], [116.63447304298667, 39.97977723922397], [116.62647114086512, 39.98303989367693], [116.63728888701715, 39.99189310484806], [116.62924258149216, 40.00312806141134], [116.58894630705632, 40.0166229438694], [116.60769898896936, 40.031049770282614]]]
                }
            },
            {
                attributes: {
                    FID: 12,
                    bm: "110109",
                    y: 39.9933170839,
                    x: "115.785110269135"
                },
                geometry: {
                    rings: [[[115.9154057539625, 40.13351075509871], [115.93985140150944, 40.10972242726608], [115.93726213649772, 40.10200507003112], [115.95008950396851, 40.095307384874054], [115.95616247090555, 40.101533043857394], [115.9617640215424, 40.0748001251269], [115.98071907690269, 40.08272248831379], [116.01398168561019, 40.07372808751534], [116.04189741441523, 40.08432898458421], [116.06439258313627, 40.06066080211511], [116.07119658822236, 40.03172099066011], [116.12752820753391, 40.02965068721796], [116.1569620196288, 40.01591919503875], [116.16588142714778, 40.00004308522789], [116.10647224574792, 39.98052461515212], [116.1160626351079, 39.966704516764565], [116.10491530306001, 39.9419261179457], [116.13462111869615, 39.92065854994059], [116.16053054187299, 39.88606177371708], [116.14692149027229, 39.88802488521448], [116.09578045334895, 39.872315197251694], [116.09466285994887, 39.86663887748581], [116.06529518839878, 39.868145023480054], [116.06406731425916, 39.85271110377923], [116.04764088322142, 39.844973305651216], [116.01287418156481, 39.839409825521564], [116.00125661270843, 39.84979736365046], [115.98326111930413, 39.839514160240064], [115.97845128104767, 39.86624090323329], [115.9903299802246, 39.87454685542836], [115.9476549222611, 39.86609889556538], [115.91935443793595, 39.87477371888911], [115.91541105432681, 39.88382216818247], [115.93885091739868, 39.901204623786384], [115.9341742943516, 39.91700609538745], [115.87323647505838, 39.91570763079106], [115.83852383451527, 39.896315572881576], [115.7970407291345, 39.920307874174725], [115.7628476411748, 39.92446003139147], [115.62436405923589, 39.87138133115282], [115.58895189917689, 39.819915571112304], [115.56289472344048, 39.812673705768994], [115.50743650099288, 39.83695405488787], [115.50377796832277, 39.84404588799126], [115.52241605467384, 39.87493902610798], [115.50279141278646, 39.88083920057486], [115.51314632749848, 39.90202714921534], [115.4739493824356, 39.93477522089972], [115.41661164634012, 39.95470033673935], [115.42143069816917, 39.98328153826816], [115.4429641597094, 39.99235786206431], [115.43433966898488, 40.00958465078112], [115.44813999630111, 40.02955108747239], [115.4647460656901, 40.028749303993486], [115.50305105086255, 40.064720895919166], [115.54548580121778, 40.078526264717716], [115.55689634422151, 40.09804587553856], [115.58484832673491, 40.09655277619554], [115.59249264334959, 40.11937147209641], [115.63511967726828, 40.11531053259348], [115.64858591073487, 40.13127325621132], [115.67836178263686, 40.125871389053756], [115.70267001213733, 40.13386138258431], [115.72937420095067, 40.12944396554875], [115.73000903602893, 40.138197179939176], [115.74573846164262, 40.1461467815028], [115.7355141855704, 40.15390555624684], [115.76154274490969, 40.16503414429911], [115.7662853772653, 40.17538626257607], [115.78259522675356, 40.177852653028765], [115.80030710308884, 40.15210952659637], [115.8584591401989, 40.147927186859675], [115.87499159468962, 40.138386944875805], [115.9154057539625, 40.13351075509871]]]
                }
            },
            {
                attributes: {
                    FID: 13,
                    bm: "110113",
                    y: 40.1492225263,
                    x: "116.715777102184"
                },
                geometry: {
                    rings: [[[116.86498608738106, 40.29006703104089], [116.867645828663, 40.26755144959236], [116.89512210710704, 40.23615746440951], [116.88755015104152, 40.231650141482916], [116.90723679347276, 40.21938362085617], [116.92442436134219, 40.22990143894891], [116.93427727032396, 40.22321971286089], [116.93191684572493, 40.210402110368015], [116.92284834629102, 40.21052880863661], [116.92947732720795, 40.19543107380015], [116.94228285898652, 40.19002472042276], [116.94026285910891, 40.17685975581699], [116.95531591528145, 40.174778969809864], [116.97212598688597, 40.15152278420968], [116.95901938984512, 40.12701451164819], [116.97599252208767, 40.06987411553052], [116.9556118757702, 40.062771296496244], [116.95529120083509, 40.05064367946489], [116.93861131202583, 40.04063144957258], [116.92299970740328, 40.05469839687137], [116.91030318026044, 40.04365961082459], [116.90392793025597, 40.05195326101199], [116.86436690804841, 40.03971872972281], [116.84355175215518, 40.05448970769464], [116.82494771443258, 40.04999858423891], [116.81617395524071, 40.04581804209973], [116.81586766980202, 40.02879302347476], [116.77437255785067, 40.03399167282911], [116.76569256189556, 40.01414440119373], [116.74672882531745, 40.015072198163104], [116.73549890219171, 40.02664975319374], [116.71068480633929, 40.0187497101989], [116.70268870040354, 40.025856030983164], [116.69059755501884, 40.0153121336223], [116.67896652566021, 40.01578061326844], [116.67966119180566, 40.00749597214832], [116.64441236441677, 40.02490382481516], [116.61364365473051, 40.021817094109174], [116.60769898896936, 40.031049770282614], [116.58894630705632, 40.0166229438694], [116.54072923157118, 40.04712836787877], [116.54147680221682, 40.06147798801647], [116.45793529575941, 40.091901577604006], [116.48570624541053, 40.107005152591974], [116.47232813229107, 40.145895653503835], [116.48124510640186, 40.1569447555852], [116.46995637518523, 40.15812923700329], [116.48128082144729, 40.19080156408871], [116.46396059139856, 40.20858840986195], [116.46699422072847, 40.22018567510076], [116.47809058409399, 40.22245526790591], [116.47563212947041, 40.24569615549186], [116.49332265990964, 40.248463176910704], [116.49800760702897, 40.26021087485166], [116.507620816115, 40.25568716530032], [116.51734623977048, 40.256695355003004], [116.518582497705, 40.26470030272094], [116.52913108378095, 40.260815540584446], [116.53034025146816, 40.276329082672895], [116.55959972501921, 40.2772501580328], [116.56370305340783, 40.268140197349105], [116.59019130444202, 40.266052241620365], [116.59934947884318, 40.25008648182264], [116.61557091695492, 40.24977496910764], [116.61720651028877, 40.25987135362313], [116.66050202332211, 40.26191839390597], [116.66183847071791, 40.23667909384667], [116.67734141150285, 40.23351548372796], [116.7316193871087, 40.283529875622925], [116.73151288641533, 40.27775424532699], [116.76487774280758, 40.265597027392204], [116.78210775325124, 40.29054757523196], [116.8160823560998, 40.280456489950765], [116.82227740421858, 40.30358299533472], [116.84225775200817, 40.31042373623501], [116.85120483813012, 40.291503905047556], [116.86498608738106, 40.29006703104089]]]
                }
            }];
            for (c = 0; c < b.length; c++) {
                var e = b[c];
                data._hashT.put(e.attributes.bm, {
                    x: e.attributes.x,
                    y: e.attributes.y,
                    geo: e.geometry
                })
            }
            JsonpRequest(Service.comHandl + "QueryDic", {},
            function(b) {
                b = b.result;
                for (var c = 0; c < b.length; c++) {
                    var d = b[c];
                    data.hash_Condition.put(d.id, d.d)
                }
            })
        },
        getCondition: function() {
            return data.hash_Condition
        },
        getHash: function() {
            return data._hashT
        },
        getLay: function() {
            return data._layer1
        },
        getLay1: function() {
            return data._layer
        },
        addTileLayer: function() {
            wmswmts.addLayer({
                id: "1",
                url: Service.qdhyTile,
                layer: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            })
        },
        removeTileLayer: function() {
            wmswmts.removeLayer("1")
        }
    }
} (),
qsgk = function() {
    function b() {
        E = {
            check: {
                enable: !0
            },
            view: {
                showIcon: !1
            },
            data: {
                key: {
                    name: "name",
                    children: "child"
                }
            },
            callback: {
                onClick: n,
                onCheck: g
            }
        };
        var b = qsgk._map.map;
        b.events.register("zoomend", null,
        function() {
            12 < b.getZoom() ? document.attachEvent ? qsgk._map.map.viewPortDiv.attachEvent("onclick", y, !1) : qsgk._map.map.viewPortDiv.addEventListener("click", y, !1) : document.detachEvent ? qsgk._map.map.viewPortDiv.detachEvent("onclick", y) : qsgk._map.map.viewPortDiv.removeEventListener("click", y)
        });
        var d = {
            TRANSPARENT: !0,
            STYLES: "",
            FORMAT: "image/png",
            SRS: qsgk._map.map.getProjection()
        };
        k = new OpenLayers.Layer.WMS("testWms", Service.qdhyTile, d, {
            isBaseLayer: !1,
            opacity: 1,
            singleTile: !0
        });
        z = data.getLay();
        $(".d_item input").attr("readonly", "readonly");
        $(".d_item input").click(function() {
            a($(this))
        });
        $("#con_tree").mouseleave(function() {
            $("#con_tree").css({
                display: "none"
            })
        });
        $("#btn_Query").click(function() {
            u = [];
            var a = p();
            h(a);
            u.push(a)
        });
        $("#ul_list").on("click", "li",
        function(a) {
            $("#ul_list li").css("background-color", "#fff");
            $(this).css("background-color", "#eee");
            a = $(this).attr("x");
            var b = $(this).attr("y");
            a = new OpenLayers.LonLat(a, b);
            qsgk._map.map.setCenter(a, 9);
            x(a)
        });
        $("#btn_return").click(function() {
            $("#btn_Query").click()
        });
        z.events.on({
            featureselected: c
        })
    }
    function c(a) {
        null != qsgk._map.widgetPop && qsgk._map.removePopup(qsgk._map.widgetPop);
        l(a.feature.attributes.bm, !1)
    }
    function e() {
        JsonpRequest(Service.comHandl + "GetCountAll", {},
        function(a) {
            a = a.result;
            if (null != a) {
                for (var b = 0; b < a.length; b++) a[b].name = a[b].name + "(" + a[b].count + ")",
                d(a[b].code, a[b].count);
                A = $.fn.zTree.init($("#qsgk_tree"), E, a)
            }
        })
    }
    function f(a) {
        a ? ($("#qsgk_tree").hide(), $("#ul_list").show(), $("#pag").show(), $("#btn_return").show()) : ($("#qsgk_tree").show(), $("#ul_list").hide(), $("#pag").hide(), $("#btn_return").hide())
    }
    function h(a) {
        z.removeAllFeatures();
        data.getLay1().removeAllFeatures();
        qsgk._map.removePopup(qsgk._map.widgetPop);
        qsgk._map.map.setCenter(new OpenLayers.LonLat(116.399, 40.185), 9);
        data.addTileLayer();
        f(!1);
        JsonpRequest(Service.comHandl + "SuperQuery_C", v(a),
        function(a) {
            a = a.result;
            if (null != a) {
                for (var b = 0; b < a.length; b++) a[b].name = a[b].name + "(" + a[b].count + ")",
                d(a[b].code, a[b].count);
                A = $.fn.zTree.init($("#qsgk_tree"), E, a)
            }
        })
    }
    function d(a, b) {
        var c = data.getHash().get(a);
        if (c) {
            var c = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(c.x, c.y)),
            d = OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style["default"]);
            d.externalGraphic = "images/yuye/Point.png";
            rr = 45 + parseInt(b / 15);
            d.graphicWidth = rr;
            d.graphicHeight = rr;
            d.fillOpacity = 1;
            d.cursor = "pointer";
            d.label = "\u6570\u91cf:" + b;
            d.stroke = !1;
            d.labelSelect = !0;
            d.labelOutlineWidth = 2;
            d.fontColor = "blue";
            c.style = d;
            c.attributes = {
                bm: a
            };
            z.addFeatures(c)
        }
    }
    function a(a) {
        var b = a.position().top,
        c = a.position().left,
        d = a.attr("d");
        $("#con_tree").css({
            display: "block"
        });
        $("#con_tree").css("left", c);
        $("#con_tree").css("top", b + 20);
        b = {
            view: {
                showLine: !1,
                showIcon: !1
            },
            check: {
                enable: !0,
                chkStyle: "11" == d || "12" == d ? "checkbox": "radio"
            },
            data: {
                key: {
                    name: "name"
                }
            },
            callback: {
                onClick: function(b, c, e) {
                    "11" != d && "12" != d && (a.val(e.name), a.attr("c", e.c))
                },
                onCheck: function(b, c, e) {
                    if ("11" == d || "12" == d) if ("1100" == e.c || "1200" == e.c) a.val(e.name),
                    a.attr("c", e.c),
                    $("#con_tree").css({
                        display: "none"
                    });
                    else {
                        c = b = "";
                        nodes = w.getCheckedNodes(!0);
                        for (e = 0; e < nodes.length; e++) b += nodes[e].name + " ",
                        c += nodes[e].c + ",";
                        c = "," == c.substring(c.length - 1) ? c.substring(0, c.length - 1) : c;
                        a.val(b);
                        a.attr("c", c)
                    } else a.val(e.name),
                    a.attr("c", e.c)
                }
            }
        };
        c = data.getCondition().get(d);
        w = $.fn.zTree.init($("#con_tree"), b, c)
    }
    function g(a, b, c) {
        data.removeTileLayer();
        z.removeAllFeatures();
        if (c.checked) {
            a = c.code;
            b = {
                opa: .1,
                only: !1
            };
            c = data.getLay1();
            var d = data.getHash();
            if (d.contains(a)) {
                var e = OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style["default"]);
                e.strokeColor = "blue";
                e.strokeWidth = 2;
                e.strokeDashstyle = "longdash";
                e.fillOpacity = null != b ? b.opa: .2;
                e.fillColor = null != b ? b.filC: "red";
                c.style = e;
                if (d = d.get(a)) {
                    for (var d = d.geo.rings,
                    e = [], f = 0; f < d.length; f++) {
                        for (var g = [], h = 0; h < d[f].length; h++) {
                            var l = new OpenLayers.Geometry.Point(d[f][h][0], d[f][h][1]);
                            g.push(l)
                        }
                        g = new OpenLayers.Geometry.LinearRing(g);
                        g = new OpenLayers.Geometry.Polygon([g]);
                        e[f] = new OpenLayers.Feature.Vector(g, {
                            bm: a
                        })
                    }
                    b.only && c.removeAllFeatures();
                    c.addFeatures(e);
                    qsgk._map.map.zoomToExtent(c.getDataExtent())
                }
            }
        } else a = data.getLay1().getFeaturesByAttribute("bm", c.code),
        data.getLay1().removeFeatures(a);
        a = A.getCheckedNodes(!0);
        if (0 < a.length) {
            b = [];
            for (c = 0; c < a.length; c++) b.push(Service.dy[a[c].code]);
            qsgk._map.addLayer(k);
            k.mergeNewParams({
                LAYERS: b.join(",")
            })
        } else qsgk._map.removeLayer(k)
    }
    function n(a, b, c) {
        l(c.code, !0)
    }
    function l(a, b) {
        for (var c = {
            type: "11",
            code: a
        },
        d = u[0].concat(), e = 0; e < d.length; e++) if ("11" == d[e].type) {
            d.splice(e, 1);
            break
        }
        d.push(c);
        JsonpRequest(Service.comHandl + "SuperQuery_S", v(d),
        function(c) {
            var e = data.getHash().get(a),
            e = new OpenLayers.LonLat(e.x, e.y);
            c = c.retult[0];
            PoiInfoPop.show("resourcelist", e, {
                "\u540d\u79f0": c.name,
                "\u4f01\u4e1a\u6570\u91cf": c.total.count,
                "\u5360\u5730\u9762\u79ef": c.total.floor,
                "\u6c34\u9762\u9762\u79ef": c.total.aqu,
                "\u4ea7\u91cf": c.total.val,
                "\u63a5\u5f85\u91cf": c.total.recep,
                "\u8425\u4e1a\u989d": c.total.pro
            },
            null);
            b && q(d)
        })
    }
    function q(a) {
        JsonpRequest(Service.comHandl + "SuperQuery", v(a),
        function(a) {
            f(!0);
            a = a.result[0];
            a = "undefined" == typeof a.detaillist ? null: a.detaillist;
            null != a && m(a)
        })
    }
    function m(a) {
        var b = a.length;
        r(a, 1, 10);
        b = {
            containerClass: "pagination",
            currentPage: 1,
            numberOfPages: 6,
            totalPages: Math.ceil(b / 10),
            onPageClicked: function(b, c, d, e) {
                r(a, e, 10)
            }
        };
        $("#pag").bootstrapPaginator(b)
    }
    function r(a, b, c) {
        var d = [],
        e = b * c,
        e = e > a.length ? a.length: e;
        for (b = (b - 1) * c; b < e; b++) d.push(common.format('\x3cli class\x3d"li_resultlist" x\x3d{0} y\x3d{1}\x3e\x3cdiv class\x3d"img-info"\x3e\x3c/div\x3e\x3cdiv class\x3d"basic-info"\x3e\x3ch4\x3e{2}\x3c/h4\x3e\x3c/div\x3e\x3c/li\x3e', a[b].longitude, a[b].latitude, a[b].name));
        $("#ul_list").empty();
        $("#ul_list").html(d.join(""))
    }
    function p() {
        var a = [];
        $(".d_item input").each(function(b, c) {
            var d = $(c).attr("c");
            if (void 0 != d) {
                var e = $(c).attr("d");
                a.push({
                    type: e,
                    code: d
                })
            }
        });
        return a
    }
    function v(a) {
        for (var b = {},
        c = 0; c < a.length; c++) b["param" + a[c].type] = a[c].code;
        return b
    }
    function x(a) {
        var b = qsgk._map.map,
        c = b.getExtent(),
        c = c.left + "," + c.bottom + "," + c.right + "," + c.top,
        d = '{"x":' + a.lon + ',"y":' + a.lat + "}",
        e = b.size,
        b = {
            imageDisplay: e.w + "," + e.h + ",96",
            sr: b.getProjection().split(":")[1],
            mapExtent: c,
            geometry: d,
            layers: "all:0,1,2,3,4,5,6,7,8,9,10,11,12",
            geometryType: "esriGeometryPoint",
            returnGeometry: !0,
            tolerance: 4,
            f: "json"
        },
        c = Service.ident + "/identify";
        jQuery.support.cors = !0;
        $.ajax({
            data: b,
            method: "POST",
            url: c,
            success: function(b) {
                b = JSON.parse(b);
                if (null != b.results && 0 < b.results.length) {
                    PoiInfoPop.show("resourcelist", a, b.results[0].attributes, null);
                    var c = b.results[0].geometry;
                    if (null != c) {
                        b = OpenLayers.Util.extend({},
                        OpenLayers.Feature.Vector.style["default"]);
                        b.strokeColor = "red";
                        b.strokeWidth = 2;
                        b.strokeDashstyle = "longdash";
                        b.fillOpacity = .2;
                        b.fillColor = "yellow";
                        z.style = b;
                        for (var c = c.rings,
                        d = [], e = 0; e < c.length; e++) {
                            for (var f = [], g = 0; g < c[e].length; g++) {
                                var h = new OpenLayers.Geometry.Point(c[e][g][0], c[e][g][1]);
                                f.push(h)
                            }
                            f = new OpenLayers.Geometry.LinearRing(f);
                            f = new OpenLayers.Geometry.Polygon([f]);
                            f = new OpenLayers.Feature.Vector(f);
                            f.style = b;
                            d[e] = f
                        }
                        z.removeAllFeatures();
                        z.addFeatures(d);
                        qsgk._map.map.setCenter(z.getDataExtent().getCenterLonLat(), 16)
                    }
                }
            },
            error: function(a, b, c) {}
        })
    }
    function y(a) {
        var b = qsgk._map.map,
        c = a.xy;
        c || (c = $(b.div).offset(), c = {
            x: a.clientX - c.left,
            y: a.clientY - c.top
        });
        a = b.getLonLatFromPixel(c);
        x(a)
    }
    var t = !1,
    A, w, E, u = [[]],
    z = null,
    k;
    return {
        init: function(a) {
            this._map = a;
            t || (b(), e(), t = !0)
        },
        clear: function() {
            data.getLay().removeAllFeatures();
            data.getLay1().removeAllFeatures()
        }
    }
} (),
common = {
    getQueryString: function(b) {
        b = new RegExp("(^|\x26)" + b + "\x3d([^\x26]*)(\x26|$)", "i");
        b = window.location.search.substr(1).match(b);
        return null != b ? unescape(b[2]) : null
    },
    format: function(b) {
        if (0 < arguments.length) {
            var c = arguments[0];
            if (1 < arguments.length) if (2 == arguments.length && "object" == typeof arguments[1]) for (var e in arguments[1]) var f = new RegExp("({" + e + "})", "g"),
            c = c.replace(f, arguments[1][e]);
            else for (e = 1; e < arguments.length; e++) {
                if (void 0 == arguments[e]) return b;
                f = new RegExp("({[" + (e - 1) + "]})", "g");
                c = c.replace(f, arguments[e])
            }
            return c
        }
        return b
    }
},
sdMap,
g_userid = "",
g_username = "",
isImg = !1;
function initPage() {
    sdMap = new SDMap("mapDiv", {
        scaleLine: !0,
        keyboard: !0,
        layerSwitch: 0,
        mousePosition: !0
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
    checkLogin()
} (function() {
    Browser.ie6 || Browser.ie6Compat || Browser.ie7 || Browser.ie7Compat ? alert("\u5f53\u524d\u4f7f\u7528ie\u5185\u6838\u7248\u672c\u592a\u4f4e,\u90e8\u5206\u529f\u80fd\u5c06\u65e0\u6cd5\u4f7f\u7528\uff0c\u5efa\u8bae\u4f7f\u7528IE8\u53ca\u4ee5\u4e0a\u7248\u672c\u6d4f\u89c8\u5668\uff01") : LoadCtr()
})();
function LoadCtr() {
    initProject()
}
function initProject() {
    $(function() {
        $("#mapDiv").css("width", "100%");
        $("#left_hidden").click(function(b) {
            $(this).hasClass("show") ? ($(this).removeClass("show"), $(this).attr({
                title: "\u6536\u8d77\u5de6\u680f"
            }), $("#left").css("display", "block"), $("#center").css({
                width: $(window).width() - 359,
                left: 359
            }).attr("data-calc-width", "100%-359px")) : ($(this).addClass("show"), $(this).attr({
                title: "\u5c55\u5f00\u5de6\u680f"
            }), $("#left").css("display", "none"), $("#center").css({
                width: $(window).width(),
                left: 0
            }).attr("data-calc-width", "100%-0px"));
            MapContrast.IsStartContrast() ? MapContrast.mapDivHandler() : sdMap.map.updateSize()
        });
        $("#Rw_top_back").click(function() {
            var b = $("#Rw_top_img");
            b.hasClass("hide") ? (b.removeClass("hide"), $("#result_content").show()) : (b.addClass("hide"), $("#result_content").hide())
        });
        initPage()
    })
}
var TopMenu = function() {
    var b = [];
    return {
        init: function() {
            for (var c in b) {
                var e = b[c],
                f = ["\x3cul class\x3d'submenu'\x3e"];
                if (null != e.sublist) {
                    for (var h in e.sublist) f.push("\x3cli id\x3d'" + h + "'\x3e" + e.sublist[h] + "\x3c/li\x3e");
                    f.push("\x3c/ul\x3e");
                    $("#" + e.parent).append(f.join(""))
                }
            }
            $("#nav\x3eli").mouseenter(function() {
                var b = $(this).children(".submenu");
                0 < b.length && b.show()
            });
            $("#nav\x3eli").mouseleave(function() {
                var b = $(this).children(".submenu");
                0 < b.length && b.hide()
            });
            $("#nav").on("click", ".submenu\x3eli",
            function() {
                var c = $(this),
                a;
                a: {
                    a = c.parent().parent()[0].id;
                    for (var e in b) if (b[e].parent == a) {
                        a = b[e];
                        break a
                    }
                    a = null
                }
                a && a.handler && a.handler(c[0].id)
            });
            $("#d_xxzy").click(function() {
                leftMenu.addTab({
                    name: "resource"
                })
            })
        },
        addSubMenu: function(c) {
            var e = ["\x3cul class\x3d'submenu'\x3e"];
            if (null != c.sublist) {
                for (var f in c.sublist) e.push("\x3cli id\x3d'" + f + "'\x3e" + c.sublist[f] + "\x3c/li\x3e");
                e.push("\x3c/ul\x3e");
                $("#" + c.parent).append(e.join(""))
            }
            b.push(c)
        }
    }
} (),
leftMenu = function() {
    function b() {
        $("#contentPanel #tab_resource_div").show().siblings().hide()
    }
    function c(b, c) {
        c || $("#contentPanel").children().hide();
        var d;
        a: {
            for (d in e) if (e[d].name == b.name) {
                d = e[d];
                break a
            }
            d = null
        }
        d ? ($("#" + d.name + "_menu").addClass("cur").siblings().removeClass("cur"), $("#contentPanel #" + d.div).show().siblings().hide()) : (d = ["\x3cli id\x3d'", b.name, "_menu'\x3e\x3cimg src\x3d'", b.imgurl, "'/\x3e\x3cspan\x3e", b.title, "\x3c/span\x3e", "\x3c/li\x3e"], c || d.splice(d.length - 1, 0, "\x3cdiv class\x3d'deldiv'\x3e\x3c/div\x3e"), $("#leftMenu").append(d.join("")), b.handler && b.handler(), e.push({
            name: b.name,
            div: b.div,
            handler: b.handler,
            clear: b.clear
        }), $("#leftMenu li:last").addClass("cur").siblings().removeClass("cur"))
    }
    var e = [];
    return {
        init: function() {
            c({
                name: "resource",
                div: "tab_resource_div",
                title: "\u5bfc\u822a",
                imgurl: "images/leftDiv/bdico_03.png",
                handler: b,
                clear: null
            },
            !0);
            $("#leftMenu").on("click", "li",
            function() {
                var b = $(this);
                if (!b.hasClass("cur")) {
                    b.addClass("cur").siblings().removeClass("cur");
                    var b = b[0].id.replace("_menu", ""),
                    c;
                    for (c in e) if (e[c].name == b) {
                        $("#contentPanel #" + e[c].div).show().siblings().hide();
                        break
                    }
                }
            });
            $("#leftMenu").on("click", ".deldiv",
            function(c) {
                var f = $(this).parent(),
                d = f[0].id.replace("_menu", ""),
                a;
                for (a in e) if (e[a].name == d) {
                    $("#contentPanel #" + e[a].div).hide();
                    e[a].clear && e[a].clear();
                    e.splice(a, 1);
                    break
                }
                f.hasClass("cur") && ($("#leftMenu li:eq(0)").addClass("cur"), b());
                f.remove();
                c.stopImmediatePropagation()
            })
        },
        addTab: c
    }
} ();
function locationLogin() {
    window.location.href = "login.html"
}
function locationReg() {
    window.location.href = "register.html"
}
function userout() {
    delCookie("USERID");
    delCookie("JSESSIONID");
    delCookie("USERNAME");
    $("#login").html("\u767b\u5f55");
    $("#login").attr("href", "login.html");
    $("#reg").html("\u6ce8\u518c");
    $("#reg").attr("href", "register.html");
    window.location.reload()
}
function checkLogin() {
    if ("0" != g_userid) {
        var b = getSubString(g_username, 5);
        $("#login").html(b);
        $("#login").attr("href", "javascript:void(0)");
        $("#reg").html("\u9000\u51fa");
        $("#reg").attr("href", "javaScript:userout()")
    }
};