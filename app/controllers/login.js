import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service("session"),
  actions: {
    login: function() {
      this.get('session').authenticate('authenticator:mcac', {
        email: this.get('email'),
        password: this.get('password')
      }).then(() => {
        this.transitionToRoute("index");
      });
    }
  }
});
