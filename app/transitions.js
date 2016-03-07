import Bulletin from "mcac/models/bulletin";

export default function(){
  this.transition(
    this.toValue(function(toValue, fromValue) {
      if (!transitionBetweenBulletins(toValue, fromValue)) {
        return false;
      }

      if (toValue.publishedEarlierThan(fromValue)) {
        return true;
      }

      return false;
    }),
    this.use("toRight")
  );

  this.transition(
    this.toValue(function(toValue, fromValue) {
      if (!transitionBetweenBulletins(toValue, fromValue)) {
        return false;
      }

      if (!toValue.publishedEarlierThan(fromValue)) {
        return true;
      }

      return false;
    }),
    this.use("toLeft")
  );

  this.transition(
    this.toRoute('sunday'),
    this.use('toRight')
  );

  this.transition(
    this.fromRoute('bulletin/sunday'),
    this.toRoute('group'),
    this.use('toRight'),
    this.debug()
  );
}

function transitionBetweenBulletins(toValue, fromValue) {
  return toValue instanceof Bulletin && fromValue instanceof Bulletin;
}
