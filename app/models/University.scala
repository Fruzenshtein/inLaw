package models

import java.util.Date

import play.api.libs.json.Json

import scala.util.Random

/**
 * Created by Alex on 1/11/15.
 */
case class University(id: Option[String],
                      name: String,
                      faculty: String,
                      degree: String,
                      startDate: Date,
                      endDate: Option[Date])

object University {

  implicit val universityFormat = Json.format[University]

  def generateUniversity(university: University): University = {
    university copy (id = Some(Random.alphanumeric.take(12).mkString))
  }

}

case class Certificate(id: Option[String] = Some(Random.alphanumeric.take(12).mkString),
                       name: String,
                       licenseCode: Option[String],
                       link: Option[String],
                       date: Date)

object Certificate {

  implicit val certificateFormat = Json.format[Certificate]

  def generateCertificate(certificate: Certificate): Certificate = {
    certificate copy (id = Some(Random.alphanumeric.take(12).mkString))
  }

}