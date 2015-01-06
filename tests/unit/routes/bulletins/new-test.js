import Ember from 'ember';

import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:bulletins/new', 'BulletinsNewRoute', {
  // Specify the other units that are required for this test.
  needs: ['model:bulletin']
});

test('it populates model with a new bulletin', function() {
  expect(5);

  var container = new Ember.Container();
  container.register('store:main', DS.Store);

  var route = this.subject();
  var englishService = {
    id: 1,
    name: 'English Service',
    slug: 'english-service'
  };
  var newBulletin = {
    id: 1,
    name: 'Sunday Worship Service',
    description: 'Default Desc',
    serviceOrder: 'Service Order',
    group: englishService
  };

  var mockStore = {
    find: function(model, id) {
      equal(model, 'group');
      equal(id, 1);

      return englishService;
    },
    createRecord: function(model, objectHash) {
      equal(model, 'bulletin');
      equal(objectHash.group, englishService);

      return newBulletin;
    }
  };

  route.store = mockStore;

  equal(route.model(), newBulletin);
});
