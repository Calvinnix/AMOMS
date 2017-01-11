package com.calvinnix.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Calvin on 1/11/17.
 */

@Controller
public class ErrorController implements org.springframework.boot.autoconfigure.web.ErrorController {

    private static final String PATH = "/error";

    @RequestMapping(value = "/access_denied")
    public String accessDenied() {
        return "access_denied";
    }

    @RequestMapping(value = PATH)
    public String error() {
        return "access_denied";
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }
}
