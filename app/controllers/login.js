import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    login: function() {
      this.get('session').authenticate('authenticator:mcac', {
        email: this.get('email'),
        password: this.get('password')
      });
    }
  }
});
