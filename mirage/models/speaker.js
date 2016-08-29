import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  sermons: hasMany(),
  user: belongsTo()
});
