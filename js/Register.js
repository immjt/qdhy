var pwdReg = /^\S{6,14}$/;
var mobileReg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8]))\d{8}$/;
var emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
var type = 2; //1-手机注册，2-邮箱注册


$(document).ready(function () {
    createCode();
});

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

function hideTip() {
    $("#nameTip").hide();
    $("#pwdTip").hide();
    $("#validTip").hide();
}


//名称验证
function nameCheck(submit) {
    $("#nameInput").css("border-color", "#ddd");
    $("#nameTip").hide();
    var name = $("#nameInput").val();
    if (name == "") {
        if (submit) {
            $("#nameError").show();
            $("#nameInput").css("border-color", "#fc4343");
        } else {
            $("#nameError").hide();
            $("#nameSuccess").hide();
        }
    } else if (emailReg.test(name)) {
        //输入邮箱
        type = 2
        $("#validCode").show();
        $("#changeValidCode").show();
        $("#validMsg").hide();

        $.ajax({
            type: "GET", //访问WebService使用Post方式请求
            url: Service.hyserver+"hymap.ashx?op=checkusername&Email=" + name,  //调用Url(WebService的地址和方法名称组合---WsURL/方法名)
            data: {}, //这里是要传递的参数，为Json格式{paraName:paraValue}
            dataType: "JSON",
            contentType: "Application/json; charset=utf-8", // 发送信息至服务器时内容编码类型
            success: function (result) {
                if (result == "1") {
                    $("#nameError").html("该邮箱已注册可<a href='login.html'>直接登录</a>");
                    $("#nameError").show();
                    $("#nameInput").css("border-color", "#fc4343");
                } else if (result == "0") {
                    $("#nameSuccess").show();
                }
            },
            error: function (x, y, z) {
            }
        });
    } else {
        $("#nameError").html("请填写正确邮箱");
        $("#nameError").show();
        $("#nameInput").css("border-color", "#fc4343");
    }
}

//名称输入框获取焦点
function nameFocus() {
    $("#nameSuccess").hide();
    $("#nameError").hide();
    $("#nameInput").css("border-color", "#488ee7");
    $("#nameTip").show();
}

//密码验证
function pwdCheck(submit) {
    $("#pwdInput").css("border-color", "#ddd");
    $("#pwdTip").hide();
    var pwd = $("#pwdInput").val();
    if (pwd == "") {
        if (submit) {
            $("#pwdError").show();
            $("#pwdInput").css("border-color", "#fc4343");
        } else {
            $("#pwdError").hide();
            $("#pwdSuccess").hide(); ;
        }
    } else if (pwdReg.test(pwd)) {
        $("#pwdSuccess").show();
    } else {
        $("#pwdInput").css("border-color", "#fc4343");
        $("#pwdError").show();
    }
}

//密码输入框获取焦点
function pwdFocus() {
    $("#pwdSuccess").hide();
    $("#pwdError").hide();
    $("#pwdInput").css("border-color", "#488ee7");
    $("#pwdTip").show();
}

//验证码、短信验证
function validCheck(submit) {
    var validCode = $("#validCodeInput").val();
    $("#validCodeInput").css("border-color", "#ddd");
    $("#validTip").hide();
    if (validCode == "") {
        if (submit) {
            $("#validError").show();
            $("#validCodeInput").css("border-color", "#fc4343");
        } else {
            $("#validError").hide();
            $("#validSuccess").hide(); ;
        }
    } else if (type == 1) {
        //        $("#validSuccess").show();

    } else if (type == 2) {
        var vercode = $.trim($("#validCode").val());
        var inputCode = $.trim($("#validCodeInput").val()).toUpperCase();
        if (vercode == inputCode) {
            //            $("#validSuccess").show();

        } else {
            $("#validCodeInput").css("border-   ", "#fc4343");
            $("#validError").show();
        }
    } else {
        $("#validError").show();
    }
}

//验证码、短信输入框获取焦点
function validFocus() {

    $("#validSuccess").hide();
    $("#validError").hide();
    $("#validCodeInput").css("border-color", "#488ee7");
    if (type == 1) {
        $("#validTip").html("请输入您手机短信中的激活码。");
    } else if (type == 2) {
        $("#validTip").html("请输入图片中的字符，不区分大小写");
    }
    $("#validTip").show();
}

