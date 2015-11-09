import Ember from 'ember';
import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
  authorize: function(jqXHR) {
    var user = this.get('session.content.data.attributes');
    if (Ember.isNone(user)) {
      return;
    }

    var token = user["api-key"];
    var email = user["email"];
    if (this.get('session.isAuthenticated') &&
        !Ember.isEmpty(token) &&
        !Ember.isEmpty(email)) {
      jqXHR.setRequestHeader('X-User-Email', email);
      jqXHR.setRequestHeader('X-User-Token', token);
    }
  }
});
