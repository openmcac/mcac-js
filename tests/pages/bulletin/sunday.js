import { create, text, visitable } from 'ember-cli-page-object';
import announcements from "mcac/tests/pages/components/bulletin-announcements";
import cover from "mcac/tests/pages/components/bulletin-cover";
import sermonNotes from "mcac/tests/pages/components/sermon-notes";

export default create({
  visit: visitable('/sunday'),
  bulletin: {
    announcements,
    cover,
    sermonNotes,
    serviceOrder: text(selector("service-order"))
  }
});

function selector(s) {
  return `*[data-auto-id="bulletin-view"] *[data-auto-id="${s}"]`;
}
