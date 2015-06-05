package models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Json, JsPath, Format}

/**
 * Created by Alex on 6/5/15.
 */
case class Education(universities: Option[Seq[University]],
                     certificates: Option[Seq[Certificate]],
                     languages: Option[Seq[String]])

object Education {

  implicit val educationFormat = Json.format[Education]

}
