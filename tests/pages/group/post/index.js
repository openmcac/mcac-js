import { create, visitable } from 'ember-cli-page-object';
import postView from "mcac/tests/pages/components/post-view";

export default create({
  visit: visitable("/:groupSlug/:year/:month/:day/:id/:slug"),
  post: postView
});
