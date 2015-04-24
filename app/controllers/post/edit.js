import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save: function() {
      var _this = this;
      var post = _this.get('model');
      Pace.restart();
      post.save().then(function() {
        Pace.stop();
      });
    }
  }
});
