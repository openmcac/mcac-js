import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service("session"),
  store: Ember.inject.service("store"),
  actions: {
    login: function() {
      this.get('session').authenticate('authenticator:mcac', {
        email: this.get('email'),
        password: this.get('password')
      }).then(() => {
        this.get("store").pushPayload("user", {
          data: this.get("session.data.authenticated.data")
        });

        this.transitionToRoute("index");
      });
    }
  }
});
