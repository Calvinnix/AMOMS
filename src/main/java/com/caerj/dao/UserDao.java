package com.caerj.dao;

import com.caerj.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

/**
 * Created by Calvin on 1/9/17.
 */

@Repository
public interface UserDao extends CrudRepository<User, Long> {

    User findByUsername(String username);

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Override
    void delete(Long aLong);

}
