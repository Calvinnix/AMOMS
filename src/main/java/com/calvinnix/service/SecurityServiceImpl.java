package com.calvinnix.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/**
 * Created by Calvin on 1/11/17.
 */

@Service
public class SecurityServiceImpl implements SecurityService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmployeeService employeeService;

    private static final Logger logger = LoggerFactory.getLogger(SecurityServiceImpl.class);

    @Override
    public String findLoggedInUsername() {

        Object employee = SecurityContextHolder.getContext().getAuthentication().getDetails();
        if (employee instanceof UserDetails) {
            return ((UserDetails) employee).getUsername();
        }
        return null;
    }

    @Override
    public void autoLogin(String username, String password) {
        logger.info("Entering: autoLogin();");
        logger.info("Calling: employeeService.loadUserByUsername(username)");
        UserDetails userDetails = employeeService.loadUserByUsername(username);
        logger.info("Calling: new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());");
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
        logger.info("Calling: authenticationManager.authenticate(usernamePasswordAuthenticationToken);");
        try {
            authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }


        if (usernamePasswordAuthenticationToken.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            logger.debug(String.format("Auto login %s successfully!", username));
        } else {
            logger.error(String.format("Auto login %s failed!", username));
        }
        logger.info("Exiting: autoLogin();");
    }
}
