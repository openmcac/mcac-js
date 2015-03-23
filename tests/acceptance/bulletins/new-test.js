import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
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

module('Acceptance: New bulletin form', {
  needs: ['model:bulletin', 'model:group'],
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /english-service/bulletins/new', function() {
  expect(3);

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
    });
  });

  visit('/english-service/bulletins/new');

  andThen(function() {
    equal(find('.bulletin-name').val(), 'Sunday Worship Service');
    equalDate(find('.published-at input').val(), nextService());
    equal(find('.service-order').val(), 'Default service order');
  });
});

test('saving a bulletin navigates to edit page', function() {
  expect(1);

  Ember.run(function() {
    var server = new Pretender(function() {
      this.get('/api/v1/groups', function(request) {
        if (request.queryParams.slug === 'english-service') {
          var all = JSON.stringify(groups);
          return [200, {"Content-Type": "application/vnd.api+json"}, all];
        }
      });

      this.get('/api/v1/announcements', function(request) {
        if (request.queryParams.latest_for_group === '1') {
          var response = { "announcements": [] };
          return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
        }
      });

      this.post('/api/v1/bulletins', function(request) {
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

  visit('/english-service/bulletins/new');
  fillIn('.published-at', '03/10/2010 9:30 AM');
  click(':submit');

  andThen(function() {
    equal(currentURL(), '/english-service/bulletins/1/edit');
  });
});

function equalDate(actual, expected) {
  equal(window.moment(actual).toDate().getTime(),
        window.moment(expected).toDate().getTime());
}
