import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  process(groupId) {
    return this.get("_fetchAnnouncementsTask").perform(groupId);
  },
  _fetchAnnouncementsTask: task(function * (groupId) {
    const store = this.get("store");
    const query = { filter: { latest_for_group: groupId } };
    const announcements = yield store.query('announcement', query);
    return cloneAnnouncements(store, announcements);
  })
});

function cloneAnnouncements(store, announcements) {
  return announcements.map(a => cloneAnnouncement(store, a));
}

function cloneAnnouncement(store, announcement) {
  return store.createRecord('announcement', {
    description: announcement.get('description'),
    url: announcement.get('url'),
    position: announcement.get('position')
  });
}
