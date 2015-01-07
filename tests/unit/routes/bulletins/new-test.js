import Ember from 'ember';

import {
  moduleFor,
  test
} from 'ember-qunit';

var englishService, newBulletin;

moduleFor('route:bulletins/new', 'BulletinsNewRoute', {
  // Specify the other units that are required for this test.
  needs: ['model:bulletin'],
  setup: function() {
    englishService = {
      id: 1,
      name: 'English Service',
      slug: 'english-service'
    };

    newBulletin = {
      id: 1,
      name: 'Sunday Worship Service',
      description: 'Default Desc',
      serviceOrder: 'Service Order',
      group: englishService
    };
  }
});

test('it populates model with a new bulletin', function() {
  expect(7);

  var route = this.subject();
  route.store = {
    find: function(model, id) {
      equal(model, 'group');
      equal(id, 1);

      return englishService;
    },
    createRecord: function(model, objectHash) {
      equal(model, 'bulletin');
      equal(objectHash.group, englishService);

      // default publishedAt is a Sunday, 9:30am
      equal(objectHash.publishedAt.toUTCString(),
            new Date("2012-12-23T09:30:00-05:00").toUTCString());

      equal(objectHash.description, "December 23rd 2012, 9:30 am");

      return newBulletin;
    }
  };

  var tuesday = "2012-12-18T03:51:57-05:00";
  equal(route.model(tuesday), newBulletin);
});

test('publishedAt will use next Sunday when currently Sunday', function() {
  expect(1);

  var route = this.subject();
  route.store = {
    find: function(model, id) {
      return englishService;
    },
    createRecord: function(model, objectHash) {
      // default publishedAt is a Sunday, 9:30am
      equal(objectHash.publishedAt.toUTCString(),
            new Date("2012-12-30T09:30:00-05:00").toUTCString());

      return newBulletin;
    }
  };

  var sunday = "2012-12-23T09:32:00-05:00";
  route.model(sunday);
});

test('publishedAt will use current Sunday when not yet 9:30 am', function() {
  expect(1);

  var route = this.subject();
  route.store = {
    find: function(model, id) {
      return englishService;
    },
    createRecord: function(model, objectHash) {
      // default publishedAt is a Sunday, 9:30am
      equal(objectHash.publishedAt.toUTCString(),
            new Date("2012-12-23T09:30:00-05:00").toUTCString());

      return newBulletin;
    }
  };

  var sunday = "2012-12-23T09:29:00-05:00";
  route.model(sunday);
});
