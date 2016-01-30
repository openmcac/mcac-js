import EditBulletinPage from "mcac/tests/page-objects/edit-bulletin";
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

  new EditBulletinPage({ assert }).
    visit(`/${group.slug}/bulletins/${bulletin.id}/edit`).
    assertURL("/login", "user is redirected to login page");
});

test("it displays the current bulletin to be edited", assert => {
  authenticateSession(application, sessionData);

  let group = server.create("group");
  let bulletin = server.create("bulletin", {
    groupId: group.id,
    "published-at": window.moment().seconds(0).milliseconds(0)
  });

  new EditBulletinPage({ assert }).
    visit(`/${group.slug}/bulletins/${bulletin.id}/edit`).
    assertName(bulletin.name).
    assertDescription(bulletin.description).
    assertServiceOrder(bulletin["service-order"]).
    assertSermonNotes(bulletin["sermon-notes"]).
    assertPublishedAt(bulletin["published-at"]).
    assertNoAnnouncements();
});
