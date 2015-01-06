import Ember from 'ember';

import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:bulletins/new', 'BulletinsNewController', {
  // Specify the other units that are required for this test.
  needs: ['model:bulletin']
});

// Replace this with your real tests.
test('it creates a new post', function() {
  expect(1);

  var container = new Ember.Container();
  container.register('store:main', DS.Store);

  var controller = this.subject();
  var model = Ember.Object.create({
    name: 'My Bulletin',
    publishedAt: new Date(),
    serviceOrder: 'service order',
    description: 'desc',
    groupId: 1
  });

  model.save = function() {
    ok('called', 'model is saved');
  };

  Ember.run(function() {
    controller.set('model', model);
    controller.send('save');
  });
});
