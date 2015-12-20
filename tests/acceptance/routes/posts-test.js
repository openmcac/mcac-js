import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import mockServer from 'mcac/tests/helpers/server';
import PostPayload from 'mcac/tests/helpers/payloads/post';
import GroupPayload from 'mcac/tests/helpers/payloads/group';
import sessionData from '../../helpers/payloads/sessionData';
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';

var application, fakeServer;

module('Acceptance: Post Routes', {
  beforeEach: function() {
    application = startApp();
    fakeServer = createServer();
  },

  afterEach: function() {
    fakeServer.shutdown();
    Ember.run(application, 'destroy');
  }
});

function createServer() {
  var server = mockServer();
  server.get('/api/v1/posts', function() {
    var response = { "data": [] };
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  server.get('/api/v1/posts/1', function() {
    var response = {
      "data": PostPayload.build(1, {
        "title": "This is a title",
        "slug": "this-is-a-title",
        "published-at": "2015-03-11T04:01:33+00:00"
      })
    };

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  server.get('/api/v1/posts/1/group', function() {
    var response = { "data": GroupPayload.englishService() };

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  return server;
}

test('viewing post index', function(assert) {
  authenticateSession(application, sessionData);

  visit('/english-service/posts');

  andThen(function() {
    assert.equal(currentPath(), 'group.posts.index');
  });
});

test('viewing a post', function(assert) {
  authenticateSession(application, sessionData);

  visit('/english-service/2015/03/11/1/this-is-a-title');

  andThen(function() {
    assert.equal(currentPath(), 'group.post.index.index');
  });
});

test('editing a post', function(assert) {
  authenticateSession(application, sessionData);

  visit('/english-service/post/1/edit');

  andThen(function() {
    assert.equal(currentPath(), 'group.post.edit.index');
  });
});
