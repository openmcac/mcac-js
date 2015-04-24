import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import Pretender from 'pretender';
import startApp from 'mcac/tests/helpers/start-app';

var application, server;

var englishService = {
  "id": "1",
  "name": "English Service",
  "slug": "english-service",
  "createdAt": "2015-03-07T03:58:39+00:00"
};

var groups = { "groups": [englishService] };

module('Acceptance: PostIndex', {
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
  return new Pretender(function() {
    this.get('/api/v1/groups', function(request) {
      var all = JSON.stringify(groups);
      return [200, {"Content-Type": "application/vnd.api+json"}, all];
    });

    this.get('/api/v1/posts/12', function(request) {
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
  });
}

test('visiting /english-service/12/this-is-a-title', function(assert) {
  visit('/english-service/12/this-is-a-title');

  andThen(function() {
    assert.equal(find('.post-12').length, 1);
    assert.equal(find('.post-title').text().trim(), 'This is a title');
    assert.equal(find('.content').text().trim(), 'This is my post content');
  });
});
