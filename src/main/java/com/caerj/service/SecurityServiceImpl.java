package com.caerj.service;

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
    private UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(SecurityServiceImpl.class);

    @Override
    public String findLoggedInUsername() {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        logger.info(" --- Getting user authentication details from SecurityContextHolder");
        Object user = SecurityContextHolder.getContext().getAuthentication().getDetails();

        if (user instanceof UserDetails) {
            logger.info(" --- Getting username from user Object");
            String result = ((UserDetails) user).getUsername();

            logger.info(String.format(" --- username is %s", result));
            logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
            return result;
        }
        logger.error(" --- username is null");
        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
        return null;
    }

    @Override
    public void autoLogin(String username, String password) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        logger.info(String.format(" --- Loading User by Username: %s", username));
        UserDetails userDetails = userService.loadUserByUsername(username);

        logger.info(" --- Creating UsernamePasswordAuthenticationToken");
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());

        logger.info(" --- Authenticating usernamePasswordAuthenticationToken");
        authenticationManager.authenticate(usernamePasswordAuthenticationToken);


        if (usernamePasswordAuthenticationToken.isAuthenticated()) {
            logger.info(" --- Setting authentication");
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            logger.info(String.format(" --- Auto login %s successfully!", username));
        } else {
            logger.error(String.format(" --- Auto login %s failed!", username));
        }
        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }
}
