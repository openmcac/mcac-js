import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:group/index', 'Unit | Controller | group/index', {
  needs: ['service:metrics', 'service:router-scroll']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
