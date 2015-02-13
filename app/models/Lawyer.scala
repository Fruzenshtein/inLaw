package models

import java.util.Date

import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.BSONFormats._
import org.joda.time.DateTime
import play.api.libs.json.{Reads, Writes, JsPath, Format}
import play.api.libs.functional.syntax._
import scala.util.Random
import forms.UserAccountInfo
import utils.CryptUtils


/**
 * Created by Alex on 11/23/14.
 */
case class Lawyer(_id: Option[BSONObjectID],
                  email: String,
                  password: String,
                  avatar: Option[String],
                  bearerToken: Option[BearerToken],
                  createdAt: DateTime,
                  profile: Option[Profile],
                  contacts: Option[Contacts],
                  education: Option[Education],
                  experience: Option[Experience],
                  competences: Option[Seq[String]])

object Lawyer {

  implicit val accountWrites: Writes[Lawyer] = (
    (JsPath \ "_id").writeNullable[BSONObjectID] and
    (JsPath \ "email").write[String] and
    (JsPath \ "password").write[String] and
    (JsPath \ "avatar").writeNullable[String] and
    (JsPath \ "token").writeNullable[BearerToken] and
    (JsPath \ "createdAt").write[DateTime] and
    (JsPath \ "profile").writeNullable[Profile] and
    (JsPath \ "contacts").writeNullable[Contacts] and
    (JsPath \ "education").writeNullable[Education] and
    (JsPath \ "experience").writeNullable[Experience] and
    (JsPath \ "competences").writeNullable[Seq[String]]
  )(unlift(Lawyer.unapply))

  implicit val accountReads: Reads[Lawyer] = (
    (JsPath \ "_id").readNullable[BSONObjectID].map(_.getOrElse(BSONObjectID.generate)).map(Some(_)) and
    (JsPath \ "email").read[String] and
    (JsPath \ "password").read[String] and
    (JsPath \ "avatar").readNullable[String] and
    (JsPath \ "token").readNullable[BearerToken] and
    (JsPath \ "createdAt").readNullable[DateTime].map(_.getOrElse(new DateTime(0))) and
    (JsPath \ "profile").readNullable[Profile] and
    (JsPath \ "contacts").readNullable[Contacts] and
    (JsPath \ "education").readNullable[Education] and
    (JsPath \ "experience").readNullable[Experience] and
    (JsPath \ "competences").readNullable[Seq[String]]
  )(Lawyer.apply _)

  def createAccount(accountInfo: UserAccountInfo) = {
    val account = Lawyer(
      _id = None,
      email = accountInfo.email,
      password = CryptUtils.encryptPassword(accountInfo.password),
      avatar = None,
      bearerToken = None,
      createdAt = new DateTime(),
      profile = Some(Profile(None, None, None, None, None, None, active = true, availability = true)),
      contacts = None,
      education = None,
      experience = Some(Experience(0, None)),
      competences = None
    )
    account
  }

}

case class Profile(gender: Option[String],
                   firstName: Option[String],
                   lastName: Option[String],
                   middleName: Option[String],
                   birthDate: Option[Date],
                   minRate: Option[Int],
                   active: Boolean,
                   availability: Boolean)

object Profile {

  implicit val profileFormat: Format[Profile] = (
    (JsPath \ "gender").formatNullable[String] and
    (JsPath \ "firstName").formatNullable[String] and
    (JsPath \ "lastName").formatNullable[String] and
    (JsPath \ "middleName").formatNullable[String] and
    (JsPath \ "birthDate").formatNullable[Date] and
    (JsPath \ "minRate").formatNullable[Int] and
    (JsPath \ "active").format[Boolean] and
    (JsPath \ "availability").format[Boolean]
  )(Profile.apply, unlift(Profile.unapply))

}

case class Phone(name: String, number: String)

object Phone {

  implicit val phoneFormat: Format[Phone] = (
    (JsPath \ "name").format[String] and
    (JsPath \ "number").format[String]
  )(Phone.apply, unlift(Phone.unapply))

}

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

object Contacts {

  implicit val contactsFormat: Format[Contacts] = (
    (JsPath \ "country").formatNullable[String] and
    (JsPath \ "city").formatNullable[String] and
    (JsPath \ "street").formatNullable[String] and
    (JsPath \ "zip").formatNullable[String] and
    (JsPath \ "phones").formatNullable[Seq[Phone]] and
    (JsPath \ "email").formatNullable[String] and
    (JsPath \ "facebook").formatNullable[String] and
    (JsPath \ "linkedIn").formatNullable[String] and
    (JsPath \ "twitter").formatNullable[String] and
    (JsPath \ "website").formatNullable[String]
  )(Contacts.apply, unlift(Contacts.unapply))

}

case class Education(universities: Option[Seq[University]],
                     certificates: Option[Seq[Certificate]],
                     languages: Option[Seq[String]])

object Education {

  implicit val educationFormat: Format[Education] = (
    (JsPath \ "universities").formatNullable[Seq[University]] and
    (JsPath \ "certificates").formatNullable[Seq[Certificate]] and
    (JsPath \ "languages").formatNullable[Seq[String]]
  )(Education.apply, unlift(Education.unapply))

}

case class BearerToken(bearer: String, status: String, expirationDate: Option[DateTime])

object BearerToken {

  implicit val bearerTokenFormat: Format[BearerToken] = (
      (JsPath \ "bearer").format[String] and
      (JsPath \ "status").format[String] and
      (JsPath \ "expirationDate").formatNullable[DateTime]
    )(BearerToken.apply, unlift(BearerToken.unapply))

  def generateToken() = {
    Random.alphanumeric.take(12).mkString
  }

}

object Status extends Enumeration {
  type Status = Value
  val Active, Blocked, Pending, Inactive = Value
}
