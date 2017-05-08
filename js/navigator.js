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
            stopGame();

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
            stopGame();
        }
    });

});

var isLogedIn;
var users = {};

function initinalFields() {

    users["a"] = "a";
    users["test2017"] = "test2017";
    isLogedIn = false;

    //difficulty
    var hardOption = new Option();
    var MediumOption = new Option();
    MediumOption.value = MediumOption.text = "Medium";
    hardOption.value = hardOption.text = "Hard";
    $("#difficulty")[0].add(MediumOption);
    $("#difficulty")[0].add(hardOption);


}

function logIn() {
    var entered_user = $("#log_in_name")[0].value;
    var entered_pass = $("#log_in_password")[0].value;
    if (entered_user in users && users[entered_user] === entered_pass) {
        current_user = entered_user;
        $("#LOGIN").hide();
        logAfterRegister(entered_user);
        drawCanvasPic();

    }
    else
        window.alert("one or more of the parameters is not valid");
}

function logAfterRegister(name) {
    current_user = name;
    $("#REGISTER").hide();
    $("#PLAY").show();
    $("#menu").append("<div id='helloUserName'><b id='helloUserName'> Hello " + current_user + " </b>  " + " <a class='links' href='#' id='disconnect' onclick='disconnect();'>disconnect </a></div></li>");
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
    $("#game_details").hide();
    stopGame();

}

function gameSetting() {
    stopGame();
    var numberOfBalls = $("#numberOfBall")[0].value;
    var time = $("#GameTime")[0].value;
    var numberOfMonsters = $("#numberOfMonsters")[0].value;
    var points25 = $("#25Point")[0].value;
    var points15 = $("#15Point")[0].value;
    var points5 = $("#5Point")[0].value;
    var gameSpeed;
    var monstersSpeedRatioToPacman;
    if($("#difficulty")[0].value==="Easy")
    {
        gameSpeed = 200;
        monstersSpeedRatioToPacman = 4;
    }
    else if($("#difficulty")[0].value==="Medium")
    {
        gameSpeed = 150;
        monstersSpeedRatioToPacman = 2;
    }
    else if($("#difficulty")[0].value==="Hard")
    {
        gameSpeed = 100;
        monstersSpeedRatioToPacman = 1;
    }

    if(numberOfBalls<50 || numberOfBalls>90 || numberOfMonsters<1 || numberOfMonsters>3 || time<60)
    {
        window.alert("You type one or more bad inputs, please follow the order for legal setting");
    }
    else {
        $("#game_details").show();
        pacmanSetParameters(numberOfBalls, time, numberOfMonsters, points5, points15, points25 , gameSpeed, monstersSpeedRatioToPacman);
        Start();
    }
}

function drawCanvasPic() {
    var canvas = document.getElementById("canvas"); // grabs the canvas element
    var context = canvas.getContext("2d"); // returns the 2d context object
    var img = new Image() //creates a variable for a new image

    img.src = "images/start_screen.jpg";
    img.onload = function () {
        context.drawImage(img,0,0, canvas.width, canvas.height);
    }
}

function loginFromWelcome()
{
    if(!isLogedIn) {
        $("#WELCOME").hide();
        $("#LOGIN").show();
    }
    else{
        window.alert("You are already loged In, press disconnect to enter from another user");
    }
}

function RegisterFromWelcome(){
    if(!isLogedIn) {
        $("#WELCOME").hide();
        $("#REGISTER").show();
    }
    else{
        window.alert("You are already loged In, press disconnect to enter from another user");
    }

}

function stopGame(){
    stopPacmanGame();

}
