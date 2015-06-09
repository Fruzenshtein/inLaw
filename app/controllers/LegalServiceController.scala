package controllers

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
object LegalServiceController extends Controller with Security with LegalServiceForms {

  def addLegalService = isAuthenticated {
    implicit acc => implicit request => {
      createLegalService.bindFromRequest fold(
        formWithErrors => {
          Logger.info("Legal Service was with ERRORS")
          Future(BadRequest(Json.obj("message" -> formWithErrors.errorsAsJson)))
        },
        legalServiceDTO => {
          Logger.info(s"Creation of Legal Service with name: ${legalServiceDTO.name}")
          LegalServiceService.add(LegalService.createLegalService(legalServiceDTO)) map {
            case Success(msg) => Ok(Json.obj("message" -> msg))
            case Failure(ex) => BadRequest(Json.obj("message" -> ex.getMessage))
          }
        }
      )
    }
  }

}
