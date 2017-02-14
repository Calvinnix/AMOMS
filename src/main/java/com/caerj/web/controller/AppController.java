package com.caerj.web.controller;

import com.caerj.model.Role;
import com.caerj.model.User;
import com.caerj.service.UserService;
import com.caerj.web.FlashMessage;
import com.caerj.web.UserValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.validation.Errors;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by Calvin on 1/9/17.
 */

@Controller
public class AppController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserValidator userValidator;

    private static final Logger logger = LoggerFactory.getLogger(AppController.class);

    @RequestMapping(value = "/")
    public String index() {
        logger.info(" --- RequestMapping from /");
        logger.info(" --- Mapping to /application");
        return "application";
    }

    @RequestMapping(value = "/admin")
    public String admin() {
        logger.info(" --- RequestMapping from /admin");
        logger.info(" --- Mapping to /admin");
        return "admin";
    }

    @RequestMapping(value = "/patients")
    public String patients() {
        logger.info(" --- RequestMapping from /patients");
        logger.info(" --- Mapping to /patients");
        return "patients";
    }

    @RequestMapping(value = "/admin/addUser", method = RequestMethod.POST)
    public String addUser(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /admin/addUser");

        /**
         * todo:ctn refact
         * A lot of code is shared between addUser and editUser
         */

        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String role = request.getParameter("role");
        String enabled = request.getParameter("enabled");

        Role userRole = new Role(role);
        boolean isEnabled = (enabled.equals("true"));

        User user = new User(username, password, isEnabled, userRole);

        logger.info(" --- Saving user");
        userService.save(user);

        logger.info(" --- Redirecting to /admin");
        return "redirect:/admin";
    }

    @RequestMapping(value = "/admin/editUser", method = RequestMethod.POST)
    public String editUser(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /admin/editUser");

        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String role = request.getParameter("role");
        String enabled = request.getParameter("enabled");

        Role userRole = new Role(role);
        boolean isEnabled = (enabled.equals("true"));

        User user = new User(username, password, isEnabled, userRole);

        logger.info(" --- edit user");
        userService.update(user);

        logger.info(" --- Redirecting to /admin");
        return "redirect:/admin";
    }

}
