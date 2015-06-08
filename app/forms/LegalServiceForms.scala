package forms

import forms.validators.CommonValidators
import models.swagger.ServiceTask
import models.swagger.LegalService
import play.api.data._
import play.api.data.Forms._

/**
 * Created by Alex on 6/5/15.
 */
trait LegalServiceForms extends CommonValidators {

  val createLegalService = Form(
    mapping(
      "lawyerID" -> bsonObjIdCheck,
      "category" -> nonEmptyText(maxLength = 40),
      "name" -> nonEmptyText(maxLength = 40),
      "description" -> nonEmptyText(maxLength = 1024),
      "price" -> number(min = 0),
      "estimation" -> longNumber(min = 3600),
      "serviceTask" -> seq(
        mapping(
          "name" -> nonEmptyText(maxLength = 40),
          "description" -> nonEmptyText(maxLength = 1024),
          "requiredInfo" -> text(maxLength = 2048),
          "status" -> text(minLength = 2, maxLength = 8),
          "approved" -> boolean
        )(ServiceTask.apply)(ServiceTask.unapply)
      )
    )(LegalService.apply)(LegalService.unapply)
  )

}
