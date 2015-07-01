package models.marketplace

/**
 * Created by Alex on 6/16/15.
 */
case class LegalServiceDTO(category: String,
                           name: String,
                           price: Int,
                           estimation: Long,
                           included: Seq[String],
                           excluded: Seq[String],
                           required: Seq[String])
