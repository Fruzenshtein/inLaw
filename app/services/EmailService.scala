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

  def sendRecoverPasswordLinkEmail(emailTo: String, linkId: String) = {
    val email = Email(
      "Password recover link",
      "inLaw <alex.fruzenshtein@gmail.com>",
      Seq("checkpoint.10per@gmail.com"),
      bodyHtml = Some("<html>" +
        "<body>" +
        "<p>Dear user,</p>" +
        s"<p>You have initiated a process of a password recovery. In order to set a new password use id: $linkId</p>" +
        "</body>" +
        "</html>")
    )
    MailerPlugin.send(email)
  }

}
