import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  publishedAt: DS.attr('date'),
  content: DS.attr('string'),
  tags: DS.attr(),
  group: DS.belongsTo('group', { async: true }),
  slug: DS.attr('string'),
  tagList: function(key, value) {
    if (arguments.length > 1) {
      this.set('tags', tagListToArray(value));
    }

    return getTags(this).toArray().join(', ');
  }.property('tags.@each')
});

function getTags(context) {
  var tags = context.get('tags');
  return tags ? tags : [];
}

function tagListToArray(tagList) {
  return tagList.split(/\s*,\s*/);
}
