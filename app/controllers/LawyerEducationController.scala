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
    new ApiResponse(code = 200, message = "University successfully added"),
    new ApiResponse(code = 400, message = "Bad arguments")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer University object which will be added", required = true, dataType = "models.swagger.University", paramType = "body")))
  def createUniversity = isAuthenticated { implicit acc =>
    implicit request => {
      createUniversityForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Creation of University was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        university => {
          Logger.info("Creation of University...")
          Logger.info("University: "+university.toString)
          LawyerService.createUniversity(acc.email, models.University.generateUniversity(university))
          Future(Ok(Json.obj("message" -> "University successfully added")))
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
    new ApiResponse(code = 404, message = "Universities does not exist"),
    new ApiResponse(code = 404, message = "Education does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def getUniversities = isAuthenticated { implicit acc =>
    implicit request =>
      acc.education match {
        case Some(someEdu) => someEdu.universities match {
          case Some(universities) => Future.successful(Ok(Json.toJson(universities)))
          case None => Future.successful(NotFound(Json.obj("message" -> "Universities do not exist")))
        }
        case None => Future.successful(NotFound(Json.obj("message" -> "Education does not exist")))
      }
  }

  @ApiOperation(
    nickname = "lawyersEducationUniversities",
    value = "Put lawyers education universities",
    notes = "Put lawyers education universities",
    httpMethod = "PUT",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "University successfully updated"),
    new ApiResponse(code = 400, message = "Validation errors"),
    new ApiResponse(code = 404, message = "Education does not exist"),
    new ApiResponse(code = 404, message = "University with such id does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer University object which will be updated", required = true, dataType = "models.swagger.University", paramType = "body")
  ))
  def updateUniversity(id: String) = isAuthenticated { implicit acc =>
    implicit request =>
      createUniversityForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Update of Lawyer Profile was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        newUniversity => {
          acc.education match {
            case Some(someEdu) => someEdu.universities match {
              case Some(universities) => {
                universities.find((u: University) => u.id == Some(id)) match {
                  case Some(university) => {
                    LawyerService.deleteUniversity(acc.email, id)
                    LawyerService.createUniversity(acc.email, models.University.generateUniversity(newUniversity))
                    Future.successful(Ok(Json.obj("message" -> "Update university")))
                  }
                  case None => Future.successful(NotFound(Json.obj("message" -> s"University with id $id does not exist")))
                }
              }
              case None => Future.successful(Ok(Json.obj("message" -> "Universities do not exist")))
            }
            case None => Future.successful(Ok(Json.obj("message" -> "Education does not exist")))
          }
        }
      )
  }

  @ApiOperation(
    nickname = "lawyersEducationUniversities",
    value = "Delete lawyers education universities by id",
    notes = "Delete lawyers education universities by id",
    httpMethod = "DELETE",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "University successfully updated"),
    new ApiResponse(code = 404, message = "Education does not exist"),
    new ApiResponse(code = 404, message = "University with such id does not exist")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def deleteUniversity(id: String) = isAuthenticated { implicit acc =>
    implicit request => acc.education match {
      case Some(someEdu) => someEdu.universities match {
        case Some(universities) => {
          universities.find((u: University) => u.id == Some(id)) match {
            case Some(_) => {
              LawyerService.deleteUniversity(acc.email, id)
              Future.successful(Ok(Json.obj("message" -> s"University with id: $id successfully deleted")))
            }
            case None => Future.successful(NotFound(Json.obj("message" -> "Universities do not exist")))
          }
        }
        case None => Future.successful(Ok(Json.obj("message" -> "Universities do not exist")))
      }
      case None => Future.successful(Ok(Json.obj("message" -> "Education does not exist")))
    }
  }

  @ApiOperation(
    nickname = "certificatesEducationUniversities",
    value = "Create lawyers education certificates",
    notes = "Create lawyers education certificates",
    httpMethod = "POST",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Certificate successfully added"),
    new ApiResponse(code = 400, message = "Bad arguments")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true),
    new ApiImplicitParam(value = "Lawyer Certificate object which will be added", required = true, dataType = "models.swagger.Certificate", paramType = "body")))
  def createCertificate = isAuthenticated { implicit acc =>
    implicit request => {
      createCertificateForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Creation of Certificate was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        certificate => {
          Logger.info("Creation of Certificate...")
          Logger.info("Certificate: "+certificate.toString)
          LawyerService.createCertificate(acc.email, models.Certificate.generateCertificate(certificate))
          Future(Ok(Json.obj("message" -> "Certificate successfully added")))
        }
        )
    }
  }

}