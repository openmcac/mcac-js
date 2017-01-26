import Ember from 'ember';
import startApp from '../helpers/start-app';
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance'
import sessionData from "../helpers/payloads/sessionData";
import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import page from "mcac/tests/pages/login";

var application;

moduleForAcceptance('Acceptance: Login', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('logging in by clicking the submit button', function(assert) {
  server.create("bulletin");
  server.namespace = "";
  server.post('/api/auth/sign_in', function(db, request) {
    const body = JSON.parse(request.requestBody);

    if (body.email !== 'test@example.com' || body.password !== 'loginpass') {
      return;
    }

    const user = server.create("user", { email: body.email });

    authenticateSession(application, sessionData);

    return {
      data: {
        type: "users",
        id: user.id,
        attributes: user
      }
    };
  });

  page.visit().
    fillEmail("test@example.com").
    fillPassword("loginpass").
    submit();

  andThen(function() {
    assert.equal(currentURL(), '/dashboard');
  });
});
