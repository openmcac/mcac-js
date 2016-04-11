import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:bulletin/edit', 'BulletinEditRoute', {
  needs: ['service:metrics']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
