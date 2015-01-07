package models.swagger

import java.util.Date

case class BearerToken(token: String)

case class UserAccountInfo(email: String, password: String, repeatPassword: String)

case class Credentials(email: String, password: String)

case class InformationMessage(message: String)

case class Profile(gender: String,
                   firstName: String,
                   lastName: String,
                   middleName: String,
                   birthDate: Date,
                   minRate: Int)