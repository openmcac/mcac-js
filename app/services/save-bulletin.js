/* global moment:false */

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
      const sermon = yield bulletin.get("sermon");
      if (hasSermon(sermon)) {
        const group = yield bulletin.get("group");
        syncBulletinToSermon(bulletin, group, sermon);
        yield this.get("_saveResourceTask").perform(sermon);
        bulletin.set("sermon", sermon);
      }

      const announcements = yield bulletin.get("announcements");
      explicityDeleteAnnouncementsForMirageWorkaround(announcements);

      yield bulletin.save();

      announcements.forEach((a) => this.get("_saveResourceTask").perform(a));

      success = true;
    } catch (e) {
      // no-op
    }

    return success;
  }),
  _saveResourceTask: task(function * (resource) {
    try {
      yield resource.save();
    } catch (e) {
      yield resource.save();
    }
  })
});

function explicityDeleteAnnouncementsForMirageWorkaround(announcements) {
  // Not sure, but it seems that Mirage does not include deleted records in
  // their associations after the model has been saved. As a result, the
  // deleted record cannot be "saved" in order to execute the delete request.
  announcements.filterBy("isDeleted").forEach(a => a.destroyRecord());
}

function hasSermon(sermon) {
  return !(Ember.isEmpty(sermon) ||
      (Ember.isEmpty(sermon.get("series")) &&
        Ember.isEmpty(sermon.get("speaker")) &&
        Ember.isEmpty(sermon.get("name")) &&
        Ember.isEmpty(sermon.get("audioUrl")) &&
        Ember.isEmpty(sermon.get("notes"))));
}

function syncBulletinToSermon(bulletin, group, sermon) {
  sermon.set("group", group);
  sermon.set("publishedAt", bulletin.get("publishedAt"));
  sermon.set("bannerUrl", bulletin.get("bannerUrl"));
}
