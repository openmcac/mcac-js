import { moduleForModel, test } from "ember-qunit";

moduleForModel('bulletin', 'Bulletin', {
  // Specify the other units that are required for this test.
  needs: ['model:group', 'model:announcement', 'model:post', 'model:sermon']
});

test('serviceOrderHtml: converts markdown serviceOrder into HTML', function(assert) {
  assert.expect(1);
  var serviceOrder = 'this is **markdown**';
  var serviceOrderHtml = '<p>this is <strong>markdown</strong></p>';
  var model = this.subject({ serviceOrder: serviceOrder });

  assert.equal(model.get('serviceOrderHtml').trim(), serviceOrderHtml);
});

test('serviceOrderHtml: returns empty string when serviceOrder == null',
     function(assert) {
  assert.expect(1);
  var model = this.subject({ serviceOrder: null });
  assert.equal(model.get('serviceOrderHtml').trim(), "");
});
