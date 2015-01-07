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
  expect(11);

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
      equal(objectHash.publishedAt.getDay(), 0);
      equal(objectHash.publishedAt.getHours(), 9);
      equal(objectHash.publishedAt.getMinutes(), 30);
      equal(objectHash.publishedAt.getSeconds(), 0);
      equal(objectHash.publishedAt.getMilliseconds(), 0);
      ok(objectHash.publishedAt.getTime() > new Date().getTime());

      return newBulletin;
    }
  };

  equal(route.model(), newBulletin);
});
