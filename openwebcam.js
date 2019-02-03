const cv = require('opencv4nodejs');

const devicePort = 0;
const wCap = new cv.VideoCapture(devicePort);

// const frame = wCap.read();
// wCap.readAsync((err, frame) => {
//   cv.imshow('webcam capture', frame);
//   cv.waitKey();
// });

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
  cv.imshow('webcam capture', frame);

  const key = cv.waitKey(delay);
  done = key === 27; //escape key
}
