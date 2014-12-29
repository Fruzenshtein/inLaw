package controllers

import com.wordnik.swagger.annotations._
import forms.UserAccountForms
import models.BearerToken
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import services.LawyerService
import com.github.t3hnar.bcrypt._

import scala.concurrent.Future

import scala.concurrent.ExecutionContext.Implicits.global
/**
 * Created by Alex on 12/29/14.
 */
@Api(value = "/auth", description = "Authentication operations")
object AuthController extends Controller with UserAccountForms {

  @ApiOperation(
    nickname = "login",
    value = "Login",
    notes = "Login endpoint",
    httpMethod = "POST",
    response = classOf[models.swagger.BearerToken])
  @ApiResponses(Array(
    new ApiResponse(code = 200, message = ""),
    new ApiResponse(code = 400, message = "Bad email or password"),
    new ApiResponse(code = 500, message = "DB connection error")))
  @ApiImplicitParams(Array(
    new ApiImplicitParam(value = "Credentials for login", required = true, dataType = "models.swagger.Credentials", paramType = "body")))
  def login() = Action.async {
    implicit request => {
      credentialsForm.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Create Lawyer account has validation errors")
          Future.successful(BadRequest(formWithErrors.errorsAsJson))
        },
        credentials => {
          LawyerService.findByEmail(credentials.email) map {
            case Some(account) => {
              if (credentials.password.isBcrypted(account.password)) {
                val newToken = BearerToken.generateToken
                LawyerService.updateBearerToken(credentials.email, newToken)
                Ok(Json.obj(
                  "token" -> newToken
                ))
              } else {
                BadRequest(Json.obj("message" -> "Bad email or password"))
              }
            }
            case None => BadRequest(Json.obj("message" -> "Bad email or password"))
          }
        }
      )
    }
  }

}
