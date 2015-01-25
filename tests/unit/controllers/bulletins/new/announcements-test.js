import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startApp from '../../../../helpers/start-app';

var application,
    testHelper,
    englishService,
    controller,
    TestHelper = Ember.Object.createWithMixins(FactoryGuyTestMixin);

moduleFor('controller:bulletins/new/announcements',
          'BulletinsNewAnnouncementsController', {
  needs: ['model:bulletin'],
  setup: function() {
    application = startApp();
    testHelper = TestHelper.setup(application);

    controller = this.subject();
    controller.model = testHelper.make('bulletin');
    controller.store = testHelper.getStore();

    Ember.run(function() {
      controller.model.get('announcements').
                       addObjects(FactoryGuy.makeList('announcement', 3));
    });
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('addAnnouncement - it adds announcement at index specified', function() {
  Ember.run(function() {
    controller.send('addAnnouncement', 1);
  });

  var announcements = controller.model.get('announcements');

  equal(announcements.objectAt(1).get('id'), null);
  equal(announcements.get('length'), 4);
});

test("addAnnouncement - it syncs all the announcements' positions", function() {
  Ember.run(function() {
    controller.send('addAnnouncement', 1);
  });

  var announcements = controller.model.get('announcements');

  equal(announcements.objectAt(0).get('position'), 1);
  equal(announcements.objectAt(1).get('position'), 2);
  equal(announcements.objectAt(2).get('position'), 3);
  equal(announcements.objectAt(3).get('position'), 4);
});

test('removeAnnouncement - it removes announcement at index specified', function() {
  var announcements = controller.model.get('announcements');
  var announcementAfterDeletedAnnouncement = announcements.objectAt(2);

  Ember.run(function() {
    controller.send('removeAnnouncement', 1);
  });

  equal(announcements.objectAt(1), announcementAfterDeletedAnnouncement);
  equal(announcements.get('length'), 2);
});

test("removeAnnouncement - it syncs all the announcements' positions", function() {
  Ember.run(function() {
    controller.send('removeAnnouncement', 0);
  });

  var announcements = controller.model.get('announcements');

  equal(announcements.objectAt(0).get('position'), 1);
  equal(announcements.objectAt(1).get('position'), 2);
  equal(announcements.get('length'), 2);
});
