import FactoryGuy from 'factory-guy';

FactoryGuy.define('group', {
  sequences: {
    randomName: function(i) {
      return 'Test Group ' + i;
    },
    randomSlug: function(i) {
      return 'test-group-' + i;
    },
  },
  default: {
    slug: FactoryGuy.generate('randomSlug'),
    name: FactoryGuy.generate('randomName')
  }
});

export default {};
