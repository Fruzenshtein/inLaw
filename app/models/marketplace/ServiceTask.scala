package models.marketplace

import models.swagger.ServiceTaskDTO
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
  import play.modules.reactivemongo.json.BSONFormats._
  implicit val commentFormat = Json.format[Comment]
}

case class ServiceTask(id: Option[String] = Some(Random.alphanumeric.take(12).mkString),
                       name: String,
                       description: String,
                       requiredInfo: String,
                       status: String,
                       approved: Boolean = false,
                       comments: Option[Seq[Comment]] = None)
object ServiceTask {
  implicit val serviceTaskFormat = Json.format[ServiceTask]

  def createServiceTask(dto: ServiceTaskDTO) = {
    val serviceTask = ServiceTask(
      name = dto.name,
      description = dto.description,
      requiredInfo = dto.requiredInfo,
      status = dto.status
    )
    serviceTask
  }
}
