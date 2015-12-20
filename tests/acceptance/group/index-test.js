import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import groupIndexPage from "mcac/tests/helpers/pages/group/index";

var application;

module('Acceptance | group/index', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /:group_slug', function(assert) {
  let group = server.create("group", { about: "my group description" });
  let posts =
    server.createList("post", 3, { "group-id": group.id, "group-slug": group.slug });

  let page = groupIndexPage(group.slug);
  page.visit();

  andThen(function() {
    assert.equal(currentURL(), `/${group.slug}`);
    assert.equal(page.name(), group.name);
    assert.equal(page.about(), group.about);
    assert.equal(page.posts().count(), posts.length);
    assert.equal(page.bannerUrl(), group["banner-url"]);
  });
});
