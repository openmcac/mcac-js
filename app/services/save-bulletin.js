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

      const sermon = yield bulletin.get("sermon");
      if (!Ember.isEmpty(sermon)) {
        syncBulletinToSermon(bulletin, sermon);
        this.get("_saveResourceTask").perform(sermon);
      }

      const announcements = bulletin.get("announcements");
      announcements.forEach((a) => this.get("_saveResourceTask").perform(a));

      success = true;
    } catch (e) {
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

function syncBulletinToSermon(bulletin, sermon) {
  sermon.set("publishedAt", bulletin.get("publishedAt"));
  sermon.set("bannerUrl", bulletin.get("bannerUrl"));
}
