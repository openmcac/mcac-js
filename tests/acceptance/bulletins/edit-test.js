import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import nextService from 'mcac/utils/next-service';
import Pretender from 'pretender';

var application;

var englishService = {
  "id": "1",
  "name": "English Service",
  "slug": "english-service",
  "createdAt": "2015-03-07T03:58:39+00:00"
};

var groups = { "groups": [englishService] };

var announcements = {
  "8": {
    "id": "8",
    "description": "This is announcement 1",
    "position": 1,
    "links": {
      "bulletin": "1",
      "post": null
    }
  },
  "9": {
    "id": "9",
    "description": "This is an announcement",
    "position": 2,
    "links": {
      "bulletin": "1",
      "post": null
    }
  },
  "10": {
    "id": "10",
    "description": "This is an announcement",
    "position": 3,
    "links": {
      "bulletin": "1",
      "post": null
    }
  }
};

module('Acceptance: Editing a bulletin', {
  needs: ['model:bulletin', 'model:group'],
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /:group_slug/bulletins/:id/edit', function(assert) {
  assert.expect(4);

  var publishedAt = "2015-03-07T03:58:00+00:00";
  var name = "Sunday Service";
  var description = "This is a description";
  var serviceOrder = "This is a service order";

  Ember.run(function() {
    var server = new Pretender(function() {
      this.get('/api/v1/groups', function(request) {
        var all = JSON.stringify(groups);
        return [200, {"Content-Type": "application/vnd.api+json"}, all];
      });

      this.get('/api/v1/announcements', function(request) {
        if (request.queryParams.latest_for_group === '1') {
          var response = { "announcements": [] };
          return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
        }
      });

      this.get('/api/v1/bulletins/1', function(request) {
        var response = {
          "bulletins": {
            "id": "1",
            "description": description,
            "name": name,
            "serviceOrder": serviceOrder,
            "publishedAt": publishedAt,
            "links": {
              "group": "1",
              "announcements": []
            }
          }
        };
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
      });
    });
  });

  visit('/english-service/bulletins/1/edit');

  andThen(function() {
    assert.equal(find('.bulletin-name').val(), name);
    equalDate(assert, find('.published-at input').val(), window.moment(publishedAt));
    assert.equal(find('.description').val(), description);
    assert.equal(find('.service-order').val(), serviceOrder);
  });
});

test('saving a bulletin', function(assert) {
  assert.expect(4);

  var publishedAt = "2011-08-22T22:12:00+00:00";
  var name = "Super Service";
  var description = "A super description";
  var serviceOrder = "A super service order";
  var updatedBulletin;

  Ember.run(function() {
    var server = new Pretender(function() {
      this.get('/api/v1/groups', function(request) {
        var all = JSON.stringify(groups);
        return [200, {"Content-Type": "application/vnd.api+json"}, all];
      });

      this.put('/api/v1/bulletins/1', function(request) {
        updatedBulletin = JSON.parse(request.requestBody);
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(updatedBulletin)];
      });

      this.get('/api/v1/bulletins/1', function(request) {
        var response = {
          "bulletins": {
            "id": "1",
            "description": "This is a service bulletin.",
            "name": "Sunday Service",
            "serviceOrder": "This is the service order.",
            "publishedAt": "2015-03-07T03:58:40+00:00",
            "links": {
              "group": "1",
              "announcements": []
            }
          }
        };
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
      });
    });
  });

  visit('/english-service/bulletins/1/edit');
  fillIn('.published-at input', '11/30/2000 9:24 PM');
  fillIn('.bulletin-name', 'Updated bulletin name');
  fillIn('.description', 'Updated description');
  fillIn('.service-order', 'Updated service order');
  click('.save-bulletin');

  andThen(function() {
    assert.equal(updatedBulletin.bulletins.name, 'Updated bulletin name');
    assert.equal(updatedBulletin.bulletins.description, 'Updated description');
    assert.equal(updatedBulletin.bulletins.serviceOrder, 'Updated service order');
    equalDate(assert,
              window.moment(updatedBulletin.bulletins.publishedAt),
              window.moment('11/30/2000 9:24 PM', 'MM/DD/YYYY h:mm A'));
  });
});

