import DS from 'ember-data';

export default DS.Model.extend({
  announcements: DS.hasMany('announcement', { async: true }),
  bannerUrl: DS.attr('string'),
  description: DS.attr('string'),
  group: DS.belongsTo('group', { async: true }),
  name: DS.attr('string'),
  publishedAt: DS.attr('date'),
  serviceOrder: DS.attr('string'),
  sermonNotes: DS.attr('string'),
  serviceOrderHtml: function() {
    return marked(this.get('serviceOrder'));
  }.property('serviceOrder'),
  sermonNotesHtml: function() {
    return marked(this.get('sermonNotes'));
  }.property('sermonNotes'),
  sortedAnnouncements: function() {
    return this.get('announcements').sortBy('position');
  }.property('announcements.@each.position'),
  unsavedAnnouncements: function() {
    return this.get('sortedAnnouncements').filterBy('isDirty');
  }.property('sortedAnnouncements.@each.isDirty')
});
