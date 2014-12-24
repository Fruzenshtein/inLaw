package forms

import play.api.data._
import play.api.data.Forms._

/**
 * Created by pitbul on 11/23/14.
 */
trait UserAccountForms {

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

}