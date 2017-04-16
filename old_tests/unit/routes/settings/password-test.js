import { moduleFor, test } from 'ember-qunit';

moduleFor('route:settings/password', 'Unit | Route | settings/password', {
  needs: ['service:metrics', 'service:router-scroll']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
