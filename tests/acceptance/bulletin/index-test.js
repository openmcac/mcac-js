import Ember from "ember";
import startApp from "../../helpers/start-app";
import { test, module } from "qunit";

let application;

module('Acceptance: View bulletin', {
  beforeEach: () => application = startApp(),
  afterEach: () => Ember.run(application, 'destroy')
});

test('visiting /english-service/bulletin/1', function(assert) {
  const bulletin = server.create("bulletin", {
    name: "Sunday Service",
    "published-at": Date.parse("2014-12-21T13:58:27-05:00"),
    "service-order": "This is the service order.",
    "group": server.create("group", { slug: "english-service" })
  });

  const announcements = [
    server.create("announcement", { url: "" }),
    server.create("announcement"),
    server.create("announcement", { url: "" })
  ];

  mockAnnouncementsForBulletinId(assert, server, bulletin.id, announcements);

  visit(`/english-service/bulletins/${bulletin.id}`);

  andThen(function() {
    // bulletin name is displayed
    assert.equal(find('.bulletin-info .name').text().trim(), 'Sunday Service');

    // announcement descriptions are displayed
    assert.equal(find('.announcements li:nth-child(1) .announcement').text().trim(),
                 announcements[0].description);
    assert.equal(find('.announcements li:nth-child(2) .announcement').text().trim(),
                 announcements[1].description);
    assert.equal(find('.announcements li:nth-child(3) .announcement').text().trim(),
                 announcements[2].description);

    // announcement external link placeholders are not rendered if they do
    // not have external links
    assert.equal(find('.announcements li:nth-child(1) .external-link').length, 0);
    assert.equal(find('.announcements li:nth-child(3) .external-link').length, 0);

    // announcement external links are rendered when present
    assert.equal(find('.announcements li:nth-child(2) .external-link a').attr('href'),
                 announcements[1].url);

    assert.equal(find(".sermon-notes .no-notes").length, 1);
  });
});

test("when there are sermon notes", function(assert) {
  const bulletin = server.create("bulletin", {
    name: "Sunday Service",
    "published-at": Date.parse("2014-12-21T13:58:27-05:00"),
    "service-order": "This is the service order.",
    "group": server.create("group", { slug: "english-service" }),
    "sermon-notes": "Here are sermon notes"
  });

  const announcements = [
    server.create("announcement", { url: "" }),
    server.create("announcement"),
    server.create("announcement", { url: "" })
  ];

  mockAnnouncementsForBulletinId(assert, server, bulletin.id, announcements);

  visit(`/english-service/bulletins/${bulletin.id}`);

  andThen(function() {
    assert.equal(find(".bulletin-info .name").text().trim(), "Sunday Service");
    assert.equal(find(".sermon-notes .no-notes").length, 0);
  });
});

function mockAnnouncementsForBulletinId(assert, server, bulletinId, announcements) {
  const done = assert.async();

  server.get("/api/v1/bulletins/:bulletinId/announcements", (db, request) => {
    assert.equal(request.params.bulletinId, `${bulletinId}`);
    done();

    return {
      data: announcements.map(attrs => ({
        type: "announcements",
        id: attrs.id,
        attributes: attrs,
        relationships: {
          groups: {
            links: {
              self: `/api/v1/announcements/${attrs.id}/relationships/bulletin`,
              related: `/api/v1/announcements/${attrs.id}/bulletin`
            }
          }
        }
      }))
    };
  });
}
