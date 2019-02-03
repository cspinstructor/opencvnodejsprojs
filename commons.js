const cv = require('opencv4nodejs');

const grabFrames = (videoFile, delay, onFrame) => {
  const cap = new cv.VideoCapture(videoFile);
  let done = false;
  const intvl = setInterval(() => {
    let frame = cap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
      cap.reset();
      frame = cap.read();
    }
    onFrame(frame);

    const key = cv.waitKey(delay);
    done = key !== -1 && key !== 255;
    if (done) {
      clearInterval(intvl);
      console.log('Key pressed, exiting.');
    }
  }, 0);
};

runVideoFaceDetection = (src, detectFaces) =>
  grabFrames(src, 1, frame => {
    console.time('detection time');
    const frameResized = frame.resizeToMax(800);

    // detect faces
    const faceRects = detectFaces(frameResized);
    if (faceRects.length) {
      // draw detection
      faceRects.forEach(faceRect => drawBlueRect(frameResized, faceRect));
    }

    cv.imshow('face detection', frameResized);
    console.timeEnd('detection time');
  });

const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
  image.drawRectangle(rect, color, opts.thickness, cv.LINE_8);

drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(255, 0, 0), opts);
drawGreenRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 255, 0), opts);
drawRedRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 0, 255), opts);

module.exports = {
  runVideoFaceDetection,
  drawBlueRect,
  drawGreenRect,
  drawRedRect
};
