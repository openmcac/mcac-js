import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import Pretender from 'pretender';
import mockServer from 'mcac/tests/helpers/server';

var application, server;

function createServer() {
  var server = mockServer();
  server.get('/api/v1/posts', function(request) {
    var response = {
      "posts": [{
        "content": "Hai",
        "id": "4",
        "slug": "test",
        "title": "Test",
        "publishedAt": "2015-04-20T04:04:50+00:00",
        "updatedAt": "2015-04-20T04:04:50+00:00",
        "tags": [
          "test",
          "now"
        ],
        "links": {
          "author": "1",
          "editor": null,
          "group": "1"
        }
      },
      {
        "content": "wow post",
        "id": "5",
        "slug": "this-is-a-post-01f531de-3d6e-41e7-b517-23cf4c64d04e",
        "title": "This is a post",
        "publishedAt": "2015-04-23T22:35:05+00:00",
        "updatedAt": "2015-04-23T22:35:05+00:00",
        "tags": [
          "one",
          "two",
          "three"
        ],
        "links": {
          "author": "1",
          "editor": null,
          "group": "1"
        }
      }]
    };

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
      200,
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
