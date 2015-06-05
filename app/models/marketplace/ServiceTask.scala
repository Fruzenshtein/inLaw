package models.marketplace

import play.api.libs.json.Json

import scala.util.Random

/**
 * Created by Alex on 6/4/15.
 */
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
