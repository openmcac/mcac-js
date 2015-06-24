import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import mockServer from '../helpers/server';

var application;

module('Acceptance: SundayRedirect', {
  needs: ['model:bulletin', 'model:announcement'],
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('app/index.js redirects root path to /sunday', function(assert) {
  assert.expect(1);

  var server = mockServer();
  server.get('/api/v1/sunday', function(request) {
    var response = {
      "bulletins": {
        "id": "1",
        "description": "This is a service bulletin.",
        "name": "Sunday Service",
        "serviceOrder": "This is the service order.",
        "publishedAt": "2015-03-07T03:58:40+00:00",
        "links": {
          "group": "1",
          "announcements": []
        }
      }
    };
    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
  });

  visit('/');

  andThen(function() {
    Ember.run.next(function() {
      assert.equal(currentURL(), '/sunday');
    });
  });
});
