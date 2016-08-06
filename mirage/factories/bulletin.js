import { Factory, faker } from "ember-cli-mirage";

export default Factory.extend({
  name() {
    return faker.company.companyName();
  },
  publishedAt() {
    const publishedAt = faker.date.past();
    publishedAt.setMilliseconds(0);
    publishedAt.setSeconds(0);

    return publishedAt.toISOString();
  },
  serviceOrder() {
    return faker.lorem.sentence();
  },
  audioUrl() {
    return null;
  },
  bannerUrl() {
    return null;
  }
});
