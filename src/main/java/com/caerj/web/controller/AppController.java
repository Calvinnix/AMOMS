package com.caerj.web.controller;

import com.caerj.service.EmployeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(AppController.class);

    @RequestMapping(value = "/")
    public String index() {
        logger.info(" --- RequestMapping from /");
        logger.info(" --- Mapping to /application");
        return "application";
    }

}
