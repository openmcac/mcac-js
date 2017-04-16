import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { test } from 'qunit';
import Ember from 'ember';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/group/bulletins/new";
import sessionData from 'mcac/tests/helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";

let application;

moduleForAcceptance('Acceptance | group/bulletins/new', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('creating a new bulletin', function(assert) {
  const existingAnnouncements  = [
    server.create("announcement", { id: 1 }),
    server.create("announcement", { id: 2 }),
    server.create("announcement", { id: 3 })
  ];
  const group = server.create("group");
  const bulletin = server.create("bulletin", { group });

  authenticateSession(application, sessionData);

  page.
    visit({ group_slug: bulletin.group.slug }).
    name("my bulletin").
    serviceOrder("my service order").
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
    const createdBulletin = server.db.bulletins[server.db.bulletins.length - 1];
    assert.equal(createdBulletin.name, "my bulletin");
    assert.equal(createdBulletin.serviceOrder, "my service order");
    assert.deepEqual(new Date(createdBulletin.publishedAt),
                     new Date(2000, 2, 23, 9, 30));

    const createdSermon = server.db.sermons.find(createdBulletin.sermonId);
    assert.equal(createdSermon.series, "sermon series");
    assert.equal(createdSermon.name, "sermon name");
    assert.equal(createdSermon.speaker, "sermon speaker");
    assert.equal(createdSermon.tags, "tag1, tag2, tag3");
    assert.equal(createdSermon.notes, "sermon notes");

    const createdAnnouncements =
      server.db.announcements.where({ bulletinId: createdBulletin.id });

    assert.equal(createdAnnouncements[0].description,
                 existingAnnouncements[0].description);
    assert.equal(createdAnnouncements[1].description,
                 existingAnnouncements[1].description);
    assert.equal(createdAnnouncements[2].description,
                 existingAnnouncements[2].description);
    assert.equal(createdAnnouncements[3].description, "new announcement");

    assert.equal(existingAnnouncements.length, 3);
    assert.equal(createdAnnouncements.length, 4);

    assert.equal(currentURL(), "/dashboard");
  });
});
