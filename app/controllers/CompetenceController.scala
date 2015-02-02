package controllers

import com.wordnik.swagger.annotations._
import forms.CompetenceForm
import models.Competence
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import services.{LawyerService, CompetenceService}

import scala.concurrent.Future

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Created by Alex on 1/27/15.
 */
object CompetenceController extends Controller with Security with CompetenceForm {

  @ApiOperation(
    nickname = "lawyersCompetences",
    value = "Post lawyers competences",
    notes = "Adding of new key word to competences set for particular lawyer",
    httpMethod = "POST")
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Competence successfully added"),
    new ApiResponse(code = 400, message = "Validation errors")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer Certificate object which will be updated", required = true, dataType = "models.swagger.Competence", paramType = "body")
  ))
  def addCompetence = isAuthenticated { implicit acc =>
    implicit request =>
      competenceForm.bindFromRequest fold (
        formWithErrors => {
          Logger.info("Competence has validation errors")
          Future.successful(BadRequest(formWithErrors.errorsAsJson))
        },
        compForm => {
          CompetenceService.getCompetence(compForm.competence) map {
            case Some(comp) => {
              Logger.info("Competence exists in DB")
              LawyerService.addLawyerCompetence(acc.email, comp.name)
              Ok
            }
            case None => {
              Logger.info("Competence does not exist in DB")
              CompetenceService.add(compForm.competence)
              LawyerService.addLawyerCompetence(acc.email, compForm.competence)
              Ok
            }
          }
        }
      )

  }

  def getCompetenceByQuery(competence: String) = Action.async {
    implicit request =>
      CompetenceService.findCompetenceByFirstCharacters(competence) map {
        competences => Ok(Json.toJson(competences))
      }
  }

}
