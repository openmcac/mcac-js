import Ember from "ember";
import ResizeAware from "ember-resize/mixins/resize-aware";

export default Ember.Component.extend(ResizeAware, {
  classNames: ["bulletin-cover"],
  resizeCover: function() {
    var screenHeight = Ember.$(window).height();
    Ember.$(".bulletin-cover").height(screenHeight);
  }.on("didInsertElement"),
  debouncedDidResize(width, height, evt) {
    console.log(`Debounced Resize! ${width}x${height}`);
    this.resizeCover();
  }
});
