package controllers

import javax.ws.rs.QueryParam

import com.wordnik.swagger.annotations._
import forms.LegalServiceForms
import models.marketplace.{ServiceTask, LegalService}
import play.api.Logger
import play.api.libs.json.{JsObject, Json}
import play.api.mvc.{Results, Result, Controller}
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
      val legalServiceJSON =  legalServiceToJson(service)
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
    new ApiImplicitParam(value = "Legal Service object which will be added", required = true, dataType = "models.marketplace.LegalServiceEdit", paramType = "body")
  ))
  def updateLegalService(@QueryParam("id") id: String) = isAuthenticated { implicit acc => implicit request =>
    withLegalService(id, acc._id.get.stringify, implicit service =>
      editLegalService.bindFromRequest fold(
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

  @ApiOperation(
    nickname = "serviceTasks",
    value = "Add service task",
    notes = "Add service task to legal service",
    httpMethod = "POST",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "ServiceTask $name successfully added"),
    new ApiResponse(code = 400, message = "Bad arguments"),
    new ApiResponse(code = 404, message = "Legal Service with id: $id does not exist")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Service Task object which will be added", required = true, dataType = "models.swagger.ServiceTaskDTO", paramType = "body")))
  def addServiceTask(@QueryParam("id") id: String) = isAuthenticated { implicit acc => implicit request =>
    withLegalService(id, acc._id.get.stringify, implicit service =>
    taskInfo.bindFromRequest fold(
      formWithErrors => {
        Logger.info("Legal Task was with ERRORS")
        Future.successful(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
      },
      dto => {
        import models.marketplace.ServiceTask._
        Logger.info(s"Creation of Service Task with name: ${dto.name}")
        LegalServiceService.addTask(id, acc._id.get.stringify, createServiceTask(dto)) map {
          case Success(msg) => Ok(Json.obj("message" -> msg))
          case Failure(ex) => BadRequest(Json.obj("message" -> ex.getMessage))
        }
      }
      )
    )
  }

  @ApiOperation(
    nickname = "serviceTasks",
    value = "Update service task",
    notes = "Update service task of legal service",
    httpMethod = "PUT",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "ServiceTask with ID $taskID successfully updated"),
    new ApiResponse(code = 400, message = "Bad arguments"),
    new ApiResponse(code = 404, message = "Service Task with ID: $taskID does not exist")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Service Task object which will be added", required = true, dataType = "models.swagger.ServiceTaskDTO", paramType = "body")))
  def updateServiceTask(@QueryParam("id") id: String, @QueryParam("taskID") taskID: String) = isAuthenticated
  { implicit acc => implicit request =>
    val lawyerId = acc._id.get.stringify
    withLegalService(id, lawyerId, implicit service =>
      taskInfo.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Legal Task was with ERRORS")
          Future.successful(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        dto => {
          service.tasks.find( task => task.id == taskID) match {
            case Some(serviceTask) => {
              Logger.info(s"Update of Service Task with id: ${taskID}")
              LegalServiceService.deleteTask(id, lawyerId, taskID) flatMap {
                case Success(msg) => {
                  LegalServiceService.addTask(id, lawyerId,
                    ServiceTask(id, dto.name, dto.description, dto.requiredInfo)) map {
                      case Success(msg) => Ok(Json.obj("message" -> s"ServiceTask with ID '${taskID}' successfully updated"))
                      case Failure(ex) => BadRequest(Json.obj("message" -> ex.getMessage))
                    }
                }
                case Failure(ex) => Future.successful(BadRequest(Json.obj("message" -> ex.getMessage)))
              }
            }
            case None => Future.successful(NotFound(
              Json.obj("message" -> s"Service Task with ID: ${taskID} does not exist"))
            )
          }
        }
      )
    )
  }

  @ApiOperation(
    nickname = "serviceTasks",
    value = "Delete service task",
    notes = "Delete service task from legal service",
    httpMethod = "DELETE",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "ServiceTask with ID $taskID successfully deleted"),
    new ApiResponse(code = 400, message = "Legal Service must contain at least one Task"),
    new ApiResponse(code = 404, message = "Legal Service with id: $id does not exist")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def deleteServiceTask(@QueryParam("id") id: String, @QueryParam("taskID") taskID: String) = isAuthenticated {
    implicit acc => implicit request => withLegalService(id, acc._id.get.stringify, implicit service => {
      service.tasks.length match {
        case length: Int if (length > 1) => {
          LegalServiceService.deleteTask(id, acc._id.get.stringify, taskID) map {
            case Success(msg) => Ok(Json.obj("message" -> s"ServiceTask with ID '${taskID}' successfully deleted"))
            case Failure(ex) => BadRequest(Json.obj("message" -> ex.getMessage))
          }
        }
        case _ => Future.successful(BadRequest(Json.obj("message" -> "Legal Service must contain at least one Task")))
      }
    })
  }

  private def legalServiceToJson(ls: LegalService): JsObject = {
    val serviceJson = Json.obj("id" -> ls._id.get.stringify, "lawyerID" -> ls.lawyerID,
      "category" -> ls.category, "name" -> ls.name, "description" -> ls.description,
      "price" -> ls.price, "estimation" -> ls.estimation, "tasks" -> ls.tasks)
    serviceJson
  }

  def withLegalService(id: String, accID: String, f: LegalService => Future[Result]): Future[Result] = {
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