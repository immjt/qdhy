$(function () {
    DIVDKJD.init();
});
var DIVDKJD = {
    init: function () {
        this._handlers();
    },
    _handlers: function () {
        var self = this;

        $("#tabSGXX a.add").click(function () {
            self._showDKJD();
        });
    },
    _showDKJD: function (url) {
        $("#mask").show();
        var ww = $(document).width();
        var wh = document.documentElement.clientHeight;

        var top = (wh - 500) / 2;
        var right = (ww - 1200) / 2;
     // var top = 20;
      //var right =20;
        if (top < 15) {
            top = 15;
        }
        if (right < 15) {
            right = 15;
        } 
        $("#DKJD").css({
            top: 100,
            right: right,
            display: "block",
            width:1200,
            height:550
        });
        $("#iframeDKJD")[0].src = url;
    },
    _closeDKJD: function () {
        $("#mask,#DKJD").hide();
    }

};
