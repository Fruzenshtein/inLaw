package services

import models.RecoverLink
import org.joda.time.DateTime
import play.api.libs.json.Json
import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection

import play.api.Play.current
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
 * Created by Alex on 5/4/15.
 */
object PasswordService {

  private val collection = ReactiveMongoPlugin.db.collection[JSONCollection]("recoverLink")

  def createRecoverLink(email: String) = {
    collection.save(RecoverLink(_id = None, userEmail = email, DateTime.now))
  }

  def findByEmail(email: String): Future[Option[RecoverLink]] = {
    val query = Json.obj("userEmail" -> email)
    val recoverLink = collection.find(query).one[RecoverLink]
    recoverLink
  }

  def findById(id: String): Future[Option[RecoverLink]] = {
    val query = Json.obj("_id" -> Json.obj("$oid" -> id))
    val recoverLink = collection.find(query).one[RecoverLink]
    recoverLink
  }

  def remove(id: String) = {
    collection.remove(Json.obj("_id" -> Json.obj("$oid" -> id)))
  }

}
