import FactoryGuy from 'factory-guy';

FactoryGuy.define('announcement', {
  sequences: {
    position: function(num) {
      return num;
    }
  },
  default: {
    bulletin: FactoryGuy.belongsTo('bulletin'),
    position: FactoryGuy.generate('position'),
    description: 'This is a description'
  }
});

export default {};
