package forms.validators

import play.api.data.Mapping
import play.api.data.Forms._
import play.api.data.validation.{Invalid, Valid, ValidationError, Constraint}

/**
 * Created by Alex on 1/7/15.
 */
trait LawyerValidators {

  private val gender = """^m|f$""".r
  private val genderConstraint: Constraint[String] = Constraint("constraints.gender")({
    plainText =>
      val errors = gender.findFirstIn(plainText) match {
        case Some(_) => Nil
        case None => Seq(ValidationError("Gender could be 'm' or 'f'"))
      }
      if (errors.isEmpty)
        Valid
      else
        Invalid(errors)
  })

  val genderCheck: Mapping[String] = text.verifying(genderConstraint)

}
