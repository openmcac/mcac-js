import Ember from 'ember';
import Pagination from 'ember-cli-jsonapi-pagination/mixins/controllers/jsonapi-pagination';

export default Ember.Controller.extend(Pagination, {
  totalPages: Ember.computed('size', 'number', 'model.posts.[]', function() {
    const lastPage = new URL(this.get("posts.links.last"));
    return parseInt(lastPage.searchParams.get("page[number]"));
  })
});
