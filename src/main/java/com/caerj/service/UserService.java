package com.caerj.service;

import com.caerj.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Created by Calvin on 1/10/17.
 */
public interface UserService extends UserDetailsService {
    User findUserByUsername(String username);
    void save(User user);
    void update(User user);
}
