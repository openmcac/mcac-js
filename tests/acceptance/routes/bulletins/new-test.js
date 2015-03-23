import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startApp from '../../../helpers/start-app';
import { defineFixture } from 'ic-ajax';

var application,
    testHelper,
    englishService,
    TestHelper = Ember.Object.createWithMixins(FactoryGuyTestMixin);

moduleFor('route:bulletins/new', 'BulletinsNewRoute', {
  needs: ['model:bulletin'],
  setup: function() {
    application = startApp();
    testHelper = TestHelper.setup(application);
    englishService = testHelper.make('group', {
      name: 'English Service',
      slug: 'english-service'
    });
  },
  teardown: function() {
    Ember.run(function() {
      testHelper.teardown();
    });
    Ember.run(application, 'destroy');
  }
});

test('it populates a default bulletin', function() {
  expect(2);

  testHelper.handleFindQuery('group', ['slug'], [englishService]);
  visit('/english-service/bulletins/new');

  andThen(function() {
    var route = application.__container__.lookup('route:bulletins/new');
    route.store = testHelper.getStore();

    var model = route.model();
    // it defaults the bulletin name to Sunday Worship Service
    equal(model.get('name'), 'Sunday Worship Service');

    // it sets the group to English Service
    equal(model.get('group'), englishService);
  });
});
