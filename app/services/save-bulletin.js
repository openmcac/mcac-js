import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Service.extend({
  save(bulletin) {
    return this.get("_saveBulletinTask").perform(bulletin);
  },
  _saveBulletinTask: task(function * (bulletin) {
    let success = false;
    bulletin.set('publishedAt', moment(bulletin.get('publishedAt')).toDate());

    try {
      yield bulletin.save();

      const announcements = bulletin.get("announcements");
      announcements.forEach((a) => this.get("_saveAnnouncementTask").perform(a));

      success = true;
    } catch (e) {
    }

    return success;
  }),
  _saveAnnouncementTask: task(function * (announcement) {
    try {
      yield announcement.save();
    } catch (e) {
      yield announcement.save();
    }
  })
});
