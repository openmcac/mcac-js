import Ember from "ember";
import EmberUploader from "ember-uploader";

export default EmberUploader.FileField.extend({
  url: "",

  filesDidChange: (function() {
    var _this = this;
    var uploadUrl = this.get("url");
    var files = this.get("files");

    var uploader = EmberUploader.S3Uploader.create({
      url: uploadUrl
    });

    uploader.on("didUpload", function(response) {
      _this.sendAction("didUpload", getUploadedUrl(response));
    });

    if (!Ember.isEmpty(files)) {
      // Uploader will send a sign request then upload to S3
      uploader.upload(files[0]);
    }
  }).observes("files")
});

function getUploadedUrl(response) {
  // S3 will return XML with url
  var uploadedUrl = Ember.$(response).find("Location")[0].textContent;

  // => http://yourbucket.s3.amazonaws.com/file.png
  return decodeURIComponent(uploadedUrl);
}
