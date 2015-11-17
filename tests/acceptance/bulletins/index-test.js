import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { test, module } from 'qunit';
import mockServer from '../../helpers/server';
import BulletinPayload from '../../helpers/payloads/bulletin';
import sessionData from '../../helpers/payloads/sessionData';
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';

let application, server;

module('Acceptance: BulletinsIndex', {
  beforeEach: function() {
    application = startApp();
    server = mockServer();
    mockBulletins();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

function mockBulletins() {
  server.get('/api/v1/bulletins', function(request) {
    if (request.queryParams["filter[group]"] === "1") {
      let bulletin1 = {
        "name": "Sunday Worship Service 1",
        "published-at": "2014-10-07T03:58:00+00:00"
      };

      let bulletin2 = {
        "name": "Sunday Worship Service 2",
        "published-at": "2015-06-07T03:58:00+00:00"
      };

      let bulletin3 = {
        "name": "Sunday Worship Service 3b",
        "published-at": "2015-03-07T03:58:00+00:00"
      };

      let bulletin4 = {
        "name": "Sunday Worship Service 3a",
        "published-at": "2015-03-07T03:58:00+00:00"
      };

      let response = {
        "data": [
          BulletinPayload.build(1, bulletin1),
          BulletinPayload.build(2, bulletin2),
          BulletinPayload.build(3, bulletin3),
          BulletinPayload.build(4, bulletin4)
        ]
      };

      return [
        200,
        { "Content-Type": "application/vnd.api+json" },
        JSON.stringify(response)
      ];
    }
  });

  return server;
}

test('Requires authentication', function(assert) {
  visit('/english-service/bulletins');

  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});

test('visiting /english-service/bulletins', function(assert) {
  authenticateSession(application, sessionData);

  visit('/english-service/bulletins');

  andThen(function() {
    assert.equal($(".bulletin-name", $(".bulletin")[0]).text(), "Sunday Worship Service 2");
    assert.equal($(".bulletin-name", $(".bulletin")[1]).text(), "Sunday Worship Service 3a");
    assert.equal($(".bulletin-name", $(".bulletin")[2]).text(), "Sunday Worship Service 3b");
    assert.equal($(".bulletin-name", $(".bulletin")[3]).text(), "Sunday Worship Service 1");
    assert.equal(currentURL(), '/english-service/bulletins');
  });
});
