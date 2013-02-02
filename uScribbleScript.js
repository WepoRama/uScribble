var canvas;
var context;
var lastX;
var lastY;
var penDown;
var startPoint;
var topCanvas;
var topContext;
var shapeStack = new Array();
shapeStack.findInPath = function (point, context) {
    for (var i = stack.length; i> 0 ; i--) {
        stack[i].Trace(context);
        if (context.isPointInPath(point.x, point.y)) {
            return i;
        }
    }
    return -1;
}
shapeStack.hide = function (shape) { }
    

var undoStack = new Array();

window.onload = function () {
    var button = document.getElementById("undo");
    button.onclick = undoAddShape;
    button = document.getElementById("redo");
    button.onclick = redoAddShape;

    initCanvas();
};

function undoAddShape() {
    stackTransfer(shapeStack, undoStack);
    Redraw(shapeStack, context);
}
function redoAddShape() {
    stackTransfer(undoStack, shapeStack);
    Redraw(shapeStack, context);
}
function stackTransfer(fromStack, toStack) {
    if (fromStack.length == 0) {
        return;
    }
    var shape = fromStack.pop();
    toStack.push(shape);
}

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
    Trace: function (context) {
    },
    Draw: function (context) {
        this.Trace(context);
        context.stroke();
    },
    visible: true,
    hide: function() { this.visible = false;},
    show: function() { this.visible = true;}
});
var Rectangle = Shape.extend({
    constructor: function (point, end) {
        this.base(point, end);
    },
    Trace: function (context) {
        context.beginPath();
        context.rect(this.startPoint.x, this.startPoint.y, this.length, this.height);
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
    Trace: function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
    }
});
var Line = Shape.extend({
    Trace: function (context) {
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.endPoint.x, this.endPoint.y);
    }
});
var Pen = Shape.extend({
    segment: new Array(),
    constructor: function(start, end) {
        this.base(start, end);
        this.segment.push(new Line(start, end));
    },
    add: function (segment) {
        this.segment.push(segment);
    },
    Draw: function (contex) {
        for (var i = 0; i < this.segment.length ; i++) {
            this.segment[i].Draw(contex);
        }
    }
});

// */

function WhichShape(shape) {
    var selectObj = document.getElementById("shape");
    var index = selectObj.selectedIndex;
    var shape = selectObj[index].value;
    if (shape == "rectangle") {
        return function (start, stop) { return new Rectangle(start, stop); }
    }  // todo: add more shapes, here and above
    else if (shape == "line") {
        return function (start, stop) { return new Line(start, stop); }
    }
    else if (shape == "pen") {
        return function (start, stop) {
            var that = {};
            that.stop = stop;
            that.shape = new Pen(start, stop);
            
            var func = function (start, stop) {
                that.shape.push(new Line(that.stop, stop));
                that.stop = stop;
            }
            func.Draw = function (context) {
                that.shape.Draw(context);
            }
            return func;
        }
    }
    else {
        return function (start, stop) { return new Circle(start, stop); }
    }
}

    function initCanvas() {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");

        topCanvas = document.getElementById("canvasTop");
        topContext = topCanvas.getContext("2d");

        //fillBackgroundColor(canvas, context);
        var selectObj = document.getElementById("shape");
        var index = selectObj.selectedIndex;
        var shape = selectObj[index].value;

        var ChooseShape;
        $('#canvasTop').mousedown(function (e) {
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            startPoint = new Point(mouseX, mouseY);
            //var whichShape = shapeStack.findInPath(startPoint, topContext)
            //if (whichShape == -1) {
                penDown = true;
                ChooseShape = WhichShape();
            /*} else {
                shapeStack.hide(whichShape);
            }// */
        });
        $('#canvasTop').mouseup(function (e) {
            topContext.clearRect(0, 0, 600, 600);
            penDown = false;
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            var endPoint = new Point(mouseX, mouseY);

            var box = ChooseShape(startPoint, endPoint);
            box.Draw(context);
            shapeStack.push(box);
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

    function Redraw(stack, context) {
        context.clearRect(0, 0, 600, 600);
        for (var i = 0; i < stack.length ; i++) {
            stack[i].Draw(context);
        }
    }
/*
    function findInPath(point, stack, context) {
        for (var i = stack.length; i> 0 ; i--) {
            stack[i].Trace(context);
            if (context.isPointInPath(point.x, point.y)) {
                return i;
            }
        }
        return -1;
    }*/
