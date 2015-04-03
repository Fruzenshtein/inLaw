package filters

import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits.defaultContext

class CORSFilter extends EssentialFilter {
  def apply(next: EssentialAction) = new EssentialAction {
    def apply(requestHeader: RequestHeader) = {
      next(requestHeader).map { result =>
        result.withHeaders("Access-Control-Allow-Origin" -> "*",
          "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS, DELETE, PUT",
          "Access-Control-Max-Age" -> "3600",
          "Access-Control-Allow-Headers" -> "Origin, Content-Type, Accept, Authorization",
          "Access-Control-Allow-Credentials" -> "true")
      }
    }
  }
}