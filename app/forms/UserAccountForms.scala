package forms

import models.{Phone, Contacts, Profile}
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
      (UserAccountInfo.apply)(UserAccountInfo.unapply)
  )

  val credentialsForm = Form(mapping(
    "email" -> email,
    "password" -> nonEmptyText(minLength = 6))
    (Credentials.apply)(Credentials.unapply)
  )

  val updateLawyerProfileForm = Form(
    mapping(
      "gender" -> optional(genderCheck),
      "firstName" -> optional(text(maxLength = 20)),
      "lastName" -> optional(text(maxLength = 20)),
      "middleName" -> optional(text(maxLength = 20)),
      "birthDate" -> optional(date("dd/MM/yyyy")),
      "minRate" -> optional(number)
    )(Profile.apply)(Profile.unapply)
  )

  val updateContactsProfileForm = Form(
    mapping(
      "country" -> optional(text(maxLength = 40)),
      "city" -> optional(text(maxLength = 40)),
      "street" -> optional(text(maxLength = 40)),
      "zip" -> optional(text(maxLength = 8)),
      "phones" -> optional(
        seq(
          mapping(
            "name" -> text,
            "number" -> text
          )(Phone.apply)(Phone.unapply)
        )
      ),
      "email" -> optional(text(maxLength = 60)),
      "facebook" -> optional(text(maxLength = 60)),
      "twitter" -> optional(text(maxLength = 60)),
      "linkedIn" -> optional(text(maxLength = 60)),
      "website" -> optional(text(maxLength = 80))
    )(Contacts.apply)(Contacts.unapply)
  )

}