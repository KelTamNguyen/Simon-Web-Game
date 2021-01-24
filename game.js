//array of the possible colors
var buttonColors = ["green", "red", "yellow", "blue"];

//arrays to compare between the game and the user's input
var gamePattern = [];
var userInputPattern = [];

//level and high scores
var level = 0;
var currentScore = 0;
var highScore = 0;

//qualities related to the game state
var isRunning = false;
var difficulty = "easy"
var muted = false;

//initiate Simon game with the press of a key
$(document).on("keydown", function () {
    if(!isRunning){
        $("#select-mode").fadeOut();
        $(".difficulty-btn").fadeOut();
        nextSequence();
        showPattern(gamePattern);
        isRunning = true;
    }
})

//handle clicking easy/hard buttons
$(".difficulty-btn").click(function (event) {
    if (event.target.id == "easy") {
        difficulty = "easy";
        $("#easy").addClass("selected");
        $("#hard").removeClass("selected");
    } 
    else {
        difficulty = "hard";
        $("#hard").addClass("selected");
        $("#easy").removeClass("selected");
    }
})

//handle colored button click
$(".btn").click(function () {
    var inputColor = $(this).attr("id");
    userInputPattern.push(inputColor);

    //play button sound
    playSound(inputColor);
    animatedPress(inputColor);
    checkAnswer(userInputPattern.length - 1);
});

//handle mute button click
$("i").click(function () {
    if (!muted) {
        $(this).attr("class", "fas fa-volume-mute fa-2x"); 
        muted = true;
    }
    else {
        $(this).attr("class", "fas fa-volume-up fa-2x");
        muted = false;
    }
});

//add the next color to the sequence
function nextSequence() {
    var randomNumber = Math.floor(Math.random()*4);
    gamePattern.push(buttonColors[randomNumber])
    level++;
    $("h1").text("Level " + level)
    return gamePattern;
}

//(For Easy mode) play the entire pattern so far
function showPattern(gamePattern) {
    for (let i = 0; i < gamePattern.length; i++) {
        animatedBtn(i);
    }
}

//(For Hard mode) show the next color in the sequence by 
//playing the last element in gamePattern after the next color has been added
function showLastPatternElement(gamePattern) {
    var color = gamePattern[gamePattern.length-1];
    playSound(color);
    $("#"+color).addClass("pressed").delay(100).queue(function () {
        $(this).removeClass("pressed").dequeue();
    }); 
}

//animates the button
function animatedBtn(i) { setTimeout(function() {
    var color = gamePattern[i];
    playSound(color);
    $("#"+color).addClass("pressed").delay(100).queue(function () {
        $(this).removeClass("pressed").dequeue();
    }); 
    }, 500 * i);   
}

//play sound button sounds or wrong sound
function playSound(name) {
    if (!muted){
        var buttonSound = new Audio("sounds/" + name + ".mp3");
        buttonSound.play();
    }
}

//animation for button upon click
function animatedPress(color) {
    $("#"+color).addClass("pressed").delay(100).queue(function () {
    $(this).removeClass("pressed").dequeue();
    }); 
}

//logic for checking the inputs for correctness
function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] == userInputPattern[currentLevel]) {
        if(userInputPattern.length === gamePattern.length){
            nextSequence();
            currentScore++;
            console.log(currentScore);
            setTimeout(function () {
                if (difficulty == "easy") {
                    showPattern(gamePattern);
                } 
                else {
                    showLastPatternElement(gamePattern);  
                }
            }, 1000);
            userInputPattern = [];
        }
    } 
    else {
        if (!muted){
            playSound("wrong");
        }
        $("body").addClass("game-over").delay("200").queue(function () {
            $(this).removeClass("game-over").dequeue();
        })
        //Game Over Screen
        $("#level-title").text("Game Over, Press Any Key To Restart");
            
        //update high score
        if (currentScore > highScore){
            $("#high-score").text("High Score:" + currentScore);
        };

        restart();
    }

}

//change the game state back to what it was like at the start
function restart() {
    level = 0;
    gamePattern = [];
    userInputPattern = [];
    isRunning = false;
    currentScore = 0;
    $(".difficulty-btn").fadeIn();
}