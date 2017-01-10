package com.calvinnix.web;

import com.calvinnix.dao.EmployeeDao;
import com.calvinnix.dao.RoleDao;
import com.calvinnix.model.Employee;
import com.calvinnix.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Created by Calvin on 1/9/17.
 */

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final EmployeeDao employeeDao;
    private final RoleDao roleDao;

    @Autowired
    public DatabaseLoader(EmployeeDao employeeDao, RoleDao roleDao) {
        this.employeeDao = employeeDao;
        this.roleDao = roleDao;
    }

    @Override
    public void run(String... strings) throws Exception {
        Role ROLE_USER = new Role("ROLE_USER");
        this.roleDao.save(ROLE_USER);

        final String password = "$2a$08$wgwoMKfYl5AUE9QtP4OjheNkkSDoqDmFGjjPE2XTPLDe9xso/hy7u";
        final String username = "cnix";


       this.employeeDao.save(new Employee(username, password, true, ROLE_USER));
    }
}
