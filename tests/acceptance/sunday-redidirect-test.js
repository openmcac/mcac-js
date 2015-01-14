import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: SundayRedidirect', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('app/index.js should redirect root path to sunday', function() {
  visit('/');

  andThen(function() {
    equal(currentURL(), '/sunday');
  });
});
