import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'mcac/tests/helpers/start-app';
import Pretender from 'pretender';

var application, server;

module('Acceptance: BulletinsIndex', {
  beforeEach: function() {
    application = startApp();

    server = createServer();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

function createBulletinJson(bulletin) {
  return {
    "id": bulletin.id,
    "description": bulletin.description,
    "name": bulletin.name,
    "serviceOrder": bulletin.serviceOrder,
    "publishedAt": bulletin.publishedAt,
    "links": {
      "group": "1",
      "announcements": bulletin.announcements
    }
  };
}

function createServer() {
  return new Pretender(function() {
    var englishService = {
      "id": "1",
      "name": "English Service",
      "slug": "english-service",
      "createdAt": "2015-03-07T03:58:39+00:00"
    };

    var groups = { "groups": [englishService] };

    this.get('/api/v1/groups', function(request) {
      var all = JSON.stringify(groups);
      return [200, {"Content-Type": "application/vnd.api+json"}, all];
    });

    this.get('/api/v1/bulletins', function(request) {
      if (request.queryParams.group === '1') {
        var response = {
          "bulletins": [
            createBulletinJson({
              id: "1",
              description: "",
              name: "First bulletin",
              publishedAt: "2015-03-07T03:58:00+00:00",
              announcements: ["1", "2"]
            }),
            createBulletinJson({
              id: "2",
              description: "",
              name: "Second bulletin",
              publishedAt: "2015-03-08T03:58:00+00:00",
              announcements: ["3", "4"]
            }),
            createBulletinJson({
              id: "3",
              description: "",
              name: "Third bulletin",
              publishedAt: "2015-03-09T03:58:00+00:00",
              announcements: []
            })
          ]
        };

        return [
          200,
          {"Content-Type": "application/vnd.api+json"},
          JSON.stringify(response)
        ];
      }
    });
  });
}

test('Viewing bulletins for a group', function(assert) {
  visit('/english-service/bulletins');

  andThen(function() {
    assert.equal(currentPath(), 'group.bulletins.index');
    assert.equal(Ember.$(find('.bulletin-name')[0]).text().trim(), 'First bulletin');
    assert.equal(Ember.$(find('.bulletin-name')[1]).text().trim(), 'Second bulletin');
    assert.equal(Ember.$(find('.bulletin-name')[2]).text().trim(), 'Third bulletin');
    assert.equal(find('.bulletin').length, 3);
  });
});

test('Deleting a bulletin', function(assert) {
  visit('/english-service/bulletins');

  var deletedAnnouncementId;

  server.delete('/api/v1/bulletins/:id', function(request) {
    deletedAnnouncementId = request.params.id;

    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify({})
    ];
  });

  click('.bulletin-2 .remove-bulletin');

  andThen(function() {
    assert.equal(deletedAnnouncementId, '2');
  });
});
