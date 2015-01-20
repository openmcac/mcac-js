import DS from 'ember-data';

export default DS.Model.extend({
  description: DS.attr('string'),
  position: DS.attr('number'),
  bulletin: DS.belongsTo('bulletin'),
  descriptionHtml: function() {
    return marked(this.get('description'));
  }.property('description')
});
