package com.calvinnix.service;

/**
 * Created by Calvin on 1/11/17.
 */
public interface SecurityService {

    String findLoggedInUsername();
    void autoLogin(String username, String password);

}
