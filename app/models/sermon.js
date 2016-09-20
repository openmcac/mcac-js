import DS from "ember-data";

export default DS.Model.extend({
  audioUrl: DS.attr("string"),
  bannerUrl: DS.attr("string"),
  group: DS.belongsTo("group", { async: true }),
  name: DS.attr("string"),
  notes: DS.attr("string"),
  publishedAt: DS.attr('date'),
  series: DS.attr("string"),
  speaker: DS.attr("string"),
  tags: DS.attr(),
  tagList: Ember.computed("tags.[]", {
    get: function() {
      return getTags(this).toArray().join(", ");
    },
    set: function(key, value) {
      this.set("tags", tagListToArray(value));
      return value;
    }
  })
});

function getTags(context) {
  var tags = context.get("tags");
  return tags ? tags : [];
}

function tagListToArray(tagList) {
  return tagList.split(/\s*,\s*/);
}
