import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import Pretender from 'pretender';

var application, server;

var englishService = {
  "id": "1",
  "name": "English Service",
  "slug": "english-service",
  "createdAt": "2015-03-07T03:58:39+00:00"
};

var groups = { "1": englishService };

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

    this.get('/api/v1/posts', function(request) {
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
  });
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
  visit('/english-service/posts');

  andThen(function() {
    assert.equal(find('.post').length, 2);
  });
});
