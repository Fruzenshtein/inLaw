package services

import models.Competence
import play.api.libs.json.Json
import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection

import play.api.Play.current
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
 * Created by Alex on 1/27/15.
 */
object CompetenceService {

  private val collection = ReactiveMongoPlugin.db.collection[JSONCollection]("competence")

  def add(competence: String) = {
    collection.save(Competence(_id = None, name = competence))
    competence
  }

  def findCompetenceByFirstCharacters(searchReq: String): Future[Seq[Competence]] = {
    val results = collection.find(Json.obj(
      "name" -> Json.obj("$regex" -> s"^$searchReq.*", "$options" -> "i"))
    ).cursor[Competence].collect[Seq]()
    results
  }

  def getCompetence(competence: String): Future[Option[Competence]] = {
    val query = Json.obj("name" -> competence)
    val account = collection.find(query).one[Competence]
    account map {
      case Some(comp) => Some(comp)
      case None => None
    }
  }

}