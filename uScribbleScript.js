var canvas;
var context;
var lastX;
var lastY;
var penDown;
var startPoint;
var topCanvas;
var topContext;

window.onload = function () {
    var button = document.getElementById("previewButton");
    //button.onclick =
    initCanvas();
};

function Point(x, y) {
    this.x = (x !== undefined) ? x : 0;
    this.y = (y !== undefined) ? y : 0;
}
function Rectangle (p) {
    this.startPoint = (p !== undefined) ? p : new Point(0,0);
}
Rectangle.prototype.SetEndPoint = function (p) {
    this.endPoint = (p !== undefined) ? p : new Point(0, 0);
}
Rectangle.prototype.Draw = function (context) {
    context.strokeRect(this.startPoint.x, this.startPoint.y,
        this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);
}





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

        topCanvas = document.getElementById("canvasTop");
        topContext = topCanvas.getContext("2d")

        fillBackgroundColor(canvas, context);
        var selectObj = document.getElementById("shape");
        var index = selectObj.selectedIndex;
        var shape = selectObj[index].value;

        $('#canvasTop').mousedown(function (e) {
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            startPoint = new Point(mouseX, mouseY);
            penDown = true;
/*            context.beginPath();
            context.moveTo(mouseX, mouseY);
            context.closePath();
            lastX = mouseX;
            lastY = mouseY;
            // */

        });
        $('#canvasTop').mouseup(function (e) {
            penDown = false;
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            var endPoint = new Point(mouseX, mouseY);

            var box = new Rectangle(startPoint);
            box.SetEndPoint(endPoint);
            box.Draw(context);
        });
        $('#canvasTop').mousemove(function (e) {
            if (!penDown) {
                return;
            }

            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            var endPoint = new Point(mouseX, mouseY);

            var box = new Rectangle(startPoint);
            box.SetEndPoint(endPoint);
            topContext.clearRect(0, 0, 600, 600);
            box.Draw(topContext);

            /*
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            penDown = true;

            context.strokeStyle = "black";
            context.lineJoin = "round";
            context.lineWidth = 3;
            context.stroke();

            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(mouseX, mouseY);
            context.closePath();
            lastX = mouseX;
            lastY = mouseY;
            // */
        });
        $('#canvasTop').mouseleave(function (e) {
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


