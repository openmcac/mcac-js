import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  announcements: DS.hasMany('announcement', { async: true }),
  audioUrl: DS.attr('string'),
  bannerUrl: DS.attr('string'),
  description: DS.attr('string'),
  group: DS.belongsTo('group', { async: true }),
  name: DS.attr('string'),
  publishedAt: DS.attr('date'),
  serviceOrder: DS.attr('string'),
  sermonNotes: DS.attr('string'),
  serviceOrderHtml: Ember.computed("serviceOrder", function() {
    return markedOrEmptyString(this.get("serviceOrder"));
  }),
  sermonNotesHtml: Ember.computed("sermonNotes", function() {
    return markedOrEmptyString(this.get("sermonNotes"));
  }),
  sortedAnnouncements: Ember.computed('announcements.@each.position',
                                      function() {
    return this.get('announcements').sortBy('position');
  }),
  unsavedAnnouncements: Ember.computed('sortedAnnouncements.@each.isDirty',
                                       function() {
    return this.get('sortedAnnouncements').filterBy('isDirty');
  })
});

function markedOrEmptyString(markdown) {
  if (Ember.isEmpty(markdown)) {
    return "";
  }

  return marked(markdown);
}
