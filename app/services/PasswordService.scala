package services

import models.RecoverLink
import org.joda.time.DateTime
import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection
import reactivemongo.bson.BSONObjectID

import play.api.Play.current
import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Created by Alex on 5/4/15.
 */
object PasswordService {

  private val collection = ReactiveMongoPlugin.db.collection[JSONCollection]("recoverLink")

  def createRecoverLink(userId: BSONObjectID) = {
    collection.save(RecoverLink(_id = None, userId = userId, DateTime.now))
  }

}
