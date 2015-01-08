package forms

import models.Profile
import play.api.data._
import play.api.data.Forms._
import forms.validators.LawyerValidators

/**
 * Created by pitbul on 11/23/14.
 */
trait UserAccountForms extends LawyerValidators {

  val createAccountForm = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText(minLength = 6),
      "repeatPassword" -> nonEmptyText(minLength = 6))
      (UserAccountInfo.apply)(UserAccountInfo.unapply))

  val credentialsForm = Form(mapping(
    "email" -> email,
    "password" -> nonEmptyText(minLength = 6))
    (Credentials.apply)(Credentials.unapply))

  val updateLawyerProfileForm = Form(
    mapping(
      "gender" -> optional(genderCheck),
      "firstName" -> optional(text(maxLength = 20)),
      "lastName" -> optional(text(maxLength = 20)),
      "middleName" -> optional(text(maxLength = 20)),
      "birthDate" -> optional(date("dd/MM/yyyy")),
      "rate" -> optional(number(max=1000000))
    )(Profile.apply)(Profile.unapply)
  )

}