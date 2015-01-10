import Ember from 'ember';

import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:group', 'GroupRoute', {
  // Specify the other units that are required for this test.
  // needs: ['model:group']
});

test('model hook returns the group matching the slug provided', function() {
  expect(3);

  var route = this.subject();
  var expectedGroup = { dummy: true };
  var groupSlug = "my-slug";

  route.store = {
    find: function(model, hash) {
      equal('group', model);
      equal(groupSlug, hash.slug);

      return DS.PromiseArray.create({
        promise: new Ember.RSVP.Promise(function(resolve, reject) {
          resolve([expectedGroup]);
        })
      });
    }
  };

  route.model({ group_slug: groupSlug }).then(function(group) {
    equal(expectedGroup, group);
  });
});
