package controllers

import play.api.mvc._

object Application extends Controller {

  def swagger = Action {
    request =>
      Ok(views.html.swagger())
  }

  def appLogin = Action {
    request =>
      Ok(views.html.app())
  }

}