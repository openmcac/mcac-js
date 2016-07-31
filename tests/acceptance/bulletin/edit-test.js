import page from "mcac/tests/pages/edit-bulletin";
import Ember from "ember";
import sessionData from '../../helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { module, test } from 'qunit';
import { faker } from "ember-cli-mirage";

let application;

module('Acceptance | bulletin/edit', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    try {
      Ember.run(application, 'destroy');
    } catch(e) {
      Ember.run(application, 'destroy');
    }
  }
});

test("it requires authentication", assert => {
  const group = server.create("group");
  const bulletin = server.create("bulletin", { group });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  andThen(() => {
    assert.equal(currentURL(), "/login");
  });
});

test("it displays the bulletin to be edited", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const sermon = server.create("sermon", {
    audioUrl: `${faker.internet.url()}/audio.mp3`
  });
  const bulletin = server.create("bulletin", {
    bannerUrl: `${faker.internet.url()}/banner.png`,
    group,
    publishedAt: window.moment().seconds(0).milliseconds(0),
    sermon
  });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  andThen(() => {
    assert.equal(page.name, bulletin.name);
    assert.equal(page.serviceOrder, bulletin.serviceOrder);
    equalDate(assert, page.publishedAt, bulletin.publishedAt);
    assert.equal(page.announcements().count, 0);
    assert.equal(page.bannerUrl(), bulletin.bannerUrl);
    assert.equal(page.sermon.notes, sermon.notes);
    assert.equal(page.sermon.audioUrl(), sermon.audioUrl);
    assert.equal(page.sermon.speaker, sermon.speaker);
    assert.equal(page.sermon.series, sermon.series);
    assert.equal(page.sermon.name, sermon.name);
  });
});

test("it adds announcement editors when announcements are available",
    assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const bulletin = server.create("bulletin", {
    group,
    publishedAt: window.moment().seconds(0).milliseconds(0)
  });

  const firstAnnouncement = server.create("announcement", { position: 1, bulletin });
  const secondAnnouncement = server.create("announcement", { position: 2, bulletin });
  const thirdAnnouncement = server.create("announcement", { position: 3, bulletin });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  andThen(() => {
    assert.equal(page.announcements().count, 3);
    assert.equal(page.announcements(0).url, firstAnnouncement.url);
    assert.equal(page.announcements(0).description,
                 firstAnnouncement.description);
    assert.equal(page.announcements(1).url, secondAnnouncement.url);
    assert.equal(page.announcements(1).description,
                 secondAnnouncement.description);
    assert.equal(page.announcements(2).url, thirdAnnouncement.url);
    assert.equal(page.announcements(2).description,
                 thirdAnnouncement.description);
  });
});

test("it allows announcements to be deleted", function(assert) {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const bulletin = server.create("bulletin", {
    group,
    publishedAt: window.moment().seconds(0).milliseconds(0)
  });

  const firstAnnouncement = server.create("announcement", { position: 1, bulletin });
  server.create("announcement", { position: 2, bulletin });
  const thirdAnnouncement = server.create("announcement", { position: 3, bulletin });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  page.announcements(1).clickRemove();

  page.submit();

  andThen(() => {
    assert.equal(server.db.announcements.length, 2);
    assert.equal(page.announcements().count, 2);
    assert.equal(page.announcements(0).url, firstAnnouncement.url);
    assert.equal(page.announcements(0).description,
                 firstAnnouncement.description);
    assert.equal(page.announcements(1).url, thirdAnnouncement.url);
    assert.equal(page.announcements(1).description,
                 thirdAnnouncement.description);
  });
});


test("it updates the current bulletin", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const sermon = server.create("sermon", {
    audioUrl: `${faker.internet.url()}/audio.mp3`
  });
  const bulletin = server.create("bulletin", {
    audioUrl: `${faker.internet.url()}/audio.mp3`,
    bannerUrl: `${faker.internet.url()}/banner.png`,
    group,
    publishedAt: window.moment().seconds(0).milliseconds(0),
    sermon
  });

  const announcement = server.create("announcement", { position: 1, bulletin });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id }).
    fillName("updated name").
    fillPublishedAt("05/27/1984 9:30 AM").
    fillServiceOrder("updated service order");

  page.sermon.fillNotes("updated sermon notes");

  page.announcements(0).
    fillUrl("http://updated.com").
    fillDescription("updated announcement");

  page.submit();

  andThen(() => {
    const updatedBulletin = server.db.bulletins.find(bulletin.id);
    assert.equal(updatedBulletin.name, page.name);
    assert.equal(updatedBulletin.description, page.description);
    equalDate(assert, updatedBulletin.publishedAt, page.publishedAt);
    assert.equal(updatedBulletin.serviceOrder, page.serviceOrder);

    const updatedSermon = server.db.sermons.find(sermon.id);
    assert.equal(updatedSermon.name, page.sermon.name);
    assert.equal(updatedSermon.notes, page.sermon.notes);
    assert.equal(updatedSermon.series, page.sermon.series);
    assert.equal(updatedSermon.speaker, page.sermon.speaker);
    equalDate(assert, updatedSermon.publishedAt, page.publishedAt);
    assert.equal(updatedSermon.audioUrl, page.sermon.audioUrl());
    assert.equal(updatedSermon.bannerUrl, page.bannerUrl());

    const updatedAnnouncement = server.db.announcements.find(announcement.id);
    const announcementEditor = page.announcements(0);
    assert.equal(updatedAnnouncement.url, announcementEditor.url);
    assert.equal(updatedAnnouncement.description,
                 announcementEditor.description);
  });
});

test("when updating a bulletin without a sermon", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const bulletin = server.create("bulletin", {
    publishedAt: window.moment().seconds(0).milliseconds(0),
    bannerUrl: `${faker.internet.url()}/banner.png`
  });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id }).
    fillName("updated name").
    submit();

  andThen(() => {
    assert.equal(server.db.sermons.length, 0);
    const updatedBulletin = server.db.bulletins.find(bulletin.id);
    assert.equal(updatedBulletin.name, page.name);
  });
});

test("when bulletin doesn't have a sermon yet", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const bulletin = server.create("bulletin", {
    publishedAt: window.moment().seconds(0).milliseconds(0),
    bannerUrl: `${faker.internet.url()}/banner.png`
  });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  page.sermon.
    fillName("sermon name").
    fillNotes("updated sermon notes").
    fillSeries("my series").
    fillSpeaker("my series");

  page.submit();

  andThen(() => {
    const updatedSermon = server.db.sermons[server.db.sermons.length - 1];
    assert.equal(updatedSermon.name, page.sermon.name);
    assert.equal(updatedSermon.notes, page.sermon.notes);
    assert.equal(updatedSermon.series, page.sermon.series);
    assert.equal(updatedSermon.speaker, page.sermon.speaker);
    equalDate(assert, updatedSermon.publishedAt, page.publishedAt);
    assert.equal(updatedSermon.bannerUrl, page.bannerUrl());
  });
});

test("it allows user to create a new announcement", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const bulletin = server.create("bulletin", {
    publishedAt: window.moment().seconds(0).milliseconds(0)
  });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id }).
    appendNewAnnouncement();

  page.announcements(0).
    fillUrl("http://test.com").
    fillDescription("new desc");

  page.submit();

  andThen(() => {
    const announcements = server.db.announcements;
    const lastAnnouncement = announcements[announcements.length - 1];
    const announcementEditor = page.announcements(0);

    assert.equal(lastAnnouncement.url, announcementEditor.url);
    assert.equal(lastAnnouncement.description, announcementEditor.description);
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}
