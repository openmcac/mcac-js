import Ember from 'ember';

export default Ember.Controller.extend({
  notify: Ember.inject.service("notify"),
  updatePasswordService: Ember.inject.service("update-password"),
  actions: {
    updatePassword() {
      const passwordUpdated = this.get("updatePasswordService").
        process(this.get("model.currentPassword"), this.get("model.password"));

      passwordUpdated.then(() => {
        this.get("notify").success("Your password has been updated.");
        this.clearForm();
      }, () => {
        this.get("notify").alert("Unable to update your password.");
      });
    }
  },
  clearForm() {
    this.set("model.password", "");
    this.set("model.passwordConfirmation", "");
    this.set("model.currentPassword", "");
  }
});
