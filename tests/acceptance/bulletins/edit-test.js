import page from "mcac/tests/pages/edit-bulletin";
import Ember from "ember";
import sessionData from '../../helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { module, test } from 'qunit';

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

test("it displays the current bulletin to be edited", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  let bulletin = server.create("bulletin", {
    "published-at": window.moment().seconds(0).milliseconds(0)
  });

  page.visit({ groupSlug: group.slug, bulletinId: bulletin.id });

  andThen(() => {
    assert.equal(page.name(), bulletin.name);
    assert.equal(page.description(), bulletin.description);
    assert.equal(page.serviceOrder(), bulletin["service-order"]);
    assert.equal(page.sermonNotes(), bulletin["sermon-notes"]);
    equalDate(assert, page.publishedAt(), bulletin["published-at"]);

    // TODO add check for no announcements
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}
