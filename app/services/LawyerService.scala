package services

import java.util.{Calendar, Date}

import play.api.Logger
import play.api.Play.current
import scala.concurrent.ExecutionContext.Implicits.global

import play.modules.reactivemongo.ReactiveMongoPlugin
import play.modules.reactivemongo.json.collection.JSONCollection
import models._
import scala.concurrent.Future
import play.api.libs.json.{JsObject, Json}

import scala.util.{Failure, Success}

/**
 * Created by Alex on 11/23/14.
 */
object LawyerService {

  private val collection = ReactiveMongoPlugin.db.collection[JSONCollection]("userAccount")

  def add(account: Lawyer) = {
    collection.save(account)
    account
  }

  def findByEmail(email: String): Future[Option[Lawyer]] = {
    val query = Json.obj("email" -> email)
    val account = collection.find(query).one[Lawyer]
    account
  }

  def findById(id: String): Future[Option[Lawyer]] = {
    val query = Json.obj("_id" -> Json.obj("$oid" -> id))
    val account = collection.find(query).one[Lawyer]
    account
  }

  def filterLawyers(query: JsObject): Future[Seq[Lawyer]] = {
    val lawyers = collection.find(query)
      .cursor[Lawyer]
      .collect[Seq]()
    lawyers
  }

  def findByToken(token: String): Future[Option[Lawyer]] = {
    val query = Json.obj("token.bearer" -> token)
    val account = collection.find(query).one[Lawyer]
    account
  }

  def updateBearerToken(email: String, token: String) = {
    val updatedToken = Json.obj(
      "$set" -> Json.obj(
        "token.bearer" -> token)
      )
    val updateAction = collection.update(
      Json.obj("email" -> email),
      updatedToken)
    updateAction
  }

  def updateProfile(email: String, profile: Profile) = {
    val updateProfile = Json.obj(
      "$set" -> Json.obj(
        "profile" -> profile)
      )
    collection.update(
      Json.obj("email" -> email),
      updateProfile
    )
  }

  def getProfile(email: String): Future[Option[Profile]] = {
    val query = Json.obj("email" -> email)
    val account = collection.find(query).one[Lawyer]
    account map {
      case Some(lawyer) => lawyer.profile
      case None => None
    }
  }

  def updateContacts(email: String, contacts: Contacts) = {
    val updateProfile = Json.obj(
      "$set" -> Json.obj(
        "contacts" -> contacts)
    )
    collection.update(
      Json.obj("email" -> email),
      updateProfile
    )
  }

  def getContacts(email: String): Future[Option[Contacts]] = {
    val query = Json.obj("email" -> email)
    val account = collection.find(query).one[Lawyer]
    account map {
      case Some(lawyer) => lawyer.contacts
      case None => None
    }
  }

  def createUniversity(email: String, university: University) = {
    val createUniversity = Json.obj(
      "$push" -> Json.obj(
        "education.universities" -> university
      )
    )
    collection.update(
      Json.obj("email" -> email),
      createUniversity
    )
  }

  def deleteUniversity(email: String, id: String) = {
    val removeUniver = Json.obj(
      "$pull" -> Json.obj(
        "education.universities" -> Json.obj("id" -> id)
      )
    )
    collection.update(
      Json.obj("email" -> email),
      removeUniver
    )
  }

  def createCertificate(email: String, certificate: Certificate) = {
    val createCertificate = Json.obj(
      "$push" -> Json.obj(
        "education.certificates" -> certificate
      )
    )
    collection.update(
      Json.obj("email" -> email),
      createCertificate
    )
  }

  def deleteCertificate(email: String, id: String) = {
    val removeCertificate = Json.obj(
      "$pull" -> Json.obj(
        "education.certificates" -> Json.obj("id" -> id)
      )
    )
    collection.update(
      Json.obj("email" -> email),
      removeCertificate
    )
  }

  def createWorkPlace(email: String, workPlace: WorkPlace) = {
    val createExperience = Json.obj(
      "$push" -> Json.obj(
        "experience.workPlaces" -> workPlace
      )
    )
    collection.update(
      Json.obj("email" -> email),
      createExperience
    )
  }

  def deleteWorkPlace(email: String, id: String) = {
    val deleteWorkPlace = Json.obj(
      "$pull" -> Json.obj(
        "experience.workPlaces" -> Json.obj("id" -> id)
      )
    )
    collection.update(
      Json.obj("email" -> email),
      deleteWorkPlace
    )
  }

  def addLanguage(email: String, language: String) = {
    val addLanguage = Json.obj(
      "$addToSet" -> Json.obj(
        "education.languages" -> language
      )
    )
    collection.update(
      Json.obj("email" -> email),
      addLanguage
    )
  }

  def totalExperienceRecalculation(email: String) = {
    Logger.info(s"Recalculation of total experience for user $email")
    val query = Json.obj("email" -> email)
    val account = collection.find(query).one[Lawyer]

    def defineStartDate(d1: Date, d2: Date) = {
      if (d1 before d2) d1 else d2
    }

    def defineEndDate(dates: Seq[Date]) = {
      dates match {
        case Nil => new Date()
        case _ => dates max
      }
    }

    val totalExperience = account map {
      case Some(lawyer) => lawyer.experience match {
        case Some(exp) => exp.workPlaces match {
          case Some(workPlaces) => {

            val startDates = workPlaces map (_.startDate)
            val endDates = workPlaces map (_.endDate) map(_.get)

            val startDate = startDates reduceLeft(defineStartDate)
            val endDate =  defineEndDate(endDates)

            val calendar = Calendar.getInstance()
            calendar.setTimeInMillis(endDate.getTime)
            val endYear = calendar.get(Calendar.YEAR)
            calendar.setTimeInMillis(startDate.getTime)
            val startYear = calendar.get(Calendar.YEAR)

            endYear - startYear
          }
          case None => 0
        }
        case None => 0
      }
    }

    totalExperience onComplete {
      case Success(total) => {
        Logger.info(s"Total experience is $total")
        val updateTotalExp = Json.obj(
          "$set" -> Json.obj(
            "experience.total" -> total)
        )
        collection.update(
          Json.obj("email" -> email),
          updateTotalExp
        )
      }
      case Failure(reason) => Logger.info("Failure: Total experience wan not defined")
    }
/*
    totalExperience map {
      case total: Int => {
        Logger.info(s"Total experience is $total")
        val updateTotalExp = Json.obj(
          "$set" -> Json.obj(
            "experience.total" -> total)
        )
        collection.update(
          Json.obj("email" -> email),
          updateTotalExp
        )
      }
      case _ => Logger.info("Total experience wan not Int")
    }
*/
  }

  def addLawyerCompetence(email: String, competence: String) = {
    val addCompetence = Json.obj(
      "$addToSet" -> Json.obj(
        "competences" -> competence
      )
    )
    collection.update(
      Json.obj("email" -> email),
      addCompetence
    )
  }

  def deleteLawyerCompetence(email: String, competence: String) = {
    val deleteCompetence = Json.obj(
      "$pull" -> Json.obj(
        "competences" -> competence
      )
    )
    collection.update(
      Json.obj("email" -> email),
      deleteCompetence
    )
  }

}