/**
 * Created by windows on 05/05/2017.
 */

var oMonster = new Image();
var bMonster = new Image();
var gMonster= new Image();
var strawberry = new Image();
var clock = new Image();

var _monsters = [];
var canvas ;
var context;
var _gameWidth = 1200;   //the game board width
var _gameHeight = 600;    //the game board height
var proportion = 30;    //cell size
var pacmanShape = {};   //the object pacman
var _foodCounter;   //count the food in bard
var currBoard;
var score;
var pac_color;
var start_time;
var time_elapsed;
var intervalPacman;
var m_currDirection;
var locatePacman;
var _beforeMonsterCell = [9, 9, 9];
var _monsterLastPosition = [[], [], []];    //save the monsters last positions
var _numberOfMonster;

var colorOf5Points;
var colorOf15Points;
var colorOf25Points;


var _lastPointsPositions = [];  //strewbbery last position
var _beforePointsCell = 9;     //value of cell strewbbery last position
var ui_totalFood;         //user input number of points

var ui_monsterSpeed;       //user input for monster speed
var _monsterSpeedControl = 0;
var _pacmanLives;
var _strawberryGotEaten ;

var ui_gameSpeed;
var ui_gameTime=100;

//for the clock feature
var _clockTimeRemaind;
var _randomUpdatesToShowClock;
var _updatesCounter;
var _clockIsShow;
var _clockUpTime ;
var gameBoard = [[]];

function pacmanSetParameters(numberOfBalls, time, numberOfMonsters, points5, points15, points25, gameSpeed, monstersSpeed) {
    ui_totalFood=numberOfBalls ;
    ui_gameTime = parseInt(time);
    _numberOfMonster=numberOfMonsters;
    if(_numberOfMonster==="1")
    {
        _monsters = [oMonster];
    }
    else if(_numberOfMonster==="2")
    {
        _monsters = [oMonster,bMonster];
    }
    else if(_numberOfMonster==="3")
    {
        _monsters = [oMonster,bMonster,gMonster];
    }
    colorOf5Points= points5;
    colorOf15Points=points15;
    colorOf25Points=points25;
    ui_gameSpeed = gameSpeed;
    ui_monsterSpeed = monstersSpeed;
}

function Start() {
    startInitializer();

    var points25 = Math.floor(ui_totalFood / (10 * ui_totalFood / 100));
    var points15 = Math.floor(ui_totalFood / (30 * ui_totalFood / 100));
    var blackCell  = 1;
    var randomNum = Math.floor((Math.random() * 285 + 1));
    var rand;
    var pacman_remain = 1;

    var cnt = 284;
    var food = 0;
    var foodRemain = ui_totalFood;
    //create the board - pacman and food .
    for (var i = 0; i < _gameWidth / proportion - 1; i++) {
        currBoard[i] = new Array(19);
        for (var j = 0; j < _gameHeight / proportion - 1; j++) {
            //oreange monster
            rand = Math.random();
            var randomNumFood = Math.random();
            // if(_numberOfMonster<2 && currBoard[i][j] === 6){
            //     currBoard[i][j]=9;
            // }
            // if(_numberOfMonster<3 && currBoard[i][j] === 7){
            //     currBoard[i][j]=9;
            // }
            if ((i === 0 && j === 0)) {
                currBoard[i][j] = 5;
                oMonster.i = i;
                oMonster.j = j;
                _monsterLastPosition[0] = [i, j];
            }
            //blue monster
            else if ((i === 38 && j === 18) && _numberOfMonster>1) {
                currBoard[i][j] = 6;
                bMonster.i = i;
                bMonster.j = j;
                _monsterLastPosition[1] = [i, j];
            }
            //grey monster
            else if ((i === 38 && j === 0) &&_numberOfMonster>2) {
                currBoard[i][j] = 7;
                gMonster.i = i;
                gMonster.j = j;
                _monsterLastPosition[2] = [i, j];
            }
            //define strawberry
            else if ((i === 0 && j === 18)) {
                currBoard[i][j] = 4;
                strawberry.i = i;
                strawberry.j = j;
                _lastPointsPositions = [i, j];
            }
            //pacman
            else if (gameBoard[i][j] === 0) {
                if (randomNum - 10 <= locatePacman && locatePacman <= randomNum + 10 && pacman_remain === 1 && (i != 0 && j != 0 ) && (i != 38 && j != 18 )) {
                    currBoard[i][j] = 2;
                    pacmanShape.i = i;
                    pacmanShape.j = j;
                    pacman_remain--;
                }
                if(randomNumFood<=1.0 * foodRemain/cnt){
                    foodRemain--;
                    if ((food % points25) === 0) {
                        currBoard[i][j] = 25;

                    }
                    else if ((food % points15) === 0) {
                        currBoard[i][j] = 15;
                    }
                    else {
                        currBoard[i][j] = 0.05;
                    }
                    food++;
                }
                else {
                    currBoard[i][j] = 9;
                    blackCell++;
                }
                locatePacman++;
                cnt--;
            }
            else if (gameBoard[i][j] === 1) {
                currBoard[i][j] = 1;
            }

        }
    }
    Draw();
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);

    if (intervalPacman) {
        window.clearInterval(intervalPacman);
    }
    intervalPacman = setInterval(UpdatePosition, ui_gameSpeed);
}

