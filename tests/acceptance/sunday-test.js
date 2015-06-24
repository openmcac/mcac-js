import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import { test, module } from 'qunit';
import mockServer from '../helpers/server';

var application, server;

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

module('Acceptance: Sunday', {
  beforeEach: function() {
    application = startApp();
    server = mockServer();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /sunday', function(assert) {
  server.get('/api/v1/announcements/:id', function(request) {
    var announcement = {
      "announcements": announcements[request.params.id]
    };
    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(announcement)];
  });

  server.get('/api/v1/sunday', function(request) {
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

  visit('/sunday');

  andThen(function() {
    assert.equal(find('.bulletin-info .name').text(), 'Sunday Service');
    assert.equal(find('audio').length, 0);
    assert.equal(find('.announcements li:nth-child(1)').text().trim(),
                 'This is the first announcement');
    assert.equal(find('.announcements li:nth-child(2)').text().trim(),
                 'This is the second announcement');
    assert.equal(find('.announcements li:nth-child(3)').text().trim(),
                 'This is the third announcement');
  });
});

test('visiting a bulletin with audio', function(assert) {
  server.get('/api/v1/sunday', function(request) {
    var response = {
      "bulletins": {
        "id": "1",
        "audioUrl": "http://example.com/audio.mp3",
        "description": "This is a service bulletin.",
        "name": "Sunday Service",
        "serviceOrder": "This is the service order.",
        "publishedAt": "2014-12-21T13:58:27-05:00",
        "links": {
          "group": "1",
          "announcements": []
        }
      }
    };
    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
  });

  visit('/sunday');

  andThen(function() {
    assert.equal(find('audio').length, 1);
  });
});
