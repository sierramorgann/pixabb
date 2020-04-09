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
}

// Clear the canvas context using the canvas width and height
function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    location.reload();
}

function download(canvas) {
    var blank = isCanvasBlank(canvas);

    if (blank != true) {
        var url = canvas.toDataURL("image/png");
        var link = document.getElementById('link');
        link.innerHTML = '<button>Download Image</button>';
        link.href = url;
        link.download = "littleBits.acnl";
        link.className = "link";
    } else {
        console.log("canvas is blank")
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
    var blank = isCanvasBlank(canvas);

    if (blank != true) { 
        var typeNumber = 40;
        var errorCorrectionLevel = 'H';
        var qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(image);
        qr.make();
        document.getElementById('placeHolder').innerHTML = qr.createImgTag();
    } else {
        document.getElementById('placeHolder').innerHTML = "Canvas is blank."
    }
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

        // We'll be pixelating the image by 95% (5% of original size).
        var percent = 0.05;

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