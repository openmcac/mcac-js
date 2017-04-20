/* global server:false */

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
    publishedAt: Date.parse("2015-03-06T04:01:33+00:00"),
    slug: "my-test-post",
    title: "My Test Post",
    content: "My Test Content",
    bannerUrl: "http://image.com/banner.png"
  });

  page.visit({
    groupSlug: group.slug,
    year: 2015,
    month: "03",
    day: "06",
    slug: "my-test-post",
    id: 22
  });

  andThen(function() {
    assert.equal(currentURL(), '/english-service/2015/03/06/22/my-test-post');
    assert.equal(page.post.publishedAt, "March 5 at 11:01pm");
    assert.equal(page.post.title, "My Test Post");
    assert.equal(page.post.content, "My Test Content");
    assert.equal(page.post.bannerUrl(), "http://image.com/banner.png");
  });
});
