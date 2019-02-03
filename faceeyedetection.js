const cv = require('opencv4nodejs');

const { drawBlueRect, drawGreenRect } = require('./commons');

const image = cv.imread(getDataFilePath('Lenna.png')); //use webcam

const faceClassifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);
const eyeClassifier = new cv.CascadeClassifier(cv.HAAR_EYE);

// detect faces
const faceResult = faceClassifier.detectMultiScale(image.bgrToGray());

getFaceEye = () => {
  if (!faceResult.objects.length) {
    throw new Error('No faces detected!');
  }

  const sortByNumDetections = result =>
    result.numDetections
      .map((num, idx) => ({ num, idx }))
      .sort((n0, n1) => n1.num - n0.num)
      .map(({ idx }) => idx);

  // get best result
  const faceRect = faceResult.objects[sortByNumDetections(faceResult)[0]];
  console.log('faceRects:', faceResult.objects);
  console.log('confidences:', faceResult.numDetections);

  // detect eyes
  const faceRegion = image.getRegion(faceRect);
  const eyeResult = eyeClassifier.detectMultiScale(faceRegion);
  console.log('eyeRects:', eyeResult.objects);
  console.log('confidences:', eyeResult.numDetections);

  // get best result
  const eyeRects = sortByNumDetections(eyeResult)
    .slice(0, 2)
    .map(idx => eyeResult.objects[idx]);

  // draw face detection
  drawBlueRect(image, faceRect);

  // draw eyes detection in face region
  eyeRects.forEach(eyeRect => drawGreenRect(faceRegion, eyeRect));

  cv.imshowWait('face detection', image);
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
