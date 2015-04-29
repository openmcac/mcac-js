import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var _this = this;
    return _this.store.find('post', params.post_id).then(function(post) {
      if (post.get('slug') !== params.slug) {
        _this.transitionTo('post', post);
      }

      return post;
    });
  },
  serialize: function(model) {
    return { slug: model.get('slug'), post_id: model.get('id') };
  }
});