function startInitializer(){
    canvas = document.getElementById("canvas");
    context=canvas.getContext("2d");
    document.getElementById("beginning_sound").pause();
    document.getElementById("pacman_background").play();

    oMonster.src = 'images/oMonster.jpg';
    bMonster.src = 'images/bMonster.jpg';
    gMonster.src= 'images/gMonster.jpg';
    strawberry.src = 'images/strawberry.JPG';
    clock.src = 'images/clock.PNG';
    _pacmanLives = 3;
    _clockIsShow = false;
    _updatesCounter=0;
    _strawberryGotEaten = false;
    locatePacman = 0;
    _foodCounter=ui_totalFood;
    m_currDirection=4;
    _randomUpdatesToShowClock = Math.floor((Math.random() * 100 + 1 ));
    _clockTimeRemaind = 30;

    //initilize board
    gameBoard = [
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    ];
    score = 0;
    pac_color = "yellow";
    currBoard = new Array(39);

    start_time = new Date();
    start_time=start_time.setSeconds(start_time.getSeconds() + ui_gameTime);

    _clockUpTime=0;
}


function drawPacmanMaze() {
    var padding = 22;
    var thickness = 5;
    //maze frame

    context.beginPath();
    //top
    context.moveTo(20, 290);

    context.lineTo(45 - padding + 300, 290);
    context.lineTo(45 - padding + 300, 220);
    context.lineTo(45 - padding, 220);
    context.lineTo(45 - padding, padding);

    context.lineTo(1230 - padding, padding);
    context.lineTo(1230 - padding, 220);
    context.lineTo(1230 - padding - 300, 220);
    context.lineTo(1230 - padding - 300, 290);
    context.lineTo(1230 - padding, 290);
    //button
    context.moveTo(1230 - padding, 340);
    context.lineTo(1230 - padding - 300, 340);
    context.lineTo(1230 - padding - 300, 410);
    context.lineTo(1230 - padding, 410);
    context.lineTo(1230 - padding, 630 - padding);
    context.lineTo(1230 - padding - 585, 630 - padding);
    context.lineTo(1230 - padding - 585, 630 - padding - 242);
    context.lineTo(1230 - padding - 600, 630 - padding - 242);
    context.lineTo(1230 - padding - 600, 630 - padding);
    context.lineTo(45 - padding, 630 - padding);

    context.lineTo(45 - padding, 630 - padding);
    context.lineTo(45 - padding, 410);
    context.lineTo(45 - padding + 300, 410);
    context.lineTo(45 - padding + 300, 340);
    context.lineTo(45 - padding, 340);

    context.lineWidth = thickness;
    context.lineJoin = "bevel";
    context.lineCap = "butt";
    context.strokeStyle = "blue";
    context.stroke()

    //shapes in maze
    var paddingShapes = 15;
    //squre on the cells
    context.beginPath();
    context.strokeStyle = "blue";
    context.lineWidth = thickness;
    //corner rec
    context.strokeRect(70, 70, 220, 100);
    context.strokeRect(70, 460, 220, 100);
    context.strokeRect(940, 70, 220, 100);
    context.strokeRect(940, 460, 220, 100);

    //center
    context.strokeRect(370, 220, 490, 100);

    //top thin rec
    context.strokeRect(340, 70, 550, 40);
    context.strokeRect(340, 160, 550, 10);

    //small bottom
    context.strokeRect(370, 370, 190, 40);
    context.strokeRect(670, 370, 190, 40);

    context.strokeRect(340, 460, 40, 100);
    context.strokeRect(430, 460, 40, 100);
    context.strokeRect(520, 460, 40, 50);
    context.strokeRect(520, 550, 40, 10);

    context.strokeRect(670, 460, 40, 50);
    context.strokeRect(670, 550, 40, 10);
    context.strokeRect(760, 460, 40, 100);
    context.strokeRect(850, 460, 40, 100);


}

