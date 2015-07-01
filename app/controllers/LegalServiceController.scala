package controllers

import javax.ws.rs.QueryParam

import com.wordnik.swagger.annotations._
import forms.LegalServiceForms
import models.marketplace.LegalService
import play.api.Logger
import play.api.libs.json.{JsObject, Json}
import play.api.mvc.{Result, Controller}
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
    new ApiImplicitParam(value = "Legal Service object which will be added", required = true, dataType = "models.marketplace.LegalServiceDTO", paramType = "body")))
  def addLegalService = isAuthenticated {
    implicit acc => implicit request => {
      legalServiceInfo.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Legal Service was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        legalServiceDTO => {
          Logger.info(s"Creation of Legal Service with name: ${legalServiceDTO.name}")
          LegalServiceService.add(LegalService.createLegalService(legalServiceDTO, acc._id.get.stringify)) map {
            case Success(msg) => Ok(Json.obj("message" -> msg))
            case Failure(ex) => BadRequest(Json.obj("message" -> ex.getMessage))
          }
        }
      )
    }
  }

  @ApiOperation(
    nickname = "lawyersLegalServices",
    value = "Get lawyers legal services",
    notes = "Get lawyers legal services",
    httpMethod = "GET",
    responseContainer="List",
    response = classOf[models.swagger.response.LegalService])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "List of legal services")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def getLawyerLegalServices = isAuthenticated {implicit acc => implicit request =>
    LegalServiceService.listByLawyerId(acc._id.get.stringify) map {
      case legalServices => {
        Logger.info("List Lawyer's Legal Services...")
        val legalServicesJSON = legalServices map(legalServiceToJson(_))
        Ok(Json.toJson(legalServicesJSON))
      }
    }
  }

  @ApiOperation(
    nickname = "lawyersLegalServicesById",
    value = "Get lawyers legal service by id",
    notes = "Get lawyers legal service by id of the service",
    httpMethod = "GET",
    response = classOf[models.swagger.response.LegalService])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Legal service"),
    new ApiResponse(code = 404, message = "Legal Service with id: $id does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def getLawyerLegalService(@QueryParam("id") id: String) = isAuthenticated {implicit acc => implicit request =>
    withLegalService(id, acc._id.get.stringify, implicit service => {
      val legalServiceJSON = legalServiceToJson(service)
      Future.successful(Ok(Json.toJson(legalServiceJSON)))
    })
  }

  @ApiOperation(
    nickname = "deleteLawyerLegalService",
    value = "Delete lawyers legal service by id",
    notes = "Delete lawyers legal service by id of the service",
    httpMethod = "DELETE",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "LegalService with id: $id successfully deleted"),
    new ApiResponse(code = 404, message = "Legal Service with id: $id does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def deleteLegalService(@QueryParam("id") id: String) = isAuthenticated { implicit acc => implicit request =>
    withLegalService(id, acc._id.get.stringify, implicit service => {
      Logger.info(s"Deleting of Service with id: ${id}")
      LegalServiceService.deleteById(id, acc._id.get.stringify) map {
        case Success(msg) => Ok(Json.obj("message" -> msg.toString))
        case Failure(ex) => BadRequest(Json.obj("message" -> ex.getMessage))
      }
    })
  }

  @ApiOperation(
    nickname = "updateLawyerLegalService",
    value = "Update lawyers legal service by id",
    notes = "Update lawyers legal service by id of the service",
    httpMethod = "PUT",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "LegalService with id: $id successfully updated"),
    new ApiResponse(code = 404, message = "Legal Service with id: $id does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Legal Service object which will be added", required = true, dataType = "models.marketplace.LegalServiceDTO", paramType = "body")
  ))
  def updateLegalService(@QueryParam("id") id: String) = isAuthenticated { implicit acc => implicit request =>
    withLegalService(id, acc._id.get.stringify, implicit service =>
      legalServiceInfo.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Legal Service was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        dto => {
          Logger.info(s"Updating of Service with id: ${id}")
          LegalServiceService.updateById(id, acc._id.get.stringify, dto) map {
            case Success(msg) => Ok(Json.obj("message" -> msg.toString))
            case Failure(ex) => BadRequest(Json.obj("message" -> ex.getMessage))
          }
        }
      )
    )
  }

  private def legalServiceToJson(ls: LegalService): JsObject = {
    val serviceJson = Json.obj("id" -> ls._id.get.stringify, "lawyerID" -> ls.lawyerID,
      "category" -> ls.category, "name" -> ls.name, "price" -> ls.price, "estimation" -> ls.estimation,
      "included" -> ls.included, "excluded" -> ls.excluded, "required" -> ls.required)
    serviceJson
  }

  private def withLegalService(id: String, accID: String, f: LegalService => Future[Result]): Future[Result] = {
    LegalServiceService.findByIdAndLawyerId(id, accID) flatMap {
      case legalServiceOpt => {
        Logger.info(s"Searching Legal Service by its ID: ${id}")
        legalServiceOpt match {
          case Some(legalService) => f(legalService)
          case None => {
            val message = s"Legal Service with id: $id does not exist"
            Logger.info(message)
            Future.successful(NotFound(Json.obj("message" -> message)))
          }
        }
      }
    }
  }

}