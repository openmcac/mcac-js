import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('post', params.post_id);
  },
  serialize: function(model) {
    return { slug: model.get('slug'), post_id: model.get('id') };
  }
});
