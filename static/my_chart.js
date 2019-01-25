for (var i = 0; i < values.length; i++) {
    value_str = values[i].toString();
    div_class = "progress" + i.toString();
    $("<div>", {class: div_class}).text(labels[i]).appendTo(".main_container");
    $("<div>", {class: "progress"}).appendTo("." + div_class);
    $("." + div_class).find(".progress").append($("<div>", {class: "progress-bar progress-bar-success"}).attr({"role": "progressbar", "aria-valuenow": value_str, "aria-valuemin":"0", "aria-valuemax":"100", "style":"width:" + value_str + "%"}).text(value_str));
}