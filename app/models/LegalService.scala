package models

import org.joda.time.DateTime
import reactivemongo.bson.BSONObjectID

/**
 * Created by Alex on 6/3/15.
 */
case class LegalService(_id: Option[BSONObjectID],
                        lawyerID: BSONObjectID,
                        category: String,
                        name: String,
                        description: String,
                        price: Integer,
                        estimation: Long, tasks: Seq[ServiceTask])

case class ServiceTask(id: String,
                       name: String,
                       description: String,
                       requiredInfo: String,
                       status: String,
                       approved: Boolean,
                       comments: Option[Seq[Comment]])

case class Comment(id: String,
                   authorID: BSONObjectID,
                   updatedAt: Option[DateTime] = None,
                   body: String)