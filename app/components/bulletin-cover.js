import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["bulletin-cover"],
  resizeCover: function() {
    var screenHeight = Ember.$(window).height();
    Ember.$('.bulletin-cover').height(screenHeight);
  }.on("didInsertElement")
});
