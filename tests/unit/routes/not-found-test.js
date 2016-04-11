import { moduleFor, test } from 'ember-qunit';

moduleFor('route:not-found', 'Unit | Route | not found', {
  needs: ['service:metrics']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
