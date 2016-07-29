import Mirage, { faker } from "ember-cli-mirage";

export default Mirage.Factory.extend({
  title() {
    return faker.lorem.sentence();
  },
  slug() {
    return faker.helpers.slugify(this.title()).toLowerCase();
  },
  "group-slug"() {
    return faker.helpers.slugify(this.title()).toLowerCase();
  },
  content() {
    return faker.lorem.paragraphs(2);
  },
  "banner-url"() {
    return `${faker.internet.url()}/banner.png`;
  },
  "published-at"() {
    return faker.date.past().toISOString();
  },
  "kind"() {
    return "post";
  }
});

