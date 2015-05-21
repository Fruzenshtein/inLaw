package models.swagger

import java.util.Date
import models.Phone
import org.joda.time.DateTime

case class BearerToken(token: String)

case class UserAccountInfo(email: String, password: String, repeatPassword: String)

case class Credentials(email: String, password: String)

case class InformationMessage(message: String)

case class LawyerSearchResult(id: String,
                              avatar: String,
                              createdAt: DateTime,
                              gender: String,
                              firstName: String,
                              lastName: String,
                              middleName: String,
                              birthDate: Date,
                              minRate: Int,
                              availability: Boolean)

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

case class University(name: String,
                      faculty: String,
                      degree: String,
                      startDate: Date,
                      endDate: Option[Date])

case class Certificate(name: String,
                       licenseCode: Option[String],
                       link: Option[String],
                       date: Date)

case class Experience(name: String,
                      position: String,
                      responsibilities: String,
                      startDate: Date,
                      endDate: Option[Date])

case class Competence(competence: String)