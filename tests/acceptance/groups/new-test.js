import Ember from "ember";
import NewGroupPage from "mcac/tests/helpers/pages/groups/new";
import sessionData from '../../helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { module, test } from 'qunit';

let application;

module('Acceptance | groups/new', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test("it requires authentication", assert => {
  visit("/groups/new");

  andThen(() => {
    assert.equal(currentURL(), "/login");
  });
});

test("it can create a new group", assert => {
  authenticateSession(application, sessionData);

  NewGroupPage.visit().
    name("New Group").
    slug("this-is-a-slug").
    about("This is a description about the group").
    submit();

  andThen(() => {
    let groups = server.db.groups;
    let createdGroup = groups[groups.length - 1];

    assert.equal(createdGroup.name, "New Group");
    assert.equal(createdGroup.slug, "this-is-a-slug");
    assert.equal(createdGroup.about, "This is a description about the group");
    assert.equal(currentURL(), "/groups");
  });
});
