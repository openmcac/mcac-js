import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/bulletin/sunday";

moduleForAcceptance('Acceptance | bulletin/sunday');

test('visiting /bulletin/sunday', function(assert) {
  const hardcodedSundayBulletinId = 3;
  const bulletin = server.create("bulletin", { id: hardcodedSundayBulletinId });

  page.visit();

  andThen(function() {
    assert.equal(currentURL(), '/sunday');
    assert.equal(page.bulletin.cover.name, bulletin.name);
  });
});
