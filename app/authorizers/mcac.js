import Ember from 'ember';
import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
  session: Ember.inject.service("session"),
  authorize(sessionData, block) {
    let user = sessionData.data.attributes;
    let session = this.get("session");

    if (sessionData.auth) {
      session.set("auth", sessionData.auth);
    }

    if (Ember.isNone(user)) {
      return;
    }

    let auth = session.get("auth");

    let token = auth.accessToken;
    let email = user.email;
    let clientId = auth.client;
    if (!Ember.isEmpty(token) && !Ember.isEmpty(email)) {
      block('access-token', token);
      block('client', clientId);
      block('uid', email);
    }
  }
});
