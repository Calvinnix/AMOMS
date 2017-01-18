package com.caerj.web.controller;

import com.caerj.model.Employee;
import com.caerj.web.Utility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Calvin on 1/10/17.
 */

@Controller
public class LoginController {

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @RequestMapping(path = "/login", method = RequestMethod.GET)
    public String loginForm(Object object, Model model, HttpServletRequest request) {
        logger.info(" --- RequestMapping from /login");

        logger.info(" --- Adding employee attribute to model from new Employee()");
        model.addAttribute("employee", new Employee());

        logger.info(" --- Adding disableReact attribute to model from new Object()");
        model.addAttribute("disableReact", new Object());

        Utility.addFlashAttributeIfAvailable(model, request);

        logger.info(" --- Mapping to /login");
        return "login";
    }

}
