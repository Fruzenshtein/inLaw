package models

import java.util.Date

import play.api.libs.json.Json

import scala.util.Random

/**
 * Created by Alex on 1/19/15.
 */
case class WorkPlace(id: Option[String],
                      name: String,
                      position: String,
                      responsibilities: String,
                      startDate: Date,
                      endDate: Option[Date])

object WorkPlace {
  implicit val workPlaceFormat = Json.format[WorkPlace]

  def populateWorkPlace(workPlace: WorkPlace): WorkPlace = {
    workPlace copy (id = Some(Random.alphanumeric.take(12).mkString))
  }
}

case class Experience(total: Long, workPlaces: Option[Seq[WorkPlace]])

object Experience {
  implicit val experienceFormat = Json.format[Experience]
}