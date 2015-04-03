package controllers

import com.wordnik.swagger.annotations._
import controllers.LawyerProfileController._
import forms.UserAccountForms
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.Controller
import services.LawyerService

import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.Future

/**
 * Created by Alex on 1/9/15.
 */
@Api(value = "/lawyers/contacts", description = "Operations with Lawyer Contacts")
object LawyerContactsController extends Controller with Security with UserAccountForms {

  @ApiOperation(
    nickname = "updateLawyerContacts",
    value = "Update Lawyer Contacts",
    notes = "Update Lawyer Contacts",
    httpMethod = "PUT",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 400, message = "Bad arguments")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer Contacts object which will update previous one", required = true, dataType = "models.swagger.Contacts", paramType = "body")))
  def updateContacts = isAuthenticated { implicit acc =>
    implicit request => {
      updateContactsProfileForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Update of Lawyer Contacts was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        contactsInfo => {
          Logger.info("Updating of Lawyer Contacts...")
          Logger.info("Lawyer Contacts: "+contactsInfo.toString)
          LawyerService.updateContacts(acc.email, contactsInfo)
          Future(Ok(Json.obj("message" -> "Lawyer Contacts successfully updated")))
        }
        )
    }
  }

  @ApiOperation(
    nickname = "getLawyerContacts",
    value = "Get Lawyer Contacts",
    notes = "Get Lawyer Contacts",
    httpMethod = "GET",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Information about Contacts")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)))
  def getContacts = isAuthenticated { implicit acc =>
    implicit request => {
      LawyerService.getContacts(acc.email) map {
        case Some(profile) => Ok(Json.toJson(profile))
        case None => Ok(Json.obj("message" -> "Contacts does not exist"))
      }
    }
  }

}
