import Ember from 'ember';
import startApp from '../helpers/start-app';
import mockServer from '../helpers/server';
import Pretender from 'pretender';
import { module, test } from 'qunit';
import UserPayload from "../helpers/payloads/user";
import BulletinPayload from "../helpers/payloads/bulletin";

var application, fakeServer;

module('Acceptance: Login', {
  beforeEach: function() {
    application = startApp();
    fakeServer = createServer();
  },
  afterEach: function() {
    fakeServer.shutdown();
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

    let response = {
      "data": UserPayload.build("1", {
        "email": 'test@example.com',
        "api-key": 'myapikey'
      })
    };

    return [
      201,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(response)
    ];
  });

  server.get('/api/v1/bulletins/1', function(request) {
    var response = {
      "data": BulletinPayload.build("1", {
        "published-at": "2014-12-21T13:58:27-05:00",
        "name": "Sunday Service",
        "service-order": "This is the service order.",
        "description": "This is a service bulletin."
      })
    };

    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(response)
    ];
  });

  server.get('/api/v1/sunday', function(request) {
    var response = {
      "data": BulletinPayload.build("1", {
        "published-at": "2014-12-21T13:58:27-05:00",
        "name": "Sunday Service",
        "service-order": "This is the service order.",
        "description": "This is a service bulletin."
      })
    };

    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(response)
    ];
  });

  server.get("/api/v1/bulletins/:id/announcements", function(request) {
    let response = { "data": [] };

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
