package models

import org.joda.time.DateTime
import play.api.libs.json.Json

import scala.util.Random

/**
 * Created by Alex on 6/5/15.
 */
case class BearerToken(bearer: String, status: String, expirationDate: Option[DateTime])

object BearerToken {

  implicit val bearerTokenFormat = Json.format[BearerToken]

  def generateToken() = {
    Random.alphanumeric.take(12).mkString
  }

}