import PageObject from '../page-object';

const { visitable, clickable } = PageObject;

export default PageObject.create({
  visit: visitable('/'),
  viewOnlineSermons: clickable(selector("listen-sermons-button"))
});

function selector(s) {
  return `*[data-auto-id="index"] *[data-auto-id="${s}"]`;
}
