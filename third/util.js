/**
 * 在父层的元素范围内进行拖动
 * @author Cicada
 * @date 2013-08-08 17:13:36
 *
 */
 
(function() {
	var source = null;
	var target = null;
	var _left = 0;
	var _top = 0;
	//内偏移
	var _offset = 0;
	
	//拖动事件
	function move(s, d, e) {
		source = $(s);
		target = $(d);
		
		e = e || window.event;
		_left = e.clientX - source.offsetLeft;
		_top  = e.clientY - source.offsetTop;
		
		source.setCapture && source.setCapture();
	}
	
	//移动过程中进行计算
	document.onmousemove = function(e) {
		if (!target || !source) return;
		
		e = e || window.event;
		
		//先算出外层的范围
		var offset = $D.getOffset(target);
		var size   = $D.getSize(target);
		
		var l = e.clientX - _left;
		var t = e.clientY - _top;
		var c = $D.getSize(source);
		//当前位置 + 本身的宽度 > 外层的左偏移 + 外层本身宽度，这个右边的范围
		var x = (l + c.width) > (offset.left + size.width) ? (offset.left + size.width - c.width) : l;
		//左边的范围
		x = (x < offset.left) ? offset.left + _offset : x - _offset;
		//当前位置 + 本身的高度 > 外层的上偏移 + 外层本身高度，这个下边的范围
		var y = (t + c.height) > (offset.top + size.height) ? (offset.top + size.height - c.height) : t;
		//上边的范围
		y = (y < offset.top) ? offset.top + _offset : y - _offset;
		//直接赋值
		$D.setStyle(source, {"left" : x + "px", "top" : y + "px"});
	};
	
	//释放鼠标
	document.onmouseup = function() {
		if (!source) return;
		
		source.releaseCapture && source.releaseCapture();
		source = target = null;
	};
	
	window.move = move;
	
	//ie8之前的版本增加indexOf方法
	if(!Array.indexOf)
	{
	    Array.prototype.indexOf = function(obj)
	    {              
	        for(var i=0; i<this.length; i++)
	        {
	            if(this[i]==obj)
	            {
	                return i;
	            }
	        }
	        return -1;
	    };
	};
	Array.prototype.arryRemove = function(varElement)//数组删除指定元素
	{
	    var numDeleteIndex = -1;
	    for (var i=0; i<this.length; i++)
	    {
	        if (this[i] === varElement)//强等
	        {
	            this.splice(i, 1);
	            numDeleteIndex = i;
	            break;
	        }
	    }
	    return numDeleteIndex;
	};
})();

//此类就是添加一些工具类，有什么工具可以进行扩充

/**
 * Cloudgamer JavaScript Library v0.1
 * Copyright (c) 2009 cloudgamer
 * Blog: http://cloudgamer.cnblogs.com/
 * Date: 2009-10-15
 */

var $O, $B, $A, $F, $D, $E, $CE, $S;

