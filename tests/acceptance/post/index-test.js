import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import page from "mcac/tests/pages/post-index";

var application;

module('Acceptance: PostIndex', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting a post', function(assert) {
  const group = server.create("group", { slug: "english-service" });

  const post = server.create("post", {
    "group-id": group.id,
    "published-at": Date.parse("2015-03-06T04:01:33+00:00"),
    "content": "this is my content",
    "banner-url": null
  });

  page.visit({
    groupSlug: "english-service",
    year: "2015",
    month: "03",
    day: "06",
    id: post.id,
    slug: post.slug
  });

  andThen(function() {
    assert.notOk(page.post.hasBanner());
    assert.equal(page.post.title, post.title);
    assert.equal(page.post.content, post.content);
    assert.equal(page.post.publishedAt, "March 5 at 11:01pm");
  });
});

test("shows a banner when it has one", function(assert) {
  const group = server.create("group", { slug: "english-service" });

  const post = server.create("post", {
    "group-id": group.id,
    "published-at": Date.parse("2015-03-06T04:01:33+00:00"),
    "content": "this is my content"
  });

  page.visit({
    groupSlug: "english-service",
    year: "2015",
    month: "03",
    day: "06",
    id: post.id,
    slug: post.slug
  });

  andThen(function() {
    assert.equal(page.post.bannerUrl(), post["banner-url"]);
  });
});

test('Corrects the url if slug is wrong', function(assert) {
  const group = server.create("group", { slug: "english-service" });

  const post = server.create("post", {
    "group-id": group.id,
    "published-at": Date.parse("2015-03-06T04:01:33+00:00"),
    "content": "this is my content"
  });

  page.visit({
    groupSlug: "english-service",
    year: "2015",
    month: "03",
    day: "06",
    id: post.id,
    slug: "badslug"
  });

  andThen(function() {
    assert.equal(currentURL(), `/english-service/2015/03/06/${post.id}/${post.slug}`);
  });
});

test('Corrects the url if year is wrong', function(assert) {
  const group = server.create("group", { slug: "english-service" });

  const post = server.create("post", {
    "group-id": group.id,
    "published-at": Date.parse("2015-03-06T04:01:33+00:00"),
    "content": "this is my content"
  });

  page.visit({
    groupSlug: "english-service",
    year: "2014",
    month: "03",
    day: "06",
    id: post.id,
    slug: post.slug
  });

  andThen(function() {
    assert.equal(currentURL(), `/english-service/2015/03/06/${post.id}/${post.slug}`);
  });
});

test('Corrects the url if month is wrong', function(assert) {
  const group = server.create("group", { slug: "english-service" });

  const post = server.create("post", {
    "group-id": group.id,
    "published-at": Date.parse("2015-03-06T04:01:33+00:00"),
    "content": "this is my content"
  });

  page.visit({
    groupSlug: "english-service",
    year: "2015",
    month: "07",
    day: "06",
    id: post.id,
    slug: post.slug
  });

  andThen(function() {
    assert.equal(currentURL(), `/english-service/2015/03/06/${post.id}/${post.slug}`);
  });
});

test('Corrects the url if day is wrong', function(assert) {
  const group = server.create("group", { slug: "english-service" });

  const post = server.create("post", {
    "group-id": group.id,
    "published-at": Date.parse("2015-03-06T04:01:33+00:00"),
    "content": "this is my content"
  });

  page.visit({
    groupSlug: "english-service",
    year: "2015",
    month: "03",
    day: "22",
    id: post.id,
    slug: post.slug
  });

  andThen(function() {
    assert.equal(currentURL(), `/english-service/2015/03/06/${post.id}/${post.slug}`);
  });
});
