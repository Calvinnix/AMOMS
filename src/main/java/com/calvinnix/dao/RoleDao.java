package com.calvinnix.dao;

import com.calvinnix.model.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Calvin on 1/10/17.
 */

@Repository
public interface RoleDao extends CrudRepository<Role, Long> {
}
