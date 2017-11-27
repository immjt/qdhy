
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
           /* if (MapContrast.IsStartContrast()) {
                MapContrast.mapDivHandler();
            }
            else { sdMap.map.updateSize(); }*/
            sdMap.map.updateSize();
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
}