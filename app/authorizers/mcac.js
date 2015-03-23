import Ember from 'ember';
import Base from 'simple-auth/authorizers/base';

export default Base.extend({
  authorize: function(jqXHR) {
    var secureData = this.get('session.content');
    if (Ember.isNone(secureData)) {
      return;
    }

    var userToken = secureData['users']['apiKey'];
    var userIdentification = secureData['users']['email'];
    if (this.get('session.isAuthenticated') &&
        !Ember.isEmpty(userToken) &&
        !Ember.isEmpty(userIdentification)) {
      jqXHR.setRequestHeader('X-User-Email', userIdentification);
      jqXHR.setRequestHeader('X-User-Token', userToken);
    }
  }
});
