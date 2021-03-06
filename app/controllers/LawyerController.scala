package controllers

import javax.ws.rs.{PathParam, QueryParam}

import controllers.LawyerContactsController._
import utils.CryptUtils

import scala.concurrent.ExecutionContext.Implicits.global

import forms.{LawyerFilterForm, UserAccountForms}
import play.api.mvc._

import play.api.Logger
import scala.concurrent.Future
import play.api.libs.json.{JsObject, Json}
import services.{PasswordService, EmailService, LawyerService}
import models.{BearerToken, Lawyer}
import com.wordnik.swagger.annotations._

import scala.util.Random

/**
 * Created by Alex on 11/23/14.
 */
@Api(value = "/lawyers", description = "Operations with account")
object LawyerController extends Controller with UserAccountForms with LawyerFilterForm with Security {

  @ApiOperation(
    nickname = "createLawyerAccount",
    value = "Create lawyer account",
    notes = "Lawyer Sign Up endpoint. Validation rules for password is length must be more than 6 characters.",
    httpMethod = "POST",
    response = classOf[models.swagger.BearerToken])
  @ApiResponses(Array(
    new ApiResponse(code = 201, message = "Lawyer account successfully created"),
    new ApiResponse(code = 400, message = "Email already exist"),
    new ApiResponse(code = 500, message = "DB connection error")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(value = "Lawyer account object that need to be created", required = true, dataType = "models.swagger.UserAccountInfo", paramType = "body")))
  def createAccount = Action.async {
    implicit request => {
      createAccountForm.bindFromRequest fold (
        formWithErrors => {
          Logger.info("Create Lawyer account has validation errors")
          Future.successful(BadRequest(formWithErrors.errorsAsJson))
        },
        accountInfo => {
          if (accountInfo.password != accountInfo.repeatPassword) {
            Logger.info("Password does not match repeated password value")
            Future.successful(BadRequest(Json.obj("message" -> "Password does not match repeated password value")))
          } else {
            LawyerService.findByEmail(accountInfo.email) map {
              case accOpt: Option[Lawyer] => accOpt match {
                case Some(acc) => {
                  Logger.info("Email is already exists")
                  BadRequest(Json.obj("message" -> "Email is already exists"))
                }
                case None => {
                  Logger.info("Creating Lawyer account process...")
                  val account = Lawyer.createAccount(accountInfo)
                  val newBearerToken = BearerToken(BearerToken.generateToken(), models.Status.Active.toString, None)
                  val accountToSave = account copy (bearerToken = Some(newBearerToken))
                  LawyerService.add(accountToSave)
                  EmailService.sendWelcomeEmail("userName", "UA")
                  Created(Json.obj("token" -> newBearerToken.bearer))
                }
              }
              case _ => {
                Logger.info("DB connection error")
                InternalServerError(Json.obj("message" -> "DB connection error"))
              }
            }
          }
        })
    }
  }

  @ApiOperation(
    nickname = "filterLawyers",
    value = "Get lawyers accounts",
    notes = "Filter lawyers accounts by parameters",
    httpMethod = "POST",
    response = classOf[models.swagger.LawyerSearchResult])
  @ApiResponses(Array(new ApiResponse(code = 200, message = "Lawyers list")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(value = "Search parameters by which you want to filter lawyers", required = true, dataType = "forms.LawyerFilter", paramType = "body")))
  def filterLawyers() = Action.async {
    implicit request => {
      lawyerFilterForm.bindFromRequest fold(
      formWithErrors => {
        Logger.info("Create Lawyer account has validation errors")
        Future.successful(BadRequest(formWithErrors.errorsAsJson))
      },
      filterObj => {
        val generalQuery = Json.obj("profile.active" -> true)

        val finalQuery = lastNameQuery(filterObj.lastName,
          firstNameQuery(filterObj.firstName,
          availabilityQuery(filterObj.availability,
          languageQuery(filterObj.languages,
          competenceQuery(filterObj.competences,
          maxExperienceQuery(filterObj.maxExp,
          minExperienceQuery(filterObj.minExp,
          minRateQuery(filterObj.minRate,
          genderQuery(filterObj.gender, generalQuery)))))))))

        Logger.info("Filter object: "+finalQuery.toString)

        val futureLawyers = LawyerService.filterLawyers(finalQuery)

        futureLawyers map {
          case seqLawyers => {
            Ok(Json.toJson(seqLawyers map(lawyer => lawyerToJson(lawyer))))
          }
        }
      }
      )
    }

  }

