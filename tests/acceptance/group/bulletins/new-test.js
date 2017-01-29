import { authenticateSession } from 'mcac/tests/helpers/ember-simple-auth';
import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/group/bulletins/new";
import sessionData from 'mcac/tests/helpers/payloads/sessionData';
import startApp from "mcac/tests/helpers/start-app";

let application;

moduleForAcceptance('Acceptance | group/bulletins/new', {
  beforeEach() {
    application = startApp();
  }
});

test('visiting /english-service/bulletins/new', function(assert) {
  const group = server.create("group");
  const bulletin = server.create("bulletin", { group });

  authenticateSession(application, sessionData);

  page.visit({ group_slug: bulletin.group.slug });

  andThen(function() {
    assert.equal(currentURL(), `/${group.slug}/bulletins/new`);
  });
});
