import play.api.{Application, GlobalSettings}
import play.api.mvc.WithFilters
import filters.CORSFilter

object Global extends WithFilters(new CORSFilter) with GlobalSettings {

  override def onStart(app: Application): Unit = {
    super.onStart(app)
  }

}