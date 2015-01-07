package models.swagger

import java.util.Date

case class BearerToken(token: String)

case class UserAccountInfo(email: String, password: String, repeatPassword: String)

case class Credentials(email: String, password: String)

case class InformationMessage(message: String)

case class Profile(gender: Option[String],
                   firstName: Option[String],
                   lastName: Option[String],
                   middleName: Option[String],
                   birthDate: Option[Date],
                   minRate: Option[Int])