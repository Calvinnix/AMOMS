package com.caerj.service;

import com.caerj.dao.UserDao;
import com.caerj.dao.RoleDao;
import com.caerj.model.Role;
import com.caerj.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Created by Calvin on 1/10/17.
 */

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Override
    public void save(User user) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        logger.info(" --- Setting password");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        //todo:ctn this code is reused below... Refactor?
        logger.info(" --- Setting Role");
        String userRole = user.getRole().getName();
        if (userRole == null) {
            user.setRole(roleDao.findByName("ROLE_USER"));
        } else {
            /**
             * Need to re-map the user's Role with the actual
             * Role object created in the database. I believe
             * there is an issue because these roles aren't
             * being detected as the same object just because
             * they have the same name.
             */
            Role roleFound = roleDao.findByName(userRole);
            if (roleFound == null) {
                /**
                 * Default to ROLE_USER if invalid role is passed in
                 */
                user.setRole(roleDao.findByName("ROLE_USER"));
            } else {
                user.setRole(roleFound);
            }

        }

        logger.info(" --- Saving user");
        userDao.save(user);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }

    @Override
    public void update(User user) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        User userFound = userDao.findByUsername(user.getUsername());
        if (userFound == null) {
            /**
             * An existing user with this username was not found.
             * This will create a new user.
             */
            logger.info(" --- An existing user with this username was not found. This will create a new user.");
        } else {
            logger.info(" --- Mapping edited user to the existing user.");
            user.setId(userFound.getId());
        }

        logger.info(" --- Setting password");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        logger.info(" --- Setting Role");
        String userRole = user.getRole().getName();
        if (userRole == null) {
            user.setRole(roleDao.findByName("ROLE_USER"));
        } else {
            /**
             * Need to re-map the user's Role with the actual
             * Role object created in the database. I believe
             * there is an issue because these roles aren't
             * being detected as the same object just because
             * they have the same name.
             */
            Role roleFound = roleDao.findByName(userRole);
            if (roleFound == null) {
                /**
                 * Default to ROLE_USER if invalid role is passed in
                 */
                user.setRole(roleDao.findByName("ROLE_USER"));
            } else {
                user.setRole(roleFound);
            }

        }

        logger.info(" --- Updating user");
        logger.info(String.format("ID: %s, Username: %s, Password: %s, Enabled: %s, Role: %s ",
                                             user.getId(),
                                             user.getUsername(),
                                             user.getPassword(),
                                             user.isEnabled(),
                                             user.getRole().getName()));
        userDao.save(user);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }

    @Override
    public User findUserByUsername(String username) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        logger.info(String.format(" --- Finding User by username: %s", username));
        User user = userDao.findByUsername(username);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
        return user;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        User user = userDao.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
        return user;
    }
}
