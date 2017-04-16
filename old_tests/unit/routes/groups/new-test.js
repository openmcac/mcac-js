import { moduleFor, test } from 'ember-qunit';

moduleFor('route:groups/new', 'Unit | Route | groups/new', {
  needs: ['service:metrics', 'service:router-scroll']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