(function(undefined){

var O, B, A, F, D, E, CE, S;


/*Object*/

O = function (id) {
	return "string" == typeof id ? document.getElementById(id) : id;
};

O.emptyFunction = function(){};

O.extend = function (destination, source, override) {
	if (override === undefined) override = true;
	for (var property in source) {
		if (override || !(property in destination)) {
			destination[property] = source[property];
		}
	}
	return destination;
};

O.deepextend = function (destination, source) {
	for (var property in source) {
		var copy = source[property];
		if ( destination === copy ) continue;
		if ( typeof copy === "object" ){
			destination[property] = arguments.callee( destination[property] || {}, copy );
		}else{
			destination[property] = copy;
		}
	}
	return destination;
};

/*from youa*/
O.wrapper = function(me, parent) {
    var ins = function() { me.apply(this, arguments); };
    var subclass = function() {};
    subclass.prototype = parent.prototype;
    ins.prototype = new subclass;
    return ins;
};


/*Browser*/

/*from youa*/
B = (function(ua){
	var b = {
		msie: /msie/.test(ua) && !/opera/.test(ua),
		opera: /opera/.test(ua),
		safari: /webkit/.test(ua) && !/chrome/.test(ua),
		firefox: /firefox/.test(ua),
		chrome: /chrome/.test(ua)
	};
	var vMark = "";
	for (var i in b) {
		if (b[i]) { vMark = "safari" == i ? "version" : i; break; }
	}
	b.version = vMark && RegExp("(?:" + vMark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";
	
	b.ie = b.msie;
	b.ie6 = b.msie && parseInt(b.version, 10) == 6;
	b.ie7 = b.msie && parseInt(b.version, 10) == 7;
	b.ie8 = b.msie && parseInt(b.version, 10) == 8;
	
	return b;
})(window.navigator.userAgent.toLowerCase());


/*Array*/

A = function(){
	
	var ret = {
		isArray: function( obj ) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		},
		indexOf: function( array, elt, from ){
			if (array.indexOf) {
				return isNaN(from) ? array.indexOf(elt) : array.indexOf(elt, from);
			} else {
				var len = array.length;
				from = isNaN(from) ? 0
					: from < 0 ? Math.ceil(from) + len : Math.floor(from);
				
				for ( ; from < len; from++ ) { if ( array[from] === elt ) return from; }
				return -1;
			}
		},
		lastIndexOf: function( array, elt, from ){
			if (array.lastIndexOf) {
				return isNaN(from) ? array.lastIndexOf(elt) : array.lastIndexOf(elt, from);
			} else {
				var len = array.length;
				from = isNaN(from) || from >= len - 1 ? len - 1
					: from < 0 ? Math.ceil(from) + len : Math.floor(from);
				
				for ( ; from > -1; from-- ) { if ( array[from] === elt ) return from; }
				return -1;
			}
		}
	};
	
	function each( object, callback ) {
		if ( undefined === object.length ){
			for ( var name in object ) {
				if (false === callback( object[name], name, object )) break;
			}
		} else {
			for ( var i = 0, len = object.length; i < len; i++ ) {
				if (i in object) { if (false === callback( object[i], i, object )) break; }
			}
		}
	};
	
	each({
			forEach: function( object, callback, thisp ){
				each( object, function(){ callback.apply(thisp, arguments); } );
			},
			map: function( object, callback, thisp ){
				var ret = [];
				each( object, function(){ ret.push(callback.apply(thisp, arguments)); });
				return ret;
			},
			filter: function( object, callback, thisp ){
				var ret = [];
				each( object, function(item){
						callback.apply(thisp, arguments) && ret.push(item);
					});
				return ret;
			},
			every: function( object, callback, thisp ){
				var ret = true;
				each( object, function(){
						if ( !callback.apply(thisp, arguments) ){ ret = false; return false; };
					});
				return ret;
			},
			some: function( object, callback, thisp ){
				var ret = false;
				each( object, function(){
						if ( callback.apply(thisp, arguments) ){ ret = true; return false; };
					});
				return ret;
			}
		}, function(method, name){
			ret[name] = function( object, callback, thisp ){
				if (object[name]) {
					return object[name]( callback, thisp );
				} else {
					return method( object, callback, thisp );
				}
			}
		});
	
	return ret;
}();


/*Function*/

F = (function(){
	var slice = Array.prototype.slice;
	return {
		bind: function( fun, thisp ) {
			var args = slice.call(arguments, 2);
			return function() {
				return fun.apply(thisp, args.concat(slice.call(arguments)));
			}
		},
		bindAsEventListener: function( fun, thisp ) {
			var args = slice.call(arguments, 2);
			return function(event) {
				return fun.apply(thisp, [E.fixEvent(event)].concat(args));
			}
		}
	};
})();


/*Dom*/

D = {
	getScrollTop: function(node) {
		var doc = node ? node.ownerDocument : document;
		return doc.documentElement.scrollTop || doc.body.scrollTop;
	},
	getScrollLeft: function(node) {
		var doc = node ? node.ownerDocument : document;
		return doc.documentElement.scrollLeft || doc.body.scrollLeft;
	},
	contains: document.defaultView
		? function (a, b) { return !!( a.compareDocumentPosition(b) & 16 ); }
		: function (a, b) { return a != b && a.contains(b); },
	rect: function(node){
		var left = 0, top = 0, right = 0, bottom = 0;
		//ie8的getBoundingClientRect获取不准确
		if ( !node.getBoundingClientRect || B.ie8 ) {
			var n = node;
			while (n) { left += n.offsetLeft, top += n.offsetTop; n = n.offsetParent; };
			right = left + node.offsetWidth; bottom = top + node.offsetHeight;
		} else {
			var rect = node.getBoundingClientRect();
			left = right = D.getScrollLeft(node); top = bottom = D.getScrollTop(node);
			left += rect.left; right += rect.right;
			top += rect.top; bottom += rect.bottom;
		};
		return { "left": left, "top": top, "right": right, "bottom": bottom };
	},
	clientRect: function(node) {
		var rect = D.rect(node), sLeft = D.getScrollLeft(node), sTop = D.getScrollTop(node);
		rect.left -= sLeft; rect.right -= sLeft;
		rect.top -= sTop; rect.bottom -= sTop;
		return rect;
	},
	curStyle: document.defaultView
		? function (elem) { return document.defaultView.getComputedStyle(elem, null); }
		: function (elem) { return elem.currentStyle; },
	getStyle: document.defaultView
		? function (elem, name) {
			var style = document.defaultView.getComputedStyle(elem, null);
			return name in style ? style[ name ] : style.getPropertyValue( name );
		}
		: function (elem, name) {
			var style = elem.style, curStyle = elem.currentStyle;
			//透明度 from youa
			if ( name == "opacity" ) {
				if ( /alpha\(opacity=(.*)\)/i.test(curStyle.filter) ) {
					var opacity = parseFloat(RegExp.$1);
					return opacity ? opacity / 100 : 0;
				}
				return 1;
			}
			if ( name == "float" ) { name = "styleFloat"; }
			var ret = curStyle[ name ] || curStyle[ S.camelize( name ) ];
			//单位转换 from jqury
			if ( !/^-?\d+(?:px)?$/i.test( ret ) && /^\-?\d/.test( ret ) ) {
				var left = style.left, rtStyle = elem.runtimeStyle, rsLeft = rtStyle.left;
				
				rtStyle.left = curStyle.left;
				style.left = ret || 0;
				ret = style.pixelLeft + "px";
				
				style.left = left;
				rtStyle.left = rsLeft;
			}
			return ret;
		},
	setStyle: function(elems, style, value) {
		if ( !elems.length ) { elems = [ elems ]; }
		if ( typeof style == "string" ) { var s = style; style = {}; style[s] = value; }
		A.forEach( elems, function(elem ) {
			for (var name in style) {
				var value = style[name];
				if (name == "opacity" && B.ie) {
					//ie透明度设置 from jquery
					elem.style.filter = (elem.currentStyle && elem.currentStyle.filter || "").replace( /alpha\([^)]*\)/, "" ) + " alpha(opacity=" + (value * 100 | 0) + ")";
				} else if (name == "float") {
					elem.style[ B.ie ? "styleFloat" : "cssFloat" ] = value;
				} else {
					elem.style[ S.camelize( name ) ] = value;
				}
			};
		});
	},
	getSize: function(elem) {
		var width = elem.offsetWidth, height = elem.offsetHeight;
		if ( !width && !height ) {
			var repair = !D.contains( document.body, elem ), parent;
			if ( repair ) {//如果元素不在body上
				parent = elem.parentNode;
				document.body.insertBefore(elem, document.body.childNodes[0]);
			}
			var style = elem.style,
				cssShow = { position: "absolute", visibility: "hidden", display: "block", left: "-9999px", top: "-9999px" },
				cssBack = { position: style.position, visibility: style.visibility, display: style.display, left: style.left, top: style.top };
			D.setStyle( elem, cssShow );
			width = elem.offsetWidth; height = elem.offsetHeight;
			D.setStyle( elem, cssBack );
			if ( repair ) {
				parent ? parent.appendChild(elem) : document.body.removeChild(elem);
			}
		}
		return { "width": width, "height": height };
	},
	//Add By Cicada 2013-8-2 17:13:51
	getOffset: function(elem) {
		var left = elem.offsetLeft;
		var top = elem.offsetTop;
		while (elem.offsetParent != null) {
			elem = elem.offsetParent;
			left += elem.offsetLeft;
			top += elem.offsetTop;
		}
		return { "left": left, "top": top };
	}
};


/*Event*/
E = (function(){
	/*from dean edwards*/
	var addEvent, removeEvent, guid = 1,
		storage = function( element, type, handler ){
			if (!handler.$$guid) handler.$$guid = guid++;
			if (!element.events) element.events = {};
			var handlers = element.events[type];
			if (!handlers) {
				handlers = element.events[type] = {};
				if (element["on" + type]) {
					handlers[0] = element["on" + type];
				}
			}
		};
	if ( window.addEventListener ) {
		var fix = { "mouseenter": "mouseover", "mouseleave": "mouseout" };
		addEvent = function( element, type, handler ){
			if ( type in fix ) {
				storage( element, type, handler );
				var fixhandler = element.events[type][handler.$$guid] = function(event){
					var related = event.relatedTarget;
					if ( !related || (element != related && !(element.compareDocumentPosition(related) & 16)) ){
						handler.call(this, event);
					}
				};
				element.addEventListener(fix[type], fixhandler, false);
			} else {
				element.addEventListener(type, handler, false);
			};
		};
		removeEvent = function( element, type, handler ){
			if ( type in fix ) {
				if (element.events && element.events[type]) {
					element.removeEventListener(fix[type], element.events[type][handler.$$guid], false);
					delete element.events[type][handler.$$guid];
				}
			} else {
				element.removeEventListener(type, handler, false);
			};
		};
	} else {
		addEvent = function( element, type, handler ){
			storage( element, type, handler );
			element.events[type][handler.$$guid] = handler;
			element["on" + type] = handleEvent;
		};
		removeEvent = function( element, type, handler ){
			if (element.events && element.events[type]) {
				delete element.events[type][handler.$$guid];
			}
		};
		function handleEvent() {
			var returnValue = true, event = fixEvent();
			var handlers = this.events[event.type];
			for (var i in handlers) {
				this.$$handleEvent = handlers[i];
				if (this.$$handleEvent(event) === false) {
					returnValue = false;
				}
			}
			return returnValue;
		};
	}
	
	function fixEvent(event) {
		if (event) return event;
		event = window.event;
		event.pageX = event.clientX + D.getScrollLeft(event.srcElement);
		event.pageY = event.clientY + D.getScrollTop(event.srcElement);
		event.target = event.srcElement;
		event.stopPropagation = stopPropagation;
		event.preventDefault = preventDefault;
		var relatedTarget = {
				"mouseout": event.toElement, "mouseover": event.fromElement
			}[ event.type ];
		if ( relatedTarget ){ event.relatedTarget = relatedTarget;}
		
		return event;
	};
	function stopPropagation() { this.cancelBubble = true; };
	function preventDefault() { this.returnValue = false; };
	
	return {
		"addEvent": addEvent,
		"removeEvent": removeEvent,
		"fixEvent": fixEvent
	};
})();


/*CustomEvent*/

CE = (function(){
	var guid = 1;
	return {
		addEvent: function( object, type, handler ){
			if (!handler.$$$guid) handler.$$$guid = guid++;
			if (!object.cusevents) object.cusevents = {};
			if (!object.cusevents[type]) object.cusevents[type] = {};
			object.cusevents[type][handler.$$$guid] = handler;
		},
		removeEvent: function( object, type, handler ){
			if (object.cusevents && object.cusevents[type]) {
				delete object.cusevents[type][handler.$$$guid];
			}
		},
		fireEvent: function( object, type ){
			if (!object.cusevents) return;
			var args = Array.prototype.slice.call(arguments, 2),
				handlers = object.cusevents[type];
			for (var i in handlers) {
				handlers[i].apply(object, args);
			}
		},
		clearEvent: function( object ){
			if (!object.cusevents) return;
			for (var type in object.cusevents) {
				var handlers = object.cusevents[type];
				for (var i in handlers) {
					handlers[i] = null;
				}
				object.cusevents[type] = null;
			}
			object.cusevents = null;
		}
	};
})();


/*String*/

S = {
	camelize: function(s){
		return s.replace(/-([a-z])/ig, function(all, letter) { return letter.toUpperCase(); });
	},

	/**
	 * 判断是否全为空格
	 */
	isBlank : function(str)
	{
		while( str.lastIndexOf(" ")>=0 )
		{
			str = str.replace(" ","");
		}
		
		if( str.length == 0 )
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};


/*System*/

// remove css image flicker
if (B.ie6) {
	try {
		document.execCommand("BackgroundImageCache", false, true);
	} catch(e) {}
};


/*define*/

$O = O; $B = B; $A = A; $F = F; $D = D; $E = E; $CE = CE; $S = S;

})();


