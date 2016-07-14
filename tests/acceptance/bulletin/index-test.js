import Ember from "ember";
import { test, module } from "qunit";
import startApp from "../../helpers/start-app";
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
    group: server.create("group", { slug: "english-service" })
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

test("when there is a sermon", function(assert) {
  const sermon = server.create("sermon");
  const bulletin = server.create("bulletin", {
    group: server.create("group", { slug: "english-service" })
  });

  mockSermonForBulletinId(assert, server, bulletin.id, sermon);

  page.visit({ groupSlug: bulletin.group.slug, id: bulletin.id });

  andThen(function() {
    assert.notOk(page.bulletin.sermonNotes.noNotesIndicatorShown());
    assert.equal(page.bulletin.sermonNotes.notes, sermon.notes);
    assert.equal(page.bulletin.cover.sermonAudioUrl(), sermon["audio-url"]);
    assert.equal(page.bulletin.cover.sermonName, sermon.name);
  });
});

function mockSermonForBulletinId(assert, server, bulletinId, sermon) {
  server.get("/api/v1/bulletins/:bulletinId/sermon", (db, request) => {
    assert.equal(request.params.bulletinId, `${bulletinId}`);

    return {
      data: {
        type: "sermons",
        id: sermon.id,
        attributes: sermon,
        relationships: {
          groups: {
            links: {
              self: `/api/v1/sermons/${sermon.id}/relationships/bulletin`,
              related: `/api/v1/sermons/${sermon.id}/bulletin`
            }
          }
        }
      }
    };
  });
}

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
  equalDate(assert, page.bulletin.cover.publishedAt, bulletin["published-at"]);
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

function equalDate(assert, actual, expected) {
  const actualDate = window.moment(actual, "MMMM Do YYYY, h:mm a").toDate();
  const expectedDate = window.moment(expected).toDate();

  actualDate.setSeconds(0);
  actualDate.setMilliseconds(0);
  expectedDate.setSeconds(0);
  expectedDate.setMilliseconds(0);

  assert.equal(actualDate.getTime(), expectedDate.getTime());
}
