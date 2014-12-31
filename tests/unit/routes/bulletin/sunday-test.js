import Ember from 'ember';

import {
  moduleFor,
  test
} from 'ember-qunit';

import { defineFixture } from 'ic-ajax';

moduleFor('route:bulletin/sunday', 'BulletinSundayRoute', {
  // Specify the other units that are required for this test.
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
  }
});

test('it returns the normalized sunday bulletin', function() {
  expect(5);

  var container = new Ember.Container();
  container.register('store:main', DS.Store);

  var store = container.lookup('store:main');

  var route = this.subject();
  route.store = {
    normalize: function(modelName, model) {
      equal('bulletin', modelName);
      equal('Sunday Service', model.name);
      model.name = 'Normalized ' + model.name;
      return model;
    },
    push: function(modelName, model) {
      equal('bulletin', modelName);
      equal('Normalized Sunday Service', model.name);
      return model;
    }
  };

  route.model().then(function(bulletin) {
    equal('Normalized Sunday Service', bulletin.name);
  });
});