  def genderQuery(gender: Option[String], generalQuery: JsObject) = {
    gender match {
      case Some(g) => generalQuery deepMerge Json.obj("profile.gender" -> g)
      case None => generalQuery
    }
  }

  def minRateQuery(minRate: Option[Int], generalQuery: JsObject) = {
    minRate match {
      case Some(m) => generalQuery deepMerge Json.obj("profile.minRate" -> Json.obj("$lte" -> m))
      case None => generalQuery
    }
  }

  def minExperienceQuery(minExp: Option[Int], generalQuery: JsObject) = {
    minExp match {
      case Some(me) => generalQuery deepMerge Json.obj("experience.total" -> Json.obj("$gte" -> me))
      case None => generalQuery
    }
  }

  def maxExperienceQuery(maxExp: Option[Int], generalQuery: JsObject) = {
    maxExp match {
      case Some(me) => generalQuery deepMerge Json.obj("experience.total" -> Json.obj("$lte" -> me))
      case None => generalQuery
    }
  }

  def competenceQuery(competences: Option[List[String]], generalQuery: JsObject) = {
    competences match {
      case Some(c) => generalQuery deepMerge Json.obj(
        "competences" -> Json.obj(
          "$all" -> c
        )
      )
      case None => generalQuery
    }
  }

  def languageQuery(languages: Option[List[String]], generalQuery: JsObject) = {
    languages match {
      case Some(langs) => generalQuery deepMerge Json.obj(
        "education.languages" -> Json.obj(
          "$all" -> langs
        )
      )
      case None => generalQuery
    }
  }

  def availabilityQuery(availability: Option[Boolean], generalQuery: JsObject) = {
    availability match {
      case Some(a) => generalQuery deepMerge Json.obj("profile.availability" -> a)
      case None => generalQuery
    }
  }

  def lastNameQuery(lastNameOpt: Option[String], generalQuery: JsObject) = {
    lastNameOpt match {
      case Some(lastName) => generalQuery deepMerge Json.obj("profile.lastName" -> lastName)
      case None => generalQuery
    }
  }

  def firstNameQuery(firstNameOpt: Option[String], generalQuery: JsObject) = {
    firstNameOpt match {
      case Some(firstName) => generalQuery deepMerge Json.obj("profile.firstName" -> firstName)
      case None => generalQuery
    }
  }

  private def lawyerToJson(lawyer: Lawyer): JsObject = {

    val lawyerJson = Json.obj("id" -> lawyer._id.get.stringify, "avatar" -> lawyer.avatar, "createdAt" -> lawyer.createdAt)

    val profileJson = lawyer.profile match {
      case Some(profile) => Json.obj("profile" ->
        Json.obj("gender" -> profile.gender, "firstName" -> profile.firstName,
          "lastName" -> profile.lastName, "middleName" -> profile.middleName, "birthDate" -> profile.birthDate,
          "minRate" -> profile.minRate, "availability" -> profile.availability)
      )
      case None => Json.obj()
    }

    val contactsJson = lawyer.contacts match {
      case Some(contacts) => Json.obj("contacts" -> contacts)
      case None => Json.obj()
    }

    val educationJson = lawyer.education match {
      case Some(education) => Json.obj("education" -> education)
      case None => Json.obj()
    }

    val experienceJson = lawyer.experience match {
      case Some(experience) => Json.obj("experience" -> experience)
      case None => Json.obj()
    }

    val competencesJson = lawyer.competences match {
      case Some(competences) => Json.obj("competences" -> competences)
      case None => Json.obj()
    }

    lawyerJson deepMerge profileJson deepMerge contactsJson deepMerge educationJson deepMerge experienceJson deepMerge competencesJson
  }

