/* global server:false */

import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { test } from 'qunit';
import Ember from 'ember';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/group/bulletins/index";
import sessionData from 'mcac/tests/helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";

let application;

moduleForAcceptance('Acceptance | group/bulletins/index', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test("viewing a group's bulletins", function(assert) {
  const group = server.create("group", { slug: "english-service" });
  server.create("bulletin", { group });

  authenticateSession(application, sessionData);

  page.visit({ group_slug: "english-service" });

  page.bulletins(0).remove();

  andThen(function() {
    assert.equal(currentURL(), '/english-service/bulletins');
    assert.equal(server.db.bulletins.length, 0);
  });
});
