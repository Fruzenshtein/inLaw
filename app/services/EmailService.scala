package services

import play.api.libs.mailer._
import play.api.Play.current

/**
 * Created by Alex on 3/27/15.
 */
object EmailService {

  def sendWelcomeEmail(emailTo: String, language: String) = {
    val email = Email(
      "Welcome to inLaw",
      "inLaw <alex.fruzenshtein@gmail.com>",
      Seq("checkpoint.10per@gmail.com"),
      bodyText = Some("A text message"),
      bodyHtml = Some("<html>" +
        "<body>" +
        "<p>Dear user,</p>" +
        "<p>Welcome to <b>inLaw</b>. Your registration was successful.</p>" +
        "</body>" +
        "</html>")
    )
    MailerPlugin.send(email)
  }

}
