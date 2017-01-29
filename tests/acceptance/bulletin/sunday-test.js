import { test } from 'qunit';
import moduleForAcceptance from 'mcac/tests/helpers/module-for-acceptance';
import page from "mcac/tests/pages/bulletin/sunday";

moduleForAcceptance('Acceptance | bulletin/sunday');

test('visiting /sunday', function(assert) {
  const hardcodedSundayBulletinId = 3;
  const sermon = server.create("sermon");
  const bulletin = server.create("bulletin", {
    id: hardcodedSundayBulletinId,
    publishedAt: new Date(2000, 11, 10, 9, 30),
    sermon: sermon
  });
  const announcements = server.createList("announcement", 3, { bulletin });

  page.visit();

  andThen(function() {
    assert.equal(currentURL(), '/sunday');

    assert.equal(page.bulletin.cover.name, bulletin.name);
    assert.equal(page.bulletin.cover.sermonName, sermon.name);
    assert.equal(page.bulletin.cover.sermonAudioUrl(), sermon.audioUrl);
    assert.equal(page.bulletin.cover.publishedAt, "December 10th 2000, 9:30 am");

    assert.equal(page.bulletin.announcements.title, "Announcements");
    assert.equal(page.bulletin.announcements.announcements(0).description,
                 announcements[0].description);
    assert.equal(page.bulletin.announcements.announcements(1).description,
                 announcements[1].description);
    assert.equal(page.bulletin.announcements.announcements(2).description,
                 announcements[2].description);

    assert.equal(page.bulletin.serviceOrder, bulletin.serviceOrder);

    assert.equal(page.bulletin.sermonNotes.title, "Notes");
    assert.equal(page.bulletin.sermonNotes.notes, sermon.notes);
  });
});
