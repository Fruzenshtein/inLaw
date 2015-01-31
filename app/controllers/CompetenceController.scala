package controllers

import forms.CompetenceForm
import models.Competence
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import services.CompetenceService

import scala.concurrent.Future

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Created by Alex on 1/27/15.
 */
object CompetenceController extends Controller with CompetenceForm {

  def createCompetence = Action.async {
    implicit request => 
      competenceForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Update of Lawyer Contacts was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        competence => {
          CompetenceService.add(Competence(_id=None,name=competence.competence))
          Future(Created)
        }
      )
  }

  def getCompetenceByQuery(competence: String) = Action.async {
    implicit request =>
      CompetenceService.findByCompetence(competence) map {
        competences => Ok(Json.toJson(competences))
      }
  }

}
