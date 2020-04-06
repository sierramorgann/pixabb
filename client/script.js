var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "black",
    y = 2;

function handleImage(e) {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    document.getElementById("imageLoader").style.display = "none";
    var reader = new FileReader();

    reader.onload = function(event) {
        var img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function init() {

    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    // drag image on to canvas and draw

    //window.ondragover = function(e) {e.preventDefault()}
    //window.ondrop = function(e) {e.preventDefault(); draw(e.dataTransfer.files[0]); }

    // function draw(file){

    //     var img =new Image();
    //     // URL @ Mozilla, webkitURL @ Chrome
    //     img.src = (window.webkitURL ? webkitURL : URL).createObjectURL(file);

    //     // call ctx.drawImage when the image got loaded
    //     img.onload = function() {
    //       // ctx.drawImage(img, 0, 0);
    //       ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height); // stretch img to canvas size
    //   }
    //}

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

    initTouch();
}

// Clear the canvas context using the canvas width and height
function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function download(canvas) {
    //document.getElementById("link").innerHTML = "";
    var url = canvas.toDataURL("image/png");
    var link = document.getElementById('link');
    link.innerHTML = '<button>Download Image</button>';
    link.href = url;
    link.download = "littleBits.png";
    link.className = "link";
}

function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "orange":
            x = "orange";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 14;
    else y = 2;
}

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
            ctx.fillRect(currX, currY, 2, 2);
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

// Get the touch position relative to the top-left of the canvas
// When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
// but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
// "target.offsetTop" to get the correct values in relation to the top left of the canvas.
function getTouchPos(e) {
    if (!e)
        var e = event;

    if (e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            touchX = touch.pageX - touch.target.offsetLeft;
            touchY = touch.pageY - touch.target.offsetTop;
        }
    }
}

// Draw something when a touch start is detected
function sketchpad_touchStart() {
    // Update the touch co-ordinates
    getTouchPos();

    console.log("touch start");

    // Prevents an additional mousedown event being triggered
    event.preventDefault();
}

// Draw something and prevent the default scrolling when touch movement is detected
function sketchpad_touchMove(e) {
    // Update the touch co-ordinates
    var res = getTouchPos(e);

    // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
    findxy(e);

    console.log("touch pos");

    // Prevent a scrolling action as a result of this touchmove triggering.
    event.preventDefault();
}

// Set-up the canvas and add our event handlers after the page has loaded
function initTouch() {
    // Get the specific canvas element from the HTML document
    canvas = document.getElementById('can');

    // If the browser supports the canvas tag, get the 2d drawing context for this canvas
    if (canvas.getContext)
        ctx = canvas.getContext('2d');

    // Check that we have a valid context to draw on/with before adding event handlers
    if (ctx) {
        // React to touch events on the canvas
        canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false);
    }
}

// returns true if every pixel's uint32 representation is 0 (or "blank")
function isCanvasBlank(canvas) {
    const context = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(

        context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);

    return !pixelBuffer.some(color => color !== 0);
}

function qrCode(image) {
    var typeNumber = 40;
    var errorCorrectionLevel = 'H';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(image);
    qr.make();
    document.getElementById('placeHolder').innerHTML = qr.createImgTag();
}

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image.png");

    // After image has been loaded in memory invoke a callback.
    image.onload = imageLoaded;

    // Image loaded callback.
    function imageLoaded() {

        document.getElementById("video").style.display = "none";
        document.getElementById("startbutton").style.display = "none";

        var width = canvas.width;
        var height = canvas.height;

        // This is what gives us that blocky pixel styling, rather than a blend between pixels.
        canvas.style.cssText = 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
            'image-rendering: -moz-crisp-edges;' + // FireFox
            'image-rendering: -o-crisp-edges;' + // Opera
            'image-rendering: -webkit-crisp-edges;' + // Chrome
            'image-rendering: crisp-edges;' + // Chrome
            'image-rendering: -webkit-optimize-contrast;' + // Safari
            'image-rendering: pixelated; ' + // Future browsers
            '-ms-interpolation-mode: nearest-neighbor;'; // IE

        // Grab the drawing context object. It's what lets us draw on the canvas.
        var context = canvas.getContext('2d');

        // Use nearest-neighbor scaling when images are resized instead of the resizing algorithm to create blur.
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        // We'll be pixelating the image by 80% (20% of original size).
        var percent = 0.2;

        // Calculate the scaled dimensions.
        var scaledWidth = width * percent;
        var scaledHeight = height * percent;

        // Render image smaller.
        context.drawImage(image, 0, 0, scaledWidth, scaledHeight);

        // Stretch the smaller image onto larger context.
        context.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);

        // Append canvas 
        var newnew = document.getElementById("can");
        download(newnew);

        var qr = qrCode(image);
        console.log(qr);
    }

}

function imgcap() {

    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    canvas = document.getElementById("can");

    var width = 600; // We will scale the photo width to this
    var height = 0; // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    // Fill the photo with an indication that none has been
    // captured.

    function clearphoto() {
        var canvas = document.getElementById('can');
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        //var data = canvas.toDataURL('image/png');
        //photo.setAttribute('src', data);

    }

    function startup() {
        video = document.getElementById('video');
        video.style.display = "inline-block";
        canvas = document.getElementById('can');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');
        startbutton.style.display = "inline-block";

        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });

        video.addEventListener('canplay', function(ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        startbutton.addEventListener('click', function(ev) {
            takepicture();
            ev.preventDefault();
        }, false);

        clearphoto();
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
        var canvas = document.getElementById('can');
        var context = canvas.getContext('2d');
        document.getElementById("video").style.display = "none";
        document.getElementById("startbutton").style.display = "none";

        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            console.log("captured");

        } else {
            clearphoto();
        }
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    startup();
}