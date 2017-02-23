package com.caerj.service;

import com.caerj.dao.AppointmentDao;
import com.caerj.model.Appointment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by nixc1 on 2/23/17.
 */

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentDao appointmentDao;

    private static final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    @Override
    public Appointment findById(Long id) {
        return null;
    }

    @Override
    public void save(Appointment appointment) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        logger.info(" --- Saving appointment");
        appointmentDao.save(appointment);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }

    @Override
    public void update(Appointment appointment) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        Appointment appointmentFound = appointmentDao.findById(appointment.getId());
        if (appointmentFound != null) {
            logger.info(" --- Mapping edited appointment to the existing appointment.");
            appointment.setId(appointmentFound.getId());
        }

        appointmentDao.save(appointment);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }
}
