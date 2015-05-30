import Ember from "ember";

export default Ember.Component.extend({
  classNameBindings: ["hasFile:is-shown:is-hidden"],
  classNames: ["file-preview"],
  actions: {
    remove: function() {
      this.set("url", "");
    }
  },
  hasFile: function() {
    return !Ember.isEmpty(this.url);
  }.property("url")
});