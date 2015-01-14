
//chun added this
import Ember from 'ember';

var IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('bulletin/sunday');
  }
});

export default IndexRoute;
