import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore: function(properties) {
    var propertiesObject = Ember.Object.create(properties);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(propertiesObject.get('users.apiKey')) &&
          !Ember.isEmpty(propertiesObject.get('users.email'))) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },
  authenticate: function(credentials) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data = {
        user: {
          password: credentials.password,
          email: credentials.email
        }
      };

      makeRequest(data).then(function(response) {
        Ember.run(function() {
          resolve(response);
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
    url: '/api/users/sign_in',
    type: 'POST',
    data: JSON.stringify(data),
    dataType: 'json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    }
  });
}
