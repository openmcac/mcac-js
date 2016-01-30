import BasePageObject from './base';

export default class EditBulletinPage extends BasePageObject {
  fillInName(name) {
    return this.fillIn("bulletin-name", name);
  }
  fillInPublishedAt(publishedAt) {
    return this.fillIn("bulletin-published-at", publishedAt);
  }
  assertName(name) {
    return this.assertHasValue("bulletin-name", name);
  }
  assertDescription(description) {
    return this.assertHasValue("bulletin-description", description);
  }
  assertServiceOrder(serviceOrder) {
    return this.assertHasValue("bulletin-service-order", serviceOrder);
  }
  assertSermonNotes(sermonNotes) {
    return this.assertHasValue("bulletin-sermon-notes", sermonNotes);
  }
  assertPublishedAt(publishedAt) {
    return this.andThen(() => {
      let actualPublishedAt =
        find("*[data-auto-id='bulletin-published-at'] input").val();
      return this.assertEqualDate(actualPublishedAt, publishedAt);
    });
  }
  assertNoAnnouncements() {
    return this.assertNotPresent("announcement-editor");
  }
};
