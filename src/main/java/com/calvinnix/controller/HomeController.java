package com.calvinnix.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Calvin on 1/9/17.
 */

@Controller
public class HomeController {

    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }

}
