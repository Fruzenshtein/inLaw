package models

import java.util.Date

import play.api.libs.json.Json

/**
 * Created by Alex on 6/5/15.
 */
case class BarCard(number: String, state: String, issuedDate: Date, status: String)

object BarCard {
  implicit val barCardFormat = Json.format[BarCard]
}