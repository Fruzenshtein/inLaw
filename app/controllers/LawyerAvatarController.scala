package controllers

import com.wordnik.swagger.annotations._
import play.api.libs.json.Json
import play.api.mvc.Controller
import services.AvatarService

import scala.concurrent.Future

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
    new ApiResponse(code = 400, message = "Can't save logo"),
    new ApiResponse(code = 401, message = "Authorization is failed"),
    new ApiResponse(code = 201, message = "Logo was saved")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Image file that should be stored", required = true, dataType = "file", name = "logo", paramType = "body")))
  def saveLogoByCouncil() = isAuthenticated(parse.multipartFormData) { implicit lawyer =>
    implicit request => Future.successful(Ok(Json.obj("message" -> "avatar uploaded")))
    // AvatarService.saveAvatar(lawyer._id.map(_.stringify).getOrElse(defaultId))(request)
  }

}
