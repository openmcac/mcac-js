import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  description: DS.attr('string'),
  position: DS.attr('number'),
  bulletin: DS.belongsTo('bulletin'),
  post: DS.belongsTo('post'),
  url: DS.attr('string'),
  descriptionHtml: Ember.computed('description', function() {
    return marked(this.get('description') || '');
  })
});
