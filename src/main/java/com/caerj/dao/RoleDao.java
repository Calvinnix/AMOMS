package com.caerj.dao;

import com.caerj.model.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Calvin on 1/10/17.
 */

@Repository
public interface RoleDao extends CrudRepository<Role, Long> {
    Role findByName(String name);
}
