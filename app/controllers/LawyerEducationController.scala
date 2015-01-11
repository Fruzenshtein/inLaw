package controllers

import com.wordnik.swagger.annotations.Api
import forms.UserAccountForms
import play.api.mvc.Controller

/**
 * Created by Alex on 1/11/15.
 */
@Api(value = "/lawyers/education", description = "Operations with Lawyer Education")
object LawyerEducationController extends Controller with Security with UserAccountForms {

  

}
