package com.caerj.service;

import com.caerj.dao.UserDao;
import com.caerj.dao.RoleDao;
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

        logger.info(" --- Setting Role");
        user.setRole(roleDao.findByName("ROLE_USER"));

        logger.info(" --- Setting enabled");
        user.setEnabled(true);

        logger.info(" --- Saving user");
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
