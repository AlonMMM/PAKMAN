/**
 * Created by Liron on 07/05/2017.
 */
var current_user;

var users = {};
users["a"] = "a";
users["test2017"] = "test2017";

$(document).ready(function () {
    $('a.links').click(function (e) {
        e.preventDefault();
        var div_id = $('a.links').index($(this))
        $('.divs').hide().eq(div_id).show();
    });
});

function logIn() {
    var entered_user = $("#log_in_name")[0].value;
    var entered_pass = $("#log_in_password")[0].value;
    if (entered_user in users && users[entered_user] === entered_pass) {
        current_user = entered_user;
        $("#LOGIN").hide();
        $("#PLAY").show();
        var usrlbl=document.getElementById("usrlbl");
        usrlbl.innerHTML=current_user;
    }
    else
        window.alert("one or more of the parameters is not valid");
}

function logAfterRegister(name) {
    current_user = name;
    $("#REGISTER").hide();
    $("#PLAY").show();
}

