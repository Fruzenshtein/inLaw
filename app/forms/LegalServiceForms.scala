package forms

import forms.validators.CommonValidators
import models.marketplace.LegalServiceDTO
import play.api.data._
import play.api.data.Forms._

/**
 * Created by Alex on 6/5/15.
 */
case class LegalServiceFilter(category: Option[String],
                              name: Option[String],
                              minPrice: Option[Int],
                              maxPrice: Option[Int],
                              minEst: Option[Long],
                              maxEst: Option[Long])

trait LegalServiceForms extends CommonValidators {

  val legalServiceInfo = Form(
    mapping(
      "category" -> nonEmptyText(maxLength = 40),
      "name" -> nonEmptyText(maxLength = 40),
      "price" -> number(min = 0),
      "estimation" -> longNumber(min = 3600),
      "included" ->seq(nonEmptyText(maxLength = 240)),
      "excluded" ->seq(nonEmptyText(maxLength = 240)),
      "required" ->seq(nonEmptyText(maxLength = 240))
    )(LegalServiceDTO.apply)(LegalServiceDTO.unapply)
  )

  val serviceFilterForm = Form(
    mapping(
      "category" -> optional(text),
      "name" -> optional(text),
      "minPrice" -> optional(number),
      "maxPrice" -> optional(number),
      "minEst" -> optional(longNumber),
      "maxEst" -> optional(longNumber)
    )(LegalServiceFilter.apply)(LegalServiceFilter.unapply)
  )

}