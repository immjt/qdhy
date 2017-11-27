var pwdReg = /^[a-zA-Z0-9]{6,16}$/;
var emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
//产生验证码
function createCode() {
    var code = "";
    var codeLength = 4; //验证码的长度
    var checkCode = $("#vercode");
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
				 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数
    for (var i = 0; i < codeLength; i++) {//循环操作
        var index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
        code += random[index]; //根据索引取得随机数加到code上
    }
    $("#validCode").val(code); //把code值赋给验证码
}

//失去焦点时检查文本
function checktext(e) {
    var inputtxt = e;
    var str = "";

    str = $.trim(inputtxt.value);
    if (str == "") {
        $(inputtxt).next().show();
    }
    else {
        $(inputtxt).next().hide();
    }

    //邮箱
    if (inputtxt.id == "UserName") {
        str = $.trim(inputtxt.value);
        if (str != "") {
            if (!(emailReg.test(str))) {
                $("#id_usercheck").show();
            }
            else {
                $("#id_usercheck").hide();
            }
        }
    }

    //密码
    if (inputtxt.id == "Password") {
        str = $.trim(inputtxt.value);
        if (str != "") {
            if (!(pwdReg.test(str))) {
                $("#pwd_usercheck").show();
            }
            else {
                $("#pwd_usercheck").hide();
            }
        }
    }
}
//提交时检查文本
function DataCheck() {
    var datachk = true;
    //用户名
    if ($.trim($("#UserName").val()) == "" || (!(emailReg.test($.trim($("#UserName").val()))))) {
        datachk = false;
        alert("用户名不能为空且必须为邮箱！");
        return datachk;
    }
    //密码
    if ($.trim($("#Password").val()) == "" || (!(pwdReg.test($.trim($("#Password").val()))))) {
        datachk = false;
        alert("密码不能为空且长度6~16位字母、数字！");
        return datachk;
    }
    return datachk
}
//登录
function LoginButton_Click() {
    if (DataCheck()) {
        var data = {};
        data.Email = $.trim($("#UserName").val());
        data.Pwd = $.trim($("#Password").val());
        $.ajax({
            type: "GET", //访问WebService使用Post方式请求
            url: Service.hyserver+"hymap.ashx?op=login&Email=" + data.Email + "&Pwd=" + data.Pwd,  //调用Url(WebService的地址和方法名称组合---WsURL/方法名)
            data: {}, //这里是要传递的参数，为Json格式{paraName:paraValue}
            dataType: "JSON",
            contentType: "Application/json; charset=utf-8", // 发送信息至服务器时内容编码类型
            success: function (result) {
                //没有该用户
                var val = eval(result);
                if (val.State == "0") {
                    $("#UserName").val("");
                    $("#Password").val("");
                    alert("不存在该用户！");
                }
                //密码错误
                else if (val.State == "2") {
                    $("#Password").val("");
                    alert("密码错误！");
                }
                //验证成功
                else if (val.State == "1") {
                    userinfo = eval(val.Info);
                    setCookie("USERID", userinfo[0]);
                    setCookie("USERNAME", userinfo[1]);
                    window.location.href = "index.html";
                }
                //其他错误
                else {
                    alert("其他错误！");
                }

            },
            error: function (x, y, z) {
            }
        });
    } else {
        //alert("LoginButton_Click错误！");
    }
}


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