  @ApiOperation(
    nickname = "lawyerById",
    value = "Get lawyer by ID",
    notes = "Get lawyer by ID",
    httpMethod = "GET",
    response = classOf[models.Lawyer])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Lawyer object"),
    new ApiResponse(code = 404, message = "Lawyer not found")))
  def findById(@QueryParam("id") id: String) = Action.async {
    implicit request =>
      Logger.info(s"Looking for Lawyer with id: $id")
      LawyerService.findById(id) map {
        case Some(lawyer) => {
          lawyer.profile match {
            case Some(profile) => profile.active match {
              case true => Ok(lawyerToJson(lawyer))
              case false => BadRequest(Json.obj("message" -> "Lawyer is not active"))
            }
            case None => BadRequest(Json.obj("message" -> "Lawyer is not active"))
          }
        }
        case None => NotFound(Json.obj("message" -> s"Lawyer with $id is not found"))
      }
  }

  @ApiOperation(
    nickname = "changePassword",
    value = "Change password",
    notes = "Changes password of logged in user",
    httpMethod = "PUT",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Password successfully updated"),
    new ApiResponse(code = 400, message = "Old password does not match")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(value = "Object contains old a new passwords", dataType = "forms.ChangePassword", paramType = "body", required = true),
    new ApiImplicitParam(name = "Authorization", value = "Header parameter. Example 'Bearer yourTokenHere'.", dataType = "string", paramType = "header", required = true)
  ))
  def changePassword = isAuthenticated { implicit acc =>
    implicit request => {
      changePasswordForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Password validation failed")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        passwordInfo => {
          Logger.info("Updating of Lawyer password...")
          if (CryptUtils.isMatch(acc.password, passwordInfo.oldPassword)) {
            LawyerService.updatePassword(acc.email, CryptUtils.encryptPassword(passwordInfo.newPassword))
            Future(Ok(Json.obj("message" -> "Password successfully updated")))
          } else
            Future(BadRequest(Json.obj("message" -> "Old password does not match")))
        }
      )
    }
  }

  @ApiOperation(
    nickname = "resetPassword",
    value = "Reset password",
    notes = "Initialize process of reset password. Send email with recover link id.",
    httpMethod = "POST",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Recover link was created"),
    new ApiResponse(code = 400, message = ""),
    new ApiResponse(code = 404, message = "User with such email not found")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(value = "Object contains email of user who needs password reset", dataType = "forms.Email", paramType = "body", required = true)
  ))
  def resetPassword = Action.async { implicit request =>
    resetPasswordForm.bindFromRequest fold(
      formWithErrors => {
        Logger.info("Email validation failed")
        Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
      },
      emailData => {
        LawyerService.findByEmail(emailData.email) map {
          case Some(lawyer) => {
            Logger.info("Recover password link creation...")
            LawyerService.updatePassword(emailData.email, Random.alphanumeric.take(16).mkString)
            PasswordService.createRecoverLink(lawyer.email)
            PasswordService.findByEmail(lawyer.email) map {
              case Some(recoverLink) => EmailService.sendRecoverPasswordLinkEmail(emailData.email, recoverLink._id.get.stringify)
              case None =>
            }
            Ok(Json.obj("message" -> "Recover link was created"))
          }
          case None => {
            Logger.info("User with such email not found")
            NotFound(Json.obj("message" -> "User with such email not found"))
          }
        }

      }
    )
  }

  @ApiOperation(
    nickname = "recoverPassword",
    value = "Recover password",
    notes = "Recovers password for user",
    httpMethod = "POST",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 404, message = "Recover link does not exist"),
    new ApiResponse(code = 200, message = "Password was successfully recovered"),
    new ApiResponse(code = 400, message = "Passwords do not match")
  ))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(value = "Object contains new password", dataType = "forms.RecoverPassword", paramType = "body", required = true)
  ))
  def recoverPassword(@ApiParam(value = "Password recover link ID", required = true)@PathParam("id") recoverLinkID: String) = Action.async { implicit request =>
    recoverPasswordForm.bindFromRequest fold(
      formWithErrors => {
        Logger.info("Password validation failed")
        Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
      },
      recoverPassData => {
        Logger.info("Recover password process...")
        if (recoverPassData.password == recoverPassData.repeatPassword) {
          PasswordService.findById(recoverLinkID) map {
            case Some(recoverLink) => {
              Logger.info("Password was successfully recovered")
              //TODO: Check if link is not expired
              LawyerService.updatePassword(recoverLink.userEmail, CryptUtils.encryptPassword(recoverPassData.password))
              PasswordService.remove(recoverLinkID)
              Ok(Json.obj("message" -> "Password was successfully recovered"))
            }
            case None => {
              Logger.info("Recover link does not exist")
              NotFound(Json.obj("message" -> "Recover link does not exist"))
            }
          }
        } else {
          Logger.info("Passwords do not match")
          Future.successful(BadRequest(Json.obj("message" -> "Passwords do not match")))
        }
      }
    )
  }

}