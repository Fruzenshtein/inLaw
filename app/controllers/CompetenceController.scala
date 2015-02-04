package controllers

import javax.ws.rs.QueryParam

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
@Api(value = "/lawyers/competences", description = "Operations with Lawyer Competences")
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

  @ApiOperation(
    nickname = "lawyersCompetences",
    value = "Get competences by first characters match",
    notes = "Get competences by first characters match",
    httpMethod = "GET",
    response = classOf[Competence])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Competences")
  ))
  def getCompetenceByQuery(@QueryParam("competence") competence: String) = Action.async {
    implicit request =>
      CompetenceService.findCompetenceByFirstCharacters(competence) map {
        competences => {
          Ok(Json.toJson(competences))
        }
      }
  }

  @ApiOperation(
    nickname = "lawyersCompetences",
    value = "Delete lawyers competence by name",
    notes = "Removing of lawyer's competence",
    httpMethod = "DELETE")
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Competence successfully deleted")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def removeCompetence(@QueryParam("competence") competence: String) = isAuthenticated { implicit acc =>
    implicit request =>
      LawyerService.deleteLawyerCompetence(acc.email, competence)
      Future.successful(Ok)
  }

  @ApiOperation(
    nickname = "lawyersCompetences",
    value = "Get lawyers competences",
    notes = "Get competences of particular lawyer",
    httpMethod = "GET")
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Competences array"),
    new ApiResponse(code = 404, message = "No competences found")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def getLawyerCompetences() = isAuthenticated { implicit acc =>
    implicit request =>
      acc.competences match {
        case Some(competences) => Future.successful(Ok(Json.toJson(competences)))
        case None => Future.successful(NotFound(Json.obj("message" -> "No competences found")))
      }
  }

}
