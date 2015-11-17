import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import mockServer from 'mcac/tests/helpers/server';
import GroupPayload from 'mcac/tests/helpers/payloads/group';
import PostPayload from 'mcac/tests/helpers/payloads/post';
import sessionData from '../../helpers/payloads/sessionData';
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';

var application, fakeServer;

function createServer() {
  let server = mockServer();
  server.get('/api/v1/posts', function() {
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

  server.get('/api/v1/posts/:id/group', function() {
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
    fakeServer = createServer();
  },

  afterEach: function() {
    fakeServer.shutdown();
    Ember.run(application, 'destroy');
  }
});

test('visiting /posts/index', function(assert) {
  authenticateSession(application, sessionData);

  visit('/english-service/posts');

  andThen(function() {
    assert.equal(find('.post').length, 2);
  });
});

test('deleting a post', function(assert) {
  authenticateSession(application, sessionData);

  var deletedPost;

  fakeServer.delete('/api/v1/posts/5', function() {
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
