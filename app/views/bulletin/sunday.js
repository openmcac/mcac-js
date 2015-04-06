import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'bulletin/sunday/index',
  didInsertElement: function() {
    this._super();

    var screenHeight = Ember.$(window).height();
    Ember.$('.cover').height(screenHeight);
    Ember.$('.cover .bulletin-info').css('padding-top', screenHeight / 1.5);
  }
});