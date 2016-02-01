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
    Ember.run(application, 'destroy');
  }
});

test("it requires authentication", assert => {
  let group = server.create("group");
  let bulletin = server.create("bulletin", { groupId: group.id });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  andThen(() => {
    assert.equal(currentURL(), "/login");
  });
});

test("it displays the bulletin to be edited", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  let bulletin = server.create("bulletin", {
    "published-at": window.moment().seconds(0).milliseconds(0),
    "banner-url": `${faker.internet.url()}/banner.png`,
    "audio-url": `${faker.internet.url()}/audio.mp3`
  });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  andThen(() => {
    assert.equal(page.name(), bulletin.name);
    assert.equal(page.description(), bulletin.description);
    assert.equal(page.serviceOrder(), bulletin["service-order"]);
    assert.equal(page.sermonNotes(), bulletin["sermon-notes"]);
    equalDate(assert, page.publishedAt(), bulletin["published-at"]);
    assert.equal(page.announcements().count(), 0);
    assert.equal(page.bannerUrl(), bulletin["banner-url"]);
    assert.equal(page.audioUrl(), bulletin["audio-url"]);
  });
});

test("it adds announcement editors when announcements are available",
    assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  let bulletin = server.create("bulletin", {
    "published-at": window.moment().seconds(0).milliseconds(0)
  });

  let firstAnnouncement = server.create("announcement", { position: 1 });
  let secondAnnouncement = server.create("announcement", { position: 2 });
  let thirdAnnouncement = server.create("announcement", { position: 3 });

  let announcements = [
    secondAnnouncement,
    thirdAnnouncement,
    firstAnnouncement
  ];

  mockAnnouncementsForBulletinId(assert, server, bulletin.id, announcements);

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  andThen(() => {
    assert.equal(page.announcements().count(), 3);
    assert.equal(page.announcements(1).url(), firstAnnouncement.url);
    assert.equal(page.announcements(1).description(),
                 firstAnnouncement.description);
    assert.equal(page.announcements(2).url(), secondAnnouncement.url);
    assert.equal(page.announcements(2).description(),
                 secondAnnouncement.description);
    assert.equal(page.announcements(3).url(), thirdAnnouncement.url);
    assert.equal(page.announcements(3).description(),
                 thirdAnnouncement.description);
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}

function mockAnnouncementsForBulletinId(assert, server, bulletinId, announcements) {
  let done = assert.async();

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
