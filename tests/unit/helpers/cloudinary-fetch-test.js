import { cloudinaryFetch } from 'mcac/helpers/cloudinary-fetch';
import { module, test } from 'qunit';
import ENV from "mcac/config/environment";

module('Unit | Helper | cloudinary fetch');

test('width: it sets the width of the thumbnail', function(assert) {
  const width = 100;
  const url = "http://www.test.com/image.jpg";
  const args = { width: width, url: url };

  const result = cloudinaryFetch(null, args);
  assert.equal(result, `https://res.cloudinary.com/${ENV.cloudinary.cloudName}/image/fetch/w_${width}/${url}`);
});

test('radius: it sets the corner radius of the thumbnail', function(assert) {
  const radius = 100;
  const url = "http://www.test.com/image.jpg";
  const args = { radius: radius, url: url };

  const result = cloudinaryFetch(null, args);
  assert.equal(result, `https://res.cloudinary.com/${ENV.cloudinary.cloudName}/image/fetch/r_${radius}/${url}`);
});

test('crop: it sets the crop style of the thumbnail', function(assert) {
  const url = "http://www.test.com/image.jpg";
  const args = { crop: "fill", url: url };

  const result = cloudinaryFetch(null, args);
  assert.equal(result, `https://res.cloudinary.com/${ENV.cloudinary.cloudName}/image/fetch/c_fill/${url}`);
});

test('height: it sets the height of the thumbnail', function(assert) {
  const height = 100;
  const url = "http://www.test.com/image.jpg";
  const args = { height: height, url: url };

  const result = cloudinaryFetch(null, args);
  assert.equal(result, `https://res.cloudinary.com/${ENV.cloudinary.cloudName}/image/fetch/h_${height}/${url}`);
});

test('mixed options: it merges all the supported options', function(assert) {
  const url = "http://www.test.com/image.jpg";
  const args = { width: 4, radius: 10, url: url };

  const result = cloudinaryFetch(null, args);
  assert.equal(result, `https://res.cloudinary.com/${ENV.cloudinary.cloudName}/image/fetch/r_10,w_4/${url}`);
});
