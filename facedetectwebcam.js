const cv = require('opencv4nodejs');
const devicePort = 0;
const wCap = new cv.VideoCapture(devicePort);
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

// loop through the capture
const delay = 10;
let done = false;
while (!done) {
  let frame = wCap.read();
  // loop back to start on end of stream reached
  if (frame.empty) {
    wCap.reset();
    frame = wCap.read();
  }

  // ...

  const grayImg = frame.bgrToGray();
  classifier.detectMultiScaleAsync(grayImg, (err, res) => {
    if (err) {
      return console.error(err);
    }

    const { objects, numDetections } = res;
    //...
    console.log(numDetections);
  });
  cv.imshow('webcam capture', frame);
  const key = cv.waitKey(delay);
  done = key === 27; //escape key
}
