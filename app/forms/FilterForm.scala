package forms

import play.api.data.Form
import play.api.data.Forms._

/**
 * Created by Alex on 3/31/15.
 */
case class LawyerFilter(gender: Option[String],
                        firstName: Option[String],
                        lastName: Option[String],
                        minRate: Option[Int],
                        minExp: Option[Int],
                        maxExp: Option[Int],
                        competences: Option[List[String]],
                        languages: Option[List[String]],
                        availability: Option[Boolean])

trait LawyerFilterForm {

  val lawyerFilterForm = Form(
    mapping(
      "gender" -> optional(text),
      "firstName" -> optional(text),
      "lastName" -> optional(text),
      "minRate" -> optional(number),
      "minExp" -> optional(number),
      "maxExpExp" -> optional(number),
      "competences" -> optional(list(text)),
      "languages" -> optional(list(text)),
      "availability" -> optional(boolean)
    )(LawyerFilter.apply)(LawyerFilter.unapply)
  )

}