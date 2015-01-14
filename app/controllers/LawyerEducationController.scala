package controllers

import com.wordnik.swagger.annotations._
import forms.UserAccountForms
import models.University
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.Controller
import services.LawyerService

import scala.collection.immutable.Seq
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
    new ApiResponse(code = 200, message = "Lawyer's University successfully added"),
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
          LawyerService.createUniversity(acc.email, University.generateUniversity(university))
          Future(Ok(Json.obj("message" -> "Lawyer's University successfully added")))
        }
        )
    }
  }

  @ApiOperation(
    nickname = "lawyersEducationUniversities",
    value = "Get lawyers education universities",
    notes = "Get lawyers education universities",
    httpMethod = "GET",
    response = classOf[models.University])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "List of universities"),
    new ApiResponse(code = 200, message = "Universities does not exist"),
    new ApiResponse(code = 200, message = "Education does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def getUniversities = isAuthenticated { implicit acc =>
    implicit request =>
      acc.education match {
        case Some(someEdu) => someEdu.universities match {
          case Some(universities) => Future.successful(Ok(Json.toJson(universities)))
          case None => Future.successful(Ok(Json.obj("message" -> "Universities do not exist")))
        }
        case None => Future.successful(Ok(Json.obj("message" -> "Education does not exist")))
      }
  }

}
