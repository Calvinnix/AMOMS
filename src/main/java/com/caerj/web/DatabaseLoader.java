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
/*
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

*/
        for (int i = 0; i < PRESCRIPTION_AMOUNT; i++) {
            Prescription prescription = new Prescription("Prescription"+i, i+" "+LOREMIPSUM);
            this.prescriptionDao.save(prescription);
        }
        Date date=new Date();
        Calendar cal=Calendar.getInstance();


        SetUpdateDatabase();
        cal.set(2015,2,10);
        AddAppointment("6:30","7:30",cal.getTime(),patientService.findById(1L),LOREMIPSUM,true);
        cal.set(2015,2,23);
        AddAppointment("8:30","12:45",cal.getTime(),patientService.findById(2L),LOREMIPSUM,true);
        AddAppointment("2:00","4:30",cal.getTime(),patientService.findById(3L),LOREMIPSUM,false);
        cal.set(2015,4,1);
        AddAppointment("7:00","8:30",cal.getTime(),patientService.findById(4L),LOREMIPSUM,false);
        cal.set(2015,4,28);
        AddAppointment("8:30","9:30",cal.getTime(),patientService.findById(5L),LOREMIPSUM,true);
        AddAppointment("10:30","11:30",cal.getTime(),patientService.findById(6L),LOREMIPSUM,false);
        //--------------------------------------------------------------------------------------------------

        cal.set(2016,1,10);
        AddAppointment("6:30","7:30",cal.getTime(),patientService.findById(7L),LOREMIPSUM,false);
        AddAppointment("8:30","9:30",cal.getTime(),patientService.findById(8L),LOREMIPSUM,true);
        cal.set(2016,1,11);
        AddAppointment("7:00","11:30",cal.getTime(),patientService.findById(9L),LOREMIPSUM,false);

        cal.set(2016,3,10);
        AddAppointment("6:30","7:30",cal.getTime(),patientService.findById(10L),LOREMIPSUM,false);
        AddAppointment("8:30","9:30",cal.getTime(),patientService.findById(11L),LOREMIPSUM,false);
        AddAppointment("10:30","11:30",cal.getTime(),patientService.findById(12L),LOREMIPSUM,false);
        //--------------------------------------------------------------------------------------------------
        cal.setTime(date);

        AddAppointment("6:30","7:30",cal.getTime(),patientService.findById(13L),LOREMIPSUM,false);
        AddAppointment("8:30","9:30",cal.getTime(),patientService.findById(14L),LOREMIPSUM,false);
        cal.add(Calendar.DATE,-3);
        AddAppointment("10:30","11:30",cal.getTime(),patientService.findById(15L),LOREMIPSUM,false);
        cal.add(Calendar.DATE,-1);
        AddAppointment("6:30","7:30",cal.getTime(),patientService.findById(16L),LOREMIPSUM,false);
        AddAppointment("8:30","9:30",cal.getTime(),patientService.findById(17L),LOREMIPSUM,true);
        cal.add(Calendar.DATE,-1);
        AddAppointment("10:30","11:30",cal.getTime(),patientService.findById(18L),LOREMIPSUM,false);
        //--------------------------------------------------------------------------------------------------
        cal.setTime(date);
        cal.add(Calendar.DATE,1);
        AddAppointment("6:30","7:30",cal.getTime(),patientService.findById(19L),LOREMIPSUM,false);
        AddAppointment("8:30","9:30",cal.getTime(),patientService.findById(20L),LOREMIPSUM,false);
        AddAppointment("10:30","11:30",cal.getTime(),patientService.findById(21L),LOREMIPSUM,false);
        cal.add(Calendar.DATE,1);
        AddAppointment("6:00","7:45",cal.getTime(),patientService.findById(22L),LOREMIPSUM,false);
        AddAppointment("8:45","9:45",cal.getTime(),patientService.findById(23L),LOREMIPSUM,false);
        AddAppointment("11:30","12:30",cal.getTime(),patientService.findById(24L),LOREMIPSUM,false);
        cal.add(Calendar.DATE,1);
        AddAppointment("6:30","7:30",cal.getTime(),patientService.findById(25L),LOREMIPSUM,false);
        AddAppointment("10:30","11:30",cal.getTime(),patientService.findById(26L),LOREMIPSUM,false);
        AddAppointment("2:00","3:45",cal.getTime(),patientService.findById(27L),LOREMIPSUM,false);

    }

    public  void SetUpdateDatabase(){

        Patient temp;

        temp=new Patient("Billy","","Batson",true,"January 18,1973","2334 Heavner Avenue","Marietta","GA",30064,"Single",0,7707933386L,userService.findUserByUsername("dr. bob"),"Bob","billyB@email.com");
    this.patientDao.save(temp);


        temp=new Patient("Victor","","Stone",true,"April 29,1991","4159 Smith Road","Marietta","GA",30067,"Single",0,7709558463L,userService.findUserByUsername("dr. billy"),"Billy","victorS@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Anna","","Marie",false,"July 13,1993","411 Smith Road","Marietta","GA",30068,"Single",0,7707954886L,userService.findUserByUsername("dr. chang"),"Chang","annaM@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Virgil","Ovid","Hawkins",true,"November 14,1940","1681 Elsie Drive","Marietta","GA",30068,"Single",0,7707987586L,userService.findUserByUsername("dr. billy"),"Billy","virgilH@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Richard","Osgood","Foley",true,"January 23,1948","4098 Elk Creek Road","Marietta","GA",30064,"Single",0,7703015678L,userService.findUserByUsername("dr. billy"),"Billy","richardF@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Wally","","West",true,"August 29,1973","12 Neuport Lane","Marietta","GA",30062,"Single",0,7707415942L,userService.findUserByUsername("dr. bob"),"Bob","wallyW@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Conner","","Kent",true,"June 4,1965","4684 Hanifan Lane","Marietta","GA",30064,"Single",0,7704222420L,userService.findUserByUsername("dr. chang"),"Chang","connerK@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Megan","","Morse",false,"June 18,1963","1230 Oak Street","Marietta","GA",30066,"Single",0,4046932587L,userService.findUserByUsername("dr. bob"),"Bob","meganM@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Garfield","","Logan",true,"July 17,1933","3332 Pine Garden Lane","Marietta","GA",30066,"Single",0,6782154869L,userService.findUserByUsername("dr. chang"),"Chang","bb@email.com");
        this.patientDao.save(temp);





        temp=new Patient("Bart","","Allen",true,"July 7,1978","742 Elkview Drive","Marietta","GA",30064,"Single",0,7701483757L,userService.findUserByUsername("dr. bob"),"Bob","bartA@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Oliver","","Queen",true,"October 3,1984","1495 Lakeland Park Drive","Marietta","GA",30062,"Married",0,4046589598L,userService.findUserByUsername("dr. chang"),"Chang","oliverQ@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Arthur","","Curry",true,"June 27,1990","2036 Fowler Avenue","Marietta","GA",30062,"Single",0,6784584587L,userService.findUserByUsername("dr. billy"),"Billy","arthurC@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Floyd","","Lawton",true,"June 5,1956","2664 Heavner Avenue","Marietta","GA",30064,"Single",0,7707894587L,userService.findUserByUsername("dr. chang"),"Chang","floydL@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Nora","","Fries",false,"May 9,1973","3022 Tully Streete","Marietta","GA",30060,"Married",0,6786586986L,userService.findUserByUsername("dr. bob"),"Bob","noraF@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Rachel","","Roth",false,"August 21,1973","2506 Heavner Avenue","Marietta","GA",30061,"Single",0,7704581235L,userService.findUserByUsername("dr. billy"),"Billy","rachelR@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Cassandra","","Cain",false,"March 19,1960","1130 Leroy Lane","Marietta","GA",30062,"Single",0,7707788596L,userService.findUserByUsername("dr. chang"),"Chang","cassandraC@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Stephanie","","Brown",false,"May 23,1983","1130 Leroy Lane","Marietta","GA",30064,"Single",0,4044563713L,userService.findUserByUsername("dr. billy"),"Billy","stephB@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Roy","","Harper",true,"August 30,1960","3300 Sheila Lane","Marietta","GA",30062,"Single",0,6784584587L,userService.findUserByUsername("dr. bob"),"Bob","royH@email.com");
        this.patientDao.save(temp);






        temp=new Patient("Curtis","","Connors",true,"January 4,1993","5894 Heavner Avenue","Marietta","GA",30067,"Single",0,6784524897L,userService.findUserByUsername("dr. billy"),"Billy","curtisC@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Quentin","","Beck",true,"Decemeber 16,1990","515 Leroy Lane","Marietta","GA",30063,"Single",0,4045454874L,userService.findUserByUsername("dr. billy"),"Billy","quentinB@email.com");
        this.patientDao.save(temp);

        temp=new Patient("May","","Reilly",false,"May 4,1983","98 Lakeland Park Drive","Marietta","GA",30064,"Single",0,7707793863L,userService.findUserByUsername("dr. chang"),"Chang","mayR@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Martha","","Kane",false,"September 14,1974","4658 Smith Street","Marietta","GA",30062,"Single",0,4045681515L,userService.findUserByUsername("dr. chang"),"Chang","marthaK@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Pamela","Lillian","Isley",false,"January 18,1973","4592 Angie Drive","Marietta","GA",30064,"Single",0,7705154878L,userService.findUserByUsername("dr. bob"),"Bob","ivy@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Thomas","","Elliot",true,"May 17,1955","1212 Johnstown Road","Marietta","GA",30061,"Single",0,7707933386L,userService.findUserByUsername("dr. chang"),"Chang","thomasE@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Kent","","Nelson",true,"August 25,1955","3165 Mattson Street","Marietta","GA",30060,"Single",0,6784952541L,userService.findUserByUsername("dr. bob"),"Bob","kentN@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Martha","","Clark",false,"Decemeber 22,1973","4205 Liberty Street","Marietta","GA",30067,"Single",0,4048896322L,userService.findUserByUsername("dr. chang"),"Chang","marthaC@email.com");
        this.patientDao.save(temp);

        temp=new Patient("Michael","Jon","Carter",true,"Decemeber 18,1966","4324 Heavner Avenue","Marietta","GA",30060,"Single",0,7707456688L,userService.findUserByUsername("dr. bob"),"Bob","booster@email.com");
        this.patientDao.save(temp);

    }

    public  void  AddAppointment(String startTime,String endTime,Date date,Patient patient,String text,boolean arrived){
           SimpleDateFormat dt = new SimpleDateFormat("MM-dd-yyyy");
            String formattedDate = dt.format(date);

            Appointment appointment = new Appointment(patient, patient.getPractitioner(), formattedDate, startTime, endTime, text);
            if(arrived) {
                appointment.setCheckInTime(startTime);
                appointment.setSessionStartTime(startTime);
                appointment.setSessionEndTime(endTime);
            }
            this.appointmentDao.save(appointment);


//Update the patient appointment list
            List<Appointment> appointmentList = patient.getAppointments();
            appointmentList.add(appointment);

            patient.setAppointments(appointmentList);

            this.patientDao.save(patient);
    }
}
