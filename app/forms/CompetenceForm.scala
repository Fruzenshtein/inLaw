package forms

import play.api.data.Form
import play.api.data.Forms._

/**
 * Created by Alex on 1/27/15.
 */
trait CompetenceForm {

  case class CompetenceInfo(competence: String)

  val competenceForm = Form(
    mapping(
      "competence" -> nonEmptyText(minLength = 3)
    )(CompetenceInfo.apply)(CompetenceInfo.unapply)
  )

}
