/**
 * Created by Liron on 07/05/2017.
 */
var current_user;


$(document).ready(function () {
    $("#WELCOME").show();
    initinalFields();
    //navigate...
    $(".links").click(function (e) {
        var clickededItem = $(e.target);
        $("#WELCOME").hide();
        $("#LOGIN").hide();
        $("#PLAY").hide();
        $("#REGISTER").hide();
        $("#ABOUT").hide();
        if (clickededItem.is('#lWELCOME')) {
            $("#WELCOME").show();

        }
        else if (clickededItem.is('#lLOGIN')) {
            if (!isLogedIn)
                $("#LOGIN").show();
            else {
                $("#PLAY").show();
                window.alert("You are already loged In, press disconnect to enter from another user");
            }
        }
        else if (clickededItem.is('#lREGISTER')) {
            if (!isLogedIn)
                $("#REGISTER").show();
            else {
                window.alert("You are already loged In.");
                $("#PLAY").show();
            }

        }
        else if (clickededItem.is('#lABOUT')) {
            $("#ABOUT").show();
        }
    });

});

var isLogedIn;
var users = {};

function initinalFields() {

    users["a"] = "a";
    users["test2017"] = "test2017";
    isLogedIn = false;

}

function logIn() {
    var entered_user = $("#log_in_name")[0].value;
    var entered_pass = $("#log_in_password")[0].value;
    if (entered_user in users && users[entered_user] === entered_pass) {
        current_user = entered_user;
        $("#LOGIN").hide();
        logAfterRegister(entered_user);

    }
    else
        window.alert("one or more of the parameters is not valid");
}

function logAfterRegister(name) {
    current_user = name;
    $("#REGISTER").hide();
    $("#PLAY").show();
    $("#menu").append("<div id='helloUserName'><b > Hello " + current_user + " </b>  " + " <a class='links' href='#' id='disconnect' onclick='disconnect();'>disconnect </a></div></li>");
    isLogedIn = true;
}

function disconnect() {
    isLogedIn = false;
    $("#helloUserName").remove();
    $("#WELCOME").show();
    $("#LOGIN").hide();
    $("#PLAY").hide();
    $("#REGISTER").hide();
    $("#ABOUT").hide();

}

function gameSetting() {

    var numberOfBalls = $("#numberOfBall")[0].value;
    var time = $("#GameTime")[0].value;
    var numberOfMonsters = $("#numberOfMonsters")[0].value;
    var points25 = $("#25Point")[0].value;
    var points15 = $("#15Point")[0].value;
    var points5 = $("#5Point")[0].value;

    pacmanSetParameters(numberOfBalls,time,numberOfMonsters,points5,points15,points25);
    Start();

}

function loginFromWelcome()
{
    $("#WELCOME").hide();
    $("#LOGIN").show();
}

function RegisterFromWelcome(){
    $("#WELCOME").hide();
    $("#REGISTER").show();
}