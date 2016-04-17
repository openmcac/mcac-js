import Ember from "ember";
import DS from "ember-data";

export default DS.Model.extend({
  bannerUrl: DS.attr("string"),
  content: DS.attr("string"),
  group: DS.belongsTo("group", { async: true }),
  author: DS.belongsTo("user", { async: true }),
  publishedAt: DS.attr("date"),
  slug: DS.attr("string"),
  tags: DS.attr(),
  title: DS.attr("string"),
  kind: DS.attr("string"),
  tagList: Ember.computed("tags.[]", {
    get: function() {
      return getTags(this).toArray().join(", ");
    },
    set: function(key, value) {
      this.set("tags", tagListToArray(value));
      return value;
    }
  }),
  contentHtml: Ember.computed("content", function() {
    return markedOrEmptyString(this.get("content"));
  }),
  isPost: Ember.computed("kind", function() {
    return this.get("kind") === "post";
  }),
  isPage: Ember.computed("kind", function() {
    return this.get("kind") === "page";
  }),
  showReadMoreLink: Ember.computed("content", function() {
    return this.get("content").length > 650;
  }),
  snippetHtml: Ember.computed("content", function() {
    return marked(this.get("content").substring(0, 600));
  })
});

function getTags(context) {
  var tags = context.get("tags");
  return tags ? tags : [];
}

function tagListToArray(tagList) {
  return tagList.split(/\s*,\s*/);
}

function markedOrEmptyString(markdown) {
  if (Ember.isEmpty(markdown)) {
    return "";
  }

  return marked(markdown);
}
