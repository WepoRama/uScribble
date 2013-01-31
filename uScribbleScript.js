var canvas;
var context;
var lastX;
var lastY;
var penDown;
var startPoint;
var topCanvas;
var topContext;
var shapeStack = {};

window.onload = function () {
    var button = document.getElementById("previewButton");
    //button.onclick =
    initCanvas();
};


function Point(x, y) {
    this.x = (x !== undefined) ? x : 0;
    this.y = (y !== undefined) ? y : 0;
}

// JavaScript class imitation:
var Shape = Base.extend({
    constructor: function (point, end) {
        this.startPoint = point;
        this.x = point.x;
        this.y = point.y;
        this.endPoint = end;
        this.length = end.x - point.x;
        this.height = end.y - point.y ;
    },
    Draw: function (context) {
    }
});
var Rectangle = Shape.extend({
    constructor: function (point, end) {
        this.base(point, end);
    },
    Draw: function (context) {
        context.strokeRect(this.startPoint.x, this.startPoint.y, this.length, this.height);
    }
});
function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

//*
var Circle = Shape.extend({
    constructor: function (start, end) {
        this.base(start, end);
        this.radius = Math.sqrt(this.length * this.length + this.height * this.height);
    },
    Draw: function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);

        context.stroke();
    }
});
// */

function WhichShape(shape) {
    var selectObj = document.getElementById("shape");
    var index = selectObj.selectedIndex;
    var shape = selectObj[index].value;
    if (shape == "rectangle") {
        return function (start, stop) { return new Rectangle(start, stop); }
    }
    else {
        return function (start, stop) { return new Circle(start, stop); }
    }
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

        var ChooseShape;
        $('#canvasTop').mousedown(function (e) {
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            startPoint = new Point(mouseX, mouseY);
            penDown = true;
            ChooseShape = WhichShape();
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

            var box = ChooseShape(startPoint, endPoint);
            box.Draw(context);
        });
        $('#canvasTop').mousemove(function (e) {
            if (!penDown) {
                return;
            }

            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            var endPoint = new Point(mouseX, mouseY);

            var box = ChooseShape(startPoint, endPoint);
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
/*
    function drawCircle(canvas, context) {
        var radius = Math.floor(Math.random() * 40);
        var x = Math.floor(Math.random() * canvas.width);
        var y = Math.floor(Math.random() * canvas.height);
        context.beginPath();
        context.arc(x, y, radius, 0, degreesToRadians(360), true);
        context.fillStyle = "lightblue";
        context.fill();
    }
*/

