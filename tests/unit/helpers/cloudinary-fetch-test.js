import { cloudinaryFetch } from 'mcac/helpers/cloudinary-fetch';
import { module, test } from 'qunit';
import ENV from "mcac/config/environment";

module('Unit | Helper | cloudinary fetch');

// Replace this with your real tests.
test('it works', function(assert) {
  const width = 100;
  const url = "http://www.test.com/image.jpg";
  const args = { width: width, url: url };

  const result = cloudinaryFetch(null, args);
  assert.equal(result, `https://res.cloudinary.com/${ENV.cloudinary.cloudName}/image/fetch/w_${width}/${url}`);
});
