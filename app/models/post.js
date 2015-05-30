import Ember from "ember";
import DS from 'ember-data';

export default DS.Model.extend({
  bannerUrl: DS.attr('string'),
  content: DS.attr('string'),
  group: DS.belongsTo('group', { async: true }),
  publishedAt: DS.attr('date'),
  slug: DS.attr('string'),
  tags: DS.attr(),
  title: DS.attr('string'),
  tagList: function(key, value) {
    if (arguments.length > 1) {
      this.set('tags', tagListToArray(value));
    }

    return getTags(this).toArray().join(', ');
  }.property('tags.@each'),
  contentHtml: function() {
    return markedOrEmptyString(this.get("content"));
  }.property("content"),
});

function getTags(context) {
  var tags = context.get('tags');
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
