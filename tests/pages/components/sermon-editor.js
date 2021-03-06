import PageObject from '../../page-object';

const { fillable } = PageObject;

export default {
  fillName: fillable(selector("name")),
  fillNotes: fillable(selector("notes")),
  fillSeries: fillable(selector("series")),
  fillSpeaker: fillable(selector("speaker")),
  fillTags: fillable(selector("tags")),
  name: PageObject.value(selector("name")),
  notes: PageObject.value(selector("notes")),
  series: PageObject.value(selector("series")),
  speaker: PageObject.value(selector("speaker")),
  tags() {
    return find(selector("tags")).val().split(",");
  },
  audioUrl() {
    return find(`${selector("audio-preview")} *[data-auto-id='preview']`).
      attr("href");
  }
};

function selector(s) {
  return `*[data-auto-id="sermon-editor"] *[data-auto-id="${s}"]`;
}
