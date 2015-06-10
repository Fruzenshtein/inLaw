package models.swagger

/**
 * Created by Alex on 6/5/15.
 */
case class LegalServiceDTO(category: String,
                        name: String,
                        description: String,
                        price: Int,
                        estimation: Long,
                        tasks: Seq[ServiceTaskDTO])

case class ServiceTaskDTO(name: String,
                       description: String,
                       requiredInfo: String)