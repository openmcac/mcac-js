import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save: function () {
      var _this = this;
      var post = _this.get('model');
      post.save();
    }
  }
});
