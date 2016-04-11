import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:post/index', {
  needs: ['service:metrics']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
