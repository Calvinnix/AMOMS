package com.calvinnix.dao;

import com.calvinnix.model.Employee;
import org.springframework.data.repository.CrudRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

/**
 * Created by Calvin on 1/9/17.
 */

@Repository
public interface EmployeeDao extends CrudRepository<Employee, Long> {

    Employee findByUsername(String username);

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Override
    void delete(Long aLong);

}
