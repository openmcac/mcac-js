import Ember from "ember";
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:settings/password', 'Unit | Controller | settings/password', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it clears form after updating password', function(assert) {
  assert.expect(5);

  const controller = this.subject();
  const oldPassword = "old-password";
  const newPassword = "new-password";
  const updatePasswordService = {
    process() {
      assert.equal(arguments[0], oldPassword);
      assert.equal(arguments[1], newPassword);
      return new Ember.RSVP.Promise(function(resolve) {
        resolve(true);
      });
    }
  };

  controller.set("updatePasswordService", updatePasswordService);
  controller.set("notify", {
    success() {}
  });

  controller.set("model", Ember.Object.create({
    currentPassword: oldPassword,
    password: newPassword
  }));

  Ember.run(() => {
    controller.send("updatePassword");
  });

  assert.equal(controller.get("model.password"), "");
  assert.equal(controller.get("model.passwordConfirmation"), "");
  assert.equal(controller.get("model.currentPassword"), "");
});
