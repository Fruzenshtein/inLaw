package models.swagger.response

import models.swagger.ServiceTaskDTO

/**
 * Created by Alex on 6/12/15.
 */
case class LegalService(id: String,
                        lawyerID: String,
                        category: String,
                        name: String,
                        description: String,
                        price: Int,
                        estimation: Long,
                        tasks: Seq[ServiceTaskDTO])