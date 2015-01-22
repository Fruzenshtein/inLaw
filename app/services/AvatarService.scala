package services

import java.io.{FileInputStream, File}

import org.apache.commons.io.IOUtils
import play.modules.reactivemongo.ReactiveMongoPlugin
import reactivemongo.api.collections.default.BSONCollection
import reactivemongo.bson.{Subtype, BSONBinary, BSONDocument}
import reactivemongo.core.commands.GetLastError

import scala.concurrent.Future
import scala.util.{Failure, Success, Try}

import play.api.Play.current
import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Created by Alex on 1/22/15.
 */
object AvatarService {

  private val collection = ReactiveMongoPlugin.db.collection[BSONCollection]("lawyerAvatar")

  def saveAvatar(implicit lawyerID: String, avatar: File): Future[Try[Unit]] = {
    val imageData = IOUtils.toByteArray(new FileInputStream(avatar))
    if (imageData.length < 3000000) {
      collection update (BSONDocument("lawyerId" -> lawyerID), BSONDocument("lawyerId" -> lawyerID, "avatar" -> BSONBinary(imageData, Subtype.GenericBinarySubtype)), GetLastError(), true) map {
        case ok if ok.ok => {
          Success((): Unit)
        }
        case e => Failure(e)
      }
    } else {
      Future(Failure(new Exception("Avatar file is too big.")))
    }
  }

}
