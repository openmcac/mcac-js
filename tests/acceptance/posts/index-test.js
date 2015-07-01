import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import Pretender from 'pretender';
import mockServer from 'mcac/tests/helpers/server';
import GroupPayload from 'mcac/tests/helpers/payloads/group';
import PostPayload from 'mcac/tests/helpers/payloads/post';

var application, server;

function createServer() {
  let server = mockServer();
  server.get('/api/v1/posts', function(request) {
    let response = {
      "data": [
        PostPayload.build(4, {
          "content": "Hai",
          "slug": "test",
          "title": "Test",
          "published-at": "2015-04-20T04:04:50+00:00",
          "updated-at": "2015-04-20T04:04:50+00:00",
          "tags": [ "test", "now" ]
        }, { authorId: 1 }),
        PostPayload.build(5, {
          "content": "wow post",
          "slug": "this-is-a-post-01f531de-3d6e-41e7-b517-23cf4c64d04e",
          "title": "This is a post",
          "published-at": "2015-04-23T22:35:05+00:00",
          "updated-at": "2015-04-23T22:35:05+00:00",
          "tags": [ "one", "two", "three" ]
        }, { authorId: 1 })
      ]
    };

    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(response)
    ];
  });

  server.get('/api/v1/posts/:id/group', function(request) {
    let response = { "data": GroupPayload.englishService() };

    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(response)
    ];
  });

  return server;
}

module('Acceptance: PostsIndex', {
  beforeEach: function() {
    application = startApp();
    server = createServer();
  },

  afterEach: function() {
    server.shutdown();
    Ember.run(application, 'destroy');
  }
});

test('visiting /posts/index', function(assert) {
  authenticateSession();

  visit('/english-service/posts');

  andThen(function() {
    assert.equal(find('.post').length, 2);
  });
});

test('deleting a post', function(assert) {
  authenticateSession();

  var deletedPost;

  server.delete('/api/v1/posts/5', function(request) {
    deletedPost = true;

    return [
      204,
      {"Content-Type": "application/vnd.api+json"},
      '{}'
    ];
  });

  visit('/english-service/posts');

  click('.remove-post:last');

  andThen(function() {
    assert.equal(find('.post').length, 1);
    assert.ok(deletedPost);
  });
});
