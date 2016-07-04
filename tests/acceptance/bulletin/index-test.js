import Ember from "ember";
import startApp from "../../helpers/start-app";
import { test, module } from "qunit";
import page from "mcac/tests/pages/bulletin-index";

let application;

module('Acceptance: View bulletin', {
  beforeEach: () => application = startApp(),
  afterEach: () => Ember.run(application, 'destroy')
});

test('visiting /english-service/bulletin/1', function(assert) {
  const bulletin = server.create("bulletin", {
    group: server.create("group", { slug: "english-service" }),
    name: "Sunday Service",
    "published-at": Date.parse("2014-12-21T13:58:27-05:00"),
    "service-order": "This is the service order."
  });

  page.visit({ groupSlug: bulletin.group.slug, id: bulletin.id });

  andThen(function() {
    assertBulletinCover(page, bulletin, assert);
    assert.equal(page.bulletin.serviceOrder, bulletin["service-order"]);
    assert.ok(page.bulletin.announcements.noAnnouncementsIndicatorShown());
    assert.ok(page.bulletin.sermonNotes.noNotesIndicatorShown());
  });
});

test("when there are announcements", function(assert) {
  const bulletin = server.create("bulletin", {
    group: server.create("group", { slug: "english-service" }),
    "sermon-notes": "Here are sermon notes"
  });

  const announcements = [
    server.create("announcement", { url: "" }),
    server.create("announcement"),
    server.create("announcement", { url: "" })
  ];

  mockAnnouncementsForBulletinId(assert, server, bulletin.id, announcements);

  page.visit({ groupSlug: bulletin.group.slug, id: bulletin.id });

  andThen(function() {
    assertAnnouncements(page, announcements, assert);
  });
});

test("when there are sermon notes", function(assert) {
  const bulletin = server.create("bulletin", {
    "group": server.create("group", { slug: "english-service" }),
    "sermon-notes": "Here are sermon notes"
  });

  page.visit({ groupSlug: bulletin.group.slug, id: bulletin.id });

  andThen(function() {
    assert.notOk(page.bulletin.sermonNotes.noNotesIndicatorShown());
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

function assertBulletinCover(page, bulletin, assert) {
  assert.equal(page.bulletin.cover.name, bulletin.name);
  assert.equal(page.bulletin.cover.publishedAt, "December 21st 2014, 1:58 pm");
  // TODO test sermon title and sermon audio
}

function assertAnnouncements(page, announcements, assert) {
  assert.equal(page.bulletin.announcements.title, "Announcements");
  assert.equal(page.bulletin.announcements.announcements().count, announcements.length);
  assert.equal(page.bulletin.announcements.announcements(0).description,
               announcements[0]["description"]);
  assert.equal(page.bulletin.announcements.announcements(1).description,
               announcements[1]["description"]);
  assert.equal(page.bulletin.announcements.announcements(2).description,
               announcements[2]["description"]);
  assert.notOk(page.bulletin.announcements.noAnnouncementsIndicatorShown());
}
