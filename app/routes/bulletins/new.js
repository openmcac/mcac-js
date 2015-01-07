import Ember from 'ember';

function upcomingSunday() {
  return moment().endOf('week')
                 .add(1, 'day')
                 .hours(9)
                 .minutes(30)
                 .seconds(0)
                 .milliseconds(0);
}

export default Ember.Route.extend({
  model: function() {
    var publishedAt = upcomingSunday();
    var englishService = this.store.find('group', 1);

    return this.store.createRecord('bulletin', {
      publishedAt: publishedAt.toDate(),
      name: 'Sunday Worship Service',
      description: publishedAt,
      serviceOrder: 'Default service order',
      group: englishService
    });
  }
});
