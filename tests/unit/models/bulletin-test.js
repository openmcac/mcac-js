import Ember from 'ember';

import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('bulletin', 'Bulletin', {
  // Specify the other units that are required for this test.
  needs: []
});

test('serviceOrderHtml: converts markdown serviceOrder into HTML', function() {
  expect(1);

  var serviceOrder = '<div>this is markdown</div>';
  var serviceOrderHtml = 'fake service order rendered in html';
  var model = this.subject({ serviceOrder: serviceOrder });

  window.marked = function(markdown) {
    return serviceOrderHtml;
  };

  equal(serviceOrderHtml, model.get('serviceOrderHtml'));
});
