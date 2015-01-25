package models

import play.api.libs.json.{Reads, Writes, JsPath}
import play.modules.reactivemongo.json.BSONFormats._
import reactivemongo.bson.BSONObjectID
import play.api.libs.functional.syntax._

/**
 * Created by Alex on 1/25/15.
 */
case class Competence(_id: Option[BSONObjectID], name: String)

object Competence {

  implicit val competenceWrites: Writes[Competence] = (
    (JsPath \ "_id").writeNullable[BSONObjectID] and
    (JsPath \ "name").write[String]
  )(unlift(Competence.unapply))

  implicit val competenceReads: Reads[Competence] = (
    (JsPath \ "_id").readNullable[BSONObjectID].map(_.getOrElse(BSONObjectID.generate)).map(Some(_)) and
    (JsPath \ "name").read[String]
  )(Competence.apply _)

}