import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr("string"),
  slug: DS.attr("string"),
  about: DS.attr("string"),
  bannerUrl: DS.attr("string"),
  aboutHtml: Ember.computed("about", function() {
    return marked(this.get("about") || "");
  }),
  posts: DS.hasMany("post", { async: true })
});
