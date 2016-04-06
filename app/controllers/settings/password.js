import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Controller.extend({
  notify: Ember.inject.service("notify"),
  session: Ember.inject.service("session"),
  actions: {
    updatePassword() {
      const auth = this.get("session.data.authenticated.auth");
      const options = {
        method: "PUT",
        data: JSON.stringify({
          "password": this.get("model.password"),
          "password_confirmation": this.get("model.passwordConfirmation"),
          "current_password": this.get("model.currentPassword")
        }),
        contentType: "application/vnd.api+json",
        headers: {
          "access-token": auth.accessToken,
          client: auth.client,
          uid: auth.uid
        },
        dataType: "json"
      };

      request("/api/auth/password", options).then((data) => {
        this.set("model.password", "");
        this.set("model.passwordConfirmation", "");
        this.set("model.currentPassword", "");
        this.get("notify").success("Your password has been updated.");
      }, () => {
        this.get("notify").alert("Unable to update your password.")
      });
    }
  }
});
