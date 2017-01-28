import PageObject from '../../page-object';
import announcements from "mcac/tests/pages/components/bulletin-announcements";
import cover from "mcac/tests/pages/components/bulletin-cover";
import sermonNotes from "mcac/tests/pages/components/sermon-notes";

const { text } = PageObject;

export default {
  announcements: announcements,
  cover: cover,
  sermonNotes: sermonNotes,
  serviceOrder: text(selector("service-order"))
};

function selector(s) {
  return `*[data-auto-id="bulletin-view"] *[data-auto-id="${s}"]`;
}
