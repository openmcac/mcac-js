import AnnouncementPayload from "../helpers/payloads/announcement";
import BulletinPayload from "../helpers/payloads/bulletin";
import Ember from "ember";
import Pretender from "pretender";
import mockServer from "../helpers/server";
import startApp from "../helpers/start-app";
import { test, module } from "qunit";

let application, server;

module('Acceptance: Sunday', {
  beforeEach: function() {
    application = startApp();
    server = mockServer();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

function mockSunday(bulletin, withAnnouncements = false) {
  server.get("/api/v1/sunday", function(request) {
    let response = {
      "data": BulletinPayload.build(1, bulletin, {
        withAnnouncements: withAnnouncements
      })
    };

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  server.get("/api/v1/bulletins/1", function(request) {
    let response = {
      "data": BulletinPayload.build(1, bulletin, {
        withAnnouncements: withAnnouncements
      })
    };

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  if (!withAnnouncements) {
    server.get("/api/v1/bulletins/1/announcements", function(request) {
      return [
        200,
        {"Content-Type": "application/vnd.api+json"},
        JSON.stringify({ "data": [] })
      ];
    });
  }
}

function mockAnnouncements(bulletinId) {
  server.get(`/api/v1/bulletins/${bulletinId}/announcements`,
      function(request) {
    let response = {
      "data": [
        AnnouncementPayload.build("1", bulletinId, {
          "description": "This is the first announcement",
          "position": 1
        }),
        AnnouncementPayload.build("2", bulletinId, {
          "description": "This is the second announcement",
          "position": 2
        }),
        AnnouncementPayload.build("3", bulletinId, {
          "description": "This is the third announcement",
          "position": 3
        })
      ]
    };

    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(response)
    ];
  });
}

test('visiting /sunday', function(assert) {
  mockSunday({
    "audio-url": null,
    "banner-url": null,
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "published-at": "2014-12-21T13:58:27-05:00",
    "sermon-notes": null,
    "service-order": "This is the service order."
  }, true);

  mockAnnouncements("1");

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
  mockSunday({
    "audio-url": "http://example.com/audio.mp3",
    "banner-url": null,
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "published-at": "2014-12-21T13:58:27-05:00",
    "sermon-notes": null,
    "service-order": "This is the service order."
  });

  visit('/sunday');

  andThen(function() {
    assert.equal(find('audio').length, 1);
  });
});
