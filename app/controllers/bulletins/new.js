import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save: function() {
      var _this = this;
      var bulletin = _this.get('model');
      bulletin.set('publishedAt', moment(bulletin.get('publishedAt')).toDate());
      bulletin.save().then(function(savedBulletin) {
        _this.transitionToRoute('bulletin.edit', savedBulletin);
      });
    }
  }
});
