package services

import models.marketplace.{LegalServiceEdit, LegalService}
import play.api.Logger
import play.api.libs.json.{JsObject, Json}
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

  def listByLawyerId(lawyerID: String): Future[Seq[LegalService]] = {
    val query = Json.obj("lawyerID" -> lawyerID)
    val legalServices = collection.find(query)
      .cursor[LegalService]
      .collect[Seq]()
    legalServices
  }

  def findByIdAndLawyerId(id: String, lawyerID: String) = {
    val query = Json.obj("_id" -> Json.obj("$oid" -> id), "lawyerID" -> lawyerID)
    val legalService = collection.find(query).one[LegalService]
    legalService
  }

  def deleteById(id: String, lawyerID: String): Future[Try[String]] = {
    collection.remove(Json.obj("_id" -> Json.obj("$oid" -> id), "lawyerID" -> lawyerID)) map {
      case operation if (operation.ok && operation.updated > 0) => {
        val message = s"LegalService with id: ${id} successfully deleted"
        Logger.info(message)
        Success(message)
      }
      case operation if (!operation.ok) => {
        Logger.error(s"LegalService was not deleted due: ${operation.errMsg.get}")
        Failure(new Exception(operation.errMsg.get))
      }
    }
  }

  def updateById(id: String, lawyerID: String, dto: LegalServiceEdit) = {
    val updateLegalService = Json.obj(
      "$set" -> Json.obj(
        "category" -> dto.category,
        "name" -> dto.name,
        "description" -> dto.description,
        "price" -> dto.price,
        "estimation" -> dto.estimation)
    )
    collection.update(
      Json.obj("_id" -> Json.obj("$oid" -> id), "lawyerID" -> lawyerID),
      updateLegalService
    )  map {
      case operation if (operation.ok && operation.updated > 0) => {
        val message = s"LegalService with id: ${id} successfully updated"
        Logger.info(message)
        Success(message)
      }
      case operation if (!operation.ok) => {
        Logger.error(s"LegalService was not updated due: ${operation.errMsg.get}")
        Failure(new Exception(operation.errMsg.get))
      }
    }
  }

}
