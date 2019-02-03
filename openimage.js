const cv = require('opencv4nodejs');

const mat = cv.imread('./images/paul.jpeg');

cv.imshow('Paul image', mat);
cv.waitKey();
