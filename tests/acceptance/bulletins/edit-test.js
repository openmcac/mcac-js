import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import nextService from 'mcac/utils/next-service';
import Pretender from 'pretender';

var application, server;

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
    "description": "This is announcement 8",
    "position": 1,
    "links": {
      "bulletin": "1",
      "post": null
    }
  },
  "9": {
    "id": "9",
    "description": "This is announcement 9",
    "position": 2,
    "links": {
      "bulletin": "1",
      "post": null
    }
  },
  "10": {
    "id": "10",
    "description": "This is announcement 10",
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
    server = createServer();
  },
  teardown: function() {
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

    this.get('/api/v1/announcements', function(request) {
      if (request.queryParams.defaults_for_bulletin === '1') {
        var response = { "announcements": [] };
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
      }
    });

    this.get('/api/v1/announcements/:id', function(request) {
      var announcement = {
        "announcements": announcements[request.params.id]
      };

      return [
        200,
        {"Content-Type": "application/vnd.api+json"},
        JSON.stringify(announcement)
      ];
    });

    this.put('/api/v1/announcements/:id', function(request) {
      return [200, {"Content-Type": "application/vnd.api+json"}, request.requestBody];
    });
  });
}

function createResponseForBulletin(bulletin) {
  server.get(`/api/v1/bulletins/${bulletin.id}`, function(request) {
    var response = {
      "bulletins": {
        "id": bulletin.id,
        "description": bulletin.description,
        "name": bulletin.name,
        "serviceOrder": bulletin.serviceOrder,
        "publishedAt": bulletin.publishedAt,
        "links": {
          "group": "1",
          "announcements": bulletin.announcements
        }
      }
    };
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });
}

test('visiting /:group_slug/bulletins/:id/edit', function(assert) {
  assert.expect(4);

  authenticateSession();

  var bulletin = {
    id: "1",
    publishedAt: "2015-03-07T03:58:00+00:00",
    name: "Sunday Service",
    description: "This is a description",
    serviceOrder: "This is a service order",
    announcements: []
  };

  createResponseForBulletin(bulletin);

  visit('/english-service/bulletins/1/edit');

  andThen(function() {
    assert.equal(find('.bulletin-name').val(), bulletin.name);
    assert.equal(find('.description').val(), bulletin.description);
    assert.equal(find('.service-order').val(), bulletin.serviceOrder);
    equalDate(assert,
              find('.published-at input').val(),
              window.moment(bulletin.publishedAt));
  });
});

test('populates with latest announcements', function(assert) {
  authenticateSession();

  var bulletin = {
    id: "2",
    publishedAt: "2015-03-07T03:58:00+00:00",
    name: "Sunday Service",
    description: "This is a description",
    serviceOrder: "This is a service order",
    announcements: []
  };

  createResponseForBulletin(bulletin);

  server.get('/api/v1/announcements', function(request) {
    if (request.queryParams.defaults_for_bulletin === '2') {
      var response = {
        announcements: [
          {
            "id": "1",
            "description": "This is an announcement",
            "position": 1,
            "links": {
              "bulletin": "1",
              "post": "1"
            }
          }, {
            "id": "2",
            "description": "This is the second announcement",
            "position": 2,
            "links": {
              "bulletin": "1",
              "post": "1"
            }
          }, {
            "id": "3",
            "description": "This is the third announcement",
            "position": 3,
            "links": {
              "bulletin": "1",
              "post": "1"
            }
          }
        ]
      };

      return [
        200,
        { "Content-Type": "application/vnd.api+json" },
        JSON.stringify(response)
      ];
    }
  });


  visit('/english-service/bulletins/2/edit');

  andThen(function() {
    assert.equal(Ember.$(find('.announcement-editor-new')[0]).val(),
                 'This is an announcement');
    assert.equal(Ember.$(find('.announcement-editor-new')[1]).val(),
                 'This is the second announcement');
    assert.equal(Ember.$(find('.announcement-editor-new')[2]).val(),
                 'This is the third announcement');
    assert.equal(find('.announcement-editor').length, 3);
  });
});

test('saving a bulletin', function(assert) {
  var updatedBulletin,
      bulletin = {
        id: "1",
        publishedAt: "2011-08-22T22:12:00+00:00",
        name: "Super Service",
        description: "A super description",
        serviceOrder: "A super service order",
        announcements: []
      };

  assert.expect(4);

  authenticateSession();

  createResponseForBulletin(bulletin);

  server.put('/api/v1/bulletins/1', function(request) {
    updatedBulletin = JSON.parse(request.requestBody);
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(updatedBulletin)
    ];
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

  authenticateSession();

  server.put('/api/v1/bulletins/1', function(request) {
    var response = JSON.parse(request.requestBody);
    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(response)
    ];
  });

  server.post('/api/v1/announcements', function(request) {
    createdAnnouncement = JSON.parse(request.requestBody);
    createdAnnouncement.announcements.id = '1';
    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(createdAnnouncement)
    ];
  });

  createResponseForBulletin({
    "id": "1",
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "serviceOrder": "This is the service order.",
    "publishedAt": "2015-03-07T03:58:40+00:00",
    "announcements": []
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

  authenticateSession();

  var updatedBulletin;

  createResponseForBulletin({
    "id": "1",
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "serviceOrder": "This is the service order.",
    "publishedAt": "2015-03-07T03:58:40+00:00",
    "announcements": ["8", "9", "10"]
  });

  server.put('/api/v1/bulletins/1', function(request) {
    updatedBulletin = JSON.parse(request.requestBody);
    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(updatedBulletin)];
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

test('deleting bulletin announcements', function(assert) {
  assert.expect(4);

  authenticateSession();

  var deletedBulletinId, updatedBulletin;

  createResponseForBulletin({
    "id": "1",
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "serviceOrder": "This is the service order.",
    "publishedAt": "2015-03-07T03:58:40+00:00",
    "announcements": ["8", "9", "10"]
  });

  server.delete('/api/v1/announcements/:id', function(request) {
    deletedBulletinId = request.params.id;
    return [200, {"Content-Type": "application/vnd.api+json"}, '{}'];
  });

  visit('/english-service/bulletins/1/edit');
  click('.announcement-editor-9 ~ .remove-announcement');

  andThen(function() {
    assert.equal(find('.announcement-editor-8').val(), 'This is announcement 8');
    assert.equal(find('.announcement-editor-10').val(), 'This is announcement 10');
    assert.equal(find('.announcement-editor').length, 2);
    assert.equal(deletedBulletinId, '9');
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
        window.moment(expected).toDate().getTime());
}
