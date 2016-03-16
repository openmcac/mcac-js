import page from "mcac/tests/pages/edit-bulletin";
import Ember from "ember";
import sessionData from '../../helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { module, test } from 'qunit';
import { faker } from "ember-cli-mirage";

let application;

module('Acceptance | bulletins/edit', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    try {
      Ember.run(application, 'destroy');
    } catch(e) {
      Ember.run(application, 'destroy');
    };
  }
});

test("it requires authentication", assert => {
  const group = server.create("group");
  const bulletin = server.create("bulletin", { groupId: group.id });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  andThen(() => {
    assert.equal(currentURL(), "/login");
  });
});

test("it displays the bulletin to be edited", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const bulletin = server.create("bulletin", {
    "published-at": window.moment().seconds(0).milliseconds(0),
    "banner-url": `${faker.internet.url()}/banner.png`,
    "audio-url": `${faker.internet.url()}/audio.mp3`
  });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  andThen(() => {
    assert.equal(page.name, bulletin.name);
    assert.equal(page.description, bulletin.description);
    assert.equal(page.serviceOrder, bulletin["service-order"]);
    assert.equal(page.sermonNotes, bulletin["sermon-notes"]);
    equalDate(assert, page.publishedAt, bulletin["published-at"]);
    assert.equal(page.announcements().count, 0);
    assert.equal(page.bannerUrl(), bulletin["banner-url"]);
    assert.equal(page.audioUrl(), bulletin["audio-url"]);
  });
});

test("it adds announcement editors when announcements are available",
    assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const bulletin = server.create("bulletin", {
    "published-at": window.moment().seconds(0).milliseconds(0)
  });

  const firstAnnouncement = server.create("announcement", { position: 1 });
  const secondAnnouncement = server.create("announcement", { position: 2 });
  const thirdAnnouncement = server.create("announcement", { position: 3 });

  const announcements = [
    secondAnnouncement,
    thirdAnnouncement,
    firstAnnouncement
  ];

  mockAnnouncementsForBulletinId(assert, server, bulletin.id, announcements);

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
    "published-at": window.moment().seconds(0).milliseconds(0)
  });

  const firstAnnouncement = server.create("announcement", { id: 1, position: 1 });
  const secondAnnouncement = server.create("announcement", { id: 2, position: 2 });
  const thirdAnnouncement = server.create("announcement", { id: 3, position: 3 });

  const announcements = [
    secondAnnouncement,
    thirdAnnouncement,
    firstAnnouncement
  ];

  mockAnnouncementsForBulletinId(assert, server, bulletin.id, announcements);

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
  const bulletin = server.create("bulletin", {
    "published-at": window.moment().seconds(0).milliseconds(0),
    "banner-url": `${faker.internet.url()}/banner.png`,
    "audio-url": `${faker.internet.url()}/audio.mp3`
  });

  const announcement = server.create("announcement", { position: 1 });
  mockAnnouncementsForBulletinId(assert, server, bulletin.id, [announcement]);

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id }).
    fillName("updated name").
    fillPublishedAt("05/27/1984 9:30 AM").
    fillDescription("updated desc").
    fillServiceOrder("updated service order").
    fillSermonNotes("updated sermon notes");

  page.announcements(0).
    fillUrl("http://updated.com").
    fillDescription("updated announcement");

  page.submit();

  andThen(() => {
    const updatedBulletin = server.db.bulletins.find(bulletin.id);
    assert.equal(updatedBulletin.name, page.name);
    assert.equal(updatedBulletin.description, page.description);
    equalDate(assert, updatedBulletin["published-at"], page.publishedAt);
    assert.equal(updatedBulletin["sermon-notes"], page.sermonNotes);
    assert.equal(updatedBulletin["service-order"], page.serviceOrder);

    const updatedAnnouncement = server.db.announcements.find(announcement.id);
    const announcementEditor = page.announcements(0);
    assert.equal(updatedAnnouncement.url, announcementEditor.url);
    assert.equal(updatedAnnouncement.description,
                 announcementEditor.description);
  });
});

test("it allows user to create a new announcement", assert => {
  authenticateSession(application, sessionData);

  const group = server.create("group");
  const bulletin = server.create("bulletin", {
    "published-at": window.moment().seconds(0).milliseconds(0)
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
