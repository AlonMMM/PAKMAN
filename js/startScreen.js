/**
 * Created by windows on 06/05/2017.
 */

$(document).ready( function() {


    var canvas = document.getElementById("canvas"); // grabs the canvas element
    var context = canvas.getContext("2d"); // returns the 2d context object
    var img = new Image() //creates a variable for a new image

    img.src = "images/start_screen.jpg";
    context.drawImage(img,0,0, canvas.width, canvas.height);
});

