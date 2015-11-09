import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import nextService from 'mcac/utils/next-service';
import mockServer from '../../helpers/server';
import BulletinPayload from '../../helpers/payloads/bulletin';
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';

var application, server;

function mockDefaultAnnouncements(bulletinId) {
  server.get('/api/v1/announcements', function(request) {
    if (request.queryParams["filter[defaults_for_bulletin]"] === `${bulletinId}`) {
      var response = { "data": [] };
      return [
        200,
        { "Content-Type": "application/vnd.api+json" },
        JSON.stringify(response)
      ];
    }
  });
}

function mockBulletins(bulletins) {
  server.get('/api/v1/bulletins', function(request) {
    if (request.queryParams["filter[latest_for_group]"] === '1') {
      return [
        200,
        {"Content-Type": "application/vnd.api+json"},
        JSON.stringify({ data: bulletins })
      ];
    }
  });
}

function mockBulletin(bulletinId, bulletin, withAnnouncements = false) {
  server.get(`/api/v1/bulletins/${bulletinId}`, function() {
    let response = {
      "data": BulletinPayload.build(bulletinId, bulletin, {
        withAnnouncements: withAnnouncements
      })
    };

    return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
  });

  if (!withAnnouncements) {
    server.get(`/api/v1/bulletins/${bulletinId}/announcements`, function() {
      return [
        200,
        {"Content-Type": "application/vnd.api+json"},
        JSON.stringify({ "data": [] })
      ];
    });
  }
}

module('Acceptance: New bulletin form', {
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

test('default bulletin values without a previous bulletin', function(assert) {
  assert.expect(3);

  mockBulletins([]);

  visit('/english-service/bulletins/new');

  andThen(function() {
    assert.equal(find('.bulletin-name').val(), 'Sunday Worship Service');
    equalDate(assert, find('.published-at input').val(), nextService());
    assert.equal(find('.service-order').val(), '');
  });
});

test("defaults with last week's service order if available", function(assert) {
  assert.expect(1);

  mockBulletins([BulletinPayload.build("1", {
    "service-order": "Last week's service order"
  })]);

  visit('/english-service/bulletins/new');

  andThen(function() {
    assert.equal(find('.service-order').val(), "Last week's service order");
  });
});

test('saving a bulletin navigates to edit page', function(assert) {
  authenticateSession();

  var createdBulletin;

  mockBulletins([]);
  mockDefaultAnnouncements("2");

  server.post("/api/v1/bulletins", function(request) {
    let requestBody = JSON.parse(request.requestBody);
    createdBulletin = {
      "data": BulletinPayload.build("2", requestBody.data.attributes)
    };

    mockBulletin("2", requestBody.data.attributes);

    return [
      201,
      {"Content-Type": "application/vnd.api+json"},
      JSON.stringify(createdBulletin)
    ];
  });

  visit('/english-service/bulletins/new');
  fillIn('.published-at input', '03/10/2010 9:30 AM');
  fillIn(".sermon-notes", "these are sermon notes");
  click(':submit');

  andThen(function() {
    equalDate(assert,
              find(".published-at input").val(),
              window.moment(createdBulletin.data.attributes["published-at"]));
    assert.equal(createdBulletin.data.attributes["sermon-notes"],
                 "these are sermon notes");
    assert.equal(currentURL(), "/english-service/bulletins/2/edit");
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}
