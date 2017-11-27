
$(function () {
  SetCalcValue();
});
$(window).resize(function () {
    SetCalcValue();
    
});

function SetCalcValue() {
    $("[data-calc-height]").each(function () {
        var elem = $(this);
        var parent = elem.parent();
        var data = elem.attr("data-calc-height");

        elem.height(GetCalcValue(data, parent.height()));

    });
    $("[data-calc-width]").each(function () {
        var elem = $(this);
        var parent = elem.parent();
        var data = elem.attr("data-calc-width");

        elem.width(GetCalcValue(data, parent.width()));

    });
    $("[data-calc-left]").each(function () {
        var elem = $(this);
        var parent = elem.parent();
        var data = elem.attr("data-calc-left");

        elem.css("left",GetCalcValue(data, parent.width())+"px");

    });
}

function GetCalcValue(data,parentValue) {
    var arrayData = data.split("-");
    return parentValue * (parseInt(arrayData[0].replace("%")) * 0.01) - parseFloat(arrayData[1]);
}