import FactoryGuy from 'factory-guy';
import { testMixin as FactoryGuyTestMixin } from 'factory-guy';
import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import { defineFixture } from 'ic-ajax';
import nextService from 'mcac/utils/next-service';

var application,
    testHelper,
    englishService,
    TestHelper = Ember.Object.createWithMixins(FactoryGuyTestMixin);

module('Acceptance: New bulletin form', {
  needs: ['model:bulletin', 'model:group'],
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

test('visiting /english-service/bulletins/new', function() {
  testHelper.handleFindQuery('group', ['slug'], [englishService]);

  visit('/english-service/bulletins/new');

  andThen(function() {
    equal(find('.bulletin-name').val(), 'Sunday Worship Service');
    equalDate(find('.published-at input').val(), nextService());
    equal(find('.service-order').val(), 'Default service order');
  });
});

test('saving a bulletin navigates to edit page', function() {
  expect(1);

  Ember.run(function() {
    testHelper.handleCreate('bulletin').andReturn({ id: "1" });
  });

  testHelper.handleCreate('announcement');
  testHelper.handleFindQuery('group', ['slug'], [englishService]);
  testHelper.handleFindQuery('announcement', ['latest_for_group'], []);

  visit('/english-service/bulletins/new');
  fillIn('.published-at', '03/10/2010 9:30 AM');
  click(':submit');

  andThen(function() {
    equal(currentURL(), '/english-service/bulletins/1/edit');
  });
});

function equalDate(actual, expected) {
  equal(window.moment(actual).toDate().getTime(),
        window.moment(expected).toDate().getTime());
}
