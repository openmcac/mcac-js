import { create, visitable, clickable } from 'ember-cli-page-object';

export default create({
  visit: visitable('/'),
  viewOnlineSermons: clickable(selector("listen-sermons-button"))
});

function selector(s) {
  return `*[data-auto-id="index"] *[data-auto-id="${s}"]`;
}
