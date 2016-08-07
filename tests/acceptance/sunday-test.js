import Ember from "ember";
import startApp from "../helpers/start-app";
import { test, module } from "qunit";
import page from "mcac/tests/pages/sunday";

let application;

module('Acceptance: Sunday', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /sunday', function(assert) {
  const done = assert.async();

  server.get("/sunday", function(schema, request) {
    const includedRelationships = request.queryParams.include.split(",").sort();
    assert.deepEqual(includedRelationships, ["announcements", "group", "sermon"]);
    done();
    return schema.bulletins.find(1);
  });
  const group = server.create("group");
  const bulletin =
    server.create("bulletin", {
      group,
      name: "Sunday Service",
      publishedAt: Date.parse("2014-12-21T13:58:27-05:00"),
      serviceOrder: "This is the service order."
    });
  const announcements = [
    server.create("announcement", { url: "", position: 1, bulletin }),
    server.create("announcement", { position: 2, bulletin }),
    server.create("announcement", { url: "", position: 3, bulletin })
  ];

  page.visit({ groupSlug: group.slug, id: bulletin.id });

  andThen(function() {
    assertBulletinCover(page, bulletin, assert);
    assert.equal(page.bulletin.serviceOrder, bulletin.serviceOrder);
    assertAnnouncements(page, announcements, assert);
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
