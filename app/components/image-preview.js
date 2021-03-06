import Ember from "ember";

export default Ember.Component.extend({
  attributeBindings: ["data-auto-id"],
  classNameBindings: ["hasFile:is-shown:is-hidden"],
  hasFile: Ember.computed("url", function() {
    return !Ember.isEmpty(this.get("url"));
  }),
  backgroundImageUrl: Ember.computed("url", function() {
    if (!this.get("hasFile")) {
      return "";
    }

    return this.get("url").htmlSafe();
  })
});
