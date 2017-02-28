import Ember from 'ember';
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/group/post/edit";
import sessionData from 'mcac/tests/helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";

let application;

moduleForAcceptance('Acceptance | group/post/edit', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /group/post/edit', function(assert) {
  server.create("post", {
    id: 2,
    group: server.create("group", { slug: "english-service" }),
    bannerUrl: "http://example.com/banner.jpg",
    title: "My Test Post",
    slug: "my-test-post",
    content: "My content",
    kind: "post",
    tags: ["tag1, tag2, tag3"]
  });

  authenticateSession(application, sessionData);

  page.visit({
    groupSlug: "english-service",
    year: "2000",
    month: "11",
    day: "24",
    postId: "2",
    slug: "my-test-post"
  });

  andThen(function() {
    assert.equal(currentURL(), '/english-service/2000/11/24/2/my-test-post/edit');
    assert.equal(page.title, "My Test Post");
    assert.equal(page.content, "My content");
    assert.equal(page.bannerUrl(), "http://example.com/banner.jpg");
    assert.deepEqual(page.tags(), ["tag1", "tag2", "tag3"]);
    assert.equal(page.kind, "post");
  });
});
