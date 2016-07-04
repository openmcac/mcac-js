import PageObject from '../../page-object';

const { text } = PageObject;

export default {
  publishedAt: text(selector("published-at")),
  sermonTitle: text(selector("sermon-title")),
  name: text(selector("name")),
  sermonAudioUrl() {
  }
};

function selector(s) {
  return `*[data-auto-id="bulletin-cover"] *[data-auto-id="${s}"]`;
}
