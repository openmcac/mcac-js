import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import startApp from '../../helpers/start-app';

var application,
    testHelper,
    englishService,
    component,
    TestHelper = Ember.Object.createWithMixins(FactoryGuyTestMixin);

moduleForComponent('announcements-editor', 'AnnouncementsEditorComponent', {
  needs: [
    'model:bulletin',
    'component:announcement-editor',
    'template:components/announcement-editor'
  ],
  setup: function() {
    application = startApp();
    testHelper = TestHelper.setup(application);
  },
  teardown: function() {
    Ember.run(function() {
      testHelper.teardown();
    });
    Ember.run(application, 'destroy');
  }
});

test('addAnnouncement - it adds announcement below the current announcement', function() {
  expect(2);

  var component = this.subject(),
      $component = this.append(),
      targetObject = {
        store: testHelper.getStore(),
        model: testHelper.make('bulletin')
      };

  Ember.run(function() {
    component.set('announcements', targetObject.model.get('announcements'));
    component.set('targetObject', targetObject);
    targetObject.model.get('announcements').
                       addObjects(FactoryGuy.makeList('announcement', 3));
  });

  var announcements = targetObject.model.get('announcements');

  click('#announcements-editor li:first button.add-announcement');

  andThen(function() {
    equal(announcements.objectAt(1).get('id'), null);
    equal(announcements.get('length'), 4);
  });
});

test('removeAnnouncement - it removes announcement at index specified', function() {
  expect(2);

  var component = this.subject(),
      $component = this.append(),
      targetObject = {
        store: testHelper.getStore(),
        model: testHelper.make('bulletin')
      };

  Ember.run(function() {
    component.set('announcements', targetObject.model.get('announcements'));
    component.set('targetObject', targetObject);
    targetObject.model.get('announcements').
                       addObjects(FactoryGuy.makeList('announcement', 3));
  });

  var announcements = targetObject.model.get('announcements');
  var secondAnnouncementId = announcements.objectAt(1).get('id');

  click('#announcements-editor li:first button.remove-announcement');

  andThen(function() {
    equal(announcements.objectAt(0).get('id'), secondAnnouncementId);
    equal(announcements.get('length'), 2);
  });
});
