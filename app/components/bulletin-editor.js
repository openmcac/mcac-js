import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
  validations: {
    "bulletin.name": {
      presence: true
    },
    "bulletin.publishedAt": {
      presence: true
    }
  },
  actions: {
    save() {
      const bulletin = this.get("bulletin");
      this.sendAction("on-save", bulletin);
    },
    didUploadBanner(storageUrl) {
      const bulletin = this.get("bulletin");
      this.sendAction("did-upload-banner", storageUrl, bulletin);
    },
    didUploadAudio(storageUrl) {
      const bulletin = this.get("bulletin");
      this.sendAction("did-upload-audio", storageUrl, bulletin);
    },
    appendAnnouncement() {
      const bulletin = this.get("bulletin");
      this.sendAction("append-announcement", bulletin);
    }
  },
  disableSaveButton: Ember.computed("isValid", function() {
    return !this.get("isValid");
  })
});
