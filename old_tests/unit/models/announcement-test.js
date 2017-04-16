import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('announcement', 'Announcement', {
  // Specify the other units that are required for this test.
  needs: ['model:bulletin', 'model:group', 'model:post']
});

test('descriptionHtml: converts markdown description into HTML', function(assert) {
  var description = 'this is **markdown**';
  var descriptionHtml = '<p>this is <strong>markdown</strong></p>';
  var model = this.subject({ description: description });

  assert.equal(model.get('descriptionHtml').trim(), descriptionHtml);
});
