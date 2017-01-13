package com.calvinnix.service;

import com.calvinnix.dao.EmployeeDao;
import com.calvinnix.dao.RoleDao;
import com.calvinnix.model.Employee;
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
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);

    @Override
    public void save(Employee employee) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        logger.info(" --- Setting password");
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));

        logger.info(" --- Setting Role");
        employee.setRole(roleDao.findByName("ROLE_USER"));

        logger.info(" --- Setting enabled");
        employee.setEnabled(true);

        logger.info(" --- Saving employee");
        employeeDao.save(employee);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }

    @Override
    public Employee findEmployeeByUsername(String username) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        logger.info(String.format(" --- Finding Employee by username: %s", username));
        Employee employee = employeeDao.findByUsername(username);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
        return employee;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        Employee employee = employeeDao.findByUsername(username);
        if (employee == null) {
            throw new UsernameNotFoundException("User not found");
        }

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
        return employee;
    }
}
