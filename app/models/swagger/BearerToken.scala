package models.swagger

case class BearerToken(token: String)

case class UserAccountInfo(email: String, password: String, repeatPassword: String)