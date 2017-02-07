package com.caerj.web.controller;

import com.caerj.model.Role;
import com.caerj.model.User;
import com.caerj.service.UserService;
import com.caerj.service.SecurityService;
import com.caerj.web.UserValidator;
import com.caerj.web.FlashMessage;
import com.caerj.web.Utility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Calvin on 1/11/17.
 */

@Controller
public class SignupController {

    @Autowired
    private UserService userService;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private UserValidator userValidator;

    private static final Logger logger = LoggerFactory.getLogger(SignupController.class);

    @RequestMapping(value = "/signup", method = RequestMethod.GET)
    public String signup(Model model, HttpServletRequest request) {
        logger.info(" --- RequestMapping from /signup");

        logger.info(" --- Adding user attribute to model from new User()");
        model.addAttribute("user", new User());

        Utility.addFlashAttributeIfAvailable(model, request);

        logger.info(" --- Mapping to /signup");
        return "signup";
    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String signup(@ModelAttribute("user") User userForm, BindingResult bindingResult, Model model) {
        logger.info(" --- RequestMapping from /signup POST");

        logger.info(" --- Validating user");
        userValidator.validate(userForm, bindingResult);

        if (bindingResult.hasErrors()) {
            logger.info(" --- Adding flash attribute to model");
            model.addAttribute("flash",new FlashMessage("Invalid Username and/or Password", FlashMessage.Status.FAILURE));

            logger.info(" --- Mapping to /signup");
            return "signup";
        }

        logger.info(" --- Setting user as enabled by default (This should always be true during signups)");
        userForm.setEnabled(true);

        logger.info(" --- Saving user");
        userService.save(userForm);

        logger.info(" --- Automatically logging in user");
        securityService.autoLogin(userForm.getUsername(), userForm.getPasswordConfirm());

        logger.info(" --- Redirecting to /");
        return "redirect:/";
    }




}
