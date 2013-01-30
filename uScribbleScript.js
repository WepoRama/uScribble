var canvas;
var context;
var lastX;
var lastY;
var penDown;

window.onload = function () {
    var button = document.getElementById("previewButton");
    //button.onclick =
    initCanvas();
};


function drawSquare(canvas, context) {
    var w = Math.floor(Math.random() * 40);
    var x = Math.floor(Math.random() * canvas.width);
    var y = Math.floor(Math.random() * canvas.height);
    context.fillStyle = "lightblue";
    context.fillRect(x, y, w, w);
}
function fillBackgroundColor(canvas, context) {
    var selectObj = document.getElementById("backgroundColor");
    var index = selectObj.selectedIndex;
    var bgColor = selectObj.options[index].value;
    context.fillStyle = selectObj[index].value;
    context.fillRect(0, 0, canvas.width, canvas.height);
}
function initCanvas() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d")
    fillBackgroundColor(canvas, context);
    var selectObj = document.getElementById("shape");
    var index = selectObj.selectedIndex;
    var shape = selectObj[index].value;

    $('#canvas').mousedown(function (e) {
        penDown = true;
    });
    $('#canvas').mouseup(function (e) {
        penDown = false;
    });
    $('#canvas').mousemove(function (e) {
        if (!penDown) {
            return;
        }
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
        penDown = true;

        context.strokeStyle = "black";
		context.lineJoin = "round";
        context.lineWidth = 10;
        context.stroke();

        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(mouseX, mouseY);
        context.closePath();
        lastX = mouseX;
        lastY = mouseY;
    });
    $('#canvas').mouseleave(function (e) {
        penDown = false;
    });
}
function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
function drawCircle(canvas, context) {
    var radius = Math.floor(Math.random() * 40);
    var x = Math.floor(Math.random() * canvas.width);
    var y = Math.floor(Math.random() * canvas.height);
    context.beginPath();
    context.arc(x, y, radius, 0, degreesToRadians(360), true);
    context.fillStyle = "lightblue";
    context.fill();
}
function updateTweets(tweets) {
    var tweetsSelection = document.getElementById("tweets");
    for (var i = 0; i < tweets.length; i++) {
        tweet = tweets[i];
        var option = document.createElement("option");
        option.text = tweet.text;
        option.value = tweet.text.replace("\"", "'");
        tweetsSelection.options.add(option);
    }
    tweetsSelection.selectedIndex = 0;
}


