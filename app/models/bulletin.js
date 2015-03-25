import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  publishedAt: DS.attr('date'),
  serviceOrder: DS.attr('string'),
  description: DS.attr('string'),
  group: DS.belongsTo('group', { async: true }),
  announcements: DS.hasMany('announcement', { async: true }),
  serviceOrderHtml: function() {
    return marked(this.get('serviceOrder'));
  }.property('serviceOrder')
});
