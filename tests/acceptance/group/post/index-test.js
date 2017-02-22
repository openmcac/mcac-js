import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/group/post/index";
import startApp from "mcac/tests/helpers/start-app";

let application;

moduleForAcceptance('Acceptance | group/post/index', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /group/post/index', function(assert) {
  const group = server.create("group", { slug: "english-service" });
  server.create("post", {
    id: 22,
    group,
    publishedAt: new Date(2000, 10, 9, 8, 7),
    slug: "my-test-post"
  });

  page.visit({
    groupSlug: group.slug,
    year: 2000,
    month: 11,
    day: "09",
    slug: "my-test-post",
    id: 22
  });

  andThen(function() {
    assert.equal(currentURL(), '/english-service/2000/11/09/22/my-test-post');
  });
});
