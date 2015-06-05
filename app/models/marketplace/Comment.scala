package models.marketplace

import org.joda.time.DateTime
import play.api.libs.json.Json
import reactivemongo.bson.BSONObjectID

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
