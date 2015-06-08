package services

import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection
import play.api.Play.current

/**
 * Created by Alex on 6/5/15.
 */
object LegalServiceService {

  private val collection = ReactiveMongoPlugin.db.collection[JSONCollection]("legalService")

}
