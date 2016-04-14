import Ember from "ember";
import startApp from "mcac/tests/helpers/start-app";
import { module, test } from 'qunit';

let application;

module('Acceptance | group/index', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test("handles groups that do not exist", function(assert) {
  visit("/randomslug");

  andThen(() => {
    assert.ok(find("*[data-test-id='not-found']").length);
  });
});
