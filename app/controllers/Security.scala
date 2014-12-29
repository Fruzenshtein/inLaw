package controllers

import play.api.Logger
import play.api.mvc._
import services.LawyerService

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Created by Alex on 12/25/14.
 */
trait Security {

  private def bearerToken(request: RequestHeader) = {
    request.headers.get("Authorization") flatMap { header =>
      val tokenParts = header.split(" ")
      if (tokenParts.size == 2) Some(tokenParts(1)) else None
    } orElse {
      request.queryString.get("token") flatMap {
        case token if token.nonEmpty => Some(token(0))
        case _ => None
      }
    }
  }

  private def onUnauthorized(request: RequestHeader) = Results.Unauthorized

  def isAuthenticated[A](action: Action[A]) = Action.async(action.parser) {
    request => {
      bearerToken(request) match {
        case Some(token) => {
          LawyerService.findByToken(token) flatMap { optionLawyer =>
            optionLawyer match {
              case Some(lawyer) => {
                Logger.info(s"The Lawyer's account with token: $token exists.")
                action(request)
              }
              case None => {
                Logger.info(s"The Lawyer's account with token: $token was not found.")
                Future.successful(onUnauthorized(request))
              }
            }
          }
        }
        case None => {
          Logger.info("Token was not provided.")
          Future.successful(onUnauthorized(request))
        }
      }
    }
  }

}
