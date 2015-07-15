import Ember from "ember";
import { module, test } from "qunit";
import startApp from "mcac/tests/helpers/start-app";
import NewGroupPage from "mcac/tests/helpers/pages/groups/new";

var application;

module('Acceptance | groups/new', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /groups/new', function(assert) {
  NewGroupPage.visit().
    name("New Group").
    slug("this-is-a-slug").
    about("This is a description about the group");

  andThen(function() {
    assert.equal(currentURL(), "/groups/new");
    assert.equal(NewGroupPage.slug(), "this-is-a-slug");
    assert.equal(NewGroupPage.name(), "New Group");
    assert.equal(NewGroupPage.about(), "This is a description about the group");
  });
});
