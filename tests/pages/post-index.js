import PageObject from '../page-object';
import postView from "mcac/tests/pages/components/post-view";

const { visitable } = PageObject;

export default PageObject.create({
  visit: visitable("/:groupSlug/:year/:month/:day/:id/:slug"),
  post: postView
});
