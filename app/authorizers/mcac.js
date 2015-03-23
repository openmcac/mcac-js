import Ember from 'ember';
import Base from 'simple-auth/authorizers/base';

export default Base.extend({
  authorize: function(jqXHR) {
    var user = this.get('session.content.users');
    if (Ember.isNone(user)) {
      return;
    }

    var token = user['apiKey'];
    var email = user['email'];
    if (this.get('session.isAuthenticated') &&
        !Ember.isEmpty(token) &&
        !Ember.isEmpty(email)) {
      jqXHR.setRequestHeader('X-User-Email', email);
      jqXHR.setRequestHeader('X-User-Token', token);
    }
  }
});
