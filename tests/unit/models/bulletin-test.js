import Ember from 'ember';

import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('bulletin', 'Bulletin', {
  // Specify the other units that are required for this test.
  needs: ['model:group', 'model:announcement', 'model:post']
});

test('serviceOrderHtml: converts markdown serviceOrder into HTML', function(assert) {
  assert.expect(1);
  var serviceOrder = 'this is **markdown**';
  var serviceOrderHtml = '<p>this is <strong>markdown</strong></p>';
  var group = { slug: 'english-service', name: 'Service' };
  var model = this.subject({ serviceOrder: serviceOrder });

  assert.equal(model.get('serviceOrderHtml').trim(), serviceOrderHtml);
});