Ajax = function(){
	function request(url, opt) {
		function fn() {}
		var async   = opt.async !== false,
			method  = opt.method    || 'GET',
			data    = opt.data      || null,
			success = opt.success   || fn,
			failure = opt.failure   || fn;
			method  = method.toUpperCase();
		if (method == 'GET' && data){
			url += (url.indexOf('?') == -1 ? '?' : '&') + data;
			data = null;
		}
		
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		xhr.open(method, url, async);
		if (method == 'POST') {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		xhr.onreadystatechange = function() {
			_onStateChange(xhr, success, failure);
		};
		xhr.send(data);
		return xhr;
	}
	//响应是否成功，注：200~300之间或304的都理解成响应成功，当然你也可以改写成状态为：200
	function _onStateChange(xhr, success, failure) {
		if (xhr.readyState == 4){
			var s = xhr.status;
			if (s>= 200 && s < 300) {
				success(xhr);
			} else {
				failure(xhr);
			}
		} else {}
	}
	return {request:request};
}();

/**
 * cookie操作类
 * @author Cicada
 * @date 2013-9-12 17:13:31
 *
 */
var Cookie = {

	/**
	 * 页面变化时需要重新计算一些元素的大小
	 * @param key {string} cookie的键值
	 * @param value {string} cookie内容
	 * @param days {int} cookie存储天数
	 */
	set : function(key, value, days) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + days);
		//不指定参数，则默认给个：2038-01-17 19:14:07（可以随便写成以后的日期
		var expires = !days ? ";expires=Sun, 17-Jan-2038 19:14:07 GMT" : ";expires=" + exdate.toGMTString();
		document.cookie = key+ "=" + escape(value) + expires;
	},

	/**
	 * 根据key值去取cookie中的内容
	 * @param key {string} cookie键值
	 */
	get : function(key) {
		if (document.cookie.length > 0) {
			var c_start = document.cookie.indexOf(key + "=");
			if (c_start != -1) {
				c_start = c_start + key.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				c_end = (c_end == -1) ? document.cookie.length : c_end;
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
		return "";
	}
};

/**
 * 返回一个指定长度，并全部初始化为空字符串的数组
 * @param n {int} 数组长度
 * @author Cicada
 * @date 2013-9-12 17:13:17
 *
 */
function initArrayEmptyString(n) {
	if (n < 0 || typeof n != "number") return "";
	var arr = new Array(n);
	for (var i = 0; i < n; i++) {
		arr[i] = "";
	}
	return arr;
}


 
/**
 * 对JSON字符串的互相转换，有的地方挺多的，上面那个有些场合不太好使，还是老外写的好呀
 * Copyright (c) http://www.JSON.org/json2.js
 */
if(typeof JSON!="function"&&typeof JSON!="object")
	window.JSON = function () {
	function f(n) {
		return n < 10 ? '0' + n : n;
	}
	Date.prototype.toJSON = function () {
		return this.getUTCFullYear()   + '-' +
			 f(this.getUTCMonth() + 1) + '-' +
			 f(this.getUTCDate())      + 'T' +
			 f(this.getUTCHours())     + ':' +
			 f(this.getUTCMinutes())   + ':' +
			 f(this.getUTCSeconds())   + 'Z';
	};
	var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
		gap,
		indent,
		meta = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		rep;
	function quote(string) {
		return escapeable.test(string) ?
			'"' + string.replace(escapeable, function (a) {
				var c = meta[a];
				if (typeof c === 'string') {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) +
										   (c % 16).toString(16);
			}) + '"' :
			'"' + string + '"';
	}
	function str(key, holder) {
		var i,
			k,
			v,
			length,
			mind = gap,
			partial,
			value = holder[key];
		if (value && typeof value === 'object' &&
				typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}
		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}
		switch (typeof value) {
		case 'string':
			return quote(value);
		case 'number':
			return isFinite(value) ? String(value) : 'null';
		case 'boolean':
		case 'null':
			return String(value);
		case 'object':
			if (!value) {
				return 'null';
			}
			gap += indent;
			partial = [];
			if (typeof value.length === 'number' &&
					!(value.propertyIsEnumerable('length'))) {
				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || 'null';
				}
				v = partial.length === 0 ? '[]' :
					gap ? '[\n' + gap + partial.join(',\n' + gap) +
							  '\n' + mind + ']' :
						  '[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}
			if (typeof rep === 'object') {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					k = rep[i];
					if (typeof k === 'string') {
						v = str(k, value, rep);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			} else {
				for (k in value) {
					v = str(k, value, rep);
					if (v) {
						partial.push(quote(k) + (gap ? ': ' : ':') + v);
					}
				}
			}
			v = partial.length === 0 ? '{}' :
				gap ? '{\n' + gap + partial.join(',\n' + gap) +
						  '\n' + mind + '}' :
					  '{' + partial.join(',') + '}';
			gap = mind;
			return v;
		}
	}
	return {
		stringify: function (value, replacer, space) {
			var i;
			gap = '';
			indent = '';
			if (space) {
				if (typeof space === 'number') {
					for (i = 0; i < space; i += 1) {
						indent += ' ';
					}
				} else if (typeof space === 'string') {
					indent = space;
				}
			}
			if (!replacer) {
				rep = function (key, value) {
					if (!Object.hasOwnProperty.call(this, key)) {
						return undefined;
					}
					return value;
				};
			} else if (typeof replacer === 'function' ||
					(typeof replacer === 'object' &&
					 typeof replacer.length === 'number')) {
				rep = replacer;
			} else {
				throw new Error('JSON.stringify');
			}
			return str('', {'': value});
		},
		parse: function (text, reviver) {
			var j;
			function walk(holder, key) {
				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.hasOwnProperty.call(value, k)) {
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
			if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
				j = eval('(' + text + ')');
				return typeof reviver === 'function' ?
					walk({'': j}, '') : j;
			}
			throw new SyntaxError('JSON.parse');
		},
		quote: quote
	};
}();


























function rgbToHex(rgb) { 
	var regexp = /[0-9]{0,3}/g;  
	var re = rgb.match(regexp);//利用正则表达式去掉多余的部分，将rgb中的数字提取
	var hexColor = "#"; var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];  
	for (var i = 0; i < re.length; i++) {
		var r = null, c = re[i], l = c; 
        var hexAr = [];
        while (c > 16){  
              r = c % 16;  
              c = (c / 16) >> 0; 
              hexAr.push(hex[r]);  
         } hexAr.push(hex[c]);
         if(l < 16&&l != ""){        
             hexAr.push(0);
         }
       hexColor += hexAr.reverse().join(''); 
    }  
   //alert(hexColor)  
   return hexColor;  
}

