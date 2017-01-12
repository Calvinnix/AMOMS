package com.calvinnix.web.controller;

import com.calvinnix.model.Employee;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Calvin on 1/10/17.
 */

@Controller
public class LoginController {

    @RequestMapping(path = "/login", method = RequestMethod.GET)
    public String loginForm(Object flashFromRedirect, Model model, HttpServletRequest request) {

        model.addAttribute("employee", new Employee());
        model.addAttribute("disableReact", new Object());
        model.addAttribute("flash", flashFromRedirect);
        try {
            Object flash = request.getSession().getAttribute("flash");
            model.addAttribute("flash", flash);

            request.getSession().removeAttribute("flash");
        } catch (Exception ex) {
            // "flash" session attribute must not exist...do nothing and proceed normally
        }
        return "login";
    }

}
