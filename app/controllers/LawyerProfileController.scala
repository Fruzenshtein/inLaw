package controllers

import java.lang.annotation.Annotation

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
    new ApiImplicitParam(value = "Lawyer Profile object which will update previous one", required = true, dataType = "models.Profile", paramType = "body")))
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
    response = classOf[models.Profile])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Information about Profile"),
    new ApiResponse(code = 404, message = "Profile does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)))
  def getProfile = isAuthenticated { implicit acc =>
    implicit request => {
      LawyerService.getProfile(acc.email) map {
        case Some(profile) => Ok(Json.toJson(profile))
        case None => NotFound(Json.obj("message" -> "Profile does not exist"))
      }
    }
  }

  @ApiOperation(
    nickname = "updateLawyerBarCard",
    value = "Update Lawyer Bar Card",
    notes = "Update Lawyer Bar Card",
    httpMethod = "PUT",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 400, message = "Bad arguments")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer Bar Card object which will update previous one", required = true, dataType = "models.BarCard", paramType = "body")))
  def updateBarCard = isAuthenticated { implicit acc =>
    implicit request => {
      updateLawyerBarCard.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Update of Lawyer Bar Card was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        barCardInfo => {
          Logger.info("Updating of Lawyer Bar Card...")
          Logger.info("Lawyer Bar Card: "+barCardInfo.toString)
          LawyerService.updateBarCard(acc.email, barCardInfo)
          Future(Ok(Json.obj("message" -> "Lawyer Bar Card successfully updated")))
        }
      )
    }
  }

  @ApiOperation(
    nickname = "getLawyerBarCard",
    value = "Get Lawyer Bar Card",
    notes = "Get Lawyer Bar Card",
    httpMethod = "GET",
    response = classOf[models.BarCard])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Information about Bar Card"),
    new ApiResponse(code = 404, message = "Bar Card does not exist")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)))
  def getBarCard = isAuthenticated { implicit acc =>
    implicit request => {
      acc.barCard match {
        case Some(barCard) => Future(Ok(Json.toJson(barCard)))
        case None => Future(NotFound(Json.obj("message" -> "Bar Card does not exist")))
      }
    }
  }

}
