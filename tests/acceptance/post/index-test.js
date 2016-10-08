import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance'
import startApp from 'mcac/tests/helpers/start-app';
import page from "mcac/tests/pages/post-index";

var application;

moduleForAcceptance('Acceptance: PostIndex', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting a post', function(assert) {
  const group = server.create("group");
  const post = server.create("post", {
    bannerUrl: null,
    content: "this is my content",
    group,
    publishedAt: Date.parse("2015-03-06T04:01:33+00:00")
  });

  page.visit({
    groupSlug: group.slug,
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
  const group = server.create("group");
  const post = server.create("post", {
    content: "this is my content",
    group,
    publishedAt: Date.parse("2015-03-06T04:01:33+00:00")
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
    assert.equal(page.post.bannerUrl(), post.bannerUrl);
  });
});

test('Corrects the url if slug is wrong', function(assert) {
  const group = server.create("group");
  const post = server.create("post", {
    content: "this is my content",
    group,
    publishedAt: Date.parse("2015-03-06T04:01:33+00:00")
  });

  page.visit({
    groupSlug: group.slug,
    year: "2015",
    month: "03",
    day: "06",
    id: post.id,
    slug: "badslug"
  });

  andThen(function() {
    assert.equal(currentURL(), `/${group.slug}/2015/03/06/${post.id}/${post.slug}`);
  });
});

test('Corrects the url if year is wrong', function(assert) {
  const group = server.create("group");
  const post = server.create("post", {
    content: "this is my content",
    group,
    publishedAt: Date.parse("2015-03-06T04:01:33+00:00")
  });

  page.visit({
    groupSlug: group.slug,
    year: "2014",
    month: "03",
    day: "06",
    id: post.id,
    slug: post.slug
  });

  andThen(function() {
    assert.equal(currentURL(), `/${group.slug}/2015/03/06/${post.id}/${post.slug}`);
  });
});

test('Corrects the url if month is wrong', function(assert) {
  const group = server.create("group");
  const post = server.create("post", {
    content: "this is my content",
    group,
    publishedAt: Date.parse("2015-03-06T04:01:33+00:00")
  });

  page.visit({
    groupSlug: group.slug,
    year: "2015",
    month: "07",
    day: "06",
    id: post.id,
    slug: post.slug
  });

  andThen(function() {
    assert.equal(currentURL(), `/${group.slug}/2015/03/06/${post.id}/${post.slug}`);
  });
});

test('Corrects the url if day is wrong', function(assert) {
  const group = server.create("group");
  const post = server.create("post", {
    content: "this is my content",
    group,
    publishedAt: Date.parse("2015-03-06T04:01:33+00:00")
  });

  page.visit({
    groupSlug: group.slug,
    year: "2015",
    month: "03",
    day: "22",
    id: post.id,
    slug: post.slug
  });

  andThen(function() {
    assert.equal(currentURL(), `/${group.slug}/2015/03/06/${post.id}/${post.slug}`);
  });
});
