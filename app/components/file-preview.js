import Ember from "ember";

export default Ember.Component.extend({
  attributeBindings: ["data-auto-id"],
  classNameBindings: ["hasFile:is-shown:is-hidden"],
  classNames: ["file-preview"],
  actions: {
    remove: function() {
      this.set("url", "");
    }
  },
  hasFile: Ember.computed("url", function() {
    return !Ember.isEmpty(this.get("url"));
  }),
  fileUrl: Ember.computed("url", function() {
    if (!this.get("hasFile")) {
      return "";
    }

    return this.get("url").htmlSafe();
  }),
});
