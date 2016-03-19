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
    didUploadBanner(storageUrl) {
      this.sendAction("diduploadbanner", storageUrl);
    },
    didUploadAudio(storageUrl) {
      this.sendAction("diduploadaudio", storageUrl);
    }
  },
  disableSaveButton: Ember.computed("isValid", function() {
    return !this.get("isValid");
  })
});
