package controllers

import com.wordnik.swagger.annotations._
import forms.UserAccountForms
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.Controller
import services.LawyerService

import scala.concurrent.Future

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Created by Alex on 1/20/15.
 */
@Api(value = "/lawyers/experience", description = "Operations with Lawyer Experience")
object LawyerExperienceController extends Controller with Security with UserAccountForms {

  @ApiOperation(
    nickname = "lawyersExperience",
    value = "Create lawyers experience",
    notes = "Create lawyers experience",
    httpMethod = "POST",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Experience successfully added"),
    new ApiResponse(code = 400, message = "Bad arguments")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer Experience object which will be added", required = true, dataType = "models.swagger.Experience", paramType = "body")))
  def createExperience = isAuthenticated { implicit acc =>
    implicit request => {
      createExperienceForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Creation of Experience was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        experience => {
          Logger.info("Creation of Experience...")
          Logger.info("Experience: "+experience.toString)
          LawyerService.createExperience(acc.email, models.Experience.generateExperience(experience))
          Future(Ok(Json.obj("message" -> "Experience successfully added")))
        }
        )
    }
  }

}
