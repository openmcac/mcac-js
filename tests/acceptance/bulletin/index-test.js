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
    "url": "http://nba.com",
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
    // bulletin name is displayed
    assert.equal(find('.bulletin-info .name').text(), 'Sunday Service');

    // announcement descriptions are displayed
    assert.equal(find('.announcements li:nth-child(1) .announcement').text().trim(),
                 'This is the first announcement');
    assert.equal(find('.announcements li:nth-child(2) .announcement').text().trim(),
                 'This is the second announcement');
    assert.equal(find('.announcements li:nth-child(3) .announcement').text().trim(),
                 'This is the third announcement');

    // announcement external link placeholders are not rendered if they do
    // not have external links
    assert.equal(find('.announcements li:nth-child(1) .external-link').length, 0);
    assert.equal(find('.announcements li:nth-child(3) .external-link').length, 0);

    // announcement external links are rendered when present
    assert.equal(find('.announcements li:nth-child(2) .external-link').attr('href'),
                 'http://nba.com');

    assert.equal(find(".sermon-notes .no-notes").length, 1);
  });
});

test("when there are sermon notes", function(assert) {
  var server = mockServer();

  server.get("/api/v1/bulletins/1", function(request) {
    var response = {
      "bulletins": {
        "id": "1",
        "description": "This is a service bulletin.",
        "name": "Sunday Service",
        "serviceOrder": "This is the service order.",
        "publishedAt": "2014-12-21T13:58:27-05:00",
        "sermonNotes": "Here are sermon notes",
        "links": {
          "group": "1",
          "announcements": []
        }
      }
    };
    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
  });

  visit("/english-service/bulletins/1");

  andThen(function() {
    assert.equal(find(".sermon-notes .no-notes").length, 0);
  });
});
