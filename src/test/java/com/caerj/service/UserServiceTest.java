package com.caerj.service;

import com.caerj.dao.UserDao;
import com.caerj.model.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Created by Calvin on 1/17/17.
 */

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @Mock
    private UserDao dao;

    @InjectMocks
    private UserService service = new UserServiceImpl();

    @Test
    public void findUserByUsername_ShouldReturnUserWithUsernameCalvin() throws Exception {
        User user = new User();
        user.setUsername("Calvin");
        when(dao.findByUsername("Calvin")).thenReturn(user);
        assertEquals("findByUsername(\"Calvin\") should return 1 User object."
                , user, service.findUserByUsername("Calvin"));
        verify(dao).findByUsername("Calvin");
    }

    @Test
    public void findUserByUsername_ShouldReturnNull() throws Exception {
        when(dao.findByUsername("Calvin")).thenReturn(null);
        assertEquals(service.findUserByUsername("Calvin"), null);
        verify(dao).findByUsername("Calvin");
    }

}
