package com.caerj.service;

import com.caerj.dao.PatientDao;
import com.caerj.model.Patient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Created by nixc1 on 2/15/17.
 */

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientDao patientDao;

    private static final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);

    @Override
    public Patient findById(Long id) {
        return null;
    }

    @Override
    public void save(Patient patient) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        logger.info(" --- Saving user");
        patientDao.save(patient);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }

    @Override
    public void update(Patient patient) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        Patient patientFound = patientDao.findById(patient.getId());
        if (patientFound != null) {
            logger.info(" --- Mapping edited user to the existing user.");
            patient.setId(patientFound.getId());
        }

        patientDao.save(patient);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        logger.error(" --- This method has not been implemented yet");
        return null;
    }
}
