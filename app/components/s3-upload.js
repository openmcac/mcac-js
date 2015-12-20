import Ember from "ember";
import EmberUploader from "ember-uploader";

export default EmberUploader.FileField.extend({
  session: Ember.inject.service("session"),
  url: "",

  filesDidChange: Ember.observer("files", function() {
    let _this = this;
    let uploadUrl = this.get("url");
    let files = this.get("files");
    let $progress;
    let auth = this.get("session.data.authenticated.auth");

    let uploader = EmberUploader.S3Uploader.create({
      url: uploadUrl,
      headers: {
        "access-token": auth.accessToken,
        client: auth.client,
        uid: auth.uid
      }
    });

    uploader.on("didUpload", function(response) {
      _this.sendAction("didUpload", getUploadedUrl(response));
      $progress.hide();
    });

    uploader.on("progress", function(e) {
      $progress.attr("value", e.percent);
    });

    if (!Ember.isEmpty(files)) {
      // Uploader will send a sign request then upload to S3
      uploader.upload(files[0]);

      if ($progress) {
        $progress.attr("value", "0");
        $progress.show();
      } else {
        $progress = createProgressElement();
        Ember.$(this.element).parent().append($progress);
      }
    }
  })
});

function createProgressElement() {
  var progress = Ember.$("<progress>");
  progress.attr("max", "100");
  progress.attr("value", "0");
  return progress;
}

function getUploadedUrl(response) {
  // S3 will return XML with url
  var uploadedUrl = Ember.$(response).find("Location")[0].textContent;

  // => http://yourbucket.s3.amazonaws.com/file.png
  return decodeURIComponent(uploadedUrl);
}
