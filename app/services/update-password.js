import Ember from 'ember';

const UPDATE_PASSWORD_PATH = "/api/auth/password";

export default Ember.Service.extend({
  session: Ember.inject.service(),
  ajax: Ember.inject.service(),
  process(oldPassword, newPassword) {
    return this.get("ajax").
      request(UPDATE_PASSWORD_PATH, buildOptions(this, oldPassword, newPassword));
  },
});

function buildOptions(context, oldPassword, newPassword) {
  const auth = context.get("session.data.authenticated.auth");
  return {
    method: "PUT",
    data: JSON.stringify({
      "password": newPassword,
      "password_confirmation": newPassword,
      "current_password": oldPassword
    }),
    contentType: "application/vnd.api+json",
    headers: {
      "access-token": auth.accessToken,
      client: auth.client,
      uid: auth.uid
    },
    dataType: "json"
  };
}
