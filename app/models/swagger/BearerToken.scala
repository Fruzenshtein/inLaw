package models.swagger

import java.util.Date
import models.Phone

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

case class Contacts(country: Option[String],
                    city: Option[String],
                    street: Option[String],
                    zip: Option[String],
                    phones: Option[Seq[Phone]],
                    email: Option[String],
                    facebook: Option[String],
                    linkedIn: Option[String],
                    twitter: Option[String],
                    website: Option[String])