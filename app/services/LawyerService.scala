package services

import play.api.Play.current
import scala.concurrent.ExecutionContext.Implicits.global

import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection
import models._
import scala.concurrent.Future
import play.api.libs.json.Json

/**
 * Created by Alex on 11/23/14.
 */
object LawyerService {

  private val collection = ReactiveMongoPlugin.db.collection[JSONCollection]("userAccount")

  def add(account: Lawyer) = {
    collection.save(account)
    account
  }

  def findByEmail(email: String): Future[Option[Lawyer]] = {
    val query = Json.obj("email" -> email)
    val account = collection.find(query).one[Lawyer]
    account
  }

  def findByToken(token: String): Future[Option[Lawyer]] = {
    val query = Json.obj("token.bearer" -> token)
    val account = collection.find(query).one[Lawyer]
    account
  }

  def updateBearerToken(email: String, token: String) = {
    val updatedToken = Json.obj(
      "$set" -> Json.obj(
        "token.bearer" -> token)
      )
    val updateAction = collection.update(
      Json.obj("email" -> email),
      updatedToken)
    updateAction
  }

  def updateProfile(email: String, profile: Profile) = {
    val updateProfile = Json.obj(
      "$set" -> Json.obj(
        "profile" -> profile)
      )
    collection.update(
      Json.obj("email" -> email),
      updateProfile
    )
  }

  def getProfile(email: String): Future[Option[Profile]] = {
    val query = Json.obj("email" -> email)
    val account = collection.find(query).one[Lawyer]
    account map {
      case Some(lawyer) => lawyer.profile
      case None => None
    }
  }

  def updateContacts(email: String, contacts: Contacts) = {
    val updateProfile = Json.obj(
      "$set" -> Json.obj(
        "contacts" -> contacts)
    )
    collection.update(
      Json.obj("email" -> email),
      updateProfile
    )
  }

  def getContacts(email: String): Future[Option[Contacts]] = {
    val query = Json.obj("email" -> email)
    val account = collection.find(query).one[Lawyer]
    account map {
      case Some(lawyer) => lawyer.contacts
      case None => None
    }
  }

  def createUniversity(email: String, university: University) = {
    val createUniversity = Json.obj(
      "$push" -> Json.obj(
        "education.universities" -> university
      )
    )
    collection.update(
      Json.obj("email" -> email),
      createUniversity
    )
  }

  def deleteUniversity(email: String, id: String) = {
    val removeUniver = Json.obj(
      "$pull" -> Json.obj(
        "education.universities" -> Json.obj("id" -> id)
      )
    )
    collection.update(
      Json.obj("email" -> email),
      removeUniver
    )
  }

  def createCertificate(email: String, certificate: Certificate) = {
    val createCertificate = Json.obj(
      "$push" -> Json.obj(
        "education.certificates" -> certificate
      )
    )
    collection.update(
      Json.obj("email" -> email),
      createCertificate
    )
  }

}