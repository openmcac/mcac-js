import {
  clickable,
  collection,
  create,
  fillable,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/:group_slug/bulletin/:id/edit'),
  name: fillable(selector("name")),
  serviceOrder: fillable(selector("service-order")),
  publishedAt: fillable(`${selector("published-at")} input`),
  series: fillable(sermonSelector("series")),
  sermonName: fillable(sermonSelector("name")),
  speaker: fillable(sermonSelector("speaker")),
  tags: fillable(sermonSelector("tags")),
  notes: fillable(sermonSelector("notes")),
  appendAnnouncement: clickable(announcementsSelector("append")),
  announcements: collection({
    itemScope: announcementsSelector("announcement-editor"),
    item: {
      description: fillable("*[data-auto-id='description']")
    }
  }),
  submit: clickable(selector("submit"))
});

function selector(s) {
  return `*[data-auto-id="bulletin-form"] *[data-auto-id="${s}"]`;
}

function sermonSelector(s) {
  return `*[data-auto-id="sermon-editor"] *[data-auto-id="${s}"]`;
}

function announcementsSelector(s) {
  return `*[data-auto-id="announcements-editor"] *[data-auto-id="${s}"]`;
}
