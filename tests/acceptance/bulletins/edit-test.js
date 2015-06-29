import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import nextService from 'mcac/utils/next-service';
import Pretender from 'pretender';
import mockServer from '../../helpers/server';

let application, server;

function announcementPayload(bulletinId, announcementId, announcement) {
  return {
    "attributes": announcement,
    "id": announcementId,
    "links": {
      "self": `/api/v1/announcements/${announcementId}`
    },
    "relationships": {
      "bulletin": {
        "data": { "type": "bulletins", "id": `${bulletinId}` },
        "links": {
          "related": `/api/v1/announcements/${announcementId}/bulletin`,
          "self": `/api/v1/announcements/${announcementId}/relationships/bulletin`
        }
      },
      "post": {
        "data": null,
        "links": {
          "related": `/api/v1/announcements/${announcementId}/post`,
          "self": `/api/v1/announcements/${announcementId}/relationships/post`
        }
      }
    },
    "type": "announcements"
  };
}

function announcementsPayload(bulletinId) {
  return {
    "data": [
      announcementPayload(bulletinId, "8", {
        "description": "This is an announcement",
        "position": 1
      }),
      announcementPayload(bulletinId, "9", {
        "description": "This is the second announcement",
        "url": "http://google.com",
        "position": 2
      }),
      announcementPayload(bulletinId, "10", {
        "description": "This is the third announcement",
        "position": 3
      })
    ]
  };
}

module('Acceptance: Editing a bulletin', {
  needs: ['model:bulletin', 'model:group'],
  beforeEach: function() {
    application = startApp();
    server = mockServer();
  },
  afterEach: function() {
    server.shutdown();
    Ember.run(application, 'destroy');
  }
});

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

    if (bulletin["bannerUrl"]) {
      response.bulletins["bannerUrl"] = bulletin["bannerUrl"];
    }

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });
}

function mockDefaultAnnouncements(bulletinId) {
  server.get('/api/v1/announcements', function(request) {
    if (request.queryParams.defaults_for_bulletin === `${bulletinId}`) {
      var response = { "data": [] };
      return [
        200,
        { "Content-Type": "application/vnd.api+json" },
        JSON.stringify(response)
      ];
    }
  });
}

function mockBulletin(bulletinId, bulletin, withAnnouncements = false) {
  server.get(`/api/v1/bulletins/${bulletinId}`, function(request) {
    let response = {
      "data": {
        attributes: bulletin,
        "id": `${bulletinId}`,
        "links": {
          "self": `/api/v1/bulletins/${bulletinId}`
        },
        "relationships": {
          "announcements": {
            "links": {
              "related": `/api/v1/bulletins/${bulletinId}/announcements`,
              "self": `/api/v1/bulletins/${bulletinId}/relationships/announcements`
            }
          },
          "group": {
            "data": { "type": "groups", "id": "1" },
            "links": {
              "related": `/api/v1/bulletins/${bulletinId}/group`,
              "self": `/api/v1/bulletins/${bulletinId}/relationships/group`
            }
          }
        },
        "type": "bulletins"
      }
    };

    if (!withAnnouncements) {
      response.data.relationships.announcements["data"] = null;
      server.get(`/api/v1/bulletins/${bulletinId}/announcements`, function(request) {
        return [
          200,
          {"Content-Type": "application/vnd.api+json"},
          JSON.stringify({ "data": [] })
        ];
      });
    }

    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
  });
}

test('visiting /:group_slug/bulletins/:id/edit', function(assert) {
  assert.expect(4);

  authenticateSession();

  let bulletin = {
    "published-at": "2015-03-07T03:58:00+00:00",
    "name": "Sunday Service",
    "description": "This is a description",
    "service-order": "This is a service order"
  };

  mockBulletin("1", bulletin);
  mockDefaultAnnouncements("1");

  server.put('/api/v1/announcements/:id', function(request) {
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      request.requestBody
    ];
  });

  visit('/english-service/bulletins/1/edit');

  andThen(function() {
    assert.equal(find('.bulletin-name').val(), bulletin.name);
    assert.equal(find('.description').val(), bulletin.description);
    assert.equal(find('.service-order').val(), bulletin["service-order"]);
    equalDate(assert,
              find('.published-at input').val(),
              window.moment(bulletin["published-at"]));
  });
});

