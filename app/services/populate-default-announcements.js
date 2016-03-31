import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  process(bulletin) {
    return this.get("_populateDefaultAnnouncementsTask").perform(bulletin);
  },
  _populateDefaultAnnouncementsTask: task(function * (bulletin) {
    const announcements = yield bulletin.get("announcements");
    if (announcements.get("length") > 0) {
      return;
    }

    const groupId = yield bulletin.get("group.id");
    const defaultAnnouncements =
      yield this.get("_fetchAnnouncementsTask").perform(groupId);

    defaultAnnouncements.forEach(a => announcements.addObject(a));
  }),
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
