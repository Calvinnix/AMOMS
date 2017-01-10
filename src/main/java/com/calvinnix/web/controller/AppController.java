package com.calvinnix.web.controller;

import com.calvinnix.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Calvin on 1/9/17.
 */

@Controller
public class AppController {

    @Autowired
    private EmployeeService employeeService;

    @RequestMapping(value = "/")
    public String index() {
        return "application";
    }

}