function getStrLen(str) {
	var len = 0;
	for(var i = 0; i < str.length; i++) {
		//如果是汉字，则字符串长度加2
		if(str.charCodeAt(i) > 255) {
			len += 2;
		} else {
			len ++;
		}
	}
	return len;
}

/**
 * 截取字符串
 * @param str 待截字符串
 * @param len 要截的长度（英文字符的长度）
 * 
 * @return 截取后的字符串
 */
function subStr(str, len) {
	var subStr = "";
	//字符串的长度（英文字符）
	var strLen = getStrLen(str);
	//若待截串的长度比要截取的长度小，直接返回原字符串
	if(len > strLen) {
		subStr = str;
	} else {
		//字符数
		var charCount = str.length;
		//该字符串中全是英文字符
		if(strLen == charCount) {
			subStr = str.substring(0, len);
		}
		//全中文
		else if(strLen == charCount * 2) {
			subStr = str.substring(0, parseInt(len / 2));
		}
		//中英混合
		else {
			str = str.substring(0, len);
			var charArr = str.split("");
			for(var i = 0; i < charArr.length, len > 0; i++) {
				subStr += charArr[i];
				
				if(str.charCodeAt(i) > 255) {
					len -= 2;
				} else {
					len -= 1;
				}
			}
		}
	}
	
	return subStr;
}

