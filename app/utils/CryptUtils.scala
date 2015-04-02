package utils

import com.github.t3hnar.bcrypt._

/**
 * Created by Alex on 12/24/14.
 */
object CryptUtils {

  def encryptPassword(password: String) = {
    password.bcrypt
  }

  def isMatch(oldPassword: String, newPassword: String) = {
    newPassword.isBcryptedWithCache(oldPassword)
  }

}