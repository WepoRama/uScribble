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
shapeStack.show = function (shape) { }
shapeStack.redraw = function (context) {
    context.clearRect(0, 0, 600, 600);
    for (var i = 0; i < this.length; i++) {
        this [i].Draw(context);
    }
}
    

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
    shapeStack.redraw(context);
}
function redoAddShape() {
    stackTransfer(undoStack, shapeStack);
    shapeStack.redraw(context);
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
    myLine: null, 
    constructor: function(start, end) {
        this.base(start, end);
        this.myLine = new Array();
        this.myLine.push(new Line(start, end));
    },
    add: function (segment) {
        this.myLine.push(segment);
    },
    Draw: function (contex) {
        for (var i = 0; i < this.myLine.length ; i++) {
            this.myLine[i].Draw(contex);
        }
    }
});
var Text = Shape.extend({
    size: null,
    text: null,
    Draw: function (context) {
        if (this.size === null) {
            this.size = 12;
        }
        if (this.text === null) {
            this.text = "Hello World!";
        }
        var font = this.size + "px Arial";
        context.font = font;
        context.fillText(this.text, this.x, this.y);
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
        var start = null;
        var shape = null;
        var func = func = function (nextStart, nextStop) {
            if (shape === null) {
                shape = new Pen(nextStart, nextStop);
                start = nextStop;
            } else {
                shape.add(new Line(start, nextStop));
                start = nextStop;
            }
            return shape;
        };
        return func;
    }
    else if (shape == "text") {
        return function (start, stop) { return new Text(start, stop); }
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
            box = null;
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
        /*
        $('#colorSelector').ColorPicker({
            color: '#0000ff',
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                $('#colorSelector div').css('backgroundColor', '#' + hex);
            }
        });
        //$('#colorSelector').ColorPicker({ flat: true });
        
        // */
        $('#colorpickerHolder').ColorPicker({ flat: true });

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
