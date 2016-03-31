import Ember from 'ember';
import SaveBulletinController from "mcac/mixins/save-bulletin-controller";

export default Ember.Controller.extend(SaveBulletinController, {
  notify: Ember.inject.service("notify"),
  actions: {
    bulletinSaved() {
      this.get("notify").success("Bulletin saved.");
    },
    bulletinSaveFailed() {
      this.get("notify").alert("Failed to save bulletin. Please try again.");
    }
  }
});
