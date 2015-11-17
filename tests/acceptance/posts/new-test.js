import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import mockServer from 'mcac/tests/helpers/server';
import sessionData from '../../helpers/payloads/sessionData';
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';

var application;

module('Acceptance: PostsNew', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('saving a post', function(assert) {
  authenticateSession(application, sessionData);

  var server = mockServer(),
      postTitle = 'post title',
      content = 'post **markdown**',
      tags = 'tag5, tag6, tag7',
      createdPost;

  server.post('/api/v1/posts', function(request) {
    createdPost = JSON.parse(request.requestBody);
    createdPost.data.id = '1';

    return [
      201,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(createdPost)
    ];
  });

  visit('/english-service/posts/new');

  fillIn('.post-title', postTitle);
  fillIn('.content', content);
  fillIn('.tags', tags);

  click('.save');

  andThen(function() {
    assert.equal(createdPost.data.attributes.title, postTitle);
    assert.equal(createdPost.data.attributes.content, content);
    assert.deepEqual(createdPost.data.attributes.tags, ['tag5', 'tag6', 'tag7']);

    Ember.run.next(function() {
      assert.equal(currentURL(), "/english-service/post/1/edit");
    });
  });
});
