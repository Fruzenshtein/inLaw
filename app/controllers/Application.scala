package controllers

import play.api.mvc._

object Application extends Controller {

  def swagger = Action {
    request =>
      Ok(views.html.swagger())
  }

}