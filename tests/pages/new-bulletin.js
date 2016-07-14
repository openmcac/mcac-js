import PageObject from '../page-object';

const { visitable, fillable, clickable } = PageObject;

export default PageObject.create({
  visit: visitable("/:groupSlug/bulletins/new"),
  fillName: fillable(selector("name")),
  fillPublishedAt: fillable(`${selector("published-at")} input`),
  fillServiceOrder: fillable(selector("service-order")),
  submit: clickable('button[type=submit]'),
  name: PageObject.value(selector("name")),
  publishedAt: PageObject.value(`${selector("published-at")} input`),
  serviceOrder: PageObject.value(selector("service-order"))
});

function selector(s) {
  return `*[data-auto-id='bulletin-${s}']`;
}
