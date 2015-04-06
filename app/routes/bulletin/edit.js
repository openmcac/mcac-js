import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    var model = this.modelFor('bulletin');

    if (hasNoAnnouncements(model)) {
      populateLatestAnnouncements(model, this.store);
    }

    return model;
  }
});

function populateLatestAnnouncements(bulletin, store) {
  var group = bulletin.get('group');
  store.find('announcement', { latest_for_group: group.get('id') }).
        then(function(announcements) {
    copyAnnouncementsIntoBulletin(store, announcements, bulletin);
  });
}

function copyAnnouncementsIntoBulletin(store, announcements, bulletin) {
  announcements.forEach(function(announcement) {
    bulletin.get('announcements').
             addObject(cloneAnnouncement(store, announcement));
  });
}

function cloneAnnouncement(store, announcement) {
  return store.createRecord('announcement', {
    description: announcement.get('description'),
    position: announcement.get('position')
  });
}

function hasNoAnnouncements(bulletin) {
  return bulletin.get('announcements').get('length') === 0;
}