function gotoRegist() {
    $("#nameInput").css("border-color", "#ddd");
    hideTip();
    var name = $("#nameInput").val();
    if (name == "") {
        $("#nameError").show();
        $("#nameInput").css("border-color", "#fc4343");
        pwdCheck(true);
    } else if (emailReg.test(name)) {
        //输入邮箱
        type = 2
        $("#validCode").show();
        $("#changeValidCode").show();
        $("#validMsg").hide();
        $.ajax({
            type: "GET", //访问WebService使用Post方式请求
            url: "proxy/proxy.ashx?http://172.17.4.3:81/hyservice/hymap.ashx?op=checkusername&Email=" + name,  //调用Url(WebService的地址和方法名称组合---WsURL/方法名)
            data: {}, //这里是要传递的参数，为Json格式{paraName:paraValue}
            dataType: "JSON",
            contentType: "Application/json; charset=utf-8", // 发送信息至服务器时内容编码类型
            success: function (result) {
                if (result == "1") {
                    $("#nameError").html("该邮箱已注册可<a href='login.html'>直接登录</a>");
                    $("#nameError").show();
                    $("#nameInput").css("border-color", "#fc4343");
                    pwdCheck(true);
                } else if (result == "0") {
                    $("#nameSuccess").show();
                    var vercode = $.trim($("#validCode").val());
                    var inputCode = $.trim($("#validCodeInput").val()).toUpperCase();
                    if (vercode == inputCode) {
                        //邮箱及验证码正确
                        $("#pwdInput").css("border-color", "#ddd");
                        var pwd = $("#pwdInput").val();
                        if (pwd == "") {
                            $("#pwdError").show();
                            $("#pwdInput").css("border-color", "#fc4343");
                        } else if (pwdReg.test(pwd)) {
                            $("#pwdSuccess").show();
                            //TODO:邮箱、验证码、密码验证正确

                            var userModel = {};
                            userModel.password = $.trim($("#pwdInput").val());
                            userModel.email = $.trim($("#nameInput").val());
                            userModel.nicheng = $.trim($("#nichengInput").val());
                            /*------------------------保存用户信息--------------------------*/
                            $.ajax({
                                type: "GET", //访问WebService使用Post方式请求
                                url: "proxy/proxy.ashx?http://172.17.4.3:81/hyservice/hymap.ashx?op=register&Email=" + name + "&Pwd=" + userModel.password + "&name=" + userModel.nicheng,  //调用Url(WebService的地址和方法名称组合---WsURL/方法名)
                                data: {}, //这里是要传递的参数，为Json格式{paraName:paraValue}
                                dataType: "JSON",
                                contentType: "Application/json; charset=utf-8", // 发送信息至服务器时内容编码类型
                                success: function (result) {
                                    if (result == "1") {
                                        alert("注册成功，即将跳转到登录页面");
                                        window.location.href = "login.html";
                                    } else {
                                        createCode(); //刷新验证码
                                        alert("注册失败");
                                    }
                                }
                            });
                        } else {
                            $("#pwdInput").css("border-color", "#fc4343");
                            $("#pwdError").show();
                        }
                    } else {
                        $("#validCodeInput").css("border-color", "#fc4343");
                        $("#validError").show();
                        pwdCheck(true);
                    }
                }
            },
            error: function (x, y, z) {
            }
        });
    } else {
        $("#nameError").show();
        $("#nameInput").css("border-color", "#fc4343");
    }
}

function sendMessage() {
    //TODO：发送验证码
    var name = $("#nameInput").val();
    if (name == "") {
        $("#nameError").show();
        $("#nameInput").css("border-color", "#fc4343");
    } else if (mobileReg.test(name)) {
        var requestUrl = teleServerPath + "?phone=" + name + "&type=0";
        try {
            $("#validTip").html("短信激活码已发送,请您在30分钟内填写。");
            $("#validTip").show();
            $("#validError").hide();
            time($("#validMsg"));
            $.ajax({
                url: "../Handler/AjaxHandler.ashx?targeturl=" + requestUrl,
                dataType: "json",
                type: "get",
                success: function (data) {
                    if (data != null) {
                        switch (data.State) {
                            case 0:

                                break;
                            case 1:
                                alert(data.Message);

                                break;
                            default:
                                alert(data.Message);

                                break;
                        }
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(xhr.responseText.toString());
                }
            });
        } catch (e) {
            alert("手机验证码发送失败");
            return;
        }

    } else {
        $("#nameError").html("请填写正确的手机");
        $("#nameError").show();
        $("#nameInput").css("border-color", "#fc4343");
    }
}

var wait = 60;
function time(o) {
    if (wait == 0) {
        o.removeAttr("disabled");
        o.css("color", "#666");
        o.val("免费获取验证码");
        $("#validTip").val("请输入您手机短信中的激活码。");
        $("#validTip").hide();
        wait = 60;
    } else {
        o.attr("disabled", true);
        o.css("color", "#bbb");
        o.val("重新发送(" + wait + ")");
        wait--;
        setTimeout(function () {
            time(o)
        },
            1000)
    }
}