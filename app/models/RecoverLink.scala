package models

import org.joda.time.DateTime
import play.api.libs.functional.syntax._
import play.modules.reactivemongo.json.BSONFormats._
import play.api.libs.json.{Reads, JsPath, Writes}
import reactivemongo.bson.BSONObjectID

/**
 * Created by Alex on 5/4/15.
 */
case class RecoverLink(_id: Option[BSONObjectID],
                       userId: BSONObjectID,
                       createdAt: DateTime)

object RecoverLink {

  implicit val recoverLinkWrites: Writes[RecoverLink] = (
    (JsPath \ "_id").writeNullable[BSONObjectID] and
    (JsPath \ "userId").write[BSONObjectID] and
    (JsPath \ "createdAt").write[DateTime]
  )(unlift(RecoverLink.unapply))

  implicit val recoverLinkReads: Reads[RecoverLink] = (
    (JsPath \ "_id").readNullable[BSONObjectID].map(_.getOrElse(BSONObjectID.generate)).map(Some(_)) and
    (JsPath \ "userId").read[BSONObjectID] and
    (JsPath \ "createdAt").read[DateTime]
  )(RecoverLink.apply _)

}
