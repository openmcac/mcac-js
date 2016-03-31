import Ember from 'ember';

export default Ember.Mixin.create({
  saveBulletinService: Ember.inject.service("save-bulletin"),
  actions: {
    reorderAnnouncements(_, announcements) {
      syncPositions(announcements);
      this.set("model.announcements", announcements);
    },
    removeAnnouncement(announcement) {
      announcement.deleteRecord();
    },
    appendAnnouncement() {
      this.get("model.announcements").then((announcements) => {
        const newAnnouncement = this.store.createRecord('announcement', {
          position: announcements.get('length') + 1
        });
        announcements.pushObject(newAnnouncement);
      });
    },
    saveBulletin(bulletin) {
      if (this.get("saveBulletinService").save(bulletin)) {
        this.send("bulletinSaved", bulletin);
      } else {
        this.send("bulletinSaveFailed", bulletin);
      }
    },
    clearBanner() {
      this.set("model.bannerUrl", "");
    },
    clearAudio() {
      this.set("model.audioUrl", "");
    },
    didUploadBanner(storageUrl) {
      this.set("model.bannerUrl", storageUrl);
    },
    didUploadAudio(storageUrl) {
      this.set("model.audioUrl", storageUrl);
    }
  }
});

function syncPositions(announcements) {
  announcements.
    filter((a) => !a.get("isDeleted")).
    forEach((a, i) => a.set("position", ++i));
}
