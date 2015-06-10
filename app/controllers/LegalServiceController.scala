package controllers

import com.wordnik.swagger.annotations._
import forms.LegalServiceForms
import models.marketplace.LegalService
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.Controller
import services.LegalServiceService

import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.Future
import scala.util.{Failure, Success}

/**
 * Created by Alex on 6/9/15.
 */
@Api(value = "/legal-services", description = "Operations with Legal Services")
object LegalServiceController extends Controller with Security with LegalServiceForms {

  @ApiOperation(
    nickname = "legalServices",
    value = "Create lawyers legal service",
    notes = "Create Legal Service for logged in Lawyer",
    httpMethod = "POST",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "LegalService 'name' successfully created"),
    new ApiResponse(code = 400, message = "Bad arguments")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Legal Service object which will be added", required = true, dataType = "models.swagger.LegalServiceDTO", paramType = "body")))
  def addLegalService = isAuthenticated {
    implicit acc => implicit request => {
      createLegalService.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Legal Service was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        legalServiceDTO => {
          Logger.info(s"Creation of Legal Service with name: ${legalServiceDTO.name}")
          LegalServiceService.add(LegalService.createLegalService(legalServiceDTO, acc._id.get)) map {
            case Success(msg) => Ok(Json.obj("message" -> msg))
            case Failure(ex) => BadRequest(Json.obj("message" -> ex.getMessage))
          }
        }
      )
    }
  }

}
