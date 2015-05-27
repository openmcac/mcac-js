import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'bulletin/index',
  xdidInsertElement: function() {
    this._super();

    var screenHeight = Ember.$(window).height();
    Ember.$('.cover').height(screenHeight);
  }
});
