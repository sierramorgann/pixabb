var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "black",
    y = 10;

var xx, yy;

function color(obj) {
    switch (obj.id) {
        case "yellow":
            x = "#f7ff56";
            break;
        case "neon":
            x = "#94fc13";
            break;
        case "aqua":
            x = "#4be3ac";
            break;
        case "navy":
            x = "#032d3c";
            break;
        case "brown":
            x = "#5a3921";
            break;
        case "moss":
            x = "#6b8c42";
            break;
        case "tree":
            x = "#616f39";
            break;
        case "pond":
            x = "#a7d129";
            break;
        case "night":
            x = "#413c69";
            break;
        case "blue":
            x = "#4a47a3";
            break;
        case "lav":
            x = "#ad62aa";
            break;
        case "mauve":
            x = "#eab9c9";
            break;
        case "pink":
            x = "#ffbcbc";
            break;
        case "ocean":
            x = "#4cd3c2";
            break;
        case "barbie":
            x = "#efa8e4";
            break;
        case "bb":
            x = "#f8e1f4";
            break;
        case "sky":
            x = "#00bcd4";
            break;
        case "mint":
            x = "#b2ebf2";
            break;
        case "orange":
            x = "#ff5722";
            break;
        case "red":
            x = "#dd2c00";
            break;
        case "turquoise":
            x = "#18b0b0";
            break;
        case "fall":
            x = "#de7119";
            break;
        case "grey":
            x = "#dee3e2";
            break;
        case "teal":
            x = "#116979";
            break;
        case "black":
            x = "black";
            break;
        case "dark":
            x = "#323232";
            break;
        case "hot":
            x = "#ff1e56";
            break;
        case "clem":
            x = "#ffac41";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 14;
    else y = 10;
}

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false)

$(document).ready(function() {

    var regBrush = $('#regBrush');
    regBrush.click(function() {
        var canvas = document.getElementById('can');
        var ctx = canvas.getContext('2d');

        canvas.addEventListener("mousemove", function(e) {
            findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function(e) {
            findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function(e) {
            findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function(e) {
            findxy('out', e)
        }, false);

        function draw() {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currX, currY);
            ctx.strokeStyle = x;
            ctx.lineWidth = y;
            ctx.stroke();
            ctx.closePath();
        }

        function findxy(res, e) {
            if (res == 'down') {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;

                flag = true;
                dot_flag = true;
                if (dot_flag) {
                    ctx.beginPath();
                    ctx.fillStyle = x;
                    ctx.fillRect(currX, currY, 10, 10);
                    ctx.closePath();
                    dot_flag = false;
                }
            }
            if (res == 'up' || res == "out") {
                flag = false;
            }
            if (res == 'move') {
                if (flag) {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX - canvas.offsetLeft;
                    currY = e.clientY - canvas.offsetTop;
                    draw();
                }
            }
            if (res == '') {
                draw();
            }
        }
    });

    var circ = $('#circ');
    circ.click(function() {

        function distanceBetween(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }

        function angleBetween(point1, point2) {
            return Math.atan2(point2.x - point1.x, point2.y - point1.y);
        }

        var el = document.getElementById('can');
        var ctx = el.getContext('2d');
        ctx.fillStyle = x;
        ctx.strokeStyle = '#333';

        var isDrawing, lastPoint;

        el.onmousedown = function(e) {
            isDrawing = true;
            xx = e.clientX - 370;
            yy = e.clientY - 120;
            lastPoint = { x: xx, y: yy };
        };

        el.onmousemove = function(e) {
            if (!isDrawing) return;
            xx = e.clientX - 370;
            yy = e.clientY - 120;
            var currentPoint = { x: xx, y: yy };
            var dist = distanceBetween(lastPoint, currentPoint);
            var angle = angleBetween(lastPoint, currentPoint);

            for (var i = 0; i < dist; i += 5) {
                x = lastPoint.x + (Math.sin(angle) * i) - 25;
                y = lastPoint.y + (Math.cos(angle) * i) - 25;
                ctx.beginPath();
                ctx.arc(x + 10, y + 10, 20, false, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                flag = true;
                dot_flag = true;
                if (dot_flag) {
                    ctx.beginPath();
                    ctx.fillStyle = x;
                    ctx.fillRect(currX, currY, 2, 2);
                    ctx.closePath();
                    dot_flag = false;
                }
            }

            lastPoint = currentPoint;
        };

        el.onmouseup = function() {
            isDrawing = false;
        };
    });

    var pixBrush = $('#pixBrush');
    pixBrush.click(function() {
        function drawPixels(x, y) {
            x = x - 370;
            y = y - 120;
            for (var i = -10; i < 10; i += 4) {
                for (var j = -10; j < 10; j += 4) {
                    if (Math.random() > 0.5) {
                        ctx.fillStyle = ['red', 'orange', 'yellow', 'green',
                            'light-blue', 'blue', 'purple'
                        ][getRandomInt(0, 6)];
                        ctx.fillRect(x + i, y + j, 4, 4);
                    }
                }
            }
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var el = document.getElementById('can');
        var ctx = el.getContext('2d');

        ctx.lineJoin = ctx.lineCap = 'round';
        var isDrawing, lastPoint;

        el.onmousedown = function(e) {
            isDrawing = true;
            lastPoint = { x: e.clientX, y: e.clientY };
        };
        el.onmousemove = function(e) {
            if (!isDrawing) return;

            drawPixels(e.clientX, e.clientY);

            lastPoint = { x: e.clientX, y: e.clientY };
        };
        el.onmouseup = function() {
            isDrawing = false;
        };
    });

    var button = $('#submit');
    button.click(function() {
        convertCanvasToImage(canvas);
    });

    var vid = $('#vidStart');
    vid.click(function() {
        imgcap();
    });

    var clear = $('#clearbutton');
    clear.click(function() {
        clearCanvas(canvas, ctx);
    });
});