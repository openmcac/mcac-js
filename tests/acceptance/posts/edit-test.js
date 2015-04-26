import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import Pretender from 'pretender';
import mockServer from 'mcac/tests/helpers/server';

var application, server;

module('Acceptance: PostsEdit', {
  needs: ['model:bulletin', 'model:group'],
  beforeEach: function() {
    application = startApp();
    server = createServer();
  },

  afterEach: function() {
    server.shutdown();
    Ember.run(application, 'destroy');
  }
});

function createServer() {
  var server = mockServer();
  server.get('/api/v1/posts/12', function(request) {
    var response = {
      "posts": {
        "content": "This is my post content",
        "id": "12",
        "slug": "this-is-a-title",
        "title": "This is a title",
        "publishedAt": "2015-03-06T04:01:33+00:00",
        "updatedAt": "2015-03-06T04:01:33+00:00",
        "tags": ["tag1", "tag2", "tag3"],
        "links": {
          "author": "1",
          "editor":null,
          "group": "1"
        }
      }
    };
    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(response)
    ];
  });

  return server;
}

test('visiting /posts/edit', function(assert) {
  authenticateSession();

  visit('/english-service/posts/12/edit');

  andThen(function() {
    assert.equal(find('.post-title').val(), 'This is a title');
    assert.equal(find('.content').val(), 'This is my post content');
    assert.equal(find('.tags').val(), 'tag1, tag2, tag3');
  });
});

test('Updating a post', function(assert) {
  authenticateSession();

  var updatedPost;

  server.put('/api/v1/posts/12', function(request) {
    updatedPost = JSON.parse(request.requestBody);

    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      request.requestBody
    ];
  });

  visit('/english-service/posts/12/edit');
  fillIn('.post-title', 'Updated title');
  fillIn('.content', 'Updated content');
  fillIn('.tags', 'newtag, tag1');
  click('.save');

  andThen(function() {
    assert.equal(updatedPost.posts.id, '12');
    assert.deepEqual(updatedPost.posts.tags, ['newtag', 'tag1']);
    assert.equal(updatedPost.posts.content, 'Updated content');
    assert.equal(updatedPost.posts.title, 'Updated title');
  });
});
