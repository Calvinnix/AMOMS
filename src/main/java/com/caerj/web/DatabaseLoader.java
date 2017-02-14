package com.caerj.web;

import com.caerj.dao.UserDao;
import com.caerj.dao.RoleDao;
import com.caerj.model.User;
import com.caerj.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Created by Calvin on 1/9/17.
 */

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserDao userDao;
    private final RoleDao roleDao;

    @Autowired
    public DatabaseLoader(UserDao userDao, RoleDao roleDao) {
        this.userDao = userDao;
        this.roleDao = roleDao;
    }

    @Override
    public void run(String... strings) throws Exception {

        Role ROLE_PRACTITIONER = new Role("ROLE_PRACTITIONER");
        this.roleDao.save(ROLE_PRACTITIONER);
        Role ROLE_RECEPTIONIST = new Role("ROLE_RECEPTIONIST");
        this.roleDao.save(ROLE_RECEPTIONIST);
        Role ROLE_ADMIN = new Role("ROLE_ADMIN");
        this.roleDao.save(ROLE_ADMIN);

        final String password = "$2a$08$wgwoMKfYl5AUE9QtP4OjheNkkSDoqDmFGjjPE2XTPLDe9xso/hy7u"; // == password
        final String username = "cnix";

        this.userDao.save(new User(username, password, true, ROLE_ADMIN));
        this.userDao.save(new User("TEST1", password, true, ROLE_PRACTITIONER));
        this.userDao.save(new User("TEST2", password, true, ROLE_RECEPTIONIST));
    }
}
