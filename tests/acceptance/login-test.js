import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import { module, test } from 'qunit';

var application;

module('Acceptance: Login', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /login', function(assert) {
  visit('/login');

  Ember.run(function() {
    var server = new Pretender(function() {
      this.post('/api/users/sign_in', function(request) {
        var body = JSON.parse(request.requestBody);

        if (body.user.email !== 'test@example.com' ||
            body.user.password !== 'loginpass') {
          return;
        }

        var response = {
          users: {
            email: 'test@example.com',
            apiKey: 'myapikey'
          }
        };

        return [
          200,
          {"Content-Type": "application/vnd.api+json"},
          JSON.stringify(response)
        ];
      });

      this.get('/api/v1/sunday', function(request) {
        var response = {
          bulletins: {
            "id": 1,
            "publishedAt": "2014-12-21T13:58:27-05:00",
            "name": "Sunday Service",
            "serviceOrder": "This is the service order.",
            "description": "This is a service bulletin.",
            "links": {
              "group": "1",
              "announcements": []
            }
          }
        };

        return [
          200,
          {"Content-Type": "application/vnd.api+json"},
          JSON.stringify(response)
        ];
      });
    });
  });

  fillIn('.email', 'test@example.com');
  fillIn('.password', 'loginpass');
  click('.submit');

  andThen(function() {
    assert.equal(currentURL(), '/sunday');
  });
});
