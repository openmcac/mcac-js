import Ember from 'ember';
import startApp from '../../../helpers/start-app';
import Pretender from 'pretender';
import { module, test } from 'qunit';

var application;

var englishService = {
  "id": "1",
  "name": "English Service",
  "slug": "english-service",
  "createdAt": "2015-03-07T03:58:39+00:00"
};

var groups = { "1": englishService };

var announcements = {
  "1": {
    "id": "1",
    "description": "This is the first announcement",
    "position": 1,
    "links": {
      "bulletin": "1",
      "post": null
    }
  },
  "2": {
    "id": "2",
    "description": "This is the second announcement",
    "position": 2,
    "links": {
      "bulletin": "1",
      "post": null
    }
  },
  "3": {
    "id": "3",
    "description": "This is the third announcement",
    "position": 3,
    "links": {
      "bulletin": "1",
      "post": null
    }
  }
};

module('Acceptance: /sunday route', {
  needs: ['model:group', 'model:bulletin', 'model:announcement'],
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('route returns model from /api/v1/sunday', function(assert) {
  assert.expect(10);

  var server = new Pretender(function() {
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

    this.get('/api/v1/announcements/:id', function(request) {
      var announcement = {
        "announcements": announcements[request.params.id]
      };
      return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(announcement)];
    });

    this.get('/api/v1/sunday', function(request) {
      var response = {
        "bulletins": {
          "id": "1",
          "description": "This is a service bulletin.",
          "name": "Sunday Service",
          "serviceOrder": "This is the service order.",
          "publishedAt": "2014-12-21T13:58:27-05:00",
          "links": {
            "group": "1",
            "announcements": ["1", "2", "3"]
          }
        }
      };
      return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
    });
  });

  visit('/sunday');

  andThen(function() {
    var controller = application.__container__
                                .lookup('controller:bulletin/sunday/index');

    // it populates the bulletin attributes
    var model = controller.model;
    assert.equal(model.get('name'), 'Sunday Service');
    assert.equal(model.get('publishedAt').getTime(),
          new Date('2014-12-21T13:58:27-05:00').getTime());

    // it populates the bulletin's group
    model.get('group').then(function(group) {
      assert.equal(group.get('name'), 'English Service');
      assert.equal(group.get('slug'), 'english-service');
    });

    // it populates the bulletin's announcements
    var announcements = model.get('announcements');
    Ember.run(function() {
      announcementEqual(assert, announcements.objectAt(0), {
        description: 'This is the first announcement',
        position: 1
      });
      announcementEqual(assert, announcements.objectAt(1), {
        description: 'This is the second announcement',
        position: 2
      });
      announcementEqual(assert, announcements.objectAt(2), {
        description: 'This is the third announcement',
        position: 3
      });
    });
  });
});

function announcementEqual(assert, announcement, hash) {
  Object.keys(hash).forEach(function(key) {
    assert.equal(announcement.get(key), hash[key]);
  });
}
