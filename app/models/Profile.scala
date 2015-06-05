package models

import java.util.Date

import play.api.libs.json.Json

/**
 * Created by Alex on 6/5/15.
 */
case class Profile(gender: Option[String],
                   firstName: Option[String],
                   lastName: Option[String],
                   middleName: Option[String],
                   birthDate: Option[Date],
                   minRate: Option[Int],
                   active: Boolean = true,
                   availability: Boolean = true)

object Profile {
  implicit val profileFormat = Json.format[Profile]
}