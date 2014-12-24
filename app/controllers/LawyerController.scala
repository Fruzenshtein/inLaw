package controllers

import scala.concurrent.ExecutionContext.Implicits.global

import forms.UserAccountForms
import play.api.mvc._

import play.api.Logger
import scala.concurrent.Future
import play.api.libs.json.Json
import services.UserAccountService
import models.{BearerToken, Lawyer}
import com.wordnik.swagger.annotations._
import scala.Some

/**
 * Created by pitbul on 11/23/14.
 */
@Api(value = "/lawyers", description = "Operations with account")
object LawyerController extends Controller with UserAccountForms {

  @ApiOperation(
    nickname = "createAccount",
    value = "Create user account",
    notes = "User Sign Up endpoint",
    httpMethod = "POST",
    response = classOf[models.swagger.BearerToken])
  @ApiResponses(Array(
    new ApiResponse(code = 201, message = "Account successfully created"),
    new ApiResponse(code = 400, message = "Email already exist"),
    new ApiResponse(code = 500, message = "DB connection error")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(value = "Account object that need to be created", required = true, dataType = "models.swagger.UserAccountInfo", paramType = "body")))
  def createAccount = Action.async {
    implicit request => {
      createAccountForm.bindFromRequest fold (
        formWithErrors => {
          Logger.info("Create Account has validation errors")
          Future.successful(BadRequest(formWithErrors.errorsAsJson))
        },
        accountInfo => {
          if (accountInfo.password != accountInfo.repeatPassword) {
            Logger.info("Password does not match repeated password value")
            Future.successful(BadRequest(Json.obj("message" -> "Password does not match repeated password value")))
          } else {
            UserAccountService.findByEmail(accountInfo.email) map {
              case accOpt: Option[Lawyer] => accOpt match {
                case Some(acc) => {
                  Logger.info("Email is already exists")
                  BadRequest(Json.obj("message" -> "Email is already exists"))
                }
                case None => {
                  Logger.info("Creating Account process...")
                  val account = Lawyer.createAccount(accountInfo)
                  val newBearerToken = BearerToken(BearerToken.generateToken(), models.Status.Active.toString, None)
                  val accountToSave = account copy (bearerToken = Some(newBearerToken))
                  UserAccountService.add(accountToSave)
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

}