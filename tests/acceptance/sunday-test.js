import AnnouncementPayload from "../helpers/payloads/announcement";
import BulletinPayload from "../helpers/payloads/bulletin";
import Ember from "ember";
import mockServer from "../helpers/server";
import startApp from "../helpers/start-app";
import { test, module } from "qunit";

let application, fakeServer;

module('Acceptance: Sunday', {
  beforeEach: function() {
    application = startApp();
    fakeServer = mockServer();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

function mockSunday(bulletin, withAnnouncements = false) {
  fakeServer.get("/api/v1/sunday", function() {
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

  fakeServer.get("/api/v1/bulletins/1", function() {
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
    fakeServer.get("/api/v1/bulletins/1/announcements", function() {
      return [
        200,
        {"Content-Type": "application/vnd.api+json"},
        JSON.stringify({ "data": [] })
      ];
    });
  }
}

function mockAnnouncements(bulletinId) {
  fakeServer.get(`/api/v1/bulletins/${bulletinId}/announcements`,
      function() {
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
