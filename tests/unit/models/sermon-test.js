import { moduleForModel, test } from 'ember-qunit';

moduleForModel('sermon', 'Unit | Model | sermon', {
  // Specify the other units that are required for this test.
  needs: ["model:group"]
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});