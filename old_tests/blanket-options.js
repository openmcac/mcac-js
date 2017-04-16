/* globals blanket */

blanket.options({
   filter: "//.*mcac/.*/",
   antifilter: "//.*(tests).*/",
   loaderExclusions: [
     "ember-marked",
     "ember-json-api"
   ]
});