function GetKeyPressed() {
    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[39]) {
        return 4;
    }
    if (keysDown[40]) {
        return 3;
    }
    if (keysDown[37]) {
        return 2;
    }
}

function Draw() {
    canvas.width = canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawPacmanMaze();
    drawLives();
    for (var i = 0; i < _gameWidth / proportion - 1; i++) {
        for (var j = 0; j < _gameHeight / proportion - 1; j++) {

            var center = {};
            center.x = i * proportion + 45;
            center.y = j * proportion + 45;
            if (currBoard[i][j] === 2) {
                context.beginPath();
                context.arc(center.x, center.y, 15, (0.15 - (m_currDirection) / 2) * Math.PI, (1.85 - (m_currDirection) / 2) * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                setPacmanEye(center.x, center.y);
                context.fillStyle = "black"; //color
                context.fill();
            }
            else if (currBoard[i][j] === 25) {  //regular point
                context.beginPath();
                context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
                context.fillStyle = colorOf25Points; //color
                context.closePath();
                context.fill();
                context.font = "10px Comic Sans MS";
                context.fillStyle = "black";
                context.textAlign = "center";
                context.fillText("25", center.x, center.y + 4);
            }
            else if (currBoard[i][j] === 15) {  //regular point
                context.beginPath();
                context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
                context.fillStyle = colorOf15Points; //color
                context.closePath();
                context.fill();
                context.font = "10px Comic Sans MS";
                context.fillStyle = "black";
                context.textAlign = "center";
                context.fillText("15", center.x, center.y + 4);
            }
            else if (currBoard[i][j] === 0.05) {  //regular point
                context.beginPath();
                context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = colorOf5Points; //color
                context.closePath();
                context.fill();
                context.font = "10px Comic Sans MS";
                context.fillStyle = "black";
                context.textAlign = "center";
                context.fillText("5", center.x, center.y + 4);
            }
            else if (currBoard[i][j] === 5) { //monster1

                context.drawImage(oMonster, i * 30 + 30, j * 30 + 30, (_gameWidth / proportion) - 10, _gameHeight / proportion + 10);
            }
            else if (currBoard[i][j] === 6) { //monster2
                context.drawImage(bMonster, i * 30 + 30, j * 30 + 30, (_gameWidth / proportion) - 10, _gameHeight / proportion + 10);
            }
            else if (currBoard[i][j] === 7) { //monster2
                context.drawImage(gMonster, i * 30 + 30, j * 30 + 30, (_gameWidth / proportion) - 10, _gameHeight / proportion + 10);
            }
            else if (currBoard[i][j] === 4) { //strawberry
                context.drawImage(strawberry, i * 30 + 30, j * 30 + 30, (_gameWidth / proportion) - 10, _gameHeight / proportion + 10);
            }
            else if (currBoard[i][j] === 400) { //clock
                context.drawImage(clock, i * 30 + 30, j * 30 + 30, (_gameWidth / proportion) - 10, _gameHeight / proportion + 10);
            }


        }
    }
}
function drawLives() {
    var center = {};
    center.x = _gameWidth+30;
    center.y = 0;
    for(var i = 0; i<_pacmanLives;i++)
    {

        center.y += 32;
        context.beginPath();
        context.arc(center.x, center.y, 15, 0.15* Math.PI ,1.85 * Math.PI); // half circle
        context.lineTo(center.x, center.y);
        context.fillStyle = "   yellow"; //color
        context.fill();
        context.beginPath();
        context.arc(center.x + 3.5, center.y - 10, 3, 0, 2 * Math.PI);
        context.fillStyle = "black"; //color
        context.fill();
    }


}

function setPacmanEye(centerX, centerY) {
    var radiudSize = 3;
    var eyeOffSet1 = 10;
    var eyeOffSet2 = 3.5
    if (m_currDirection == 1) {
        context.arc(centerX + eyeOffSet1, centerY - eyeOffSet2, radiudSize, 0, 2 * Math.PI);
    }
    if (m_currDirection == 2) {
        context.arc(centerX - eyeOffSet2, centerY - eyeOffSet1, radiudSize, 0, 2 * Math.PI);
    }
    if (m_currDirection == 3) {
        context.arc(centerX - eyeOffSet1, centerY + eyeOffSet2, radiudSize, 0, 2 * Math.PI);
    }
    if (m_currDirection == 4) {
        context.arc(centerX + eyeOffSet2, centerY - eyeOffSet1, radiudSize, 0, 2 * Math.PI);
    }

}

function UpdatePosition() {
    currBoard[pacmanShape.i][pacmanShape.j] = 9;
    var x = GetKeyPressed();
    if (GetKeyPressed() != null) {
        m_currDirection = x;
    }

    if (x == 1) {
        if (pacmanShape.j > 0 && currBoard[pacmanShape.i][pacmanShape.j - 1] !== 1) {
            pacmanShape.j--;
        }
    }
    if (x == 3) {
        if (pacmanShape.j < (_gameHeight / proportion) - 2 && currBoard[pacmanShape.i][pacmanShape.j + 1] !== 1) {
            pacmanShape.j++;
        }
    }
    if (x == 2) {
        if (pacmanShape.i === 0 && pacmanShape.j === 9) {
            pacmanShape.i = 38;
            pacmanShape.j = 9;
        }
        else if (pacmanShape.i > 0 && currBoard[pacmanShape.i - 1][pacmanShape.j] !== 1) {
            pacmanShape.i--;
        }
    }
    if (x == 4) {
        if (pacmanShape.i === 38 && pacmanShape.j === 9) {
            pacmanShape.i = 0;
            pacmanShape.j = 9;
        }
        else if (pacmanShape.i < (_gameWidth / proportion) - 2 && currBoard[pacmanShape.i + 1][pacmanShape.j] !== 1) {
            pacmanShape.i++;
        }
    }
    var pointCollected = isPoints(pacmanShape.i, pacmanShape.j)
    if (pointCollected !== -1) {
        document.getElementById("pacman_chomp").play();
        score += pointCollected;
        _foodCounter--;
    }

    //clock
    if (_randomUpdatesToShowClock <= _updatesCounter && _randomUpdatesToShowClock + _clockTimeRemaind > _updatesCounter) {
        if (!_clockIsShow) {
            findClockRandomPosition();
        }
        else {
            showClock();
            _clockIsShow = true;
        }
    }
    else if (_randomUpdatesToShowClock + _clockTimeRemaind === _updatesCounter) {
        initialClock();
        currBoard[clock.i][clock.j]=9;
    }

    //controll the speed of the monsters.
    if ((_monsterSpeedControl % ui_monsterSpeed ) === 0) {

        if (_pacmanLives === 0) {
            window.clearInterval(intervalPacman);
            window.alert("You lost!");
            return;
        }
        else if (monsterEatPacman()) {//if the monster catch the pacmam in her interval.
            Draw();
            window.clearInterval(intervalPacman);
            document.getElementById("pacman_death").play();
            continueGame();
            return;
        }
        updateMonsterPosition();
        _monsterSpeedControl = 0;
    }
    _monsterSpeedControl++;

    //update strewberry position
    if (!_strawberryGotEaten && _monsterSpeedControl % ui_monsterSpeed === 0) {
        updatePointsPosition();
    }
    
    //time
    var currentTime = new Date();
    if(isClock(pacmanShape.i,pacmanShape.j))
    {
        initialClock();
        currBoard[pacmanShape.i][pacmanShape.j] = 2;
        _clockUpTime+=15;
    }
    currentTime=currentTime.setSeconds(currentTime.getSeconds() - _clockUpTime);
    time_elapsed = (start_time-currentTime) / 1000;
    if (score >= 150 && time_elapsed >= ui_gameTime-10) {
        pac_color = "green";
    }
    if (_foodCounter === 0) {
        Draw();
        window.clearInterval(intervalPacman);
        window.alert("Game completed");
    }
    else if(time_elapsed<=0)
    {
        if(score<150)
        {
            window.alert("You can do better! you collect "+score + "points");
        }
        else{
            window.alert("we have a winner! ("+score + "points)");
        }
        window.clearInterval(intervalPacman);

    }
    //collusion pacman and ghost
    else if (monsterEatPacman()) {
        Draw();
        document.getElementById("pacman_death").play();
        if (_pacmanLives === 0) {
            window.clearInterval(intervalPacman);
            window.alert("Game Over! you got eated 3 times..");
        }
        else {
            window.clearInterval(intervalPacman);
            continueGame();
        }
        return;
    }

    else if (!_strawberryGotEaten && pacmanGetStrawberry()) {
        //here made special sound..
        Draw();
        document.getElementById("pacman_eatfruit").play();
        score = score + 50;
    }
    else {
        currBoard[pacmanShape.i][pacmanShape.j] = 2;
        Draw();
    }
    _updatesCounter++;
}

function initialClock()
{
    _updatesCounter = 0;
    _randomUpdatesToShowClock = Math.floor((Math.random() * 75 ));
    _clockIsShow=false;

}

function findClockRandomPosition() {
    var randomNum = Math.floor((Math.random() * 285 + 1));
    var locatClock = 0;
    var clock_remain = 1;
    for (var i = 0; i < _gameWidth / proportion - 1; i++) {
        for (var j = 0; j < _gameHeight / proportion - 1; j++) {
            if (currBoard[i][j] === 9) {
                if (randomNum - 10 <= locatClock && locatClock <= randomNum + 10 && clock_remain === 1) {
                    currBoard[i][j] = 400;
                    clock.i = i;
                    clock.j = j;
                    clock_remain--;
                    break;
                }
                locatClock++;
            }

        }

    }
}

function pacmanGetStrawberry() {
    if (pacmanShape.i === strawberry.i && pacmanShape.j === strawberry.j) {
        _strawberryGotEaten = true;
        currBoard[strawberry.i][strawberry.j] = 2;
    }
    return _strawberryGotEaten;
}

function monsterEatPacman() {
    for (var i = 0; i < _monsters.length; i++) {
        var monster = _monsters[i];
        if (pacmanShape.i === monster.i && pacmanShape.j === monster.j)
            return true;
    }
    return false;
}

//put clock in matrix (400)
function showClock() {
    currBoard[clock.i][clock.j] = 400;

}
//initial monster to start location and random pacman
function continueGame() {
    //initial monsters
    _pacmanLives--;
    for (var i = 0; i < _numberOfMonster; i++) {
        var monster = _monsters[i];
        currBoard[monster.i][monster.j] = _beforeMonsterCell[i];
        if (i === 0) {
            currBoard[0][0] = 5;
            monster.i = 0;
            monster.j = 0;
        }
        if (i === 1 && _numberOfMonster>1) {
            currBoard[38][18] = 6;
            monster.i = 38;
            monster.j = 18;
        }
        if (i === 2 && _numberOfMonster>2) {
            currBoard[38][0] = 7;
            monster.i = 38;
            monster.j = 0;
        }
    }
    _beforeMonsterCell = [9, 9, 9];
    _monsterLastPosition = [[], [], []];

    //initial pacman
    pac_color = "yellow";
    m_currDirection = 4;
    var randomNum = Math.floor((Math.random() * 285 + 1));
    locatePacman = 0;
    var pacman_remain = 1;
    for (var i = 0; i < _gameWidth / proportion - 1; i++) {
        for (var j = 0; j < _gameHeight / proportion - 1; j++) {
            if (currBoard[i][j] === 9) {
                if (randomNum - 10 <= locatePacman && locatePacman <= randomNum + 10 && pacman_remain === 1) {
                    currBoard[i][j] = 2;
                    pacmanShape.i = i;
                    pacmanShape.j = j;
                    pacman_remain--;
                    break;
                }
                locatePacman++;
            }
        }
    }
    Draw();
    intervalPacman = setInterval(UpdatePosition, ui_gameSpeed);
}


function updateMonsterPosition() {
   // for (var i = 0; i < _monsters.length; i++) {

    for (var i = 0; i < _numberOfMonster; i++) {
        var monster = _monsters[i];
        currBoard[monster.i][monster.j] = _beforeMonsterCell[i];

        var next_monster_i = monster.i;
        var next_monster_j = monster.j;
        var prev_monster_i = _monsterLastPosition[i][0];
        var prev_monster_j = _monsterLastPosition[i][1];
        //go from side to side
        if (monster.i === 0 && monster.j === 9 && !(_monsterLastPosition[i][0] === 38)) {
            next_monster_i = 38;
        }
        else if (monster.i === 38 && monster.j === 9 && !(_monsterLastPosition[i][0] === 0)) {
            next_monster_i = 0;
        }
        else if (Math.abs(monster.i - pacmanShape.i) === 0) {
            if (pacmanShape.j < monster.j) {
                next_monster_j--;
            }
            else {
                next_monster_j++;
            }
        }
        else if (Math.abs(monster.j - pacmanShape.j) === 0) {
            if (pacmanShape.i < monster.i)
                next_monster_i--;
            else
                next_monster_i++;
        }
        else if (Math.abs(monster.i - pacmanShape.i) < Math.abs(monster.j - pacmanShape.j)) {
            if (pacmanShape.i < monster.i)
                next_monster_i--;
            else
                next_monster_i++;
        }
        else {
            if (pacmanShape.j < monster.j)
                next_monster_j--;
            else
                next_monster_j++;
        }

        if (!isLegalPosition(next_monster_i, next_monster_j, i)) //monster new cordinate is not legal
        {
            goDefault(monster, i);
            next_monster_i = monster.i;
            next_monster_j = monster.j;
        }
        else {//only if not update in default function, update last location anyway
            _monsterLastPosition[i][0] = monster.i;
            _monsterLastPosition[i][1] = monster.j;
        }

        //if collussion
        if (!isPath(next_monster_i, next_monster_j) && currBoard[next_monster_i][next_monster_j] !== 1
            && isPath(prev_monster_i, prev_monster_j)) {//if colussion in characture and the last path is clear - go back
            next_monster_i = prev_monster_i;
            next_monster_j = prev_monster_j;
        }


        _beforeMonsterCell[i] = currBoard[next_monster_i][next_monster_j];
        currBoard[next_monster_i][next_monster_j] = 5 + i;
        monster.i = next_monster_i;
        monster.j = next_monster_j;
    }
}

function isLegalPosition(i, j, monsIndex) {

    return (currBoard[i][j] !== 1 && !(i === _monsterLastPosition[monsIndex][0] &&
    j === _monsterLastPosition[monsIndex][1]) || (i === 0 && j === 9) || (i === 38 && j === 9));

}

function goDefault(monster, monsIndex) {

    //never go to last position!
    //go right
    if (monster.i < (_gameWidth / proportion) - 2 && isLegalPosition(monster.i + 1, monster.j, monsIndex)) {
        _monsterLastPosition[monsIndex][0] = monster.i;
        monster.i++;
        return;
    }
    //go down
    if (monster.j < (_gameHeight / proportion) - 2 && isLegalPosition(monster.i, monster.j + 1, monsIndex)) {
        _monsterLastPosition[monsIndex][1] = monster.j;
        monster.j++;
        return;
    }
    //go left
    if (monster.i > 0 && isLegalPosition(monster.i - 1, monster.j, monsIndex)) {
        _monsterLastPosition[monsIndex][0] = monster.i;
        monster.i--;
        return;
    }
    //go up
    if (monster.j > 0 && isLegalPosition(monster.i, monster.j - 1, monsIndex)) {
        _monsterLastPosition[monsIndex][1] = monster.j;
        monster.j--;
        return;

    }
}

function updatePointsPosition() {
    currBoard[strawberry.i][strawberry.j] = _beforePointsCell;

    var right = [strawberry.i + 1, strawberry.j];

    var left = [strawberry.i - 1, strawberry.j];

    var up = [strawberry.i, strawberry.j - 1];

    var down = [strawberry.i, strawberry.j + 1];

    var arrLegalMoves = [];

    // collect to arr all possible moves
    if (right[0] <= (_gameWidth / proportion) - 2 && isPath(right[0], right[1])
        && !(_lastPointsPositions[0] === right[0] && _lastPointsPositions[1] === right[1])) {
        arrLegalMoves.push(right);
    }
    if (left[0] >= 0)
        if (isPath(left[0], left[1]) && !(_lastPointsPositions[0] === left[0] && _lastPointsPositions[1] === left[1])) {
            arrLegalMoves.push(left);
        }
    if (up[1] >= 0 && isPath(up[0], up[1])
        && !(_lastPointsPositions[0] === up[0] && _lastPointsPositions[1] === up[1])) {
        arrLegalMoves.push(up);
    }
    if (down[1] <= (_gameHeight / proportion) - 2 && isPath(down[0], down[1])
        && !(_lastPointsPositions[0] === down[0] && _lastPointsPositions[1] === down[1])) {
        arrLegalMoves.push(down);
    }
    //choose random move from the legals
    var len = arrLegalMoves.length;

    _lastPointsPositions[0] = strawberry.i;
    _lastPointsPositions[1] = strawberry.j;
    //move the points there
    if(len===0)
    {
        arrLegalMoves.push(_lastPointsPositions);
        len=1;

    }
    var rand = Math.floor((Math.random() * len));
    strawberry.i = arrLegalMoves[rand][0];
    strawberry.j = arrLegalMoves[rand][1];
    //save the last location
    _beforePointsCell = currBoard[strawberry.i][strawberry.j];

    //update the boeard acordingli
    if (pacmanGetStrawberry()) {
        document.getElementById("pacman_eatfruit").play();
        if (_beforePointsCell == 0.05 || _beforePointsCell == 15 || _beforePointsCell == 25) {
            _foodCounter--;
        }
        currBoard[pacmanShape.i][pacmanShape.j] = 2;
        score = score + 50;
        return;
    }
    currBoard[strawberry.i][strawberry.j] = 4;

}

function isPath(i, j) {

    if (
        (currBoard[i][j] === 25 ||
        currBoard[i][j] === 15 ||
        currBoard[i][j] === 0.05 ||
        currBoard[i][j] === 9))
        return true;
    else
        return false;
}

function isPoints(i, j) {
    if (currBoard[i][j] === 25)
        return 25;
    else if (currBoard[i][j] === 15)
        return 15;
    else if (currBoard[i][j] === 0.05)
        return 5;
    else return -1;
}
function isClock(i,j){
    return currBoard[i][j] ===400;
}

function stopPacmanGame(){
    if (intervalPacman) {
        document.getElementById("pacman_background").pause();
        clearInterval(intervalPacman);
        drawCanvasPic();
    }
}



