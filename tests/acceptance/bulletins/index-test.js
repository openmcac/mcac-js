import Ember from 'ember';
import startApp from '../../helpers/start-app';
import Pretender from 'pretender';
import { test, module } from 'qunit';
import mockServer from '../../helpers/server';

var application;

var announcements = {
  "1": {
    "id": "1",
    "description": "This is the first announcement",
    "position": 1,
    "links": {
      "bulletin": "1",
      "post": null
    }
  },
  "2": {
    "id": "2",
    "description": "This is the second announcement",
    "position": 2,
    "links": {
      "bulletin": "1",
      "post": null
    }
  },
  "3": {
    "id": "3",
    "description": "This is the third announcement",
    "position": 3,
    "links": {
      "bulletin": "1",
      "post": null
    }
  }
};

module('Acceptance: View bulletin', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /english-service/bulletin/1', function(assert) {
  var server = mockServer();
  server.get('/api/v1/announcements/:id', function(request) {
    var announcement = {
      "announcements": announcements[request.params.id]
    };
    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(announcement)];
  });

  server.get('/api/v1/bulletins/1', function(request) {
    var response = {
      "bulletins": {
        "id": "1",
        "description": "This is a service bulletin.",
        "name": "Sunday Service",
        "serviceOrder": "This is the service order.",
        "publishedAt": "2014-12-21T13:58:27-05:00",
        "links": {
          "group": "1",
          "announcements": ["1", "2", "3"]
        }
      }
    };
    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
  });

  visit('/english-service/bulletins/1');

  andThen(function() {
    assert.equal(find('.bulletin-info .name').text(), 'Sunday Service');
    assert.equal(find('.announcements li:nth-child(1)').text().trim(),
                 'This is the first announcement');
    assert.equal(find('.announcements li:nth-child(2)').text().trim(),
                 'This is the second announcement');
    assert.equal(find('.announcements li:nth-child(3)').text().trim(),
                 'This is the third announcement');
  });
});
