import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import mockServer from 'mcac/tests/helpers/server';

var application, server;

module('Acceptance: Post Routes', {
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
  server.get('/api/v1/posts', function(request) {
    var response = { posts: [] };
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  server.get('/api/v1/posts/1', function(request) {
    var response = {
      posts: {
        id: 1,
        title: 'This is a title',
        slug: 'this-is-a-title',
        publishedAt: "2015-03-11T04:01:33+00:00"
      }
    };
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  return server;
}

test('viewing post index', function(assert) {
  authenticateSession();

  visit('/english-service/posts');

  andThen(function() {
    assert.equal(currentPath(), 'group.posts.index');
  });
});

test('viewing a post', function(assert) {
  authenticateSession();

  visit('/english-service/2015/03/11/1/this-is-a-title');

  andThen(function() {
    assert.equal(currentPath(), 'group.post.index.index');
  });
});

test('editing a post', function(assert) {
  authenticateSession();

  visit('/english-service/post/1/edit');

  andThen(function() {
    assert.equal(currentPath(), 'group.post.edit.index');
  });
});
