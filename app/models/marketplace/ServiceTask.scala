package models.marketplace

import org.joda.time.DateTime
import play.api.libs.json.Json
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.BSONFormats._

import scala.util.Random

/**
 * Created by Alex on 6/4/15.
 */
case class Comment(id: Option[String] = Some(Random.alphanumeric.take(12).mkString),
                   authorID: BSONObjectID,
                   updatedAt: Option[DateTime] = None,
                   body: String)

object Comment {
  implicit val commentFormat = Json.format[Comment]
}

case class ServiceTask(id: Option[String] = Some(Random.alphanumeric.take(12).mkString),
                       name: String,
                       description: String,
                       requiredInfo: String,
                       status: String,
                       approved: Boolean,
                       comments: Option[Seq[Comment]])
object ServiceTask {
  implicit val serviceTaskFormat = Json.format[ServiceTask]
}
