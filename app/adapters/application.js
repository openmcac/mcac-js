import JsonApiAdapter from 'ember-json-api/json-api-adapter';

export default JsonApiAdapter.extend({
  namespace: 'api/v1',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'X-User-Email': 'test@example.com',
    'X-User-Token': '21ff0eddad44463f44e742198fc91c04'
  }
});
