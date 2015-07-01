package models.marketplace

import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.modules.reactivemongo.json.BSONFormats._
import reactivemongo.bson.BSONObjectID

/**
 * Created by Alex on 6/3/15.
 */
case class LegalService(_id: Option[BSONObjectID],
                        lawyerID: String,
                        category: String,
                        name: String,
                        description: String,
                        price: Int,
                        estimation: Long)

object LegalService {

  implicit val legalServiceWrites: Writes[LegalService] = (
    (JsPath \ "_id").writeNullable[BSONObjectID] and
    (JsPath \ "lawyerID").write[String] and
    (JsPath \ "category").write[String] and
    (JsPath \ "name").write[String] and
    (JsPath \ "description").write[String] and
    (JsPath \ "price").write[Int] and
    (JsPath \ "estimation").write[Long]
  )(unlift(LegalService.unapply))

  implicit val legalServiceReads: Reads[LegalService] = (
    (JsPath \ "_id").readNullable[BSONObjectID].map(_.getOrElse(BSONObjectID.generate)).map(Some(_)) and
    (JsPath \ "lawyerID").read[String] and
    (JsPath \ "category").read[String] and
    (JsPath \ "name").read[String] and
    (JsPath \ "description").read[String] and
    (JsPath \ "price").read[Int] and
    (JsPath \ "estimation").read[Long]
  )(LegalService.apply _)

  def createLegalService(dto: LegalServiceDTO, lawyerID: String) = {
    val legalService = LegalService(
      None,
      lawyerID,
      dto.category,
      dto.name,
      dto.description,
      dto.price,
      dto.estimation
    )
    legalService
  }

}

