package controllers

import javax.ws.rs.PathParam

import com.wordnik.swagger.annotations._
import play.api.libs.json.Json
import play.api.mvc.{Action, MultipartFormData, Request, Controller}
import play.api.libs.Files
import services.AvatarService

import scala.concurrent.Future
import scala.util.{Failure, Success}

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Created by Alex on 1/22/15.
 */
@Api(value = "/lawyers/avatar", description = "Operations with lawyers avatar")
object LawyerAvatarController extends Controller with Security {

  @ApiOperation(
    nickname = "uploadAvatar",
    value = "uploadAvatar",
    notes = "Upload avatar",
    httpMethod = "PUT",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 400, message = "Can not save avatar"),
    new ApiResponse(code = 401, message = "Authorization is failed"),
    new ApiResponse(code = 201, message = "Avatar was uploaded")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Image file that should be stored", required = true, dataType = "file", name = "avatar", paramType = "body")))
  def saveLogoByCouncil() = isAuthenticated(parse.multipartFormData) { implicit lawyer =>
    implicit request =>
      saveAvatar(lawyer._id.map(_.stringify).getOrElse("defaultId"))(request)
  }

  private def saveAvatar(lawyerId: String)(implicit request: Request[MultipartFormData[Files.TemporaryFile]]) = request.body.file("avatar") match {
    case Some(avatarFile) => AvatarService.saveAvatar(lawyerId, avatarFile.ref.file) map {
      case Success(_) => Created((Json.obj("message" -> "Avatar was uploaded")))
      case Failure(e) => BadRequest((Json.obj("message" -> s"Can not save avatar: ${e.getMessage}")))
    }
    case None => Future(BadRequest((Json.obj("message" -> s"Can not save avatar: Form part avatar does not exist."))))
  }

  @ApiOperation(
    nickname = "getAvatar",
    value = "getAvatar",
    notes = "Get lawyer awatar",
    httpMethod = "GET",
    produces = "image")
  @ApiResponses(Array(
    new ApiResponse(code = 404, message = "Lawyer does not have avatar"),
    new ApiResponse(code = 200, message = "image")))
  def getAvatar(@ApiParam(value = "Lawyer's ID", required = true)@PathParam("id") lawyerId: String) = Action.async {
    AvatarService.getAvatar(lawyerId) map {
      case Some(image) => Ok(image).as("image")
      case None => NotFound(s"Lawyer with ID: ${lawyerId} does not have avatar")
    }
  }

}
