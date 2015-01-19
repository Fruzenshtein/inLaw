package models

import java.util.Date

import play.api.libs.json.Json

import scala.util.Random

/**
 * Created by Alex on 1/19/15.
 */
case class Experience(id: Option[String],
                      name: String,
                      position: String,
                      responsibilities: String,
                      startDate: Date,
                      endDate: Option[Date])

object Experience {
  implicit val experienceFormat = Json.format[Experience]

  def generateExperience(experience: Experience): Experience = {
    experience copy (id = Some(Random.alphanumeric.take(12).mkString))
  }
}
