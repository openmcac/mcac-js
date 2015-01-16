import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('group', 'Group', {
  // Specify the other units that are required for this test.
  needs: ['model:bulletin']
});

test('it stores the group name', function() {
  var model = this.subject({ name: 'Test Group' });
  equal(model.get('name'), 'Test Group');
});
