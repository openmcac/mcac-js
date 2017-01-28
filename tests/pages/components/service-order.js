import PageObject from '../../page-object';

const { text } = PageObject;

export default PageObject.create({
  title: text(selector("title")),
  content: text(selector("content")),
  noNotesIndicatorShown() {
    return $.find(selector("no-notes")).length > 0;
  },
  notes: text(selector("notes"))
});

function selector(s) {
  return `*[data-auto-id="service-order"] *[data-auto-id="${s}"]`;
}