test("Saving bulletins with banners", function(assert) {
  assert.expect(2);

  authenticateSession();

  let bulletin = {
    "published-at": "2015-03-07T03:58:00+00:00",
    "name": "Sunday Service",
    "description": "This is a description",
    "service-order": "This is a service order",
    "banner-url": "/test.png"
  };

  mockBulletin("1", bulletin);
  mockDefaultAnnouncements("1");

  let savedBulletin;

  server.patch('/api/v1/bulletins/:id', function(request) {
    savedBulletin = JSON.parse(request.requestBody);
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      request.requestBody
    ];
  });

  visit("/english-service/bulletins/1/edit");
  click('.save-bulletin');

  andThen(function() {
    assert.equal(savedBulletin.data.attributes["banner-url"], "/test.png");
    assert.equal(find('.image-preview').length, 1);
  });
});

test("Removing bulletin banners", function(assert) {
  assert.expect(1);

  authenticateSession();

  let bulletin = {
    "published-at": "2015-03-07T03:58:00+00:00",
    "name": "Sunday Service",
    "description": "This is a description",
    "service-order": "This is a service order",
    "banner-url": "/test.png"
  };

  mockBulletin("1", bulletin);
  mockDefaultAnnouncements("1");

  var savedBulletin;

  server.patch('/api/v1/bulletins/:id', function(request) {
    savedBulletin = JSON.parse(request.requestBody);
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      request.requestBody
    ];
  });

  visit("/english-service/bulletins/1/edit");
  click('.image-preview .remove');
  click('.save-bulletin');

  andThen(function() {
    assert.equal(savedBulletin.data.attributes["banner-url"], "");
  });
});

test('populates with latest announcements', function(assert) {
  authenticateSession();

  let bulletin = {
    "published-at": "2015-03-07T03:58:00+00:00",
    "name": "Sunday Service",
    "description": "This is a description",
    "service-order": "This is a service order"
  };

  mockBulletin("2", bulletin);

  server.get("/api/v1/announcements", function(request) {
    if (request.queryParams.defaults_for_bulletin === "2") {
      let response = announcementsPayload("1");

      return [
        200,
        { "Content-Type": "application/vnd.api+json" },
        JSON.stringify(response)
      ];
    }
  });

  visit('/english-service/bulletins/2/edit');

  andThen(function() {
    assert.equal(Ember.$(find('.announcement-editor-new .description')[0]).val(),
                 'This is an announcement');
    assert.equal(Ember.$(find('.announcement-editor-new .description')[1]).val(),
                 'This is the second announcement');
    assert.equal(Ember.$(find('.announcement-editor-new .url')[1]).val(),
                 'http://google.com');
    assert.equal(Ember.$(find('.announcement-editor-new .description')[2]).val(),
                 'This is the third announcement');
    assert.equal(find('.announcement-editor').length, 3);
  });
});

test('saving a bulletin', function(assert) {
  let savedBulletin;
  let bulletin = {
    "published-at": "2011-08-22T22:12:00+00:00",
    "name": "Super Service",
    "description": "A super description",
    "service-order": "A super service order"
  };

  mockBulletin("1", bulletin);
  mockDefaultAnnouncements("1");

  assert.expect(5);

  authenticateSession();

  createResponseForBulletin(bulletin);

  server.patch('/api/v1/bulletins/1', function(request) {
    savedBulletin = JSON.parse(request.requestBody);
    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      request.requestBody
    ];
  });

  visit('/english-service/bulletins/1/edit');
  fillIn('.published-at input', '11/30/2000 9:24 PM');
  fillIn('.bulletin-name', 'Updated bulletin name');
  fillIn('.description', 'Updated description');
  fillIn('.service-order', 'Updated service order');
  fillIn('.sermon-notes', 'the updated sermon notes');
  click('.save-bulletin');

  andThen(function() {
    assert.equal(savedBulletin.data.attributes.name,
                 "Updated bulletin name");
    assert.equal(savedBulletin.data.attributes.description,
                 "Updated description");
    assert.equal(savedBulletin.data.attributes["service-order"],
                 "Updated service order");
    assert.equal(savedBulletin.data.attributes["sermon-notes"],
                 "the updated sermon notes");
    equalDate(assert,
              window.moment(savedBulletin.data.attributes["published-at"]),
              window.moment('11/30/2000 9:24 PM', 'MM/DD/YYYY h:mm A'));
  });
});

