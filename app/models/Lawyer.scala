package models

import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.BSONFormats._
import org.joda.time.DateTime
import play.api.libs.json._
import play.api.libs.functional.syntax._
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
                  barCard: Option[BarCard],
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
    (JsPath \ "barCard").writeNullable[BarCard] and
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
    (JsPath \ "barCard").readNullable[BarCard] and
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
      profile = Some(Profile(None, None, None, None, None, None, true, true)),
      barCard = None,
      contacts = None,
      education = None,
      experience = Some(Experience(0, None)),
      competences = None
    )
    account
  }

}

object Status extends Enumeration {
  type Status = Value
  val Active, Blocked, Pending, Inactive = Value
}
