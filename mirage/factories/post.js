import { Factory, faker } from "ember-cli-mirage";

export default Factory.extend({
  title() {
    return faker.lorem.sentence();
  },
  slug() {
    return faker.helpers.slugify(this.title).toLowerCase();
  },
  groupSlug() {
    return faker.helpers.slugify(this.title).toLowerCase();
  },
  content() {
    return faker.lorem.sentences(faker.random.number(4) + 1).replace(/\n/g, ' ');
  },
  bannerUrl() {
    return `${faker.internet.url()}/banner.png`;
  },
  publishedAt() {
    return faker.date.past().toISOString();
  },
  kind() {
    return "post";
  }
});
