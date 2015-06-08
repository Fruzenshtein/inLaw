package models.swagger

/**
 * Created by Alex on 6/5/15.
 */
case class LegalService(lawyerID: String,
                        category: String,
                        name: String,
                        description: String,
                        price: Int,
                        estimation: Long,
                        tasks: Seq[ServiceTask])

case class ServiceTask(name: String,
                       description: String,
                       requiredInfo: String,
                       status: String,
                       approved: Boolean)