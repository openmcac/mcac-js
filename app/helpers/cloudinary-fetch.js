import Ember from "ember";
import ENV from "mcac/config/environment";

const FETCH_PREFIX = `https://res.cloudinary.com/${ENV.cloudinary.cloudName}/image/fetch`;

export function cloudinaryFetch(_, args) {
  return `${FETCH_PREFIX}/${transformations(args)}/${args.url}`;
}

export default Ember.Helper.helper(cloudinaryFetch);

const helperToCloudinaryMap = {
  "crop": "c",
  "height": "h",
  "radius": "r",
  "width": "w"
};

function transformations(helperArgs) {
  const args = cloudinaryArgs(helperArgs);
  return Object.keys(cloudinaryArgs(helperArgs)).map(k => `${k}_${args[k]}`);
}

function cloudinaryArgs(helperArgs) {
  return Object.keys(helperToCloudinaryMap).reduce((obj, current) => {
    const helperArg = helperArgs[current];

    if (helperArg) {
      obj[helperToCloudinaryMap[current]] = helperArg;
    }

    return obj;
  }, {});
}
