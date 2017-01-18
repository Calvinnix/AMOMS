package com.caerj.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Calvin on 1/11/17.
 */

@Controller
public class ErrorController implements org.springframework.boot.autoconfigure.web.ErrorController {

    private static final Logger logger = LoggerFactory.getLogger(ErrorController.class);

    private static final String PATH = "/error";

    @RequestMapping(value = PATH)
    public String error() {
        logger.info(String.format(" --- RequestMapping from %s", PATH));
        logger.info(" --- Mapping to /access_denied");
        return "access_denied";
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }
}
