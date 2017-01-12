package com.calvinnix.web;

import com.calvinnix.model.Employee;
import com.calvinnix.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;

import javax.validation.ConstraintViolation;
import javax.validation.executable.ExecutableValidator;
import javax.validation.metadata.BeanDescriptor;
import java.util.Set;

/**
 * Created by Calvin on 1/11/17.
 */

@Component
public class EmployeeValidator implements org.springframework.validation.Validator {

    @Autowired
    private EmployeeService employeeService;


    @Override
    public boolean supports(Class<?> aClass) {
        return Employee.class.equals(aClass);
    }

    @Override
    public void validate(Object o, Errors errors) {
        Employee employee = (Employee) o;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "NotEmpty");
        //TODO:ctn change the restraints
        if (employee.getUsername().length() < 6 || employee.getUsername().length() > 32) {
            errors.rejectValue("username", "Size.userForm.username");
        }
        if (employeeService.findEmployeeByUsername(employee.getUsername()) != null) {
            errors.rejectValue("username", "Duplicate.userForm.username");
        }

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotEmpty");
        //TODO:ctn change the restraints
        if (employee.getPassword().length() < 8 || employee.getPassword().length() > 32) {
            errors.rejectValue("password", "Size.userForm.password");
        }

        if (!employee.getPasswordConfirm().equals(employee.getPassword())) {
            errors.rejectValue("passwordConfirm", "Diff.userForm.passwordConfirm");
        }
    }
}
