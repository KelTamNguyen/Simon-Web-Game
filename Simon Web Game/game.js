var level = 0;
var currentScore = 0;
var highScore = 0;
var gamePattern = [];
var userInputPattern = [];
var isRunning = false;
var muted = false;

// list of button colors
var buttonColors = ["red","blue", "green", "yellow"];

$(document).on("keydown", function () {
    if (!isRunning) {
        $("#level-title").text("Level " + level);
        nextSequence();
        isRunning = true;
    }
});

//handle mute button click
$("img").click(function () {
    if (!muted) {
        $(this).attr("src", "images/volume-mute-solid.svg");
        muted = true;
    }
    else {
        $(this).attr("src", "images/volume-up-solid.svg");
        muted = false;
    }
});

//handle colored button click
$(".btn").click(function () {
    var inputColor = $(this).attr("id");
    userInputPattern.push(inputColor);

    //play button sound
    playSound(inputColor);
    animatePress(inputColor);
    checkAnswer(userInputPattern.length - 1);
});

//dtermine next button in the sequence
function nextSequence() {
    level++;
    $("#level-title").text("Level " + level);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    //select a button of a specific color
    $("#" + randomChosenColor).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

    //play the corresponding button's sound effect
    playSound(randomChosenColor);
}

//check user input for accuracy
function checkAnswer(currentLevel){
    if (userInputPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userInputPattern.length === gamePattern.length){
            setTimeout(nextSequence, 1000);
            currentScore++;
            userInputPattern = [];
        }
    }
    else {
        if (isRunning) {
            if (!muted) {
                var gameOverSound = new Audio("sounds/wrong.mp3");
                gameOverSound.play();
            }
            
            $("body").addClass("game-over");

            setTimeout(function (){
                $("body").removeClass("game-over");
            }, 200);
            
            //Game Over Screen
            $("#level-title").text("Game Over, Press Any Key To Restart");
            
            //update high score
            if (currentScore > highScore){
                $("#high-score").text("High Score:" + currentScore);
            }

            restart();
        }
    }
}

//play button sounds
function playSound(name) {
    if (!muted){
        var buttonSound = new Audio("sounds/" + name + ".mp3");
        buttonSound.play();
    }
}

//gray out button for 100 milliseconds when clicked
function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

//restart after Game Over
function restart(){
    userInputPattern = [];
    gamePattern = [];
    level = 0;
    isRunning = false;
}