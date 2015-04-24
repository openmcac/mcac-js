import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import Pretender from 'pretender';

var application;

var englishService = {
  "id": "1",
  "name": "English Service",
  "slug": "english-service",
  "createdAt": "2015-03-07T03:58:39+00:00"
};

var groups = { "1": englishService };

module('Acceptance: PostsNew', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

function createServer() {
  return new Pretender(function() {
    this.get('/api/v1/groups', function(request) {
      var all = JSON.stringify({ groups: [groups["1"]] });
      return [200, {"Content-Type": "application/vnd.api+json"}, all];
    });

    this.get('/api/v1/groups/:id', function(request) {
      var group = {
        "groups": groups[request.params.id]
      };

      return [
        200,
        {"Content-Type": "application/vnd.api+json"},
        JSON.stringify(group)
      ];
    });
  });
}

test('saving a post', function(assert) {
  authenticateSession();

  var server = createServer(),
      postTitle = 'post title',
      content = 'post **markdown**',
      tags = 'tag5, tag6, tag7',
      createdPost;

  server.post('/api/v1/posts', function(request) {
    createdPost = JSON.parse(request.requestBody);
    createdPost.posts.id = '1';

    return [
      200,
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
    assert.equal(createdPost.posts.title, postTitle);
    assert.equal(createdPost.posts.content, content);
    assert.deepEqual(createdPost.posts.tags, ['tag5', 'tag6', 'tag7']);
  });
});
