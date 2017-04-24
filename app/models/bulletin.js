/* global marked:false */

import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  announcements: DS.hasMany('announcement', { async: true }),
  bannerUrl: DS.attr('string'),
  group: DS.belongsTo('group', { async: true }),
  name: DS.attr('string'),
  publishedAt: DS.attr('date'),
  serviceOrder: DS.attr('string'),
  sermon: DS.belongsTo("sermon", { async: true }),
  sermonAudioUrl: Ember.computed("sermon.audioUrl", function() {
    return this.get("sermon.audioUrl");
  }),
  serviceOrderHtml: Ember.computed("serviceOrder", function() {
    return markedOrEmptyString(this.get("serviceOrder"));
  }),
  sermonName: Ember.computed("sermon.name", function() {
    return this.get("sermon.name");
  }),
  sermonNotes: Ember.computed("sermon.notes", function() {
    return this.get("sermon.notes");
  }),
  sortedAnnouncements: Ember.computed('announcements.@each.position',
                                      function() {
    return this.get('announcements').sortBy('position');
  }),
  unsavedAnnouncements: Ember.computed('sortedAnnouncements.@each.hasDirtyAttributes',
                                       function() {
    return this.get('sortedAnnouncements').filterBy('hasDirtyAttributes');
  }),
  publishedEarlierThan(bulletin) {
    return this.get("publishedAt").getTime() <
      bulletin.get("publishedAt").getTime();
  }
});

function markedOrEmptyString(markdown) {
  if (Ember.isEmpty(markdown)) {
    return "";
  }

  return marked(markdown);
}
