import Ember from "ember";
import editBulletinPage from "mcac/tests/helpers/pages/bulletins/edit";
import announcementsEditorPage from "mcac/tests/helpers/pages/components/announcements-editor";
import nextService from 'mcac/utils/next-service';
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

  Object.create(editBulletinPage()).visit(group.slug, bulletin.id);

  andThen(() => {
    assert.equal(currentURL(), "/login");
  });
});

test("it displays the current bulletin to be edited", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  let bulletin = server.create("bulletin", { groupId: group.id });

  let page = Object.create(editBulletinPage()).visit(group.slug, bulletin.id);
  let announcementsEditor = Object.create(announcementsEditorPage());

  andThen(() => {
    assert.equal(page.name(), bulletin.name);
    assert.equal(page.description(), bulletin.description);
    assert.equal(page.serviceOrder(), bulletin["service-order"]);
    assert.equal(page.sermonNotes(), bulletin["sermon-notes"]);
    equalDate(assert, page.publishedAt(), bulletin["published-at"]);
    assert.equal(announcementsEditor.size(), 0);
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(normalizedDate(actual), normalizedDate(expected));
}

function normalizedDate(d) {
  return window.moment(d).second(0).milliseconds(0).toDate().getTime();
}
