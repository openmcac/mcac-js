/* global $:false */

import PageObject from '../../page-object';

const { text } = PageObject;

export default {
  title: text(selector("title")),
  noNotesIndicatorShown() {
    return $.find(selector("no-notes")).length > 0;
  },
  notes: text(selector("notes"))
};

function selector(s) {
  return `*[data-auto-id="sermon-notes"] *[data-auto-id="${s}"]`;
}
