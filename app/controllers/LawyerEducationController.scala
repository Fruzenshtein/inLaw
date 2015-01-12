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
 * Created by Alex on 1/11/15.
 */
@Api(value = "/lawyers/education", description = "Operations with Lawyer Education")
object LawyerEducationController extends Controller with Security with UserAccountForms {

  @ApiOperation(
    nickname = "lawyersEducationUniversities",
    value = "Create lawyers education universities",
    notes = "Create lawyers education universities",
    httpMethod = "POST",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 400, message = "Bad arguments")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer University object which will be added", required = true, dataType = "models.swagger.University", paramType = "body")))
  def createUniversity = isAuthenticated { implicit acc =>
    implicit request => {
      createUniversityForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Creation of Lawyer Profile was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        university => {
          Logger.info("Updating of Lawyer Profile...")
          Logger.info("Lawyer Profile: "+university.toString)
          LawyerService.createUniversity(acc.email, university)
          Future(Ok(Json.obj("message" -> "Lawyer's University successfully updated")))
        }
        )
    }
  }

}
