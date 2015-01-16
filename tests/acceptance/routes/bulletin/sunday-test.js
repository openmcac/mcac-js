import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import startApp from '../../../helpers/start-app';
import { defineFixture } from 'ic-ajax';

var application,
    testHelper,
    englishService,
    TestHelper = Ember.Object.createWithMixins(FactoryGuyTestMixin);

module('Acceptance: /sunday route', {
  needs: ['model:bulletin'],
  setup: function() {
    defineFixture('/api/v1/sunday', {
      response: {
        "bulletin": {
          "id": 1,
          "publishedAt": "2014-12-21T13:58:27-05:00",
          "name": "Sunday Service",
          "serviceOrder": "This is the service order.",
          "description": "This is a service bulletin.",
          "group": 1,
          "announcements": [
            {
              "id": 1,
              "description": "This is an announcement",
              "bulletinId": 1,
              "postId": 1,
              "position": 1
            }
          ]
        },
        "group": {
          "id": 1,
          "slug": "english-service",
          "name": "English Service"
        }
      }
    });

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

test('route returns model from /api/v1/sunday', function() {
  expect(4);
  visit('/sunday');

  andThen(function() {
    var controller = application.__container__
                                .lookup('controller:bulletin/sunday/index');
    var model = controller.model;
    equal(model.get('name'), 'Sunday Service');
    equal(model.get('publishedAt').getTime(),
          new Date('2014-12-21T13:58:27-05:00').getTime());

    var group = model.get('group');
    equal(group.get('name'), 'English Service');
    equal(group.get('slug'), 'english-service');
  });
});
