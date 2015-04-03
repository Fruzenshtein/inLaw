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
 * Created by Alex on 1/7/15.
 */
@Api(value = "/lawyers/profile", description = "Operations with Lawyer Profile")
object LawyerProfileController extends Controller with Security with UserAccountForms {

  @ApiOperation(
    nickname = "updateLawyerProfile",
    value = "Update Lawyer Profile",
    notes = "Update Lawyer Profile",
    httpMethod = "PUT",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 400, message = "Bad arguments")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer Profile object which will update previous one", required = true, dataType = "models.swagger.Profile", paramType = "body")))
  def updateProfile = isAuthenticated { implicit acc =>
    implicit request => {
      updateLawyerProfileForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Update of Lawyer Profile was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        profileInfo => {
          Logger.info("Updating of Lawyer Profile...")
          Logger.info("Lawyer Profile: "+profileInfo.toString)
          LawyerService.updateProfile(acc.email, profileInfo)
          Future(Ok(Json.obj("message" -> "Lawyer Profile successfully updated")))
        }
      )
    }
  }

  @ApiOperation(
    nickname = "getLawyerProfile",
    value = "Get Lawyer Profile",
    notes = "Get Lawyer Profile",
    httpMethod = "GET",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Information about Profile")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)))
  def getProfile = isAuthenticated { implicit acc =>
    implicit request => {
      LawyerService.getProfile(acc.email) map {
        case Some(profile) => Ok(Json.toJson(profile))
        case None => Ok(Json.obj("message" -> "Profile does not exist"))
      }
    }
  }

}
