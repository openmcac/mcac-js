import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr("string"),
  sermons: DS.hasMany("sermon"),
  user: DS.belongsTo("user"),
  displayLabel: Ember.computed("name", "id", function() {
    const idLabel = Ember.isEmpty(this.get("id")) ? "new" : `id: ${this.get("id")}`;
    return `${this.get("name")} (${idLabel})`;
  })
});
