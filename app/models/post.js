import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  publishedAt: DS.attr('date'),
  content: DS.attr('string'),
  tags: DS.attr(),
  group: DS.belongsTo('group', { async: true }),
  tagList: function(key, value) {
    if (arguments.length > 1) {
      this.set('tags', tagListToArray(value));
    }

    var tags = this.get('tags');
    if (!tags) {
      tags = [];
    }

    return tags.toArray().join(', ');
  }.property('tags.@each')
});

function tagListToArray(tagList) {
  return tagList.split(/\s*,\s*/);
}
