package com.caerj.web;

import com.caerj.dao.AppointmentDao;
import com.caerj.dao.PatientDao;
import com.caerj.dao.PrescriptionDao;
import com.caerj.dao.UserDao;
import com.caerj.dao.RoleDao;
import com.caerj.model.Appointment;
import com.caerj.model.Patient;
import com.caerj.model.Prescription;
import com.caerj.model.User;
import com.caerj.model.Role;
import com.caerj.service.PatientService;
import com.caerj.service.UserService;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Created by Calvin on 1/9/17.
 */

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserDao userDao;
    private final RoleDao roleDao;
    private final PatientDao patientDao;
    private final PrescriptionDao prescriptionDao;
    private final AppointmentDao appointmentDao;

    @Autowired
    public DatabaseLoader(UserDao userDao, RoleDao roleDao, PatientDao patientDao, PrescriptionDao prescriptionDao, AppointmentDao appointmentDao) {
        this.userDao = userDao;
        this.roleDao = roleDao;
        this.patientDao = patientDao;
        this.prescriptionDao = prescriptionDao;
        this.appointmentDao = appointmentDao;
    }

    @Autowired
    private UserService userService;

    @Autowired
    private PatientService patientService;

    @Override
    public void run(String... strings) throws Exception {

        int PATIENT_AMOUNT = 20;
        int PRESCRIPTION_AMOUNT = 20;
        String LOREMIPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, "
            + "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut "
            + "enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi "
            + "ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit "
            + "in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur "
            + "sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt "
            + "mollit anim id est laborum.";

        Role ROLE_USER = new Role("ROLE_USER");
        this.roleDao.save(ROLE_USER);
        Role ROLE_PRACTITIONER = new Role("ROLE_PRACTITIONER");
        this.roleDao.save(ROLE_PRACTITIONER);
        Role ROLE_RECEPTIONIST = new Role("ROLE_RECEPTIONIST");
        this.roleDao.save(ROLE_RECEPTIONIST);
        Role ROLE_ADMIN = new Role("ROLE_ADMIN");
        this.roleDao.save(ROLE_ADMIN);

        final String password = "$2a$08$wgwoMKfYl5AUE9QtP4OjheNkkSDoqDmFGjjPE2XTPLDe9xso/hy7u"; // == password
        final String username = "cnix";

        this.userDao.save(new User(username, password, true, ROLE_ADMIN));
        this.userDao.save(new User("admin", password, true, ROLE_ADMIN));
        this.userDao.save(new User("dr. bob", password, true, ROLE_PRACTITIONER));
        this.userDao.save(new User("dr. billy", password, true, ROLE_PRACTITIONER));
        this.userDao.save(new User("dr. chang", password, true, ROLE_PRACTITIONER));
        this.userDao.save(new User("practitioner", password, true, ROLE_PRACTITIONER));
        this.userDao.save(new User("receptionist", password, true, ROLE_RECEPTIONIST));
        this.userDao.save(new User("lisa", password, true, ROLE_RECEPTIONIST));
        this.userDao.save(new User("alex", password, true, ROLE_RECEPTIONIST));


        User practitioner = userService.findUserByUsername("practitioner");

        for (int i = 0; i < PATIENT_AMOUNT; i++) {
            Patient patient = new Patient("FirstName"+i,
                "MiddleName"+i,
                "LastName"+i,
                true,
                "January 8, 2000",
                i+" Brickbored ln.",
                "Marietta",
                "GA",
                30062,
                "Single",
                1,
                2223334444L+i,
                practitioner,
                "practitioner",
                i+"email@address.com");
            this.patientDao.save(patient);
        }

        for (int i = 0; i < PRESCRIPTION_AMOUNT; i++) {
            Prescription prescription = new Prescription("Prescription"+i, i+" "+LOREMIPSUM);
            this.prescriptionDao.save(prescription);
        }

        Date date = new Date();

        for (int i = 1; i <= PATIENT_AMOUNT; i++) {
            Long id = new Long(i);
            id = id%10;
            if (id == 0L) {
              id = 1L;
            }
            Patient patient = patientService.findById(id);

            String startTime = "";
            String endTime = "";

            if (i % 10 == 0) {
              Calendar cal = Calendar.getInstance();
              cal.setTime(date);
              cal.add(Calendar.DATE, 1);
              date = cal.getTime();

              startTime = "06:00";
              endTime = "06:30";

            }

            if (i % 10 == 1) {
              startTime = "06:45";
              endTime   = "07:15";
            }

            if (i % 10 == 2) {
              startTime = "07:30";
              endTime   = "08:00";
            }

            if (i % 10 == 3) {
              startTime = "08:15";
              endTime   = "08:45";
            }

            if (i % 10 == 4) {
              startTime = "09:00";
              endTime   = "09:30";
            }

            if (i % 10 == 5) {
              startTime = "09:45";
              endTime   = "10:15";
            }

            if (i % 10 == 6) {
              startTime = "10:30";
              endTime   = "11:00";
            }

            if (i % 10 == 7) {
              startTime = "11:15";
              endTime   = "11:45";
            }

            if (i % 10 == 8) {
              startTime = "12:00";
              endTime   = "12:30";
            }

            if (i % 10 == 9) {
              startTime = "12:45";
              endTime   = "13:15";
            }

            SimpleDateFormat dt = new SimpleDateFormat("MM-dd-yyyy");
            String formattedDate = dt.format(date);

            Appointment appointment = new Appointment(patient, practitioner, formattedDate, startTime, endTime, LOREMIPSUM);

            this.appointmentDao.save(appointment);

            //Update the patient appointment list
            List<Appointment> appointmentList = patient.getAppointments();
            appointmentList.add(appointment);

            patient.setAppointments(appointmentList);

            this.patientDao.save(patient);


        }



    }
}
