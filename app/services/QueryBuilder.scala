package services

import play.api.libs.json.{Json, JsObject}
import play.api.libs.json.Json._

/**
 * Created by Alex on 7/5/15.
 */
object QueryBuilder {

  def strictEquals[T](key: String, field: Option[T], generalQuery: JsObject) = {
    field match {
      case Some(value) => generalQuery deepMerge Json.obj(key -> toJsFieldJsValueWrapper(value))
      case None => generalQuery
    }
  }

  def more[T](key: String, field: Option[T], generalQuery: JsObject) = {
    field match {
      case Some(value) => generalQuery deepMerge Json.obj(key -> Json.obj("$gte" -> toJsFieldJsValueWrapper(value)))
      case None => generalQuery
    }
  }

  def less[T](key: String, field: Option[T], generalQuery: JsObject) = {
    field match {
      case Some(value) => generalQuery deepMerge Json.obj(key -> Json.obj("$lte" -> toJsFieldJsValueWrapper(value)))
      case None => generalQuery
    }
  }

}
