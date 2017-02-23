package com.caerj.web.controller;

import com.caerj.model.Appointment;
import com.caerj.model.Patient;
import com.caerj.model.Role;
import com.caerj.model.User;
import com.caerj.service.AppointmentService;
import com.caerj.service.PatientService;
import com.caerj.service.UserService;
import com.caerj.web.UserValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by Calvin on 1/9/17.
 */

@Controller
public class AppController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserValidator userValidator;

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    private static final Logger logger = LoggerFactory.getLogger(AppController.class);

    @RequestMapping(value = "/")
    public String index() {
        logger.info(" --- RequestMapping from /");
        logger.info(" --- Mapping to /application");
        return "application";
    }

    @RequestMapping(value = "/admin")
    public String admin() {
        logger.info(" --- RequestMapping from /admin");
        logger.info(" --- Mapping to /admin");
        return "admin";
    }

    @RequestMapping(value = "/patients")
    public String patients() {
        logger.info(" --- RequestMapping from /patients");
        logger.info(" --- Mapping to /patients");
        return "patients";
    }

    @RequestMapping(value = "/appointment")
    public String appointment() {
        logger.info(" --- RequestMapping from /appointment");
        logger.info(" --- Mapping to /appointment");
        return "appointment";
    }

    @RequestMapping(value = "/admin/addUser", method = RequestMethod.POST)
    public String addUser(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /admin/addUser");

        /**
         * todo:ctn refact
         * A lot of code is shared between addUser and editUser
         */

        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String role = request.getParameter("role");
        String enabled = request.getParameter("enabled");

        Role userRole = new Role(role);
        boolean isEnabled = (enabled.equals("true"));

        User user = new User(username, password, isEnabled, userRole);

        logger.info(" --- Saving user");
        userService.save(user);

        logger.info(" --- Redirecting to /admin");
        return "redirect:/admin";
    }

    @RequestMapping(value = "/admin/editUser", method = RequestMethod.POST)
    public String editUser(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /admin/editUser");

        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String role = request.getParameter("role");
        String enabled = request.getParameter("enabled");

        Role userRole = new Role(role);
        boolean isEnabled = (enabled.equals("true"));

        User user = new User(username, password, isEnabled, userRole);

        logger.info(" --- edit user");
        userService.update(user);

        logger.info(" --- Redirecting to /admin");
        return "redirect:/admin";
    }

    @RequestMapping(value = "/patients/addPatient", method = RequestMethod.POST)
    public String addPatient(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /patients/addPatient");

        String firstName = request.getParameter("firstName");
        String middleName = request.getParameter("middleName");
        String lastName = request.getParameter("lastName");
        String strGender = request.getParameter("gender");
        String dob = request.getParameter("dob");
        String address = request.getParameter("address");
        String city = request.getParameter("city");
        String state = request.getParameter("state");
        String strZipCode = request.getParameter("zipCode");
        String maritalStatus = request.getParameter("maritalStatus");
        String strNumberOfChildren = request.getParameter("numberOfChildren");
        String strPhoneNumber = request.getParameter("phoneNumber");
        String emailAddress = request.getParameter("emailAddress");
        String practitionerName = request.getParameter("practitionerName");

        Boolean gender = Boolean.valueOf(strGender);

        Integer zipCode = Integer.valueOf(strZipCode);
        Integer numberOfChildren = Integer.valueOf(strNumberOfChildren);
        Long phoneNumber = Long.valueOf(strPhoneNumber);

        User practitioner = userService.findUserByUsername(practitionerName);

        if (practitioner == null) {
            logger.error("Practitioner not found!");
        }

        Patient patient = new Patient(firstName,
                                     middleName,
                                       lastName,
                                         gender,
                                            dob,
                                        address,
                                           city,
                                          state,
                                        zipCode,
                                  maritalStatus,
                               numberOfChildren,
                                    phoneNumber,
                                   practitioner,
                               practitionerName,
                                   emailAddress);

        logger.info(" --- Saving patient");
        patientService.save(patient);

        logger.info(" --- Redirecting to /patients");
        return "redirect:/patients";
    }

    @RequestMapping(value = "/patients/editPatient", method = RequestMethod.POST)
    public String editPatient(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /patients/editPatient");

        String strId = request.getParameter("id");
        String firstName = request.getParameter("firstName");
        String middleName = request.getParameter("middleName");
        String lastName = request.getParameter("lastName");
        String strGender = request.getParameter("gender");
        String dob = request.getParameter("dob");
        String address = request.getParameter("address");
        String city = request.getParameter("city");
        String state = request.getParameter("state");
        String strZipCode = request.getParameter("zipCode");
        String maritalStatus = request.getParameter("maritalStatus");
        String strNumberOfChildren = request.getParameter("numberOfChildren");
        String strPhoneNumber = request.getParameter("phoneNumber");
        String emailAddress = request.getParameter("emailAddress");
        String practitionerName = request.getParameter("practitionerName");

        Long id = Long.valueOf(strId);

        Boolean gender = Boolean.valueOf(strGender);

        Integer zipCode = Integer.valueOf(strZipCode);
        Integer numberOfChildren = Integer.valueOf(strNumberOfChildren);
        Long phoneNumber = Long.valueOf(strPhoneNumber);

        User practitioner = userService.findUserByUsername(practitionerName);

        if (practitioner == null) {
            logger.error("Practitioner not found!");
        }

        Patient patient = new Patient(firstName,
                middleName,
                lastName,
                gender,
                dob,
                address,
                city,
                state,
                zipCode,
                maritalStatus,
                numberOfChildren,
                phoneNumber,
                practitioner,
                practitionerName,
                emailAddress);

        patient.setId(id);

        logger.info(" --- Saving updated patient");
        patientService.save(patient);

        logger.info(" --- Redirecting to /patients");
        return "redirect:/patients";
    }

    @RequestMapping(value = "/appointment/addAppointment", method = RequestMethod.POST)
    public String addAppointment(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /appointment/addAppointment");

        String strPatientId = request.getParameter("patientId");
        String practitionerName = request.getParameter("practitionerName");
        String date = request.getParameter("date");
        String reasonForVisit = request.getParameter("reasonForVisit");

        Long patientId = Long.valueOf(strPatientId);

        Patient patient = patientService.findById(patientId);
        User practitioner = userService.findUserByUsername(practitionerName); //todo:ctn should probably validate this is actually a practitioner

        if (practitioner == null) {
            logger.error("Practitioner not found!");
        }

        Appointment appointment = new Appointment(patient, practitioner, date, "default time", -1L, reasonForVisit);

        logger.info(" --- Saving appointment");
        appointmentService.save(appointment);

        logger.info(" --- Redirecting to /appointment");
        return "redirect:/appointment";
    }


}
