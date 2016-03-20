import Ember from "ember";
import EmberUploader from "ember-uploader";

export default EmberUploader.FileField.extend({
  session: Ember.inject.service("session"),
  url: "",
  filesDidChange(files) {
    let $progress;

    const uploadUrl = this.get("url");
    const auth = this.get("session.data.authenticated.auth");
    const uploader = EmberUploader.S3Uploader.create({
      url: uploadUrl,
      headers: {
        "access-token": auth.accessToken,
        client: auth.client,
        uid: auth.uid
      }
    });

    uploader.on("didUpload", response => {
      this.sendAction("didupload", getUploadedUrl(response));
      $progress.hide();
    });

    uploader.on("progress", e => $progress.attr("value", e.percent));

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
  }
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
