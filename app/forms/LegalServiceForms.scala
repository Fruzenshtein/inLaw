package forms

import forms.validators.CommonValidators
import models.marketplace.LegalServiceDTO
import play.api.data._
import play.api.data.Forms._

/**
 * Created by Alex on 6/5/15.
 */
trait LegalServiceForms extends CommonValidators {

  val legalServiceInfo = Form(
    mapping(
      "category" -> nonEmptyText(maxLength = 40),
      "name" -> nonEmptyText(maxLength = 40),
      "description" -> nonEmptyText(maxLength = 1024),
      "price" -> number(min = 0),
      "estimation" -> longNumber(min = 3600)
    )(LegalServiceDTO.apply)(LegalServiceDTO.unapply)
  )

}
