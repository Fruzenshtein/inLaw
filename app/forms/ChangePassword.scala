package forms

/**
 * Created by Alex on 4/1/15.
 */
case class ChangePassword(oldPassword: String, newPassword: String)

case class RecoverPassword(password: String, repeatPassword: String)