/**
 * 阻止事件冒泡
 */
function stopBubble(e) {
    //如果传入了事件对象.那么就是非IE浏览器
    if(e && e.stopPropagation){
        //因此它支持W3C的stopPropation()方法
        e.stopPropagation();
    }
    else{
        //否则,我们得使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
    }
}

/**
 * 将数组转换为字符串（以“,”隔开）
 */
function arrToStr(arr) {
	var str = "";
	for(var id in arr) {
		str += arr[id] + ",";
	}
	return str.substring(0, str.length - 1);
}


//cookies操作
function setCookie(c_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + exdate.toGMTString());
}

function getCookie(c_name) {
	if (document.cookie.length>0){
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			c_end = (c_end == -1) ? document.cookie.length : c_end;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

function chkcookies(NameOfCookie) {
  var c = document.cookie.indexOf(NameOfCookie+"="); 
  if (c != -1) {
    return true;
  }
  return false;
}

//删除cookie
function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function dateFormat(date, fmt) {
	var o = { 
			"M+" : date.getMonth()+1,                 //月份 
			"d+" : date.getDate(),                    //日 
			"h+" : date.getHours(),                   //小时 
			"m+" : date.getMinutes(),                 //分 
			"s+" : date.getSeconds(),                 //秒 
			"q+" : Math.floor((date.getMonth()+3)/3), //季度 
			"S"  : date.getMilliseconds()             //毫秒 
	}; 
	if(/(y+)/.test(fmt)) 
		fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	for(var k in o) 
		if(new RegExp("("+ k +")").test(fmt)) 
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
	return fmt; 
}

/**
 * 
 * @param dom
 */
function removeDom(dom) {
	var children = dom.children;
	for(var i = children.length - 1; i > -1; i--) {
		removeDom(children[i]);
	}
	dom.parentElement.removeChild(dom);
};

/**
 * 把url中的key=>value的内容以json对象返回
 * @param url
 * @returns Array
 */
function getParameter(url) {
	if (url.indexOf('?') == -1) return '';
	var query = {};
	var array = [];
	var params = (url.split('?'))[1];
	array = params.split('&');
	var length = array.length;
	if (length > 0) {
		for (var i = 0; i < length; i++)
		{
			var index = array[i].indexOf('=');
			var key   = array[i].substring(0, index);
			var value = array[i].substring(index + 1);
			query[key] = value;
		}
	}
	//如果没有元素则返回空
	return JSON.stringify(query) == '{}' ? '' : query;
}

/**
 * phpjs htmlspecialchars 
 * @param string
 * @param quote_style
 * @param charset
 * @param double_encode
 * @returns
 */
function htmlspecialchars(string, quote_style, charset, double_encode) {
  //       discuss at: http://phpjs.org/functions/htmlspecialchars/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      bugfixed by: Nathan
  //      bugfixed by: Arno
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //         input by: felix
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //             note: charset argument not supported
  //        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
  //        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
  //        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
  //        returns 2: 'ab"c&#039;d'
  //        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false);
  //        returns 3: 'my &quot;&entity;&quot; is still here'

  var optTemp = 0,
    i = 0,
    noquotes = false;
  if (typeof quote_style === 'undefined' || quote_style === null) {
    quote_style = 2;
  }
  string = string.toString();
  if (double_encode !== false) {
    // Put this first to avoid double-encoding
    string = string.replace(/&/g, '&amp;');
  }
  string = string.replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quote_style === 0) {
    noquotes = true;
  }
  if (typeof quote_style !== 'number') {
    // Allow for a single string or an array of string flags
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++) {
      // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
      if (OPTS[quote_style[i]] === 0) {
        noquotes = true;
      } else if (OPTS[quote_style[i]]) {
        optTemp = optTemp | OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/'/g, '&#039;');
  }
  if (!noquotes) {
    string = string.replace(/"/g, '&quot;');
  }

  return string;
}

/**
 * phpjs htmlspecialchars_decode
 * @param string
 * @param quote_style
 * @returns
 */
function htmlspecialchars_decode(string, quote_style) {
  //       discuss at: http://phpjs.org/functions/htmlspecialchars_decode/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      bugfixed by: Mateusz "loonquawl" Zalega
  //      bugfixed by: Onno Marsman
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //         input by: ReverseSyntax
  //         input by: Slawomir Kaniecki
  //         input by: Scott Cariss
  //         input by: Francois
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //       revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
  //        returns 1: '<p>this -> &quot;</p>'
  //        example 2: htmlspecialchars_decode("&amp;quot;");
  //        returns 2: '&quot;'

  var optTemp = 0,
    i = 0,
    noquotes = false;
  if (typeof quote_style === 'undefined') {
    quote_style = 2;
  }
  string = string.toString()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  };
  if (quote_style === 0) {
    noquotes = true;
  }
  if (typeof quote_style !== 'number') {
    // Allow for a single string or an array of string flags
    quote_style = [].concat(quote_style);
    for (i = 0; i < quote_style.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[quote_style[i]] === 0) {
        noquotes = true;
      } else if (OPTS[quote_style[i]]) {
        optTemp = optTemp | OPTS[quote_style[i]];
      }
    }
    quote_style = optTemp;
  }
  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
    // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"');
  }
  // Put this in last place to avoid escape being double-decoded
  string = string.replace(/&amp;/g, '&');

  return string;
}

var DynamicLoading = DynamicLoading || ({
    css: function (path,win) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
         if(!win)win=window;
        var head = win.document.getElementsByTagName('head')[0];
        var link = win.document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function (path,win) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        if(!win)win=window;
        var head = win.document.getElementsByTagName('head')[0];
        var script = win.document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
});
