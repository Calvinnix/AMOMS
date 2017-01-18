package com.caerj.service;

import com.caerj.model.Employee;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Created by Calvin on 1/10/17.
 */
public interface EmployeeService extends UserDetailsService {
    Employee findEmployeeByUsername(String username);
    void save(Employee employee);
}
