import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Controller.extend({
  notify: Ember.inject.service("notify"),
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
      this.get("saveBulletinTask").perform(bulletin);
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
  },
  saveBulletinTask: task(function * (bulletin) {
    bulletin.set('publishedAt', moment(bulletin.get('publishedAt')).toDate());
    Pace.restart();

    try {
      yield bulletin.save();
    } catch (e) {
      this.get("notify").alert("Failed to save bulletin");
    }

    const announcements = bulletin.get("announcements");

    announcements.forEach((announcement) => {
      this.get("saveAnnouncementTask").perform(announcement);
    });

    this.get("notify").success("Bulletin saved.");
  }),
  saveAnnouncementTask: task(function * (announcement) {
    try {
      yield announcement.save();
    } catch (e) {
      try {
        yield announcement.save();
      } catch (e) {
        this.get("notify").alert("Failed to save announcement.");
      }
    }
  })
});

function syncPositions(announcements) {
  announcements.
    filter((a) => !a.get("isDeleted")).
    forEach((a, i) => a.set("position", ++i));
}
