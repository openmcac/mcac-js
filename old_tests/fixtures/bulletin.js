import FactoryGuy from 'factory-guy';

FactoryGuy.define('bulletin', {
  default: {
    publishedAt: new Date(),
    name: 'Sunday Worship Service',
    description: '',
    serviceOrder: ''
  }
});

export default {};

