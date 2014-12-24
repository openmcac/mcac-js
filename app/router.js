import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('group', { path: 'groups/:group_id' }, function() { });
  this.resource('group/bulletin', { path: 'group/bulletins/:group/bulletin_id' }, function() { });
});

export default Router;
