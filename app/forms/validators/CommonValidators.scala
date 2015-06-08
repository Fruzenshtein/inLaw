package forms.validators

import play.api.data.Forms._
import play.api.data.Mapping
import play.api.data.validation.{Invalid, Valid, ValidationError, Constraint}
import reactivemongo.bson.BSONObjectID

import scala.util.{Failure, Success}

/**
 * Created by Alex on 6/5/15.
 */
trait CommonValidators {
  private val bsonObjIdConstraint: Constraint[String] = Constraint("constraints.bsonObjId")({
    bsonObjIdCandidate =>
      val errors = BSONObjectID.parse(bsonObjIdCandidate) match {
        case Success(_) => Nil
        case Failure(_) => Seq(ValidationError("Please enter valid BSONObjectID"))
      }
      if (errors.isEmpty)
        Valid
      else
        Invalid(errors)
  })
  val bsonObjIdCheck: Mapping[String] = text.verifying(bsonObjIdConstraint)
}
