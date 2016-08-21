import Ember from 'ember';
import SaveBulletinControllerMixin from 'mcac/mixins/save-bulletin-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | save bulletin controller', {
  needs: ['service:metrics', 'service:router-scroll']
});

// Replace this with your real tests.
test('it clears the banner', function(assert) {
  let SaveBulletinControllerObject = Ember.Controller.extend(SaveBulletinControllerMixin);
  let subject = SaveBulletinControllerObject.create();
  subject.set("model", { bannerUrl: "http://nba.com" });
  subject.send("clearBanner");
  assert.equal(subject.get("model.bannerUrl"), "");
});

test('it clears the audio', function(assert) {
  let SaveBulletinControllerObject = Ember.Controller.extend(SaveBulletinControllerMixin);
  let subject = SaveBulletinControllerObject.create();
  subject.set("model", { sermon: { audioUrl: "http://nba.com" } });
  subject.send("clearAudio");
  assert.equal(subject.get("model.sermon.audioUrl"), "");
});

test('it assigns the banner', function(assert) {
  const SaveBulletinControllerObject = Ember.Controller.extend(SaveBulletinControllerMixin);
  const subject = SaveBulletinControllerObject.create();
  subject.set("model", { bannerUrl: "http://nba.com" });

  const newBannerUrl = "http://images.com/image.png";
  subject.send("didUploadBanner", newBannerUrl);
  assert.equal(subject.get("model.bannerUrl"), newBannerUrl);
});

test('it assigns the audio', function(assert) {
  const SaveBulletinControllerObject = Ember.Controller.extend(SaveBulletinControllerMixin);
  const subject = SaveBulletinControllerObject.create();
  subject.set("model", { sermon: { audioUrl: "http://nba.com" } });

  const newAudioUrl = "http://audiophile.com/audio.mp3";
  subject.send("didUploadAudio", newAudioUrl);
  assert.equal(subject.get("model.sermon.audioUrl"), newAudioUrl);
});

test('it removes announcements', function(assert) {
  assert.expect(1);

  const SaveBulletinControllerObject = Ember.Controller.extend(SaveBulletinControllerMixin);
  const subject = SaveBulletinControllerObject.create();

  const announcement = {
    deleteRecord() {
      assert.ok("Announcement was deleted");
    }
  };

  subject.send("removeAnnouncement", announcement);
});

test("it reorders announcements", function(assert) {
  const SaveBulletinControllerObject = Ember.Controller.extend(SaveBulletinControllerMixin);
  const subject = SaveBulletinControllerObject.create();
  subject.set("model", {});

  const announcements = [
    Ember.Object.create({
      id: 3,
      isDeleted: false
    }),
    Ember.Object.create({
      id: 2,
      isDeleted: false
    }),
    Ember.Object.create({
      id: 1,
      isDeleted: false
    })
  ];

  subject.send("reorderAnnouncements", null, announcements);

  const actualAnnouncements = subject.get("model.announcements");
  assert.equal(actualAnnouncements[0].get("position"), 1);
  assert.equal(actualAnnouncements[1].get("position"), 2);
  assert.equal(actualAnnouncements[2].get("position"), 3);
});

test("when successfully saving bulletin", function(assert) {
  const saveBulletinService = Ember.Object.create({
    save() {
      return true;
    }
  });

  const SaveBulletinControllerObject = Ember.Controller.extend(SaveBulletinControllerMixin, {
    actions: {
      bulletinSaved(savedBulletin) {
        assert.equal(
          savedBulletin,
          bulletin,
          "it fires the `bulletinSaved` action"
        );
      }
    }
  });

  const subject = SaveBulletinControllerObject.create();
  subject.set("saveBulletinService", saveBulletinService);

  const bulletin = Ember.Object.create({ id: 1 });
  subject.send("saveBulletin", bulletin);
});

test("when unsuccessfully saving bulletin", function(assert) {
  const saveBulletinService = Ember.Object.create({
    save() {
      return false;
    }
  });

  const SaveBulletinControllerObject = Ember.Controller.extend(SaveBulletinControllerMixin, {
    actions: {
      bulletinSaveFailed(failedBulletin) {
        assert.equal(
          failedBulletin,
          bulletin,
          "it fires the `bulletinSaveFailed` action"
        );
      }
    }
  });

  const subject = SaveBulletinControllerObject.create();
  subject.set("saveBulletinService", saveBulletinService);

  const bulletin = Ember.Object.create({ id: 1 });
  subject.send("saveBulletin", bulletin);
});
