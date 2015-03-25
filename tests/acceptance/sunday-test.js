import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

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

module('Acceptance: Sunday', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /sunday', function() {
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
    equal(find('.bulletin-info .name').text(), 'Sunday Service');
  });
});
