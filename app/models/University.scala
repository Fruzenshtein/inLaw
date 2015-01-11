package models

import java.util.Date
import play.api.libs.functional.syntax._

import play.api.libs.json.{JsPath, Format}

/**
 * Created by Alex on 1/11/15.
 */
case class University(name: String,
                      faculty: String,
                      degree: String,
                      startDate: Date,
                      endDate: Option[Date])

object University {

  implicit val universityFormat: Format[University] = (
    (JsPath \ "name").format[String] and
    (JsPath \ "faculty").format[String] and
    (JsPath \ "degree").format[String] and
    (JsPath \ "startDate").format[Date] and
    (JsPath \ "endDate").formatNullable[Date]
  )(University.apply, unlift(University.unapply))

}

case class Certificate(name: String, licenseCode: Option[String], link: Option[String], date: Date)

object Certificate {

  implicit val certificateFormat: Format[Certificate] = (
    (JsPath \ "name").format[String] and
    (JsPath \ "licenseCode").formatNullable[String] and
    (JsPath \ "link").formatNullable[String] and
    (JsPath \ "date").format[Date]
  )(Certificate.apply, unlift(Certificate.unapply))

}