test('creating a new announcement', function(assert) {
  var createdAnnouncement;

  authenticateSession();

  server.patch('/api/v1/bulletins/1', function(request) {
    var response = JSON.parse(request.requestBody);
    return [
      200,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(response)
    ];
  });

  server.post("/api/v1/announcements", function(request) {
    let requestBody = JSON.parse(request.requestBody);
    createdAnnouncement = {
      "data": announcementPayload("1", "1", requestBody.data.attributes)
    };

    return [
      201,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(createdAnnouncement)
    ];
  });

  let bulletin = {
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "service-order": "This is the service order.",
    "published-at": "2015-03-07T03:58:40+00:00"
  };

  mockBulletin("1", bulletin);
  mockDefaultAnnouncements("1");

  visit('/english-service/bulletins/1/edit');
  click('.append-announcement');
  fillIn('.announcement-editor-new .description', 'This is a new one');
  fillIn('.announcement-editor-new .url', 'http://nba.com');
  click('.save-bulletin');

  andThen(function() {
    // assert.equal(find('.announcement-editor-1 .description').length, 1);
    // assert.equal(find('.announcement-editor').length, 1);
    assert.equal(createdAnnouncement.data.id, "1");
    assert.equal(createdAnnouncement.data.attributes.description, "This is a new one");
    assert.equal(createdAnnouncement.data.attributes.position, 1);
    assert.equal(createdAnnouncement.data.attributes.url, 'http://nba.com');
    assert.equal(createdAnnouncement.data.relationships.bulletin.data.id, '1');
  });
});

test('editing bulletin announcements', function(assert) {
  assert.expect(5);

  authenticateSession();

  var updatedAnnouncement;

  let bulletin = {
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "service-order": "This is the service order.",
    "published-at": "2015-03-07T03:58:40+00:00"
  };

  mockBulletin("1", bulletin, true);
  mockDefaultAnnouncements("1");

  server.get("/api/v1/bulletins/1/announcements", function(request) {
    let response = announcementsPayload("1");

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  server.patch('/api/v1/bulletins/1', function(request) {
    return [200, {"Content-Type": "application/vnd.api+json"}, request.requestBody];
  });

  server.patch('/api/v1/announcements/:id', function(request) {
    updatedAnnouncement = JSON.parse(request.requestBody);
    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(updatedAnnouncement)];
  });

  visit('/english-service/bulletins/1/edit');
  fillIn('.announcement-editor-8 .description', 'This is the first announcement');
  fillIn('.announcement-editor-9 .description', 'This is the second announcement');
  fillIn('.announcement-editor-10 .description', 'This is the third announcement');
  fillIn('.announcement-editor-10 .url', 'http://mcac.church');
  click('.save-bulletin');

  andThen(function() {
    assert.equal(find('.announcement-editor-8 .description').val(), 'This is the first announcement');
    assert.equal(find('.announcement-editor-9 .description').val(), 'This is the second announcement');
    assert.equal(find('.announcement-editor-10 .description').val(), 'This is the third announcement');
    assert.equal(find('.announcement-editor').length, 3);

    assert.equal(updatedAnnouncement.data.attributes.url, 'http://mcac.church');
  });
});

test('deleting bulletin announcements', function(assert) {
  assert.expect(4);

  authenticateSession();

  var deletedBulletinId, updatedBulletin;

  let bulletin = {
    "description": "This is a service bulletin.",
    "name": "Sunday Service",
    "service-order": "This is the service order.",
    "published-at": "2015-03-07T03:58:40+00:00"
  };

  mockBulletin("1", bulletin, true);
  mockDefaultAnnouncements("1");

  server.get("/api/v1/bulletins/1/announcements", function(request) {
    let response = announcementsPayload("1");

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });

  server.delete('/api/v1/announcements/:id', function(request) {
    deletedBulletinId = request.params.id;
    return [204, {"Content-Type": "application/vnd.api+json"}, ''];
  });

  visit('/english-service/bulletins/1/edit');
  click('.announcement-editor-9 .remove-announcement');

  andThen(function() {
    assert.equal(find('.announcement-editor-8 .description').val(), 'This is an announcement');
    assert.equal(find('.announcement-editor-10 .description').val(), 'This is the third announcement');
    assert.equal(find('.announcement-editor').length, 2);
    assert.equal(deletedBulletinId, '9');
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
        window.moment(expected).toDate().getTime());
}
