package services

import play.api.Play.current
import scala.concurrent.ExecutionContext.Implicits.global

import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection
import models.{Profile, Lawyer}
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
    val updateAction = collection.update(
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

}