import Ember from 'ember';
import SaveBulletinControllerMixin from 'mcac/mixins/save-bulletin-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | save bulletin controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let SaveBulletinControllerObject = Ember.Object.extend(SaveBulletinControllerMixin);
  let subject = SaveBulletinControllerObject.create();
  assert.ok(subject);
});
