import Ember from 'ember';
import startApp from '../../helpers/start-app';
import Pretender from 'pretender';
import { test, module } from 'qunit';
import mockServer from '../../helpers/server';

let application, server;

function mockBulletin(bulletin, withAnnouncements = false) {
  server.get("/api/v1/bulletins/1", function(request) {
    let response = {
      "data": {
        attributes: bulletin,
        "id": "1",
        "links": {
          "self": "/api/v1/bulletins/1"
        },
        "relationships": {
          "announcements": {
            "links": {
              "related": "/api/v1/bulletins/1/announcements",
              "self": "/api/v1/bulletins/1/relationships/announcements"
            }
          },
          "group": {
            "data": { "type": "groups", "id": "1" },
            "links": {
              "related": "/api/v1/bulletins/1/group",
              "self": "/api/v1/bulletins/1/relationships/group"
            }
          }
        },
        "type": "bulletins"
      }
    };

    if (!withAnnouncements) {
      response.data.relationships.announcements["data"] = null;
      server.get("/api/v1/bulletins/1/announcements", function(request) {
        return [
          200,
          {"Content-Type": "application/vnd.api+json"},
          JSON.stringify({ "data": [] })
        ];
      });
    }

    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
  });
}

function announcementPayload(bulletinId, announcementId, announcement) {
  return {
    "attributes": announcement,
    "id": announcementId,
    "links": {
      "self": `/api/v1/announcements/${announcementId}`
    },
    "relationships": {
      "bulletin": {
        "data": { "type": "bulletin", "id": `${bulletinId}` },
        "links": {
          "related": `/api/v1/announcements/${announcementId}/bulletin`,
          "self": `/api/v1/announcements/${announcementId}/relationships/bulletin`
        }
      },
      "post": {
        "data": null,
        "links": {
          "related": `/api/v1/announcements/${announcementId}/post`,
          "self": `/api/v1/announcements/${announcementId}/relationships/post`
        }
      }
    },
    "type": "announcements"
  };
}

function mockAnnouncements(bulletinId) {
  server.get(`/api/v1/bulletins/${bulletinId}/announcements`,
      function(request) {
    let response = {
      "data": [
        announcementPayload(bulletinId, "1", {
          "description": "This is the first announcement",
          "position": 1
        }),
        announcementPayload(bulletinId, "2", {
          "url": "http://nba.com",
          "description": "This is the second announcement",
          "position": 2
        }),
        announcementPayload(bulletinId, "3", {
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

module('Acceptance: View bulletin', {
  beforeEach: function() {
    application = startApp();
    server = mockServer();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /english-service/bulletin/1', function(assert) {
  mockBulletin({
    "audio-url": null,
    "banner-url": null,
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "published-at": "2014-12-21T13:58:27-05:00",
    "sermon-notes": null,
    "service-order": "This is the service order.",
  }, true);

  mockAnnouncements("1");

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
    assert.equal(find('.announcements li:nth-child(2) .external-link a').attr('href'),
                 'http://nba.com');

    assert.equal(find(".sermon-notes .no-notes").length, 1);
  });
});

test("when there are sermon notes", function(assert) {
  mockBulletin({
    "audio-url": null,
    "banner-url": null,
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "published-at": "2014-12-21T13:58:27-05:00",
    "sermon-notes": "Here are sermon notes",
    "service-order": "This is the service order.",
  });

  visit("/english-service/bulletins/1");

  andThen(function() {
    assert.equal(find(".bulletin-info .name").text(), "Sunday Service");
    assert.equal(find(".sermon-notes .no-notes").length, 0);
  });
});
