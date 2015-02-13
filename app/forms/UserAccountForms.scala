package forms

import models._
import play.api.data._
import play.api.data.Forms._
import forms.validators.LawyerValidators

/**
 * Created by pitbul on 11/23/14.
 */
trait UserAccountForms extends LawyerValidators {

  private val dateFormat: String = "dd/MM/yyyy"

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
      "birthDate" -> optional(date(dateFormat)),
      "minRate" -> optional(number),
      "active" -> boolean,
      "availability" -> boolean
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
            "name" -> text(maxLength = 20),
            "number" -> text(maxLength = 12)
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

  val createUniversityForm = Form(
    mapping(
      "id" -> optional(text(maxLength = 12)),
      "name" -> text(minLength = 2, maxLength = 60),
      "faculty" -> text(minLength = 2, maxLength = 60),
      "degree" -> educationDegreeCheck,
      "startDate" -> date(dateFormat),
      "endDate" -> optional(date(dateFormat))
    )(University.apply)(University.unapply)
  )

  val createCertificateForm = Form(
    mapping(
      "id" -> optional(text(maxLength = 12)),
      "name" -> text(minLength = 2, maxLength = 60),
      "licenseCode" -> optional(text(minLength = 2, maxLength = 60)),
      "link" -> optional(text(minLength = 7, maxLength = 80)),
      "date" -> date(dateFormat)
    )(Certificate.apply)(Certificate.unapply)
  )

  val createExperienceForm = Form(
    mapping(
      "id" -> optional(text(maxLength = 12)),
      "name" -> text(minLength = 2, maxLength = 60),
      "position" -> text(minLength = 2, maxLength = 60),
      "responsibilities" -> text(minLength = 30, maxLength = 60),
      "startDate" -> date(dateFormat),
      "endDate" -> optional(date(dateFormat))
    )(WorkPlace.apply)(WorkPlace.unapply)
  )

}