import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:login', 'LoginController', {
  needs: ['service:metrics', 'service:router-scroll']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var controller = this.subject();
  assert.ok(controller);
});