package models

import play.api.libs.json.Json

/**
 * Created by Alex on 6/5/15.
 */
case class Phone(name: String, number: String)

object Phone {
  implicit val phoneFormat = Json.format[Phone]
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
  implicit val contactsFormat = Json.format[Contacts]
}