package services

import models.marketplace.LegalService
import play.api.Logger
import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection

import play.api.Play.current
import reactivemongo.core.commands.LastError
import scala.concurrent.ExecutionContext.Implicits.global

import scala.util.{Failure, Success}

/**
 * Created by Alex on 6/5/15.
 */
object LegalServiceService {

  private val collection = ReactiveMongoPlugin.db.collection[JSONCollection]("legalService")

  def add(legalService: LegalService) = {
    collection.insert(legalService) map {
      case operation if (operation.ok) => Logger.info(s"LegalService successfully created")
      case operation if (!operation.ok) => Logger.error(s"LegalService was not inserted due: ${operation.errMsg.get}")
    }
  }

}
