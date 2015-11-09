import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import mockServer from 'mcac/tests/helpers/server';
import PostPayload from 'mcac/tests/helpers/payloads/post';
import GroupPayload from 'mcac/tests/helpers/payloads/group';
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';

var application, server;

module('Acceptance: PostsEdit', {
  needs: ['model:bulletin', 'model:group'],
  beforeEach: function() {
    application = startApp();
    server = mockServer();
    mockPost(12);
  },

  afterEach: function() {
    server.shutdown();
    Ember.run(application, 'destroy');
  }
});

function mockPost(id) {
  server.get(`/api/v1/posts/${id}`, function() {
    let response = {
      "data":
        PostPayload.build(id, {
          "content": "This is my post content",
          "slug": "this-is-a-title",
          "title": "This is a title",
          "published-at": "2015-03-06T04:01:33+00:00",
          "updated-at": "2015-03-06T04:01:33+00:00",
          "tags": ["tag1", "tag2", "tag3"]
        }, {
          authorId: 1
        })
    };

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  server.get(`/api/v1/posts/${id}/group`, function() {
    let response = { "data": GroupPayload.englishService() };

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });
}

test('Visiting /:group_slug/:post_id/edit', function(assert) {
  authenticateSession();

  visit('/english-service/post/12/edit');

  andThen(function() {
    assert.equal(find('.post-title').val(), 'This is a title');
    assert.equal(find('.content').val(), 'This is my post content');
    assert.equal(find('.tags').val(), 'tag1, tag2, tag3');
  });
});

test('Updating a post', function(assert) {
  authenticateSession();

  var updatedPost;

  server.patch('/api/v1/posts/12', function(request) {
    updatedPost = JSON.parse(request.requestBody);

    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      request.requestBody
    ];
  });

  visit('/english-service/post/12/edit');
  fillIn('.post-title', 'Updated title');
  fillIn('.content', 'Updated content');
  fillIn('.tags', 'newtag, tag1');
  click('.save');

  andThen(function() {
    assert.equal(updatedPost.data.id, '12');
    assert.deepEqual(updatedPost.data.attributes.tags, ['newtag', 'tag1']);
    assert.equal(updatedPost.data.attributes.content, 'Updated content');
    assert.equal(updatedPost.data.attributes.title, 'Updated title');
  });
});
