package com.calvinnix.web.controller;

import com.calvinnix.model.Employee;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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

        try {
            logger.info(" --- Checking for flash attribute from session");
            Object flash = request.getSession().getAttribute("flash");

            logger.info(" --- Adding flash attribute to model from session");
            model.addAttribute("flash", flash);

            logger.info(" --- Removing flash attribute from session");
            request.getSession().removeAttribute("flash");
        } catch (Exception ex) {
            logger.info(" --- 'flash' session attribute must not exist...do nothing and proceed normally");
        }

        logger.info(" --- Mapping to /login");
        return "login";
    }

}
