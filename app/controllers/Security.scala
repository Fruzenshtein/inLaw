package controllers

import models.Lawyer
import play.api.Logger
import play.api.mvc._
import services.LawyerService

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.Try

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

  private def handleAuthenticated[T](bodyParser: BodyParser[T])(f: => String => Request[T] => Future[Result]): EssentialAction = Security.Authenticated(bearerToken, onUnauthorized) { bearerToken =>
    Action.async(bodyParser)(request => f(bearerToken)(request))
  }

  def isAuthenticated(f: => Lawyer => Request[AnyContent] => Future[Result]) = handleAuthenticated(BodyParsers.parse.anyContent) { implicit bearerToken =>
    implicit request =>
      Try {
        LawyerService.findByToken(bearerToken) flatMap {
          case Some(account) => f(account)(request)
          case None => Future(onUnauthorized(request))
        }
      } recover {
        case e: Exception => {
          Logger.error(s"Can't find lawyer by token: $bearerToken", e)
          Future(onUnauthorized(request))
        }
      } getOrElse (Future(onUnauthorized(request)))
  }

}
