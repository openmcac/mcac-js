import Ember from 'ember';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: SundayRedirect', {
  setup: function() {
    application = startApp();
  },
  teardown: function() {
    Ember.run(application, 'destroy');
  }
});

test('app/index.js redirects root path to /sunday', function() {
  visit('/');

  andThen(function() {
    equal(currentURL(), '/sunday');
  });
});
