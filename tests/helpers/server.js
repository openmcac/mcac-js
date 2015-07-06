import Pretender from "pretender";
import GroupPayload from "./payloads/group";

export default function() {
  return new Pretender(function() {
    this.get("/api/v1/groups", function() {
      let all = JSON.stringify({ "data": [GroupPayload.englishService()] });
      return [200, {"Content-Type": "application/vnd.api+json"}, all];
    });

    this.get("/api/v1/groups/1", function() {
      let group = JSON.stringify({ "data": GroupPayload.englishService() });
      return [200, {"Content-Type": "application/vnd.api+json"}, group];
    });
  });
}
