package controllers

import javax.ws.rs.QueryParam

import scala.concurrent.ExecutionContext.Implicits.global

import forms.UserAccountForms
import play.api.mvc._

import play.api.Logger
import scala.concurrent.Future
import play.api.libs.json.{JsObject, Json}
import services.LawyerService
import models.{BearerToken, Lawyer}
import com.wordnik.swagger.annotations._

/**
 * Created by Alex on 11/23/14.
 */
@Api(value = "/lawyers", description = "Operations with account")
object LawyerController extends Controller with UserAccountForms with Security {

  @ApiOperation(
    nickname = "createLawyerAccount",
    value = "Create lawyer account",
    notes = "Lawyer Sign Up endpoint",
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
    httpMethod = "GET",
    response = classOf[models.swagger.LawyerSearchResult])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Lawyers list")))
  def filterLawyers(@QueryParam("gender") gender: Option[String],
                    @QueryParam("minRate") minRate: Option[Int],
                    @QueryParam("minExp") minExp: Option[Int],
                    @QueryParam("maxExp") maxExp: Option[Int],
                    @QueryParam("competence") competence: Option[String],
                    @QueryParam("language") language: Option[String],
                    @QueryParam("availability") availability: Option[Boolean]) = Action.async {

    val generalQuery = Json.obj("profile.active" -> true)

    val finalQuery = availabilityQuery(availability,
      languageQuery(language,
      competenceQuery(competence,
      maxExperienceQuery(maxExp,
      minExperienceQuery(minExp,
      minRateQuery(minRate,
      genderQuery(gender, generalQuery)))))))

    val futureLawyers = LawyerService.filterLawyers(finalQuery)

    def lawyerToJson(lawyer: Lawyer): JsObject = {

      val lawyerJson = Json.obj("id" -> lawyer._id.get.stringify, "avatar" -> lawyer.avatar, "createdAt" -> lawyer.createdAt)

      val profileJson = lawyer.profile match {
        case Some(profile) => Json.obj("gender" -> profile.gender, "firstName" -> profile.firstName,
          "lastName" -> profile.lastName, "middleName" -> profile.middleName, "birthDate" -> profile.birthDate,
          "minRate" -> profile.minRate, "availability" -> profile.availability)
        case None => Json.obj()
      }

      lawyerJson deepMerge profileJson
    }

    futureLawyers map {
      case seqLawyers => {
        Ok(Json.toJson(seqLawyers map(lawyer => lawyerToJson(lawyer))))
      }
    }

  }

  def genderQuery(gender: Option[String], generalQuery: JsObject) = {
    gender match {
      case Some(g) => generalQuery deepMerge Json.obj("profile.gender" -> g)
      case None => Json.obj()
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

  def competenceQuery(competence: Option[String], generalQuery: JsObject) = {
    competence match {
      case Some(c) => generalQuery deepMerge Json.obj("competences" -> c)
      case None => generalQuery
    }
  }

  def languageQuery(language: Option[String], generalQuery: JsObject) = {
    language match {
      case Some(l) => generalQuery deepMerge Json.obj("education.languages" -> l)
      case None => generalQuery
    }
  }

  def availabilityQuery(availability: Option[Boolean], generalQuery: JsObject) = {
    availability match {
      case Some(a) => generalQuery deepMerge Json.obj("profile.availability" -> a)
      case None => generalQuery
    }
  }

  @ApiOperation(
    nickname = "lawyerById",
    value = "Get lawyer by ID",
    notes = "Get lawyer by ID",
    httpMethod = "GET",
    response = classOf[models.swagger.InformationMessage])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = "Lawyer object"),
    new ApiResponse(code = 404, message = "Lawyer not found")))
  def findById(@QueryParam("id") id: String) = Action.async {
    implicit request =>

      Logger.info(s"Looking for Lawyer with id: $id")
      LawyerService.findById(id) map {
        case Some(lawyer) => {
          val lawyerJson = Json.obj("avatar" -> lawyer.avatar, "createdAt" -> lawyer.createdAt)

          val profileJson = lawyer.profile match {
            case Some(profile) => Json.obj("profile" -> profile)
            case None => Json.obj()
          }

          //lawyerJson deepMerge profileJson

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

          Ok(lawyerJson deepMerge
            profileJson deepMerge
            contactsJson deepMerge
            educationJson deepMerge
            experienceJson deepMerge
            competencesJson)
        }
        case None => NotFound
      }


  }
}