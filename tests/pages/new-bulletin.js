import PageObject from '../page-object';

const { visitable, fillable, clickable } = PageObject;

export default PageObject.create({
  visit: visitable("/:groupSlug/bulletins/new"),
  fillName: fillable(selector("name")),
  fillPublishedAt: fillable(`${selector("published-at")} input`),
  fillDescription: fillable(selector("description")),
  fillServiceOrder: fillable(selector("service-order")),
  fillSermonNotes: fillable(selector("sermon-notes")),
  submit: clickable('button[type=submit]'),
  name: PageObject.value(selector("name")),
  description: PageObject.value(selector("description")),
  publishedAt: PageObject.value(`${selector("published-at")} input`),
  serviceOrder: PageObject.value(selector("service-order")),
  sermonNotes: PageObject.value(selector("sermon-notes"))
});

function selector(s) {
  return `*[data-auto-id='bulletin-${s}']`;
}
