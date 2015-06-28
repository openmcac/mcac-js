import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import mockServer from '../helpers/server';

let application, server;

module('Acceptance: SundayRedirect', {
  needs: ['model:bulletin', 'model:announcement'],
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
    var response = {
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

test('app/index.js redirects root path to /sunday', function(assert) {
  assert.expect(1);

  mockSunday({
    "audio-url": null,
    "banner-url": null,
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "published-at": "2014-12-21T13:58:27-05:00",
    "sermon-notes": null,
    "service-order": "This is the service order."
  });

  visit('/');

  andThen(function() {
    Ember.run.next(function() {
      assert.equal(currentURL(), '/sunday');
    });
  });
});
