import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  announcements: hasMany(),
  group: belongsTo(),
  sermon: belongsTo()
});
