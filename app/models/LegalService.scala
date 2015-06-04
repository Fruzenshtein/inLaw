package models

import org.joda.time.DateTime
import play.api.libs.json._
import play.api.libs.functional.syntax._
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.BSONFormats._

import scala.util.Random

/**
 * Created by Alex on 6/3/15.
 */
case class LegalService(_id: Option[BSONObjectID],
                        lawyerID: BSONObjectID,
                        category: String,
                        name: String,
                        description: String,
                        price: Int,
                        estimation: Long,
                        tasks: Seq[ServiceTask])

object LegalService {

  implicit val legalServiceWrites: Writes[LegalService] = (
    (JsPath \ "_id").writeNullable[BSONObjectID] and
    (JsPath \ "lawyerID").write[BSONObjectID] and
    (JsPath \ "category").write[String] and
    (JsPath \ "name").write[String] and
    (JsPath \ "description").write[String] and
    (JsPath \ "price").write[Int] and
    (JsPath \ "estimation").write[Long] and
    (JsPath \ "tasks").write[Seq[ServiceTask]]
  )(unlift(LegalService.unapply))

  implicit val legalServiceReads: Reads[LegalService] = (
    (JsPath \ "_id").readNullable[BSONObjectID].map(_.getOrElse(BSONObjectID.generate)).map(Some(_)) and
    (JsPath \ "lawyerID").read[BSONObjectID] and
    (JsPath \ "category").read[String] and
    (JsPath \ "name").read[String] and
    (JsPath \ "description").read[String] and
    (JsPath \ "price").read[Int] and
    (JsPath \ "estimation").read[Long] and
    (JsPath \ "tasks").read[Seq[ServiceTask]]
  )(LegalService.apply _)

}

case class ServiceTask(id: Option[String] = Some(Random.alphanumeric.take(12).mkString),
                       name: String,
                       description: String,
                       requiredInfo: String,
                       status: String,
                       approved: Boolean,
                       comments: Option[Seq[Comment]])
object ServiceTask {

  implicit val serviceTaskFormat: Format[ServiceTask] = (
    (JsPath \ "id").formatNullable[String] and
    (JsPath \ "name").format[String] and
    (JsPath \ "description").format[String] and
    (JsPath \ "requiredInfo").format[String] and
    (JsPath \ "status").format[String] and
    (JsPath \ "approved").format[Boolean] and
    (JsPath \ "comments").formatNullable[Seq[Comment]]
  )(ServiceTask.apply _, unlift(ServiceTask.unapply))

}

case class Comment(id: Option[String] = Some(Random.alphanumeric.take(12).mkString),
                   authorID: BSONObjectID,
                   updatedAt: Option[DateTime] = None,
                   body: String)

object Comment {

  implicit val commentFormats: Format[Comment] = (
    (__ \ "id").formatNullable[String] and
    (__ \ "authorID").format[BSONObjectID] and
    (__ \ "updatedAt").formatNullable[DateTime] and
    (__ \ "body").format[String]
  )(Comment.apply, unlift(Comment.unapply))

}