test('creating a new announcement', function(assert) {
  var createdAnnouncement;

  Ember.run(function() {
    var server = new Pretender(function() {
      this.get('/api/v1/groups', function(request) {
        var all = JSON.stringify(groups);
        return [200, {"Content-Type": "application/vnd.api+json"}, all];
      });

      this.get('/api/v1/announcements/:id', function(request) {
        var announcement = {
          "announcements": announcements[request.params.id]
        };
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(announcement)];
      });

      this.put('/api/v1/announcements/:id', function(request) {
        return [200, {"Content-Type": "application/vnd.api+json"}, request.requestBody];
      });

      this.put('/api/v1/bulletins/1', function(request) {
        var response = JSON.parse(request.requestBody);
        return [
          200,
          {"Content-Type": "application/vnd.api+json"},
          JSON.stringify(response)
        ];
      });

      this.post('/api/v1/announcements', function(request) {
        createdAnnouncement = JSON.parse(request.requestBody);
        createdAnnouncement.announcements.id = '1';
        return [
          200,
          {"Content-Type": "application/vnd.api+json"},
          JSON.stringify(createdAnnouncement)
        ];
      });

      this.get('/api/v1/bulletins/1', function(request) {
        var response = {
          "bulletins": {
            "id": "1",
            "description": "This is a service bulletin.",
            "name": "Sunday Service",
            "serviceOrder": "This is the service order.",
            "publishedAt": "2015-03-07T03:58:40+00:00",
            "links": {
              "group": "1",
              "announcements": []
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
  });

  visit('/english-service/bulletins/1/edit');
  click('.append-announcement');
  fillIn('.announcement-editor-new', 'This is a new one');
  click('.save-bulletin');

  andThen(function() {
    assert.equal(find('.announcement-editor-1').length, 1);
    assert.equal(find('.announcement-editor').length, 1);
    assert.equal(createdAnnouncement.announcements.id, "1");
    assert.equal(createdAnnouncement.announcements.description, "This is a new one");
    assert.equal(createdAnnouncement.announcements.position, 1);
    assert.equal(createdAnnouncement.announcements.links.bulletin, '1');
  });
});

test('editing bulletin announcements', function(assert) {
  assert.expect(4);

  var updatedBulletin;

  Ember.run(function() {
    var server = new Pretender(function() {
      this.get('/api/v1/groups', function(request) {
        var all = JSON.stringify(groups);
        return [200, {"Content-Type": "application/vnd.api+json"}, all];
      });

      this.get('/api/v1/announcements/:id', function(request) {
        var announcement = {
          "announcements": announcements[request.params.id]
        };
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(announcement)];
      });

      this.put('/api/v1/announcements/:id', function(request) {
        return [200, {"Content-Type": "application/vnd.api+json"}, request.requestBody];
      });

      this.put('/api/v1/bulletins/1', function(request) {
        updatedBulletin = JSON.parse(request.requestBody);
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(updatedBulletin)];
      });

      this.get('/api/v1/bulletins/1', function(request) {
        var response = {
          "bulletins": {
            "id": "1",
            "description": "This is a service bulletin.",
            "name": "Sunday Service",
            "serviceOrder": "This is the service order.",
            "publishedAt": "2015-03-07T03:58:40+00:00",
            "links": {
              "group": "1",
              "announcements": ["8", "9", "10"]
            }
          }
        };
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
      });
    });
  });

  visit('/english-service/bulletins/1/edit');
  fillIn('.announcement-editor-8', 'This is the first announcement');
  fillIn('.announcement-editor-9', 'This is the second announcement');
  fillIn('.announcement-editor-10', 'This is the third announcement');
  click('.save-bulletin');

  andThen(function() {
    assert.equal(find('.announcement-editor-8').val(), 'This is the first announcement');
    assert.equal(find('.announcement-editor-9').val(), 'This is the second announcement');
    assert.equal(find('.announcement-editor-10').val(), 'This is the third announcement');
    assert.equal(find('.announcement-editor').length, 3);
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
        window.moment(expected).toDate().getTime());
}
