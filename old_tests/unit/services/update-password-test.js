import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:update-password', 'Unit | Service | update password', {
});

test("it makes a request to update password", function(assert) {
  assert.expect(3);

  const accessToken = "dummy-access-token";
  const client = "dummy-client";
  const uid = "dummy-uid";
  const sessionService = Ember.Object.create({
    data: {
      authenticated: {
        auth: {
          accessToken: accessToken,
          client: client,
          uid: uid
        }
      }
    }
  });
  const newPassword = "newpassword";
  const oldPassword = "oldpassword";

  const expectedOptions = {
    method: "PUT",
    data: JSON.stringify({
      "password": newPassword,
      "password_confirmation": newPassword,
      "current_password": oldPassword
    }),
    contentType: "application/vnd.api+json",
    headers: {
      "access-token": accessToken,
      client: client,
      uid: uid
    },
    dataType: "json"
  };

  const promise = new Ember.RSVP.Promise(function() {});
  const service = this.subject();
  service.set("session", sessionService);
  service.set("ajax", {
    request(path, options) {
      assert.equal(path, "/api/auth/password");
      assert.deepEqual(options, expectedOptions);
      return promise;
    }
  });

  assert.deepEqual(service.process(oldPassword, newPassword), promise);
});
