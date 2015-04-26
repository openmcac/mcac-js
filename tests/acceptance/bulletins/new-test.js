import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import nextService from 'mcac/utils/next-service';
import Pretender from 'pretender';
import mockServer from '../../helpers/server';

var application, server;

module('Acceptance: New bulletin form', {
  needs: ['model:bulletin', 'model:group'],
  setup: function() {
    application = startApp();
    server = mockServer();
  },
  teardown: function() {
    server.shutdown();
    Ember.run(application, 'destroy');
  }
});

test('default bulletin values without a previous bulletin', function(assert) {
  assert.expect(3);

  server.get('/api/v1/bulletins', function(request) {
    if (request.queryParams.latest_for_group === '1') {
      var response = { bulletins: [] };
      return [
        200,
        {"Content-Type": "application/vnd.api+json"},
        JSON.stringify(response)
      ];
    }
  });

  visit('/english-service/bulletins/new');

  andThen(function() {
    assert.equal(find('.bulletin-name').val(), 'Sunday Worship Service');
    equalDate(assert, find('.published-at input').val(), nextService());
    assert.equal(find('.service-order').val(), '');
  });
});

test("defaults with last week's service order if available", function(assert) {
  assert.expect(1);

  server.get('/api/v1/bulletins', function(request) {
    if (request.queryParams.latest_for_group === '1') {
      var response = {
        "bulletins": [{
          "id": "1",
          "serviceOrder": "Last week's service order",
          "links": {
            "group": "1",
            "announcements": []
          }
        }]
      };

      return [
        200,
        {"Content-Type": "application/vnd.api+json"},
        JSON.stringify(response)
      ];
    }
  });

  visit('/english-service/bulletins/new');

  andThen(function() {
    assert.equal(find('.service-order').val(), "Last week's service order");
  });
});

test('saving a bulletin navigates to edit page', function(assert) {
  assert.expect(1);

  authenticateSession();

  server.get('/api/v1/bulletins', function(request) {
    if (request.queryParams.latest_for_group === '1') {
      var response = { bulletins: [] };
      return [
        200,
        {"Content-Type": "application/vnd.api+json"},
        JSON.stringify(response)
      ];
    }
  });

  server.get('/api/v1/announcements', function(request) {
    if (request.queryParams.defaults_for_bulletin === '2') {
      var response = { "announcements": [] };
      return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
    }
  });

  server.post('/api/v1/bulletins', function(request) {
    var response = {
      "bulletins": {
        "id": "2",
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

  visit('/english-service/bulletins/new');
  fillIn('.published-at', '03/10/2010 9:30 AM');
  click(':submit');

  andThen(function() {
    assert.equal(currentURL(), '/english-service/bulletins/2/edit');
  });
});

function equalDate(assert, actual, expected) {
  assert.equal(window.moment(actual).toDate().getTime(),
               window.moment(expected).toDate().getTime());
}
