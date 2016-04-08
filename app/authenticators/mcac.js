import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.auth["accessToken"]) &&
          !Ember.isEmpty(properties.auth["client"]) &&
          !Ember.isEmpty(properties.auth["uid"])) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },
  authenticate: function(credentials) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data = {
        password: credentials.password,
        email: credentials.email
      };

      makeRequest(data).then(function(sessionData, statusCode, response) {
        Ember.run(function() {
          sessionData.auth = {
            accessToken: response.getResponseHeader("access-token"),
            client: response.getResponseHeader("client"),
            uid: response.getResponseHeader("uid")
          };
          resolve(sessionData);
        });
      }, function(xhr) {
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    });
  },
  invalidate: function() {
    return Ember.RSVP.resolve();
  }
});

function makeRequest(data) {
  return Ember.$.ajax({
    url: '/api/auth/sign_in',
    type: 'POST',
    data: JSON.stringify(data),
    dataType: 'json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    }
  });
}
