import Ember from "ember";
import ENV from "mcac/config/environment";

const FETCH_PREFIX = `https://res.cloudinary.com/${ENV.cloudinary.cloudName}/image/fetch`;

export function cloudinaryFetch(_, args) {
  return `${FETCH_PREFIX}/w_${args.width}/${args.url}`;
}

export default Ember.Helper.helper(cloudinaryFetch);
