package models.swagger.response

/**
 * Created by Alex on 6/12/15.
 */
case class LegalService(id: String,
                        lawyerID: String,
                        category: String,
                        name: String,
                        price: Int,
                        estimation: Long,
                        included: Seq[String],
                        excluded: Seq[String],
                        required: Seq[String])