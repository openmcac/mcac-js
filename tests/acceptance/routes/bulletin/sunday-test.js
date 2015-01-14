import Ember from 'ember';
import startApp from '../../../helpers/start-app';
import { defineFixture } from 'ic-ajax';

var application;

module('Acceptance: /sunday route', {
  needs: ['model:bulletin'],
  setup: function() {
    defineFixture('/api/v1/sunday', {
      response: {
        "bulletin": {
          "id": 1,
          "publishedAt": "2014-12-21T13:58:27-05:00",
          "name": "Sunday Service",
          "serviceOrder": "This is the service order.",
          "description": "This is a service bulletin.",
          "group": {
            "id": 1,
            "name": "English Service",
            "createdAt": "2014-12-21T13:58:27-05:00"
          },
          "announcements": [
            {
              "id": 1,
              "description": "This is an announcement",
              "bulletinId": 1,
              "postId": 1,
              "position": 1
            }
          ]
        }
      }
    });

    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('it populates controller with model returned from /api/v1/sunday', function() {
  expect(2);
  visit('/sunday');

  andThen(function() {
    var controller = application.__container__.lookup('controller:bulletin/sunday/index');
    var model = controller.model;
    equal(model.get('name'), 'Sunday Service');
    equal(model.get('publishedAt').getTime(),
          new Date('2014-12-21T13:58:27-05:00').getTime());
  });
});
