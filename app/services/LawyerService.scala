package services

import play.api.Play.current
import scala.concurrent.ExecutionContext.Implicits.global

import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection
import models.Lawyer
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

}