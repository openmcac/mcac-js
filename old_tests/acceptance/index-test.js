import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/index";

moduleForAcceptance('Acceptance | index');

test('visiting homepage', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(currentURL(), '/');
  });
});

test("there is a link to the latest bulletin", function(assert) {
  server.get("/sunday", function() {
    return server.create("bulletin");
  });

  page.visit().viewOnlineSermons();

  andThen(function() {
    assert.equal(currentURL(), '/sunday');
  });
});
