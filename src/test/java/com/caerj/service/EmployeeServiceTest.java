package com.caerj.service;

import com.caerj.dao.EmployeeDao;
import com.caerj.model.Employee;
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
public class EmployeeServiceTest {

    @Mock
    private EmployeeDao dao;

    @InjectMocks
    private EmployeeService service = new EmployeeServiceImpl();

    @Test
    public void findEmployeeByUsername_ShouldReturnEmployeeWithUsernameCalvin() throws Exception {
        Employee employee = new Employee();
        employee.setUsername("Calvin");
        when(dao.findByUsername("Calvin")).thenReturn(employee);
        assertEquals("findByUsername(\"Calvin\") should return 1 Employee object."
                , employee, service.findEmployeeByUsername("Calvin"));
        verify(dao).findByUsername("Calvin");
    }

    @Test
    public void findEmployeeByUsername_ShouldReturnNull() throws Exception {
        when(dao.findByUsername("Calvin")).thenReturn(null);
        assertEquals(service.findEmployeeByUsername("Calvin"), null);
        verify(dao).findByUsername("Calvin");
    }

}
