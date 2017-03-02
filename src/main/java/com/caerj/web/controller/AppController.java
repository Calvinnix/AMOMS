package com.caerj.web.controller;

import com.caerj.model.*;
import com.caerj.service.AppointmentService;
import com.caerj.service.PatientService;
import com.caerj.service.PrescriptionService;
import com.caerj.service.UserService;
import com.caerj.web.UserValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    @Autowired
    private PrescriptionService prescriptionService;

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

    @RequestMapping(value = "/practitioner_appointments")
    public String practitioner_appointments() {
        logger.info(" --- RequestMapping from /practitioner_appointments");
        logger.info(" --- Mapping to /practitioner_appointments");
        return "practitioner_appointments";
    }

    @RequestMapping(value = "/prescriptions")
    public String prescriptions() {
        logger.info(" --- RequestMapping from /prescriptions");
        logger.info(" --- Mapping to /prescriptions");
        return "prescriptions";
    }

    @RequestMapping(value = "/reports")
    public String reports() {
        logger.info(" --- RequestMapping from /reports");
        logger.info(" --- Mapping to /reports");
        return "reports";
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
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
        String reasonForVisit = request.getParameter("reasonForVisit");

        Long patientId = Long.valueOf(strPatientId);

        Patient patient = patientService.findById(patientId);

        User practitioner = userService.findUserByUsername(practitionerName); //todo:ctn should probably validate this is actually a practitioner

        if (practitioner == null) {
            logger.error("Practitioner not found!");
        }

        Appointment appointment = new Appointment(patient, practitioner, date, startTime, endTime, reasonForVisit);

        logger.info(" --- Saving appointment");
        appointmentService.save(appointment);

        //Update the patient appointment list
        List<Appointment> appointmentList = patient.getAppointments();
        appointmentList.add(appointment);
        patient.setAppointments(appointmentList);
        patientService.save(patient);

        logger.info(" --- Redirecting to /appointment");
        return "redirect:/appointment";
    }


    @RequestMapping(value = "/practitioner_appointments/saveChanges", method = RequestMethod.POST)
    public String saveChanges(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /practitioner_appointments/saveChanges");

        String strAppointmentId = request.getParameter("appointmentId");
        String notes = request.getParameter("notes");
        String jsonPrescriptions = request.getParameter("prescriptions");

        System.out.println(jsonPrescriptions);

        Long appointmentId = Long.valueOf(strAppointmentId);

        Appointment appointment = appointmentService.findById(appointmentId);

        List prescriptions = new ArrayList<Prescription>();

        JSONArray jsonAccountsArray = new JSONArray(jsonPrescriptions);
        jsonAccountsArray.length();

        for (int i = 0; i < jsonAccountsArray.length(); i++) {
            String name = jsonAccountsArray.getString(i);

            System.out.println("Name: " + name);

            Prescription prescription = prescriptionService.findByName(name);

            prescriptions.add(prescription);
        }

        if (appointment == null) {
            logger.error("Appointment not found! appointmentId = " + appointmentId);
            appointment = new Appointment();
        }

        appointment.setNotes(notes);

        appointment.setPrescriptions(prescriptions);

        logger.info(" --- Saving changes");
        appointmentService.save(appointment);

        logger.info(" --- Redirecting to /practitioner_appointments");
        return "redirect:/practitioner_appointments";
    }

    @RequestMapping(value = "/appointment/checkIn", method = RequestMethod.POST)
    public String checkIn(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /appointment/checkIn");

        String strAppointmentId = request.getParameter("appointmentId");

        Long appointmentId = Long.valueOf(strAppointmentId);

        Appointment appointment = appointmentService.findById(appointmentId);

        if (appointment == null) {
            logger.error("Appointment not found! appointmentId = " + appointmentId);
        }

        Date currentTime = new Date();
        appointment.setCheckInTime(currentTime.toString());

        logger.info(" --- Updating appointment");
        appointmentService.update(appointment);

        logger.info(" --- Redirecting to /appointment");
        return "redirect:/appointment";
    }

    @RequestMapping(value = "/appointment/startAppointment", method = RequestMethod.POST)
    public String startAppointment(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /appointment/startAppointment");

        String strAppointmentId = request.getParameter("appointmentId");

        Long appointmentId = Long.valueOf(strAppointmentId);

        Appointment appointment = appointmentService.findById(appointmentId);

        if (appointment == null) {
            logger.error("Appointment not found! appointmentId = " + appointmentId);
        }

        Date currentTime = new Date();
        appointment.setSessionStartTime(currentTime.toString());

        logger.info(" --- Updating appointment");
        appointmentService.update(appointment);

        logger.info(" --- Redirecting to /appointment");
        return "redirect:/appointment";
    }

    @RequestMapping(value = "/appointment/endAppointment", method = RequestMethod.POST)
    public String endAppointment(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /appointment/endAppointment");

        String strAppointmentId = request.getParameter("appointmentId");

        Long appointmentId = Long.valueOf(strAppointmentId);

        Appointment appointment = appointmentService.findById(appointmentId);

        if (appointment == null) {
            logger.error("Appointment not found! appointmentId = " + appointmentId);
        }

        Date currentTime = new Date();
        appointment.setSessionEndTime(currentTime.toString());

        logger.info(" --- Updating appointment");
        appointmentService.update(appointment);

        logger.info(" --- Redirecting to /appointment");
        return "redirect:/appointment";
    }

    @RequestMapping(value = "/prescriptions/addPrescription", method = RequestMethod.POST)
    public String addPrescription(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /prescriptions/addPrescriptions");

        String name = request.getParameter("name");
        String description = request.getParameter("description");

        Prescription prescription = new Prescription(name, description);

        prescriptionService.save(prescription);

        logger.info(" --- Redirecting to /prescriptions");
        return "redirect:/prescriptions";
    }

    @RequestMapping(value = "/prescriptions/editPrescription", method = RequestMethod.POST)
    public String editPrescription(HttpServletRequest request) {
        logger.info(" --- RequestMapping from /prescriptions/editPrescription");

        String strId = request.getParameter("id");
        String name = request.getParameter("name");
        String description = request.getParameter("description");

        Long id = Long.valueOf(strId);

        Prescription prescription = new Prescription(name, description);
        prescription.setId(id);

        prescriptionService.save(prescription);

        logger.info(" --- Redirecting to /prescriptions");
        return "redirect:/prescriptions";
    }




}
