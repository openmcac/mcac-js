import Ember from 'ember';
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

var application;

var englishService = {
  "id": "1",
  "name": "English Service",
  "slug": "english-service",
  "createdAt": "2015-03-07T03:58:39+00:00"
};

var groups = { "groups": [englishService] };

module('Acceptance: SundayRedirect', {
  needs: ['model:bulletin', 'model:announcement'],
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('app/index.js redirects root path to /sunday', function() {
  expect(1);

  Ember.run(function() {
    var server = new Pretender(function() {
      this.get('/api/v1/groups', function(request) {
        var all = JSON.stringify(groups);
        return [200, {"Content-Type": "application/vnd.api+json"}, all];
      });

      this.get('/api/v1/sunday', function(request) {
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
    });
  });

  visit('/');

  andThen(function() {
    Ember.run.next(function() {
      equal(currentURL(), '/sunday');
    });
  });
});
