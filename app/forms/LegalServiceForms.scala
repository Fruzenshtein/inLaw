package forms

import forms.validators.CommonValidators
import models.marketplace.LegalServiceEdit
import models.swagger.ServiceTaskDTO
import models.swagger.LegalServiceDTO
import play.api.data._
import play.api.data.Forms._

/**
 * Created by Alex on 6/5/15.
 */
trait LegalServiceForms extends CommonValidators {

  val createLegalService = Form(
    mapping(
      "category" -> nonEmptyText(maxLength = 40),
      "name" -> nonEmptyText(maxLength = 40),
      "description" -> nonEmptyText(maxLength = 1024),
      "price" -> number(min = 0),
      "estimation" -> longNumber(min = 3600),
      "tasks" -> seq(
        mapping(
          "name" -> nonEmptyText(maxLength = 40),
          "description" -> nonEmptyText(maxLength = 1024),
          "requiredInfo" -> text(maxLength = 2048)
        )(ServiceTaskDTO.apply)(ServiceTaskDTO.unapply)
      )
    )(LegalServiceDTO.apply)(LegalServiceDTO.unapply)
  )

  val editLegalService = Form(
    mapping(
      "category" -> nonEmptyText(maxLength = 40),
      "name" -> nonEmptyText(maxLength = 40),
      "description" -> nonEmptyText(maxLength = 1024),
      "price" -> number(min = 0),
      "estimation" -> longNumber(min = 3600)
    )(LegalServiceEdit.apply)(LegalServiceEdit.unapply)
  )

  val taskInfo = Form(
    mapping(
      "name" -> nonEmptyText(maxLength = 40),
      "description" -> nonEmptyText(maxLength = 1024),
      "requiredInfo" -> text(maxLength = 2048)
    )(ServiceTaskDTO.apply)(ServiceTaskDTO.unapply)
  )

}
