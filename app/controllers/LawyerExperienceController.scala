package controllers

import com.wordnik.swagger.annotations._
import forms.UserAccountForms
import models.WorkPlace
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.Controller
import services.LawyerService

import scala.concurrent.Future

import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Created by Alex on 1/20/15.
 */
@Api(value = "/lawyers/experience", description = "Operations with Lawyer Experience")
object LawyerExperienceController extends Controller with Security with UserAccountForms {

  @ApiOperation(
    nickname = "lawyersExperience",
    value = "Create lawyers experience",
    notes = "Create lawyers experience",
    httpMethod = "POST",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Experience successfully added"),
    new ApiResponse(code = 400, message = "Bad arguments")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer Experience object which will be added", required = true, dataType = "models.swagger.Experience", paramType = "body")))
  def createExperience = isAuthenticated { implicit acc =>
    implicit request => {
      createExperienceForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Creation of Experience was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        workPlace => {
          Logger.info("Creation of Experience...")
          Logger.info("Experience: "+workPlace.toString)
          LawyerService.createWorkPlace(acc.email, models.WorkPlace.populateWorkPlace(workPlace))
          LawyerService.totalExperienceRecalculation(acc.email)
          Future(Ok(Json.obj("message" -> "Experience successfully added")))
        }
        )
    }
  }

  @ApiOperation(
    nickname = "lawyersExperience",
    value = "Get lawyers experience",
    notes = "Get lawyers experience",
    httpMethod = "GET",
    response = classOf[models.WorkPlace])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "List of experience"),
    new ApiResponse(code = 404, message = "Experience does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def getExperience = isAuthenticated { implicit acc =>
    implicit request =>
      acc.experience match {
        case Some(experience) => Future.successful(Ok(Json.toJson(experience)))
        case None => Future.successful(NotFound(Json.obj("message" -> "Experience does not exist")))
      }
  }

  @ApiOperation(
    nickname = "lawyersExperience",
    value = "Put lawyers experience",
    notes = "Put lawyers experience",
    httpMethod = "PUT",

    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "WorkPlace successfully updated"),
    new ApiResponse(code = 400, message = "Validation errors"),
    new ApiResponse(code = 404, message = "Experience with such id does not exist"),
    new ApiResponse(code = 404, message = "WorkPlace with such id does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer Experience object which will be updated", required = true, dataType = "models.swagger.Experience", paramType = "body")
  ))
  def updateExperience(id: String) = isAuthenticated { implicit acc =>
    implicit request =>
      createExperienceForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("WorkPlace data was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        newWorkPlace => {
          acc.experience match {
            case Some(experience) => experience.workPlaces match {

              case Some(workPlaces) => {
                workPlaces.find ((wp: WorkPlace) => wp.id == Some (id) ) match {
                  case Some (workPlace) => {
                    Logger.info("Updating WorkPlace: "+newWorkPlace.toString)
                    LawyerService.deleteWorkPlace (acc.email, id)
                    LawyerService.createWorkPlace(acc.email, models.WorkPlace.populateWorkPlace(newWorkPlace))
                    LawyerService.totalExperienceRecalculation(acc.email)
                    Future.successful (Ok (Json.obj ("message" -> "WorkPlace successfully updated") ) )
                  }
                  case None => Future.successful (NotFound (Json.obj ("message" -> s"WorkPlace with id $id does not exist") ) )
                }
              }
              case None => Future.successful(Ok(Json.obj("message" -> "WorkPlaces do not exist")))

            }
            case None => Future.successful(Ok(Json.obj("message" -> "Experience does not exist")))
          }
        }
      )
  }

  @ApiOperation(
    nickname = "lawyersExperience",
    value = "Delete lawyers experience by id",
    notes = "Delete lawyers experience by id",
    httpMethod = "DELETE",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "WorkPlace successfully deleted"),
    new ApiResponse(code = 404, message = "Experience with such id does not exist"),
    new ApiResponse(code = 404, message = "WorkPlace with such id does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def deleteExperience(id: String) = isAuthenticated { implicit acc =>
    implicit request => acc.experience match {
      case Some(exp) => {
        exp.workPlaces match {
          case Some(workPlaces) => workPlaces.find ((wp: WorkPlace) => wp.id == Some (id) ) match {
            case Some (_) => {
              LawyerService.deleteWorkPlace (acc.email, id)
              LawyerService.totalExperienceRecalculation(acc.email)
              Future.successful (Ok (Json.obj ("message" -> s"WorkPlace with id: $id successfully deleted") ) )
            }
            case None => Future.successful (NotFound (Json.obj ("message" -> "WorkPlace does not exist") ) )
          }
          case _ => Future.successful (NotFound (Json.obj ("message" -> "WorkPlace does not exist") ) )
        }
      }
      case None => Future.successful(Ok(Json.obj("message" -> "Experience does not exist")))
    }
  }

}
