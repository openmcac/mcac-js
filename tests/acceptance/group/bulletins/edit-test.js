import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { test } from 'qunit';
import Ember from 'ember';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/group/bulletins/edit";
import sessionData from 'mcac/tests/helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";

let application;

moduleForAcceptance('Acceptance | group/bulletins/edit', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('updating an existing bulletin', function(assert) {
  const group = server.create("group");
  const bulletin = server.create("bulletin", { group });
  const announcements = server.createList("announcement", 3, { bulletin });

  authenticateSession(application, sessionData);

  page.
    visit({ group_slug: bulletin.group.slug, id: bulletin.id }).
    name("updated bulletin").
    serviceOrder("updated service order").
    publishedAt("03/23/2000 9:30 AM").
    series("sermon series").
    sermonName("sermon name").
    speaker("sermon speaker").
    tags("tag1, tag2, tag3").
    notes("sermon notes").
    appendAnnouncement();

  page.announcements(3).description("new announcement");

  page.submit();

  andThen(function() {
    const updatedBulletin = server.db.bulletins.find(bulletin.id);
    assert.equal(updatedBulletin.name, "updated bulletin");
    assert.equal(updatedBulletin.serviceOrder, "updated service order");
    assert.deepEqual(new Date(updatedBulletin.publishedAt),
                     new Date(2000, 2, 23, 9, 30));

    const updatedSermon = server.db.sermons.find(updatedBulletin.sermonId);
    assert.equal(updatedSermon.series, "sermon series");
    assert.equal(updatedSermon.name, "sermon name");
    assert.equal(updatedSermon.speaker, "sermon speaker");
    assert.equal(updatedSermon.tags, "tag1, tag2, tag3");
    assert.equal(updatedSermon.notes, "sermon notes");

    const updatedAnnouncements =
      server.db.announcements.where({ bulletinId: updatedBulletin.id });

    assert.equal(updatedAnnouncements[0].description,
                 announcements[0].description);
    assert.equal(updatedAnnouncements[1].description,
                 announcements[1].description);
    assert.equal(updatedAnnouncements[2].description,
                 announcements[2].description);
    assert.equal(updatedAnnouncements[3].description, "new announcement");

    assert.equal(announcements.length, 3);
    assert.equal(updatedAnnouncements.length, 4);
  });
});
