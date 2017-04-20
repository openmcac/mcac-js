/* global server:false */

import Ember from 'ember';
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/group/posts/new";
import sessionData from 'mcac/tests/helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";

let application;

moduleForAcceptance('Acceptance | group/posts/new', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('creating a new post', function(assert) {
  server.create("group", { slug: "english-service" });

  authenticateSession(application, sessionData);

  page.
    visit({ groupSlug: "english-service"}).
    fillInTitle("My New Title").
    fillInContent("My new content").
    fillInTags("new1, new2, new3").
    selectKind("post").
    save();

  andThen(function() {
    const createdPostId = server.db.posts[server.db.posts.length - 1].id;
    const createdPost = server.db.posts.find(createdPostId);
    assert.equal(createdPost.title, "My New Title");
    assert.equal(createdPost.content, "My new content");
    assert.equal(createdPost.bannerUrl, null);
    assert.deepEqual(createdPost.tags, ["new1", "new2", "new3"]);
    assert.equal(createdPost.kind, "post");
  });
});
