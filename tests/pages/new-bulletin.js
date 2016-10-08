import PageObject from '../page-object';
import sermonEditor from "mcac/tests/pages/components/sermon-editor";

const { visitable, fillable, clickable } = PageObject;

export default PageObject.create({
  fillName: fillable(selector("name")),
  fillPublishedAt: fillable(`${selector("published-at")} input`),
  fillServiceOrder: fillable(selector("service-order")),
  name: PageObject.value(selector("name")),
  publishedAt: PageObject.value(`${selector("published-at")} input`),
  sermonEditor,
  serviceOrder: PageObject.value(selector("service-order")),
  submit: clickable(selector("submit-top")),
  visit: visitable("/:groupSlug/bulletins/new")
});

function selector(s) {
  return `*[data-auto-id='bulletin-${s}']`;
}
