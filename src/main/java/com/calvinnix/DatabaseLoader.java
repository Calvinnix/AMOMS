package com.calvinnix;

import com.calvinnix.dao.EmployeeDao;
import com.calvinnix.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Created by Calvin on 1/9/17.
 */

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final EmployeeDao employeeDao;

    @Autowired
    public DatabaseLoader(EmployeeDao employeeDao) {
        this.employeeDao = employeeDao;
    }

    @Override
    public void run(String... strings) throws Exception {
        this.employeeDao.save(new Employee("Calvin Nix", 22, 3));
        this.employeeDao.save(new Employee("Alex Estrada", 23, 2));
        this.employeeDao.save(new Employee("Eric Plascencia", 23, 2));
        this.employeeDao.save(new Employee("Zacch Thomas", 36, 5));
    }
}
