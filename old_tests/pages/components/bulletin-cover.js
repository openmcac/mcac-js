import PageObject from '../../page-object';

const { text } = PageObject;

export default {
  name: text(selector("name")),
  publishedAt: text(selector("published-at")),
  sermonAudioUrl() {
    return $($.find(selector("audio"))[0]).attr("src");
  },
  sermonName: text(selector("sermon-name"))
};

function selector(s) {
  return `*[data-auto-id="bulletin-cover"] *[data-auto-id="${s}"]`;
}
