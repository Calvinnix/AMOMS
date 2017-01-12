package com.calvinnix.web.controller;

import com.calvinnix.dao.EmployeeDao;
import com.calvinnix.model.Employee;
import com.calvinnix.model.Role;
import com.calvinnix.service.EmployeeService;
import com.calvinnix.service.SecurityService;
import com.calvinnix.web.EmployeeValidator;
import com.calvinnix.web.FlashMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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

    @RequestMapping(value = "/signup", method = RequestMethod.GET)
    public String signup(Model model, HttpServletRequest request) {
        model.addAttribute("employee", new Employee());
        model.addAttribute("disableReact", new Object());
        try {
            Object flash = request.getSession().getAttribute("flash");
            model.addAttribute("flash", flash);
            request.getSession().removeAttribute("flash");
        } catch (Exception ex) {
            // "flash" session attribute must not exist...do nothing and proceed normally
        }
        return "signup";
    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String signup(@ModelAttribute("employee") Employee employeeForm, BindingResult bindingResult, Model model, RedirectAttributes redirectAttributes) {
        model.addAttribute("disableReact", new Object());
        employeeValidator.validate(employeeForm, bindingResult);

        if (bindingResult.hasErrors()) {
            model.addAttribute("flash",new FlashMessage("Invalid Username and/or Password", FlashMessage.Status.FAILURE));
            return "signup";
        }

        employeeService.save(employeeForm);
        securityService.autoLogin(employeeForm.getUsername(), employeeForm.getPasswordConfirm());

        redirectAttributes.addFlashAttribute("flash",new FlashMessage("Successfully created account!", FlashMessage.Status.SUCCESS));
        return "redirect:/login";
    }




}
