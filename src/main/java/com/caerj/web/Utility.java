package com.caerj.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ui.Model;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Calvin on 1/13/17.
 */
public class Utility {

    private static final Logger logger = LoggerFactory.getLogger(Utility.class);

    public static void addFlashAttributeIfAvailable(Model model, HttpServletRequest request) {
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
    }
}
