import Ember from 'ember';

export default Ember.Mixin.create({
  saveBulletinService: Ember.inject.service("save-bulletin"),
  store: Ember.inject.service("store"),
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
        const newAnnouncement = this.get("store").createRecord('announcement', {
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
      this.set("model.sermon.audioUrl", "");
    },
    didUploadBanner(storageUrl) {
      this.set("model.bannerUrl", storageUrl);
    },
    didUploadAudio(storageUrl) {
      this.set("model.sermon.audioUrl", storageUrl);
    },
    speakerSearch(term) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.run.debounce(this, this._performSearch, term, resolve, reject, 400);
      });
    },
    updateSpeaker(speaker) {
      this.set("selectedSpeaker", speaker);
    },
    createSpeaker(speakerName) {
      this.get("model.sermon").then((sermon) => {
        this.set("selectedSpeaker", this.get("store").createRecord("speaker", {
          sermon: sermon,
          name: speakerName
        }));
      });
    }
  },
  defaultSpeakerOptions: Ember.computed(function() {
    const filter = { custom: "defaultSpeakerOptions" };
    return this.get("store").query("speaker", { filter: filter });
  }),
  selectedSpeaker: {},
  _performSearch(term, resolve, reject) {
    if (Ember.isBlank(term)) {
      return resolve([]);
    }

    const filter = { autocomplete: term };
    this.get("store").
      query("speaker", { filter: filter }).
      then(speakers => resolve(speakers), reject);
  }
});

function syncPositions(announcements) {
  announcements.
    filter((a) => !a.get("isDeleted")).
    forEach((a, i) => a.set("position", ++i));
}
