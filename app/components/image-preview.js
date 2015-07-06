import Ember from "ember";

export default Ember.Component.extend({
  classNameBindings: ["hasFile:is-shown:is-hidden"],
  actions: {
    remove: function() {
      this.set("url", "");
    }
  },
  hasFile: Ember.computed("url", function() {
    return !Ember.isEmpty(this.get("url"));
  }),
  backgroundImageUrl: Ember.computed("url", function() {
    if (!this.get("hasFile")) {
      return "";
    }

    return this.get("url").htmlSafe();
  }),
});
