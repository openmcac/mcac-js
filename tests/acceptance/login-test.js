import Ember from 'ember';
import startApp from '../helpers/start-app';
import mockServer from '../helpers/server';
import Pretender from 'pretender';
import { module, test } from 'qunit';

var application, server;

module('Acceptance: Login', {
  beforeEach: function() {
    application = startApp();
    server = createServer();
  },
  afterEach: function() {
    server.shutdown();
    Ember.run(application, 'destroy');
  }
});

function createServer() {
  var server = mockServer();
  server.post('/api/users/sign_in', function(request) {
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

  server.get('/api/v1/sunday', function(request) {
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

  return server;
}

test('logging in by pressing enter on the email field', function(assert) {
  assert.expect(1);
  visit('/login');

  fillIn('.email', 'test@example.com');
  fillIn('.password', 'loginpass');
  keyEvent('.email', 'keyup', 13);

  andThen(function() {
    assert.equal(currentURL(), '/sunday');
  });
});

test('logging in by clicking the submit button', function(assert) {
  visit('/login');

  fillIn('.email', 'test@example.com');
  fillIn('.password', 'loginpass');
  click('.submit');

  andThen(function() {
    assert.equal(currentURL(), '/sunday');
  });
});
