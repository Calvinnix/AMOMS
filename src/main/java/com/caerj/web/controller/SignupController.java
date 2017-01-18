package com.caerj.web.controller;

import com.caerj.model.Employee;
import com.caerj.service.EmployeeService;
import com.caerj.service.SecurityService;
import com.caerj.web.EmployeeValidator;
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
    private EmployeeService employeeService;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private EmployeeValidator employeeValidator;

    private static final Logger logger = LoggerFactory.getLogger(SignupController.class);

    @RequestMapping(value = "/signup", method = RequestMethod.GET)
    public String signup(Model model, HttpServletRequest request) {
        logger.info(" --- RequestMapping from /signup");

        logger.info(" --- Adding employee attribute to model from new Employee()");
        model.addAttribute("employee", new Employee());

        logger.info(" --- Adding disableReact attribute to model from new Object()");
        model.addAttribute("disableReact", new Object());

        Utility.addFlashAttributeIfAvailable(model, request);

        logger.info(" --- Mapping to /signup");
        return "signup";
    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String signup(@ModelAttribute("employee") Employee employeeForm, BindingResult bindingResult, Model model) {
        logger.info(" --- RequestMapping from /signup POST");

        logger.info(" --- Adding disableReact attribute to model from new Object()");
        model.addAttribute("disableReact", new Object());

        logger.info(" --- Validating employee");
        employeeValidator.validate(employeeForm, bindingResult);

        if (bindingResult.hasErrors()) {
            logger.info(" --- Adding flash attribute to model");
            model.addAttribute("flash",new FlashMessage("Invalid Username and/or Password", FlashMessage.Status.FAILURE));

            logger.info(" --- Mapping to /signup");
            return "signup";
        }

        logger.info(" --- Saving employee");
        employeeService.save(employeeForm);

        logger.info(" --- Automatically logging in employee");
        securityService.autoLogin(employeeForm.getUsername(), employeeForm.getPasswordConfirm());

        logger.info(" --- Redirecting to /");
        return "redirect:/";
    }




}
