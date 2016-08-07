import PageObject from '../page-object';
import bulletin from "mcac/tests/pages/components/bulletin-view";

const { visitable } = PageObject;

export default PageObject.create({
  visit: visitable("/sunday"),
  bulletin: bulletin
});
