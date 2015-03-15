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

var announcementCounter = 1;

module('Acceptance: Editing a bulletin', {
  needs: ['model:bulletin', 'model:group'],
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /:group_slug/bulletins/:id/edit', function() {
  expect(4);

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
    equal(find('.bulletin-name').val(), name);
    equalDate(find('.published-at input').val(), moment(publishedAt));
    equal(find('.description').val(), description);
    equal(find('.service-order').val(), serviceOrder);
  });
});

test('saving a bulletin without announcements', function() {
  expect(4);

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

      this.get('/api/v1/announcements', function(request) {
        if (request.queryParams.latest_for_group === '1') {
          var response = { "announcements": [] };
          return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
        }
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
  click(':submit');

  andThen(function() {
    equal(updatedBulletin.bulletins.name, 'Updated bulletin name');
    equal(updatedBulletin.bulletins.description, 'Updated description');
    equal(updatedBulletin.bulletins.serviceOrder, 'Updated service order');
    equalDate(moment(updatedBulletin.bulletins.publishedAt),
              moment('11/30/2000 9:24 PM', 'MM/DD/YYYY h:mm A'));
  });
});

test('editing a bulletin with announcements', function() {
  expect(4);

  var updatedBulletin;

  Ember.run(function() {
    var server = new Pretender(function() {
      this.get('/api/v1/groups', function(request) {
        var all = JSON.stringify(groups);
        return [200, {"Content-Type": "application/vnd.api+json"}, all];
      });

      this.get('/api/v1/announcements', function(request) {
        if (request.queryParams.latest_for_group === '1') {
          var response = {
            "announcements": [
              {
                "id": "" + announcementCounter++,
                "description": "This is announcement 1",
                "position": 1,
                "links": {
                  "bulletin": "2",
                  "post": null
                }
              },
              {
                "id": "" + announcementCounter++,
                "description": "This is an announcement",
                "position": 2,
                "links": {
                  "bulletin": "2",
                  "post": null
                }
              },
              {
                "id": "" + announcementCounter++,
                "description": "This is an announcement",
                "position": 3,
                "links": {
                  "bulletin": "2",
                  "post": null
                }
              }
            ]
          };
          return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
        }
      });

      this.post('/api/v1/announcements', function(request) {
        var response = JSON.parse(request.requestBody);
        response.announcements.id = announcementCounter++;
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
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
              "announcements": []
            }
          }
        };
        return [200, {"Content-Type": "application/vnd.api+json"}, JSON.stringify(response)];
      });
    });
  });

  visit('/english-service/bulletins/1/edit');
  fillIn('.announcement-editor-1', 'This is the first announcement');
  fillIn('.announcement-editor-2', 'This is the second announcement');
  click(':submit');

  andThen(function() {
    equal(Ember.$(find('.announcement-editor-1')).val(), 'This is the first announcement');
    equal(Ember.$(find('.announcement-editor-2')).val(), 'This is the second announcement');
  });
});

function equalDate(actual, expected) {
  equal(window.moment(actual).toDate().getTime(),
        window.moment(expected).toDate().getTime());
}
