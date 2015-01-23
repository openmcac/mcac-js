import Ember from 'ember';
import request from 'ic-ajax';
import nextService from 'mcac/utils/next-service';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var publishedAt = nextService();
    var group = this.modelFor('group');
    var latestAnnouncementsEndpoint =
        '/api/v1/announcements/latest?group_id=' + group.id;

    return request(latestAnnouncementsEndpoint).then(function(data) {
      var hash = _this.store.normalize('announcement', data.announcements);
      _this.store.pushMany('announcement', hash);

      var defaultBulletin = _this.store.createRecord('bulletin', {
        publishedAt: publishedAt.toDate(),
        name: 'Sunday Worship Service',
        description: publishedAt.format('MMMM Do YYYY, h:mm a'),
        serviceOrder: 'Default service order',
        group: group
      });

      hash.forEach(function(currentAnnouncement) {
        var announcement = Ember.copy(currentAnnouncement);
        announcement.bulletin = defaultBulletin;
        delete announcement.id;
        announcement = _this.store.createRecord('announcement', announcement);
        defaultBulletin.get('announcements').addObject(announcement);
      });

      return defaultBulletin;
    });
  }
});
