import PageObject from '../page-object';

const { visitable, text } = PageObject;

export default PageObject.create({
  visit: visitable("/:groupSlug/:slug"),
  title: text(selector("title")),
  content: text(selector("content"))
});

function selector(s) {
  return `*[data-auto-id='page-${s}']`;
}
