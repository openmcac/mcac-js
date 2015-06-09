import Ember from 'ember';
import startApp from '../../helpers/start-app';
import Pretender from 'pretender';
import { test, module } from 'qunit';
import mockServer from '../../helpers/server';

let application, server;

module('Acceptance: BulletinsIndex', {
  beforeEach: function() {
    application = startApp();
    server = createServer();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

function createServer() {
  var server = mockServer();
  server.get('/api/v1/bulletins', function(request) {
    if (request.queryParams.group === '1') {
      let bulletin1 = {
        id: 1,
        name: "Sunday Worship Service 1",
        publishedAt: "2014-10-07T03:58:00+00:00"
      };

      let bulletin2 = {
        id: 2,
        name: "Sunday Worship Service 2",
        publishedAt: "2015-06-07T03:58:00+00:00"
      };

      let bulletin3 = {
        id: 3,
        name: "Sunday Worship Service 3",
        publishedAt: "2015-03-07T03:58:00+00:00"
      };

      var response = {
        "bulletins": [
          createJsonForBulletin(bulletin1),
          createJsonForBulletin(bulletin2),
          createJsonForBulletin(bulletin3)
        ]
      };

      return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
    }
  });

  return server;
}

function createJsonForBulletin(bulletin) {
  let response = {
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

  if (bulletin["bannerUrl"]) {
    response["bannerUrl"] = bulletin["bannerUrl"];
  }

  return response;
}

function createResponseForBulletin(bulletin) {
  server.get(`/api/v1/bulletins/${bulletin.id}`, function(request) {
    let response = {
      bulletins: createJsonForBulletin(bulletin)
    };

    return [
      200,
      { "Content-Type": "application/vnd.api+json" },
      JSON.stringify(response)
    ];
  });
}

test('Requires authentication', function(assert) {
  visit('/english-service/bulletins');

  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});

test('visiting /english-service/bulletins', function(assert) {
  authenticateSession();

  visit('/english-service/bulletins');

  andThen(function() {
    assert.equal($(".bulletin-name", $(".bulletin")[0]).text(), "Sunday Worship Service 2");
    assert.equal($(".bulletin-name", $(".bulletin")[1]).text(), "Sunday Worship Service 3");
    assert.equal($(".bulletin-name", $(".bulletin")[2]).text(), "Sunday Worship Service 1");
    assert.equal(currentURL(), '/english-service/bulletins');
  });
});
