package services

import models.marketplace.LegalService
import play.api.Logger
import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection

import play.api.Play.current
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Try, Failure, Success}

/**
 * Created by Alex on 6/5/15.
 */
object LegalServiceService {

  private val collection = ReactiveMongoPlugin.db.collection[JSONCollection]("legalService")

  def add(legalService: LegalService): Future[Try[String]] = {
    collection.insert(legalService) map {
      case operation if (operation.ok) => {
        val message = s"LegalService '${legalService.name}' successfully created"
        Logger.info(message)
        Success(message)
      }
      case operation if (!operation.ok) => {
        Logger.error(s"LegalService was not inserted due: ${operation.errMsg.get}")
        Failure(new Exception(operation.errMsg.get))
      }
    }
  }

}
