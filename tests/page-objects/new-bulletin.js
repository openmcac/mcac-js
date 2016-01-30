import BasePageObject from './base';

export default class NewBulletinPage extends BasePageObject {
  visit(groupSlug) {
    return this.andThen(() => {
      return visit(`/${groupSlug}/bulletins/new`);
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
  assertCreatedBulletin(server) {
    return this.andThen(() => {
      let bulletins = server.db.bulletins;
      let createdBulletin = bulletins[bulletins.length - 1];

      this.assert.equal(createdBulletin.name, this.find("bulletin-name").val());
      this.assertEqualDate(createdBulletin["published-at"],
          find("*[data-auto-id='bulletin-published-at'] input").val());
      this.assert.equal(createdBulletin.description,
          this.find("bulletin-description").val());
      this.assert.equal(createdBulletin["service-order"],
          this.find("bulletin-service-order").val());
      this.assert.equal(createdBulletin["sermon-notes"],
          this.find("bulletin-sermon-notes").val());
    });
  }
  assertRedirectToEditPage(server, groupSlug) {
    return this.andThen(() => {
      let bulletins = server.db.bulletins;
      let createdBulletin = bulletins[bulletins.length - 1];

      this.assertURL(`/${groupSlug}/bulletins/${createdBulletin.id}/edit`);
    });
  }
};
