import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('group', 'Group', {
  // Specify the other units that are required for this test.
  needs: ['model:bulletin', 'model:announcement']
});

test('it stores the expected attributes', function() {
  expect(2);

  var model = this.subject({
    name: 'Test Group',
    slug: 'test-group'
  });

  equal(model.get('name'), 'Test Group');
  equal(model.get('slug'), 'test-group');
});
