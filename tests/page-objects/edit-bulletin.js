import BasePageObject from './base';

export default class EditBulletinPage extends BasePageObject {
  visit(groupSlug, bulletinId) {
    return this.andThen(() => {
      return visit(`/${groupSlug}/bulletins/${bulletinId}/edit`);
    });
  }
  clickSubmit() {
    return this.click("bulletin-submit");
  }
  fillInName(name) {
    return this.fillIn("bulletin-name", name);
  }
  fillInPublishedAt(publishedAt) {
    return this.andThen(() => {
      fillIn("*[data-auto-id='bulletin-published-at'] input", publishedAt);
    });
  }
  fillInDescription(description) {
    return this.fillIn("bulletin-description", description);
  }
  fillInServiceOrder(serviceOrder) {
    return this.fillIn("bulletin-service-order", serviceOrder);
  }
  fillInSermonNotes(sermonNotes) {
    return this.fillIn("bulletin-sermon-notes", sermonNotes);
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
