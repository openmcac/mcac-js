/* global Pace:false */

import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save: function() {
      Pace.restart();
      this.get('model').save().then(function() {
        Pace.stop();
      });
    }
  }
});
