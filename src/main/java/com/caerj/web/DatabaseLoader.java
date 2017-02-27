package com.caerj.web;

import com.caerj.dao.PatientDao;
import com.caerj.dao.UserDao;
import com.caerj.dao.RoleDao;
import com.caerj.model.Patient;
import com.caerj.model.User;
import com.caerj.model.Role;
import com.caerj.service.UserService;
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
    private final PatientDao patientDao;

    @Autowired
    public DatabaseLoader(UserDao userDao, RoleDao roleDao, PatientDao patientDao) {
        this.userDao = userDao;
        this.roleDao = roleDao;
        this.patientDao = patientDao;
    }

    @Autowired
    private UserService userService;

    @Override
    public void run(String... strings) throws Exception {
        Role ROLE_USER = new Role("ROLE_USER");
        this.roleDao.save(ROLE_USER);
        Role ROLE_PRACTITIONER = new Role("ROLE_PRACTITIONER");
        this.roleDao.save(ROLE_PRACTITIONER);
        Role ROLE_RECEPTIONIST = new Role("ROLE_RECEPTIONIST");
        this.roleDao.save(ROLE_RECEPTIONIST);
        Role ROLE_ADMIN = new Role("ROLE_ADMIN");
        this.roleDao.save(ROLE_ADMIN);

        final String password = "$2a$08$wgwoMKfYl5AUE9QtP4OjheNkkSDoqDmFGjjPE2XTPLDe9xso/hy7u"; // == password
        final String username = "cnix";

        this.userDao.save(new User(username, password, true, ROLE_ADMIN));
        this.userDao.save(new User("admin", password, true, ROLE_ADMIN));
        this.userDao.save(new User("dr. bob", password, true, ROLE_PRACTITIONER));
        this.userDao.save(new User("dr. billy", password, true, ROLE_PRACTITIONER));
        this.userDao.save(new User("dr. chang", password, true, ROLE_PRACTITIONER));
        this.userDao.save(new User("practitioner", password, true, ROLE_PRACTITIONER));
        this.userDao.save(new User("receptionist", password, true, ROLE_RECEPTIONIST));
        this.userDao.save(new User("lisa", password, true, ROLE_RECEPTIONIST));
        this.userDao.save(new User("alex", password, true, ROLE_RECEPTIONIST));


        User practitioner = userService.findUserByUsername("practitioner");
        Patient patient = new Patient("Calvin",
                "Thomas",
                "Nix",
                true,
                "January 8, 2000",
                "132 Brickbored ln.",
                "Marietta",
                "GA",
                30062,
                "Single",
                1,
                2223334444L,
                 practitioner,
                "practitioner",
                "calvin@address.com");
        this.patientDao.save(patient);
        Patient patient2 = new Patient("Alex",
                "",
                "Estrada",
                true,
                "January 8, 1901",
                "188 Slowtown ln.",
                "Marietta",
                "GA",
                30888,
                "Single",
                9,
                2223339999L,
                practitioner,
                "practitioner",
                "alex@address.com");
        this.patientDao.save(patient2);

    }
}
