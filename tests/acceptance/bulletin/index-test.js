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
  const group = server.create("group");
  const bulletin = server.create("bulletin", {
    group,
    name: "Sunday Service",
    publishedAt: Date.parse("2014-12-21T13:58:27-05:00"),
    serviceOrder: "This is the service order."
  });

  const done = assert.async();
  server.get(`/bulletins/:id`, function(schema, request) {
    const includedRelationships = request.queryParams.include.split(",").sort();
    assert.deepEqual(includedRelationships, ["announcements", "sermon"]);
    done();
    return schema.bulletins.find(request.params.id);
  });

  page.visit({ groupSlug: group.slug, id: bulletin.id });

  andThen(function() {
    assertBulletinCover(page, bulletin, assert);
    assert.equal(page.bulletin.serviceOrder, bulletin.serviceOrder);
    assert.ok(page.bulletin.announcements.noAnnouncementsIndicatorShown());
    assert.ok(page.bulletin.sermonNotes.noNotesIndicatorShown());
  });
});

test("when there are announcements", function(assert) {
  const group = server.create("group");
  const bulletin = server.create("bulletin", { group });
  const announcements = [
    server.create("announcement", { url: "", position: 1, bulletin }),
    server.create("announcement", { position: 2, bulletin }),
    server.create("announcement", { url: "", position: 3, bulletin })
  ];

  page.visit({ groupSlug: bulletin.group.slug, id: bulletin.id });

  andThen(function() {
    assertAnnouncements(page, announcements, assert);
  });
});

test("when there is a sermon", function(assert) {
  const sermon = server.create("sermon");
  const group = server.create("group");
  const bulletin = server.create("bulletin", { group, sermon });

  page.visit({ groupSlug: bulletin.group.slug, id: bulletin.id });

  andThen(function() {
    assert.notOk(page.bulletin.sermonNotes.noNotesIndicatorShown());
    assert.equal(page.bulletin.sermonNotes.notes, sermon.notes);
    assert.equal(page.bulletin.cover.sermonAudioUrl(), sermon.audioUrl);
    assert.equal(page.bulletin.cover.sermonName, sermon.name);
  });
});

function assertBulletinCover(page, bulletin, assert) {
  assert.equal(page.bulletin.cover.name, bulletin.name);
  equalDate(assert, page.bulletin.cover.publishedAt, bulletin.publishedAt);
}

function assertAnnouncements(page, announcements, assert) {
  assert.equal(page.bulletin.announcements.title, "Announcements");
  assert.equal(page.bulletin.announcements.announcements().count, announcements.length);
  assert.equal(page.bulletin.announcements.announcements(0).description,
               announcements[0].description);
  assert.equal(page.bulletin.announcements.announcements(1).description,
               announcements[1].description);
  assert.equal(page.bulletin.announcements.announcements(2).description,
               announcements[2].description);
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
