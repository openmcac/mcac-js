import PageObject from '../page-object';
import postView from "mcac/tests/pages/components/page-view";

const { visitable } = PageObject;

export default PageObject.create({
  visit: visitable("/:groupSlug/:slug"),
  page: postView
});
