package com.calvinnix.web.controller;

import com.calvinnix.dao.EmployeeDao;
import com.calvinnix.model.Employee;
import com.calvinnix.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Calvin on 1/11/17.
 */

@Controller
public class SignupController {

    private final EmployeeDao employeeDao;

    @Autowired
    public SignupController(EmployeeDao employeeDao) {
        this.employeeDao = employeeDao;
    }

    @RequestMapping(path = "/signup", method = RequestMethod.GET)
    public String signupForm(Model model, HttpServletRequest request) {

        model.addAttribute("employee", new Employee());
        model.addAttribute("signup", new Object());
        try {
            Object flash = request.getSession().getAttribute("flash");
            model.addAttribute("flash", flash);

            request.getSession().removeAttribute("flash");
        } catch (Exception ex) {
            // "flash" session attribute must not exist...do nothing and proceed normally
        }
        return "signup";
    }

    //TODO:ctn figure out how to pass this through thymeleaf cleanly
    @RequestMapping(path = "/signup", method = RequestMethod.POST)
    public String addEmployee(@RequestParam("inputUsername") String username,
                              @RequestParam("inputPassword") String password,
                              @RequestParam("inputConfirmPassword") String confirmPassword) {

        //TODO:ctn Sanitize this shit

        //TODO:ctn verify password and confirm password are the same

        Role ROLE_USER = new Role("ROLE_USER");
        this.employeeDao.save(new Employee(username, password, true, ROLE_USER));

        //TODO:ctn login automatically using this account

        return "redirect:/";
    }




}
